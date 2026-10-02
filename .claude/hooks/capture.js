#!/usr/bin/env node
// Agent capture hook for Claude Code.
// Wired in .claude/settings.json:
//   UserPromptSubmit -> `node capture.js prompt`  (appends the verbatim prompt)
//   Stop             -> `node capture.js stop`    (appends the final response of the turn)
// Writes one markdown file per session to <repo>/.agent-logs/.
// Append-only: entries are never rewritten; only the frontmatter counters are refreshed.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EVENT = process.argv[2]; // "prompt" | "stop"
const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const LOG_DIR = path.join(PROJECT_DIR, '.agent-logs');
const ERR_LOG = path.join(LOG_DIR, '.capture-errors.log');

function readStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch { return ''; }
}

function sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

function readTranscript(p) {
  if (!p || !fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

// A "real" user prompt: a user entry that is not a tool result and not injected meta content.
function isRealPrompt(e) {
  if (e.type !== 'user' || e.isMeta || !e.message) return false;
  const c = e.message.content;
  if (typeof c === 'string') return true;
  if (Array.isArray(c)) return c.some(b => b.type === 'text') && !c.some(b => b.type === 'tool_result');
  return false;
}

function promptText(e) {
  const c = e.message.content;
  if (typeof c === 'string') return c;
  return c.filter(b => b.type === 'text').map(b => b.text).join('\n');
}

function lastModel(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    const m = entries[i].type === 'assistant' && entries[i].message && entries[i].message.model;
    if (m && m !== '<synthetic>') return m;
  }
  return null;
}

// Final response = assistant text emitted after the last user entry (prompt or tool result).
function finalResponse(entries) {
  let lastUser = -1;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].type === 'user') { lastUser = i; break; }
  }
  const texts = [];
  for (let i = lastUser + 1; i < entries.length; i++) {
    const e = entries[i];
    if (e.type !== 'assistant' || !e.message || !Array.isArray(e.message.content)) continue;
    for (const b of e.message.content) if (b.type === 'text' && b.text) texts.push(b.text);
  }
  return texts.join('\n\n');
}

function fence(text) {
  const runs = (text.match(/`+/g) || []).map(s => s.length);
  const n = Math.max(3, ...runs.map(r => r + 1));
  const f = '`'.repeat(n);
  return `${f}text\n${text}\n${f}`;
}

function gitUser() {
  try { return execSync('git config user.name', { cwd: PROJECT_DIR }).toString().trim() || 'unknown'; }
  catch { return 'unknown'; }
}

function findLogFile(sessionId) {
  if (!fs.existsSync(LOG_DIR)) return null;
  const f = fs.readdirSync(LOG_DIR).find(n => n.endsWith(`_${sessionId}.md`));
  return f ? path.join(LOG_DIR, f) : null;
}

function newLogFile(sessionId, iso) {
  const stamp = iso.replace(/\.\d+Z$/, '').replace('T', '_').replace(/:/g, '-');
  return path.join(LOG_DIR, `${stamp}_${sessionId}.md`);
}

function splitDoc(doc) {
  const m = doc.match(/^---\n[\s\S]*?\n---\n/);
  return m ? doc.slice(m[0].length) : doc;
}

function writeDoc(file, sessionId, body) {
  const promptTimes = [...body.matchAll(/^### Prompt — (\S+)/gm)].map(m => m[1]);
  const models = [...new Set([...body.matchAll(/^### (?:Prompt|Response) — \S+ — model: (\S+)/gm)]
    .map(m => m[1]).filter(m => m !== 'unknown'))];
  const first = promptTimes[0] || '';
  const fm = [
    '---',
    `session_id: ${sessionId}`,
    `date: ${first.slice(0, 10)}`,
    `author: ${gitUser()}`,
    `model: ${models.join(', ') || 'unknown'}`,
    'tool: claude-code',
    `project: ${path.basename(PROJECT_DIR)}`,
    `total_exchanges: ${promptTimes.length}`,
    `first_prompt_time: ${first}`,
    `last_prompt_time: ${promptTimes[promptTimes.length - 1] || ''}`,
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(file, fm + body);
}

function appendEntry(sessionId, nowIso, entryText) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const file = findLogFile(sessionId) || newLogFile(sessionId, nowIso);
  const body = fs.existsSync(file) ? splitDoc(fs.readFileSync(file, 'utf8')) : '';
  writeDoc(file, sessionId, body + entryText);
  return body;
}

function lastEntryKind(sessionId) {
  const file = findLogFile(sessionId);
  if (!file) return null;
  const kinds = [...fs.readFileSync(file, 'utf8').matchAll(/^### (Prompt|Response) — /gm)];
  return kinds.length ? kinds[kinds.length - 1][1] : null;
}

function promptEntry(n, iso, model, text, note) {
  return `\n## Exchange ${n}\n\n### Prompt — ${iso} — model: ${model || 'unknown'}${note ? ` — ${note}` : ''}\n\n${fence(text)}\n`;
}

function exchangeCount(sessionId) {
  const file = findLogFile(sessionId);
  if (!file) return 0;
  return [...fs.readFileSync(file, 'utf8').matchAll(/^### Prompt — /gm)].length;
}

function main() {
  const input = JSON.parse(readStdin() || '{}');
  const sessionId = input.session_id || 'unknown-session';
  const now = new Date().toISOString();

  if (EVENT === 'prompt') {
    const entries = readTranscript(input.transcript_path);
    const model = input.model || lastModel(entries) || process.env.ANTHROPIC_MODEL;
    appendEntry(sessionId, now, promptEntry(exchangeCount(sessionId) + 1, now, model, input.prompt ?? ''));
    return;
  }

  if (EVENT === 'stop') {
    // The transcript can lag the Stop event by a moment; retry briefly.
    let entries = readTranscript(input.transcript_path);
    let text = input.last_assistant_message || finalResponse(entries);
    for (let i = 0; !text && i < 10; i++) {
      sleep(200);
      entries = readTranscript(input.transcript_path);
      text = finalResponse(entries);
    }
    const model = lastModel(entries) || 'unknown';

    // If the prompt for this turn was never logged (e.g. hook installed mid-session),
    // recover it from the transcript so the response is never orphaned.
    if (lastEntryKind(sessionId) !== 'Prompt') {
      const p = [...entries].reverse().find(isRealPrompt);
      if (p) {
        const ts = p.timestamp || now;
        appendEntry(sessionId, ts, promptEntry(exchangeCount(sessionId) + 1, ts, model, promptText(p),
          'recovered from transcript by Stop hook (UserPromptSubmit did not fire)'));
      }
    }
    appendEntry(sessionId, now, `\n### Response — ${now} — model: ${model}\n\n${text || '(no final text response captured)'}\n`);
  }
}

try { main(); } catch (err) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(ERR_LOG, `${new Date().toISOString()} ${EVENT}: ${err.stack}\n`);
  } catch {}
}
process.exit(0);
