"""Meeting 2: Sales demo call (30 min, 3 participants)."""

MEETING = {
    "title": "Northwind Logistics: Product Demo",
    "description": "Discovery follow-up and product demo for Northwind Logistics, including pricing and security questions.",
    "meeting_type": "sales",
    "started_at": "2026-09-30T17:00:00+00:00",
    "duration_seconds": 1800,
    "thumbnail_url": "https://picsum.photos/seed/salesdemo/640/360",
}

PARTICIPANTS = [
    {"name": "Jordan Blake", "email": "jordan@acmesoft.io", "role": "Account Executive", "is_host": True, "avatar_color": "#6366F1"},
    {"name": "Sam Okafor", "email": "sam.okafor@northwindlogistics.com", "role": "VP of Operations, Northwind", "is_host": False, "avatar_color": "#EC4899"},
    {"name": "Lena Hoffman", "email": "lena.hoffman@northwindlogistics.com", "role": "IT Director, Northwind", "is_host": False, "avatar_color": "#14B8A6"},
]

TRANSCRIPT = [
    ("00:06", "Jordan Blake", "Hi Sam, hi Lena, thanks for joining. Last time we talked about your dispatch visibility problems, so I've tailored today's demo around that. Does that still reflect your priorities?"),
    ("00:30", "Sam Okafor", "Yes, that's still the main thing. Right now our dispatchers juggle three different tools and we lose track of late shipments until a customer calls us."),
    ("01:05", "Lena Hoffman", "And from my side, I'm here mostly for integration and security. We run on an older TMS and I need to understand how this connects."),
    ("01:30", "Jordan Blake", "Perfect, we'll cover both. Let me share my screen and start with the live dispatch board."),
    ("01:42", "@share_start", "Jordan Blake", "Live dispatch board demo"),
    ("02:10", "Jordan Blake", "This is the main view. Every active shipment shows up on one board, color coded by status. Anything running late turns red automatically based on the ETA prediction."),
    ("03:25", "Sam Okafor", "That's exactly what we're missing. How early does it flag a late shipment? Because catching it an hour ahead is not much use to us."),
    ("04:00", "Jordan Blake", "The model flags risk typically four to six hours before the promised delivery window, using traffic, weather and the driver's progress. Customers on your tier see about an 85 percent accuracy rate."),
    ("05:20", "Sam Okafor", "Four to six hours is great. That gives us time to reroute or call the customer proactively."),
    ("06:10", "Jordan Blake", "Right, and you can trigger an automated customer notification from this panel. Let me show the workflow builder for that."),
    ("08:45", "Lena Hoffman", "Can you go back to the integrations tab for a second? I want to see what's supported for TMS systems."),
    ("09:20", "Jordan Blake", "Sure. We have native connectors for the major TMS vendors, plus a REST API and webhooks. For legacy systems, we usually do a nightly SFTP sync or build a custom adapter."),
    ("10:40", "Lena Hoffman", "Our TMS is about twelve years old and only exports CSV over SFTP. Would the nightly sync be enough, or do we lose the real-time piece?"),
    ("11:30", "Jordan Blake", "A nightly sync alone wouldn't give you real-time updates. In that case we'd recommend the custom adapter, which polls your SFTP drop every five minutes. Our solutions team has done this before."),
    ("13:15", "Lena Hoffman", "Five-minute polling is acceptable. What would the implementation timeline look like?"),
    ("14:00", "Jordan Blake", "For a custom adapter plus onboarding, typically six to eight weeks. I can get our solutions engineer on a technical call with you next week to scope it."),
    ("15:30", "@share_end"),
    ("15:45", "Sam Okafor", "Okay, let's talk pricing. What are we looking at for around 80 dispatchers?"),
    ("16:20", "Jordan Blake", "For 80 seats on the annual plan, it's 45 dollars per seat per month, so about 43,200 a year. The custom adapter is a one-time 12,000 dollar implementation fee."),
    ("17:35", "Sam Okafor", "That's higher than I expected. A competitor quoted us around 35 per seat, though their product doesn't have the ETA prediction."),
    ("18:30", "Jordan Blake", "Understood. The prediction engine is what drives the late-shipment savings, and I can put together an ROI estimate. If you're losing even a handful of accounts a year to late deliveries, the math usually works out well."),
    ("20:10", "Sam Okafor", "An ROI sheet would help me make the case internally. We lost two accounts last year over late shipments, one worth about 300,000 dollars."),
    ("21:25", "Jordan Blake", "That's a strong data point. I'll build the ROI model using those numbers and send it over by Thursday."),
    ("22:40", "Lena Hoffman", "On security, I'll need your SOC 2 report and details on data residency. We can't have shipment data leaving the US."),
    ("23:30", "Jordan Blake", "We're SOC 2 Type II certified and we offer US-only data residency on the annual plan. I'll send the report and our security whitepaper today."),
    ("25:00", "Sam Okafor", "Our budget cycle closes at the end of November, so we'd want a decision by mid-November to get this funded this year."),
    ("26:10", "Jordan Blake", "That works. Let's plan a technical scoping call next week, ROI model by Thursday, and a follow-up call with both of you on November 5th to talk through next steps."),
    ("27:20", "Sam Okafor", "November 5th is good for me. Lena, can you make that?"),
    ("27:35", "Lena Hoffman", "I'll put it on my calendar."),
    ("28:40", "Jordan Blake", "Wonderful. Thanks both, I'll send a recap email right after this."),
]

SUMMARY = {
    "purpose": "Demo the dispatch visibility product to Northwind Logistics, address integration and security requirements, and discuss pricing and next steps toward a decision.",
    "key_takeaways": [
        "Northwind's core pain is dispatchers using three tools and learning about late shipments only when customers call; they lost two accounts last year, one worth about $300K.",
        "The ETA prediction flags late-delivery risk four to six hours ahead at roughly 85% accuracy, which Sam called exactly what they are missing.",
        "Integration risk: Northwind's 12-year-old TMS only exports CSV over SFTP, so a custom adapter (5-minute polling, 6-8 week implementation, $12K one-time) is needed.",
        "Pricing quoted at $45/seat/month for 80 seats (about $43,200/year); a competitor quoted about $35/seat without ETA prediction.",
        "Security requirements: SOC 2 report and US-only data residency, both available on the annual plan.",
        "Decision timeline: Northwind's budget cycle closes end of November, so they want a decision by mid-November.",
    ],
    "highlights": [
        (30, "Pain point: three tools and late shipments found by customers"),
        (240, "ETA prediction flags risk 4-6 hours early"),
        (640, "TMS integration: legacy CSV over SFTP"),
        (975, "Pricing: 80 seats at $45 per seat per month"),
        (1050, "Price objection: competitor at $35 per seat"),
        (1360, "Security: SOC 2 and US data residency"),
        (1570, "Next steps and decision timeline"),
    ],
}

ACTION_ITEMS = [
    ("Jordan Blake", "Build the ROI model using Northwind's lost-account numbers and send it by Thursday", 1285),
    ("Jordan Blake", "Send the SOC 2 Type II report and security whitepaper today", 1410),
    ("Jordan Blake", "Schedule a technical scoping call between Lena and a solutions engineer next week", 840),
    ("Jordan Blake", "Send a recap email after the call", 1720),
    ("Lena Hoffman", "Add the November 5th follow-up call to the calendar", 1655),
    ("Sam Okafor", "Get internal buy-in using the ROI sheet before the mid-November decision deadline", 1210),
]
