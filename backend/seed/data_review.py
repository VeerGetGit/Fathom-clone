"""Meeting 3: 1:1 performance review (20 min, 2 participants)."""

MEETING = {
    "title": "1:1 Performance Review: Riley Morgan",
    "description": "Mid-year performance review covering accomplishments, feedback, growth goals and compensation.",
    "meeting_type": "one_on_one",
    "started_at": "2026-10-01T14:00:00+00:00",
    "duration_seconds": 1200,
    "thumbnail_url": "https://picsum.photos/seed/oneonone/640/360",
}

PARTICIPANTS = [
    {"name": "Alex Turner", "email": "alex@acmesoft.io", "role": "Engineering Manager", "is_host": True, "avatar_color": "#8B5CF6"},
    {"name": "Riley Morgan", "email": "riley@acmesoft.io", "role": "Senior Software Engineer", "is_host": False, "avatar_color": "#F59E0B"},
]

TRANSCRIPT = [
    ("00:05", "Alex Turner", "Hey Riley, thanks for making time. I'd like to use this session for your mid-year review. How are you feeling about the last six months overall?"),
    ("00:22", "Riley Morgan", "Honestly pretty good. It's been busy, but I feel like I've shipped meaningful stuff. A little tired after the billing migration, though."),
    ("00:50", "Alex Turner", "That migration was a big one, and I want to start there. You led it end to end, and we moved 40,000 accounts with zero downtime. That was outstanding work."),
    ("01:30", "Riley Morgan", "Thanks. The dry-run approach really helped. We caught most of the edge cases in staging before touching production."),
    ("02:15", "Alex Turner", "That's exactly what I'd highlight. Your planning and risk management were a model for the rest of the team. The runbook you wrote is now the template for other migrations."),
    ("03:40", "Alex Turner", "The second big win was mentoring Jamie. Their onboarding went from six weeks to about four, and Jamie's already shipping independently. That doesn't happen without good mentorship."),
    ("04:25", "Riley Morgan", "I really enjoyed that. Honestly it's one of the parts of the job I'd like to do more of."),
    ("05:10", "Alex Turner", "Good to know, and I want to come back to that when we talk about growth. First, some constructive feedback."),
    ("05:35", "Alex Turner", "The main area is communication during incidents. In the August outage, the team went about 40 minutes without a status update, and leadership was asking for one."),
    ("06:30", "Riley Morgan", "Yeah, that's fair. I was heads-down debugging and didn't want to post a vague update. In hindsight, even a quick 'we're investigating' would have helped."),
    ("07:20", "Alex Turner", "Exactly. A short update every fifteen minutes during an incident, even when there's no news, makes a big difference. Would you be open to taking the incident communicator role on the next rotation?"),
    ("08:15", "Riley Morgan", "Sure. Pairing the debugging role with a communicator would help. I'd also like to practice writing the post-incident summaries."),
    ("09:00", "Alex Turner", "Great idea. The second piece of feedback is smaller: your pull requests sometimes get big. A couple of reviews last quarter had over 1,500 lines, and reviewers struggled."),
    ("10:10", "Riley Morgan", "That's true, especially on the migration work. I can break things into smaller, stacked PRs. I'll aim to keep them under 400 lines."),
    ("11:00", "Alex Turner", "That would be ideal. Now, growth. You mentioned you like mentoring. Where do you see yourself in the next year or two?"),
    ("11:35", "Riley Morgan", "I'm interested in the staff engineer track. I think I'm strong technically, but I want to grow in influencing across teams, not just within ours."),
    ("12:40", "Alex Turner", "I think that's a realistic goal. For a staff promotion we'd want to see you lead a cross-team initiative. There's a platform reliability effort planned for next quarter, and I'd like you to be the technical lead."),
    ("13:50", "Riley Morgan", "I'd love that. Who else would be involved?"),
    ("14:20", "Alex Turner", "Teams from payments and data platform. It'll give you exposure to leaders outside our org, which is exactly the visibility you'd need."),
    ("15:30", "Alex Turner", "On compensation, I submitted your promotion-adjacent adjustment, a 6 percent raise effective next month, based on your performance this half. It's pending final approval from HR."),
    ("16:25", "Riley Morgan", "Thank you, I really appreciate it. That's more than I expected."),
    ("17:00", "Alex Turner", "You earned it. One last thing, how can I support you better? Anything I should do differently as your manager?"),
    ("17:35", "Riley Morgan", "Maybe more regular feedback. Hearing it once at mid-year makes the incident communication point feel like a surprise. I'd rather hear things closer to when they happen."),
    ("18:25", "Alex Turner", "That's fair, and a good point. Let's do a short feedback check-in every two weeks instead of waiting for reviews."),
    ("19:15", "Riley Morgan", "That sounds good. Thanks, Alex."),
    ("19:40", "Alex Turner", "Thank you. Great work, Riley. I'll send over the written review by tomorrow."),
]

SUMMARY = {
    "purpose": "Mid-year performance review for Riley Morgan: recognize accomplishments, give constructive feedback, plan growth toward a staff engineer role, and confirm compensation.",
    "key_takeaways": [
        "Riley led the billing migration of 40,000 accounts with zero downtime, and the runbook is now the team template.",
        "Mentoring Jamie cut onboarding from six weeks to about four; Riley wants more mentoring work.",
        "Feedback: incident communication needs improvement (a 40-minute gap without updates in the August outage) and pull requests should stay under about 400 lines.",
        "Growth goal: staff engineer track, starting as technical lead of next quarter's cross-team platform reliability initiative.",
        "A 6% raise has been submitted, pending HR approval, effective next month.",
        "Riley asked for more frequent feedback, so they will start biweekly feedback check-ins.",
    ],
    "highlights": [
        (50, "Billing migration: 40,000 accounts, zero downtime"),
        (220, "Mentoring Jamie"),
        (335, "Feedback: incident communication"),
        (540, "Feedback: keep pull requests small"),
        (755, "Growth: staff engineer track and platform reliability lead"),
        (930, "Compensation: 6% raise submitted"),
        (1065, "Riley asks for more frequent feedback"),
    ],
}

ACTION_ITEMS = [
    ("Riley Morgan", "Take the incident communicator role on the next on-call rotation", 440),
    ("Riley Morgan", "Keep pull requests under 400 lines by using smaller stacked PRs", 610),
    ("Riley Morgan", "Serve as technical lead for next quarter's platform reliability initiative", 820),
    ("Alex Turner", "Get final HR approval for Riley's 6% raise", 930),
    ("Alex Turner", "Start biweekly feedback check-ins with Riley", 1105),
    ("Alex Turner", "Send Riley the written review by tomorrow", 1180),
]
