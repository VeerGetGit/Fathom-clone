"""Meeting 1: Product roadmap planning (45 min, 4 participants)."""

MEETING = {
    "title": "Q4 Product Roadmap Planning",
    "description": "Prioritizing the Q4 roadmap: search relevance, mobile app, and the analytics dashboard.",
    "meeting_type": "planning",
    "started_at": "2026-09-29T15:00:00+00:00",
    "duration_seconds": 2700,
    "thumbnail_url": "https://picsum.photos/seed/roadmap/640/360",
}

PARTICIPANTS = [
    {"name": "Priya Nair", "email": "priya@acmesoft.io", "role": "Product Manager", "is_host": True, "avatar_color": "#7C3AED"},
    {"name": "Marcus Chen", "email": "marcus@acmesoft.io", "role": "Engineering Lead", "is_host": False, "avatar_color": "#0EA5E9"},
    {"name": "Elena Rossi", "email": "elena@acmesoft.io", "role": "Design Lead", "is_host": False, "avatar_color": "#F97316"},
    {"name": "Dev Patel", "email": "dev@acmesoft.io", "role": "Data Analyst", "is_host": False, "avatar_color": "#10B981"},
]

# (timestamp, speaker, text) | (timestamp, "@share_start", speaker, what) | (timestamp, "@share_end")
TRANSCRIPT = [
    ("00:08", "Priya Nair", "Okay, let's get started. Thanks everyone for making time. Today's goal is simple: we leave this call with a committed Q4 roadmap and clear owners for each item."),
    ("00:31", "Priya Nair", "We have three big candidates on the table: search relevance improvements, the mobile app MVP, and the new analytics dashboard. We can't do all three at full scope, so we need to make trade-offs."),
    ("01:02", "Marcus Chen", "Before we dive in, I want to flag capacity. We lost one backend engineer in September, so we're effectively at four engineers for the quarter, not five."),
    ("01:25", "Priya Nair", "Good flag, thanks Marcus. Let me share the prioritization sheet so we're all looking at the same numbers."),
    ("01:40", "@share_start", "Priya Nair", "Q4 prioritization spreadsheet"),
    ("02:15", "Priya Nair", "Here's the scoring. I rated each item on customer impact, effort, and strategic fit. Search relevance scores highest on impact, 9 out of 10, mostly because it's our number one support complaint."),
    ("03:05", "Dev Patel", "That matches the data. Last month 31 percent of support tickets mentioned search, and our search-to-click rate dropped from 58 to 49 percent since the catalog doubled in size."),
    ("03:48", "Elena Rossi", "From the design side, the search results page hasn't been touched in two years. I'd love to redo the filters and the empty states while we're in there."),
    ("04:30", "Marcus Chen", "Search is roughly six weeks of work if we scope it to a new ranking model plus the filter redesign. I'd want Elena's designs locked by the end of October."),
    ("05:12", "Priya Nair", "That works. Elena, can you commit to the filter designs by October 25th?"),
    ("05:20", "Elena Rossi", "Yes, October 25th is realistic. I'll share early drafts next week so Marcus can start on the API changes."),
    ("06:02", "Priya Nair", "Great. Now the mobile app. Sales keeps asking for it, and three enterprise prospects listed it as a requirement in their last RFPs."),
    ("07:10", "Marcus Chen", "Honestly, a full mobile app is a stretch this quarter. If we want a real MVP, we're looking at ten to twelve weeks with two engineers dedicated, which would collide with search."),
    ("08:25", "Dev Patel", "One data point: only 12 percent of our weekly active users open the product on a phone browser today. The demand is more about the sales perception than actual usage."),
    ("09:40", "Priya Nair", "That's a useful distinction. So maybe the answer is a responsive web upgrade now, and the native app moves to Q1 with proper resourcing."),
    ("10:55", "Elena Rossi", "I like that. A responsive redesign of the core flows is maybe three weeks of design and gets us 80 percent of what the RFPs want."),
    ("12:30", "Marcus Chen", "I'm comfortable with that. Responsive web is two weeks of engineering if the design system components are ready, which they mostly are."),
    ("14:05", "@share_end"),
    ("14:20", "Priya Nair", "Okay, let me capture that. Decision one: search relevance is the top priority for Q4. Decision two: native mobile app is deferred to Q1, and we ship a responsive web upgrade instead."),
    ("16:45", "Priya Nair", "Now the analytics dashboard. Dev, you did some discovery interviews. What did you hear?"),
    ("17:30", "Dev Patel", "Customers want three things: exportable reports, scheduled email digests, and per-team breakdowns. The export piece came up in eight of the eleven interviews."),
    ("19:15", "Dev Patel", "My suggestion is to ship CSV export first because it's cheap, maybe three days of engineering, and defer the digests and team breakdowns."),
    ("21:00", "Marcus Chen", "CSV export I can fit in. The digests need a scheduler service we don't have, so that's a bigger lift. I'd push that to Q1 alongside the mobile app."),
    ("23:40", "Elena Rossi", "If we're deferring digests, I'd still like to prototype them so we can validate the design with customers during Q4."),
    ("25:10", "Priya Nair", "Agreed. Elena prototypes the digest flow, we test it with five customers, and engineering builds it in Q1 if the feedback is strong."),
    ("27:30", "Priya Nair", "Let's talk risks. Marcus, what could derail the search project?"),
    ("28:15", "Marcus Chen", "The ranking model depends on clean click-through data. Dev, is the event tracking reliable enough to train on?"),
    ("29:05", "Dev Patel", "Mostly. We have a gap from mid-July when the tracking snippet broke, about three weeks of missing data. I can backfill from server logs but it'll take me a few days."),
    ("31:20", "Priya Nair", "Please do that, Dev. Let's say the backfill is done by October 10th so Marcus isn't blocked."),
    ("31:35", "Dev Patel", "Works for me. I'll have it done by the 10th."),
    ("34:00", "Elena Rossi", "One more design item. If we change the filters, we need to coordinate with support so their help articles don't go stale on launch day."),
    ("35:45", "Priya Nair", "Good catch. I'll loop in the support team lead and ask for a docs update plan before launch."),
    ("38:10", "Marcus Chen", "Timeline-wise, I'd target a beta of the new search in the first week of December, with general availability before the holiday freeze."),
    ("40:30", "Priya Nair", "That's the plan then. Let me recap: search relevance with a December beta, responsive web upgrade, CSV export, and the digest prototype. Mobile app and scheduled digests move to Q1."),
    ("42:15", "Priya Nair", "I'll publish the roadmap doc to the team by Friday. Any objections or last-minute concerns?"),
    ("43:10", "Marcus Chen", "No objections from me. I'll start the ranking model spike on Monday."),
    ("43:50", "Elena Rossi", "All good here. Thanks everyone."),
    ("44:20", "Priya Nair", "Perfect. Thanks all, great discussion. Talk soon."),
]

SUMMARY = {
    "purpose": "Decide and commit to the Q4 product roadmap by prioritizing search relevance, the mobile app, and the analytics dashboard under reduced engineering capacity.",
    "key_takeaways": [
        "Search relevance is the top Q4 priority: it is the number one support complaint (31% of tickets) and search-to-click rate fell from 58% to 49%.",
        "The native mobile app is deferred to Q1; a responsive web upgrade ships in Q4 instead, since only 12% of weekly active users use phone browsers.",
        "Analytics dashboard scope is cut to CSV export in Q4; scheduled digests and team breakdowns move to Q1, with a digest prototype tested with five customers.",
        "Engineering capacity is four engineers, down from five, which drove the scope trade-offs.",
        "Target a new-search beta in the first week of December, with general availability before the holiday freeze.",
    ],
    "highlights": [
        (65, "Capacity drops to four engineers"),
        (185, "Search drives 31% of support tickets"),
        (440, "Mobile app deferred to Q1; responsive web instead"),
        (870, "Roadmap decisions recorded"),
        (1050, "Analytics: ship CSV export first"),
        (1745, "Click data gap and backfill plan"),
        (2430, "Final recap of the Q4 plan"),
    ],
}

ACTION_ITEMS = [
    ("Elena Rossi", "Deliver final search filter designs by October 25", 320),
    ("Dev Patel", "Backfill the missing July click-tracking data from server logs by October 10", 1895),
    ("Marcus Chen", "Start the search ranking model spike on Monday", 2590),
    ("Priya Nair", "Publish the Q4 roadmap doc to the team by Friday", 2535),
    ("Priya Nair", "Ask the support team lead for a help-docs update plan before the search launch", 2145),
    ("Elena Rossi", "Prototype the scheduled digest flow and test it with five customers", 1510),
]
