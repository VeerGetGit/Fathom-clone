"""Meeting 4: Technical architecture discussion (60 min, 5 participants)."""

MEETING = {
    "title": "Architecture Review: Event-Driven Order Pipeline",
    "description": "Evaluating a move from the monolithic order service to an event-driven architecture on Kafka.",
    "meeting_type": "technical",
    "started_at": "2026-10-02T13:00:00+00:00",
    "duration_seconds": 3600,
    "thumbnail_url": "https://picsum.photos/seed/architecture/640/360",
}

PARTICIPANTS = [
    {"name": "Nadia Rahman", "email": "nadia@acmesoft.io", "role": "Principal Engineer", "is_host": True, "avatar_color": "#2563EB"},
    {"name": "Tom Eriksen", "email": "tom@acmesoft.io", "role": "Backend Engineer", "is_host": False, "avatar_color": "#DC2626"},
    {"name": "Aisha Bello", "email": "aisha@acmesoft.io", "role": "SRE", "is_host": False, "avatar_color": "#059669"},
    {"name": "Victor Lam", "email": "victor@acmesoft.io", "role": "Staff Engineer, Payments", "is_host": False, "avatar_color": "#D97706"},
    {"name": "Chloe Dubois", "email": "chloe@acmesoft.io", "role": "Engineering Manager", "is_host": False, "avatar_color": "#9333EA"},
]

TRANSCRIPT = [
    ("00:10", "Nadia Rahman", "Thanks everyone. Today we're deciding whether to break the order service out of the monolith and move to an event-driven design. I wrote up a proposal, so let me walk through it."),
    ("00:45", "@share_start", "Nadia Rahman", "Architecture proposal diagram"),
    ("01:05", "Nadia Rahman", "The current problem: checkout calls the order service synchronously, which calls inventory, payments, and notifications in sequence. A slow payment provider stalls the whole request."),
    ("02:20", "Aisha Bello", "That matches what I see in the incidents. Our p99 checkout latency hits eight seconds whenever the payment gateway degrades, and we've had three of those in the last quarter."),
    ("03:30", "Nadia Rahman", "The proposal is to publish an OrderPlaced event to Kafka, and let inventory, payments and notifications consume it independently. Checkout returns as soon as the event is durably written."),
    ("05:10", "Tom Eriksen", "My concern is consistency. Today the order either succeeds or fails atomically. With events, we can have an order accepted but payment failed. How do we handle that?"),
    ("06:20", "Nadia Rahman", "Good question. We'd use the saga pattern: payment failure emits a PaymentFailed event, which triggers compensating actions like releasing the inventory reservation and notifying the customer."),
    ("08:00", "Victor Lam", "From the payments side, I'm wary. Payments must be idempotent. If a consumer reprocesses an event, we can't double charge. Kafka gives at-least-once delivery by default."),
    ("09:30", "Nadia Rahman", "Agreed. Every event carries an idempotency key, and the payments service stores processed keys in its own table. Duplicate deliveries become no-ops."),
    ("11:15", "Victor Lam", "I'd want that key check inside the same database transaction as the charge record. Otherwise there's a window where a crash causes a duplicate."),
    ("12:40", "Nadia Rahman", "Yes, an outbox-style transaction on the consumer side. I'll add that to the design doc."),
    ("14:10", "@share_end"),
    ("14:30", "Chloe Dubois", "Let me ask the business-side question. What does this cost us in time, and what do we lose while we migrate? We have the holiday peak coming."),
    ("16:00", "Tom Eriksen", "I'd estimate three months for a safe migration if we do it incrementally: orders first, then payments, then notifications. Running both paths in parallel with a feature flag."),
    ("18:20", "Aisha Bello", "The operational cost matters too. We don't run Kafka today. Managed Kafka is about 2,500 dollars a month for our volume, plus someone needs to own it on call."),
    ("20:05", "Chloe Dubois", "That on-call burden is a real concern. We're already stretched. Could we use something lighter, like SQS and SNS, since we're on AWS?"),
    ("21:30", "Nadia Rahman", "SQS with SNS fan-out would cover our current scale and removes the operational burden. We lose event replay and ordering guarantees per key, though."),
    ("23:15", "Victor Lam", "Replay matters to me. When a bug corrupts state, being able to rebuild from the event log is a big safety net. FIFO queues give ordering per message group but no replay."),
    ("25:00", "Tom Eriksen", "What's our actual throughput? If we're at 200 orders a minute at peak, Kafka is overkill."),
    ("25:40", "Aisha Bello", "Peak last Black Friday was about 900 orders a minute. We project maybe 1,500 this year. SQS handles that easily."),
    ("27:30", "Nadia Rahman", "Then throughput isn't the argument for Kafka, replay is. How often have we really needed replay?"),
    ("28:45", "Victor Lam", "Twice in the last year, both payment reconciliation incidents. Each cost us days of manual work."),
    ("31:10", "Chloe Dubois", "Can we get replay on SQS another way? For instance, archive every event to S3 as it's published."),
    ("32:40", "Aisha Bello", "Yes. An SNS subscriber can write every event to S3 through Firehose. Replaying means re-publishing from the archive. It's slower than Kafka but it works."),
    ("34:20", "Nadia Rahman", "That sounds like a sensible middle path. SNS plus SQS for delivery, S3 archive for replay, and we revisit Kafka if volume grows tenfold."),
    ("36:00", "Victor Lam", "I can live with that as long as the idempotency and outbox design are in from day one. Those aren't optional for payments."),
    ("37:45", "Tom Eriksen", "I'm good with it too. It's also much cheaper, which makes it easier to start with the orders flow."),
    ("39:30", "Chloe Dubois", "Then I'd sign off on SNS and SQS. Let's make sure we plan the work so nothing risky lands before the holiday freeze."),
    ("41:10", "Aisha Bello", "I'd propose the first production traffic in mid-January. Before then we can shadow-publish events from checkout without consuming them, just to test volumes."),
    ("43:00", "Nadia Rahman", "I like the shadow-publish idea. It validates the event schema and throughput with zero customer risk."),
    ("45:20", "Tom Eriksen", "We also need schema versioning. If we change the OrderPlaced payload, consumers shouldn't break. I'd suggest a JSON schema registry or at least versioned event types."),
    ("47:00", "Nadia Rahman", "Versioned event types with a shared schema package is the lightweight option. Tom, can you draft that?"),
    ("47:15", "Tom Eriksen", "Sure, I'll draft the schema versioning approach next week."),
    ("49:30", "Aisha Bello", "For observability, I want a dead-letter queue on every consumer, with alarms when anything lands there, plus a dashboard for queue depth and age."),
    ("51:20", "Chloe Dubois", "Let's make sure dead-letter handling has a named owner so those alarms don't go to a void."),
    ("52:40", "Aisha Bello", "I'll own the DLQ alarms and runbook as the SRE for this project."),
    ("54:30", "Nadia Rahman", "To summarize: adopt SNS and SQS instead of Kafka, S3 archive for replay, idempotency keys with transactional checks for payments, versioned event schemas, and DLQs with alarms."),
    ("56:10", "Nadia Rahman", "I'll update the design doc with these decisions and circulate it by Monday for final comments, and we start shadow publishing in November."),
    ("58:00", "Chloe Dubois", "Sounds good. Thanks everyone, this was a productive discussion."),
    ("59:10", "Nadia Rahman", "Thanks all. Talk soon."),
]

SUMMARY = {
    "purpose": "Decide whether to move the order pipeline from a synchronous monolith to an event-driven architecture, and choose the messaging technology and rollout plan.",
    "key_takeaways": [
        "Problem: synchronous checkout lets a slow payment gateway push p99 latency to eight seconds, with three such incidents last quarter.",
        "Decision: use SNS fan-out with SQS rather than Kafka, because it avoids a new on-call burden and about $2,500/month, and handles the projected 1,500 orders/minute peak.",
        "Replay is preserved by archiving every event to S3 via Firehose; Kafka will be revisited if volume grows roughly tenfold.",
        "Payments safety: idempotency keys with the check inside the same database transaction as the charge, plus saga-style compensating events for failures.",
        "Schema versioning, dead-letter queues with alarms, and a named owner for DLQ handling are required parts of the design.",
        "Rollout: shadow-publish events from checkout starting in November, first production traffic in mid-January, nothing risky before the holiday freeze.",
    ],
    "highlights": [
        (65, "Problem: synchronous checkout and slow payment provider"),
        (210, "Saga pattern for failed payments"),
        (480, "Payments idempotency requirement"),
        (1080, "Kafka vs SQS and SNS cost and ops discussion"),
        (1900, "Replay need and S3 archive idea"),
        (2655, "Rollout plan and shadow publishing"),
        (3270, "Decision summary"),
    ],
}

ACTION_ITEMS = [
    ("Nadia Rahman", "Update the design doc with the decisions and circulate it by Monday", 3370),
    ("Tom Eriksen", "Draft the event schema versioning approach next week", 2835),
    ("Aisha Bello", "Own the dead-letter queue alarms and runbook", 3160),
    ("Aisha Bello", "Set up shadow-publishing of checkout events in November", 2470),
    ("Victor Lam", "Review the payments idempotency and outbox design before implementation", 675),
    ("Nadia Rahman", "Add the consumer-side outbox transaction to the design doc", 760),
]
