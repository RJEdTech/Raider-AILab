/* Raider AILab: AI in the News. Real stories, good and bad, each with sourced numbers,
   the math to check, and the "Questions to ask any AI" run on the story.
   New weeks go at the TOP. Fields: see the project doc "In the News lab pages", plus:
   side: 'good' | 'harm' | 'both'   ask: [7 short answers, in the order of the 7 questions]
   group: optional heading that replaces "Week of …" */
window.RAIDER_NEWS = [
 {
  "id": "dublin-ai-flood-warning-2026",
  "week": "2026-11-22",
  "side": "good",
  "date": "2026-11-16",
  "title": "Dublin pilots an AI flood warning system that gave up to 21 hours' notice in tests on past floods",
  "summary": "An AI early-warning system for flooding began a pilot in Dublin, Ireland, the week of November 16, running through the autumn and winter. It looks for patterns in river, rain and tide sensors and in weather data, and council staff review every alert before acting.",
  "numbers": [
   "Built on 10 years of sensor data from the council's flood monitoring network, plus river levels, rainfall, tides and Met Éireann weather data (<a href=\"https://www.thejournal.ie/dublin-ai-flood-warning-system-7227372-Nov2026/\" target=\"_blank\" rel=\"noopener\">TheJournal.ie, Nov 16, 2026</a>).",
   "In trials on past events, it would have warned 13 to 21 hours ahead of certain floods driven by mountain rain; company-reported by EMR Integrated Solutions (<a href=\"https://www.thejournal.ie/dublin-ai-flood-warning-system-7227372-Nov2026/\" target=\"_blank\" rel=\"noopener\">TheJournal.ie, Nov 16, 2026</a>).",
   "Every alert is reviewed and interpreted by council staff before action is taken (<a href=\"https://www.thejournal.ie/dublin-ai-flood-warning-system-7227372-Nov2026/\" target=\"_blank\" rel=\"noopener\">TheJournal.ie, Nov 16, 2026</a>).",
   "No accuracy, missed-flood or false-alarm rates were published (<a href=\"https://www.thejournal.ie/dublin-ai-flood-warning-system-7227372-Nov2026/\" target=\"_blank\" rel=\"noopener\">TheJournal.ie, Nov 16, 2026</a>).",
   "Worldwide, 136 countries (70%) now report having multi-hazard early warning systems; countries with substantial to comprehensive systems have disaster death rates 6.1 times lower than countries with limited ones (<a href=\"https://news.un.org/en/story/2026/11/1168787\" target=\"_blank\" rel=\"noopener\">UN News, reporting a UNDRR and WMO report, Nov 11, 2026</a>)."
  ],
  "concept": {
   "title": "Lead time is not enough: hits and false alarms",
   "html": "A warning system can be judged three ways. <b>Lead time</b>: how early does it warn? <b>Hit rate</b>: of the real floods, what share did it warn about? <b>Share of alerts that are real</b> (precision): of all the alerts, how many were followed by a flood? A system that warns of everything has a perfect hit rate and useless alerts. The Dublin trial reported only lead time, so two of the three numbers are missing."
  },
  "hook": {
   "prompt": "Part (a) assumes, as a teaching example, that a sensor records once every 15 minutes. Parts (b) and (c) use made-up teaching numbers: in a test on 20 past floods, a system warned before 17 of them and also raised 6 false alarms.",
   "parts": [
    {
     "label": "(a) How many readings does one sensor make in 10 years? (Use 365.25 days per year.)",
     "answer": 350640,
     "tol": 1,
     "unit": "readings"
    },
    {
     "label": "(b) What is the hit rate?",
     "answer": 85,
     "tol": 0.2,
     "unit": "%"
    },
    {
     "label": "(c) What percent of all alerts were followed by a real flood?",
     "answer": 73.9,
     "tol": 0.3,
     "unit": "%"
    }
   ],
   "worked": "(a) 10 &times; 365.25 &times; 24 &times; 4 = <b>350,640 readings</b> per sensor, which is why a computer is good at searching them for patterns. (b) 17 &divide; 20 = <b>85%</b>; 3 floods were missed. (c) Alerts = 17 + 6 = 23. 17 &divide; 23 = 0.739, about <b>73.9%</b>. Ask any warning system for all three numbers."
  },
  "hides": "The 13 to 21 hours comes from the company's own tests on past floods, not a live season, and only for one kind of flood. Missed floods and false alarms were not reported. The UN's 6.1 times figure compares countries, which differ in many ways besides warning systems, so it shows an association, not proof that warnings alone cut deaths.",
  "evidence": "Preliminary: a company-reported pilot described in a news article, with a government minister's comment. No independent evaluation yet. The UN figure is from a UN agency report, not a peer-reviewed study.",
  "investigate": "The UN's <a href=\"https://www.un.org/en/climatechange/early-warnings-for-all\" target=\"_blank\" rel=\"noopener\">Early Warnings for All</a> initiative aims to cover everyone by 2027. Find out what four parts it says a full warning system needs. Which part would AI help with, and which need people?",
  "ask": [
   "Ten years of the council's flood sensor data plus weather data (company-reported).",
   "How early it would have warned of past floods: 13 to 21 hours in tests (company-reported).",
   "No: the method and test results are not public.",
   "Yes: council staff review every alert before acting.",
   "A missed flood could damage homes and roads; a false alarm costs crew time. Who pays: unknown.",
   "Not applicable: it does not make decisions about individuals.",
   "Unknown: the number of people in the pilot area was not given."
  ],
  "related": [
   {
    "href": "index.html#detector",
    "label": "Detector check"
   },
   {
    "href": "index.html#frontier",
    "label": "The jagged frontier"
   }
  ]
 },
 {
  "id": "oregon-sues-openai-teens-2026",
  "week": "2026-11-22",
  "side": "harm",
  "date": "2026-11-17",
  "title": "Oregon sues OpenAI, alleging ChatGPT was marketed as safe for teens without working safeguards",
  "summary": "Oregon's Department of Justice sued OpenAI on November 17, alleging the company misrepresented ChatGPT as safe for young users and knew its protections for minors could be easily bypassed. These are allegations; no court has ruled (checked November 22, 2026).",
  "numbers": [
   "The 53-page complaint alleges willful violations of Oregon's Unlawful Trade Practices Act (<a href=\"https://www.opb.org/article/2026/11/17/oregon-ag-sues-openai-claims-company-knowingly-endangers-teens/\" target=\"_blank\" rel=\"noopener\">OPB, Nov 17, 2026</a>).",
   "Oregon seeks at least $2.035 billion in damages; the article does not say how that figure was calculated (<a href=\"https://www.opb.org/article/2026/11/17/oregon-ag-sues-openai-claims-company-knowingly-endangers-teens/\" target=\"_blank\" rel=\"noopener\">OPB, Nov 17, 2026</a>).",
   "ChatGPT allows users as young as 13 with a parent's or guardian's consent; the complaint alleges the company often fails to confirm that consent (<a href=\"https://www.opb.org/article/2026/11/17/oregon-ag-sues-openai-claims-company-knowingly-endangers-teens/\" target=\"_blank\" rel=\"noopener\">OPB, Nov 17, 2026</a>).",
   "The complaint alleges the teen version's safeguards are \"easily bypassed\" and did not alert parents when teens asked about risky topics (alleged, <a href=\"https://www.opb.org/article/2026/11/17/oregon-ag-sues-openai-claims-company-knowingly-endangers-teens/\" target=\"_blank\" rel=\"noopener\">OPB, Nov 17, 2026</a>).",
   "Oregon's Attorney General said no specific incident in Oregon led to the suit; eight other states sued OpenAI in October (<a href=\"https://www.opb.org/article/2026/11/17/oregon-ag-sues-openai-claims-company-knowingly-endangers-teens/\" target=\"_blank\" rel=\"noopener\">OPB, Nov 17, 2026</a>).",
   "OpenAI said it will keep working with experts and building safeguards such as parental controls, break reminders and age-appropriate protections (<a href=\"https://www.opb.org/article/2026/11/17/oregon-ag-sues-openai-claims-company-knowingly-endangers-teens/\" target=\"_blank\" rel=\"noopener\">OPB, Nov 17, 2026</a>)."
  ],
  "concept": {
   "title": "A safety chain is only as strong as each check",
   "html": "A sign-up that asks \"Do you have a parent's permission?\" is a check only if someone verifies the answer. For a false claim to slip through, two things must happen: the claim is false, <b>and</b> it is not checked. Multiply the chances: P(slip) = P(false) &times; P(not checked). A system that checks 1 in 5 claims leaves 80% of false claims standing, however good the rest of its design."
  },
  "hook": {
   "prompt": "No real sign-up numbers were published, so use made-up teaching numbers. An app gets 10,000 teen sign-ups. 60% say a parent gave permission. The app verifies only 1 in 5 of those claims. Assume 15% of the claims are false.",
   "parts": [
    {
     "label": "(a) How many permission claims are never verified?",
     "answer": 4800,
     "tol": 1,
     "unit": "claims"
    },
    {
     "label": "(b) About how many false claims slip through unchecked?",
     "answer": 720,
     "tol": 1,
     "unit": "claims"
    },
    {
     "label": "(c) What percent of all 10,000 sign-ups had their permission verified?",
     "answer": 12,
     "tol": 0.1,
     "unit": "%"
    }
   ],
   "worked": "(a) Claims: 0.60 &times; 10,000 = 6,000. Unverified: 6,000 &times; 0.80 = <b>4,800</b>. (b) 4,800 &times; 0.15 = <b>720 false claims</b> that look the same as real ones. (c) Verified: 6,000 &times; 0.20 = 1,200, and 1,200 &divide; 10,000 = <b>12%</b>."
  },
  "hides": "A lawsuit tells you what one side says it can prove, not what a court has found. The $2.035 billion figure is what Oregon asks for, not a fine anyone has been ordered to pay. The hook's numbers are made up because neither side has published real sign-up or verification data. Chatbots also help many teens with homework and questions, which a suit about harms does not measure.",
  "evidence": "Pending lawsuit (alleged), checked November 22, 2026, read through one news report. The complaint itself was not read. The court was not named in the coverage.",
  "investigate": "Common Sense Media publishes <a href=\"https://www.commonsensemedia.org/ai-ratings\" target=\"_blank\" rel=\"noopener\">AI risk ratings</a> for popular AI tools. Pick one tool you use. What age does it say the tool is for, and how does the tool check a user's age?",
  "ask": [
   "Not public in detail.",
   "Not public; the lawsuit questions whether teen safety was tested well enough (alleged).",
   "No: the model and its safety testing are not public.",
   "Parents are supposed to consent, but the complaint alleges consent often is not confirmed.",
   "The complaint alleges teens are harmed; Oregon seeks at least $2.035 billion; no ruling yet (checked Nov 22, 2026).",
   "Users can report problems to the company; the state is using the courts.",
   "Unknown: the suit named no count of Oregon users."
  ],
  "related": [
   {
    "href": "index.html#companion",
    "label": "Why does an AI companion feel like a friend?"
   },
   {
    "href": "index.html#gamegoal",
    "label": "Game the goal"
   }
  ]
 },
 {
  "id": "alphagenome-2-2026",
  "week": "2026-11-15",
  "side": "good",
  "date": "2026-11-11",
  "title": "An AI model predicts which DNA changes switch genes on or off in specific cell types",
  "summary": "Google DeepMind released AlphaGenome 2, which predicts how changes in non-coding DNA (the part that does not code for proteins) affect gene activity in particular types of cells. Researchers can use it to narrow down where a disease starts. It is a research tool, not a medical test.",
  "numbers": [
   "Trained on single-cell data from more than 100 million cells across 68 tissues (<a href=\"https://www.nature.com/articles/d41586-026-03673-0\" target=\"_blank\" rel=\"noopener\">Nature news, Nov 11, 2026</a>).",
   "Makes predictions for 637 human and 311 mouse cell types (<a href=\"https://www.nature.com/articles/d41586-026-03673-0\" target=\"_blank\" rel=\"noopener\">Nature news, Nov 11, 2026</a>).",
   "Non-coding DNA is about 98% of the human genome (<a href=\"https://www.nature.com/articles/d41586-026-03673-0\" target=\"_blank\" rel=\"noopener\">Nature news, Nov 11, 2026</a>).",
   "On one immune-cell test set, it found 30% of likely causal variants at 90% precision, against 16% for the first AlphaGenome; company-reported (<a href=\"https://www.unite.ai/google-deepminds-alphagenome-2-predicts-cell-state-variant-effects/\" target=\"_blank\" rel=\"noopener\">Unite.AI, Nov 11, 2026</a>).",
   "An outside scientist said a lab experiment that took about 1.5 years reached a related answer in about 30 minutes with the model (<a href=\"https://www.nature.com/articles/d41586-026-03673-0\" target=\"_blank\" rel=\"noopener\">Nature news, Nov 11, 2026</a>)."
  ],
  "concept": {
   "title": "Precision and recall",
   "html": "<b>Recall</b> asks: of all the real answers, what share did the model find? <b>Precision</b> asks: of everything the model flagged, what share was right? A model can have high precision and low recall: it is usually right when it speaks up, but it misses most of what is there. Both numbers matter, and a tool reported with only one of them is only half described."
  },
  "hook": {
   "prompt": "Imagine a test set with 1,000 DNA variants that truly cause a change in gene activity. Use the company-reported 30% recall and 90% precision.",
   "parts": [
    {
     "label": "(a) How many of the 1,000 real variants does the model find?",
     "answer": 300,
     "tol": 0.5,
     "unit": "variants"
    },
    {
     "label": "(b) If 90% of its flags are correct, how many variants does it flag in total?",
     "answer": 333,
     "tol": 1,
     "unit": "variants"
    },
    {
     "label": "(c) How many times the first model's recall (16%) is the new 30%?",
     "answer": 1.875,
     "tol": 0.02,
     "unit": "times"
    }
   ],
   "worked": "(a) 0.30 &times; 1,000 = <b>300 found</b>, so 700 are missed. (b) 300 correct flags are 90% of all flags: 300 &divide; 0.90 = <b>333 flags</b>, about 33 of them wrong. (c) 30 &divide; 16 = <b>1.875 times</b>. Nearly double, and it still misses 7 in 10."
  },
  "hides": "The best results come from one test set chosen and scored by the company, in a preprint that had not been peer reviewed. A prediction is a lead, not proof: researchers still have to test it in the lab. The model finds a minority of the variants, and some cell types are poorly represented in its training data.",
  "evidence": "Preliminary: a company release and preprint, with independent reporting and an outside expert's comment in <i>Nature</i>'s news section. The performance figures are company-reported. DeepMind's own post could not be opened by this automated run.",
  "investigate": "The <a href=\"https://www.ebi.ac.uk/gwas/\" target=\"_blank\" rel=\"noopener\">GWAS Catalog</a> lists DNA variants linked to traits. Search a trait such as height or asthma. How many variants are listed, and why might it be hard to tell which ones actually cause the trait?",
  "ask": [
   "Single-cell data from more than 100 million human and mouse cells in 68 tissues.",
   "Finding likely causal variants in one immune-cell dataset, scored by the developer.",
   "Partly: a technical preprint is public; open model weights were not mentioned.",
   "Yes: researchers check its predictions with lab experiments; it is not used to diagnose patients.",
   "Researchers lose time and money chasing the wrong variant; patients are not directly affected.",
   "Not applicable: it makes no decisions about people.",
   "Unknown: the number of research users is not public."
  ],
  "related": [
   {
    "href": "index.html#frontier",
    "label": "The jagged frontier"
   },
   {
    "href": "index.html#coauthor",
    "label": "Co-author with AI"
   }
  ]
 },
 {
  "id": "uk-facial-recognition-inspection-2026",
  "week": "2026-11-15",
  "side": "harm",
  "date": "2026-11-12",
  "title": "UK police inspectors warn that facial recognition searches risk wrongful arrests",
  "summary": "His Majesty's Inspectorate of Constabulary and Fire &amp; Rescue Services (HMICFRS) reviewed how police in England and Wales and the National Crime Agency use retrospective facial recognition: searching photos from cameras against police image databases. Inspectors found some investigators treated a match as evidence instead of a lead and skipped checks, and that the system was more likely to wrongly flag people from ethnic minority groups.",
  "numbers": [
   "16 recommendations in the inspection report (<a href=\"https://bigbrotherwatch.org.uk/press-releases/big-brother-watch-response-to-watchdog-warning-that-facial-recognition-risks-wrongful-arrests/\" target=\"_blank\" rel=\"noopener\">Big Brother Watch response, Nov 12, 2026</a>; <a href=\"https://www.yahoo.com/news/politics/articles/facial-recognition-cameras-risk-wrongful-061500316.html\" target=\"_blank\" rel=\"noopener\">The Telegraph via Yahoo, Nov 12, 2026</a>).",
   "Live facial recognition is already used by 13 police forces; a Home Office proposal would extend it to all 43 forces in England and Wales (<a href=\"https://www.yahoo.com/news/politics/articles/facial-recognition-cameras-risk-wrongful-061500316.html\" target=\"_blank\" rel=\"noopener\">The Telegraph via Yahoo, Nov 12, 2026</a>).",
   "Inspectors could not tell whether bias contributed to any wrongful arrest, because the data needed was not kept (<a href=\"https://www.yahoo.com/news/politics/articles/facial-recognition-cameras-risk-wrongful-061500316.html\" target=\"_blank\" rel=\"noopener\">The Telegraph via Yahoo, Nov 12, 2026</a>).",
   "Custody images that should have been deleted were still being searched (<a href=\"https://www.aol.co.uk/articles/facial-recognition-errors-put-ethnic-000103000.html\" target=\"_blank\" rel=\"noopener\">The Guardian via AOL, Nov 12, 2026</a>).",
   "Public support for police use was 91% in one 2025 survey and 53% in another, depending on who asked and how (<a href=\"https://www.theregister.com/security/2026/11/13/brit-police-watchdog-says-cops-use-of-facial-recog-risks-wrongful-arrests/5309379\" target=\"_blank\" rel=\"noopener\">The Register, Nov 13, 2026</a>)."
  ],
  "concept": {
   "title": "Base rates: why most alerts can be wrong",
   "html": "When almost everyone searched is innocent, even a small false-match rate produces many false alerts. If a system scans N people with a false-match rate f, it makes about N &times; f false alerts. Compare that with the number of real matches: when the real matches are rare, false alerts can outnumber them. That is why a match should start an investigation, never end one."
  },
  "hook": {
   "prompt": "No real error rates were published, so use made-up teaching numbers. A camera checks 100,000 faces against a watchlist. 10 of those people are really on the list, and the system catches all 10. It also falsely matches 1 in every 1,000 innocent people. Part (c) uses the real numbers above.",
   "parts": [
    {
     "label": "(a) About how many false alerts?",
     "answer": 100,
     "tol": 1,
     "unit": "alerts"
    },
    {
     "label": "(b) What percent of all alerts are real matches?",
     "answer": 9.1,
     "tol": 0.2,
     "unit": "%"
    },
    {
     "label": "(c) What percent of the 43 forces already use live facial recognition?",
     "answer": 30.2,
     "tol": 0.3,
     "unit": "%"
    }
   ],
   "worked": "(a) Innocent people: 100,000 &minus; 10 = 99,990. 99,990 &times; 0.001 = 99.99, about <b>100 false alerts</b>. (b) Real alerts &divide; all alerts = 10 &divide; (10 + 100) = 0.091, about <b>9.1%</b>. More than 9 of every 10 alerts are wrong, even though the system is \"99.9% accurate\" on innocent faces. (c) 13 &divide; 43 = 0.302, about <b>30.2%</b>."
  },
  "hides": "The inspection report itself gave no false-match rates or error rates by group in the coverage read here, so the hook uses made-up numbers. \"Bias\" means the error rate differs between groups; inspectors could not measure its real-world effect because records were missing. Survey results on public support depend heavily on how the question is asked.",
  "evidence": "Strong source: an official government inspection. But this run read only news coverage and a campaign group's response; the HMICFRS report itself could not be opened, so its exact title and figures are not verified here.",
  "investigate": "The US National Institute of Standards and Technology runs the <a href=\"https://www.nist.gov/programs-projects/face-recognition-vendor-test-frvt\" target=\"_blank\" rel=\"noopener\">Face Recognition Vendor Test</a>. Find what it says about how false-match rates differ between demographic groups and between algorithms.",
  "ask": [
   "Not public.",
   "Not public in the coverage; research cited shows higher error rates for some groups.",
   "No: inspectors found gaps in how searches were recorded and overseen.",
   "It is supposed to, but inspectors found some investigators treated matches as evidence and skipped checks.",
   "The wrongly flagged person pays first; inspectors could not count wrongful arrests because data was missing.",
   "No clear route; the Home Office has proposed new independent oversight.",
   "Anyone whose photo is in a searchable police database; the exact number is not public."
  ],
  "related": [
   {
    "href": "index.html#blackbox",
    "label": "Can you see why?"
   },
   {
    "href": "index.html#detector",
    "label": "Detector check"
   }
  ]
 },
 {
  "id": "data-center-grid-costs-2026",
  "week": "2026-11-15",
  "side": "harm",
  "date": "2026-11-09",
  "title": "Study: households pay most of the power grid costs tied to data center growth",
  "summary": "Cornell University researchers, publishing in <i>Nature Energy</i>, studied four major US power grids from 2020 to 2025, including about 4,000 existing and proposed data centers, many built for AI. They found data centers paid only about 38% of the grid costs linked to their own growth, with most of the rest falling on households.",
  "numbers": [
   "Data centers paid $3.12 billion of $8.25 billion in growth-linked grid costs in 2025; $5.13 billion fell largely on residents (<a href=\"https://news.cornell.edu/stories/2026/11/data-centers-need-power-lower-income-rural-residents-pay-price\" target=\"_blank\" rel=\"noopener\">Cornell Chronicle, Nov 9, 2026</a>).",
   "Transmission investment rose from $2 billion in 2020 to $34 billion in 2025 (<a href=\"https://news.cornell.edu/stories/2026/11/data-centers-need-power-lower-income-rural-residents-pay-price\" target=\"_blank\" rel=\"noopener\">Cornell Chronicle, Nov 9, 2026</a>).",
   "Wholesale electricity prices rose about 15% in Virginia and about 20% in the southern San Francisco Bay Area by 2025 (<a href=\"https://news.cornell.edu/stories/2026/11/data-centers-need-power-lower-income-rural-residents-pay-price\" target=\"_blank\" rel=\"noopener\">Cornell Chronicle, Nov 9, 2026</a>).",
   "The share of rural families spending more than 6% of income on energy rose 76% more than the urban share (<a href=\"https://news.cornell.edu/stories/2026/11/data-centers-need-power-lower-income-rural-residents-pay-price\" target=\"_blank\" rel=\"noopener\">Cornell Chronicle, Nov 9, 2026</a>).",
   "The authors suggest charging data centers for the demand they add and cutting their use in about 22 peak hours a year (<a href=\"https://news.cornell.edu/stories/2026/11/data-centers-need-power-lower-income-rural-residents-pay-price\" target=\"_blank\" rel=\"noopener\">Cornell Chronicle, Nov 9, 2026</a>)."
  ],
  "concept": {
   "title": "Who pays: shares and growth factors",
   "html": "A <b>share</b> is a part divided by the whole. A <b>growth factor</b> is new &divide; old. To find the steady yearly rate that would produce that growth over n years, take the n-th root: rate = (new &divide; old)<sup>1/n</sup> &minus; 1. AI runs on electricity, so the cost of the grid that delivers it is part of the cost of AI, even when it does not show up in the price of an app."
  },
  "hook": {
   "prompt": "Use the study's numbers.",
   "parts": [
    {
     "label": "(a) What percent of the $8.25 billion did data centers pay?",
     "answer": 37.8,
     "tol": 0.3,
     "unit": "%"
    },
    {
     "label": "(b) Transmission investment went from $2 billion to $34 billion. What is the growth factor?",
     "answer": 17,
     "tol": 0.05,
     "unit": "times"
    },
    {
     "label": "(c) What steady yearly growth rate over 5 years gives that factor?",
     "answer": 76.2,
     "tol": 0.6,
     "unit": "% per year"
    }
   ],
   "worked": "(a) 3.12 &divide; 8.25 = 0.378, about <b>37.8%</b>; residents and other customers paid the other 62%. (b) 34 &divide; 2 = <b>17 times</b>. (c) 17<sup>1/5</sup> = 1.762, so about <b>76.2% a year</b>. Check: 2 &times; 1.762<sup>5</sup> = 34."
  },
  "hides": "Transmission spending rises for many reasons, not only data centers, and the study's model has to decide which costs to link to them. Some regions (New York and New England) showed no clear increase. A Washington Post analysis published Nov 6, 2026 argued data centers may not be raising most Americans' bills much; it could not be opened for this page, so its numbers are not included. Data centers serve many uses besides AI.",
  "evidence": "Moderate: a peer-reviewed study in <i>Nature Energy</i>, read through the university's news release, not the paper itself. The modeling assumptions and uncertainty ranges were not checked.",
  "investigate": "The <a href=\"https://www.eia.gov/electricity/data/browser/\" target=\"_blank\" rel=\"noopener\">EIA Electricity Data Browser</a> shows the average residential electricity price by state. How has Colorado's price changed since 2020? Compare it with Virginia's.",
  "ask": [
   "Not applicable: this is about the power AI runs on, not one model.",
   "Not applicable; the study measured who paid grid costs.",
   "Partly: utility rate filings are public, but many data centers do not disclose their power use.",
   "State utility regulators approve the rates customers pay.",
   "Residents, especially lower-income and rural households, pay much of the cost, the study finds.",
   "Yes, in a way: through public comment in state utility rate cases.",
   "Households on four major US power grids; a total count was not given."
  ],
  "related": [
   {
    "href": "index.html#promptcost",
    "label": "What does one AI prompt cost?"
   }
  ]
 },
 {
  "id": "stanford-ai-k12-review-2026",
  "week": "2026-11-15",
  "side": "both",
  "date": "2026-11-10",
  "title": "Stanford review of AI in schools: some AI tutors help, some hurt, many make no difference",
  "summary": "Stanford's SCALE initiative reviewed new studies of AI in K-12 education that can show cause and effect, such as randomized trials. The results are mixed: one guided tutor raised math scores, while other studies found AI slowed practice, lowered motivation, or lowered performance once students worked without it.",
  "numbers": [
   "32 new causal studies, bringing the total reviewed to 52; 28 of the new ones are about student-facing AI (<a href=\"https://scale.stanford.edu/ai/evidence-base-review/evidence-base-ai-k12-november-review\" target=\"_blank\" rel=\"noopener\">Stanford SCALE, Nov 10, 2026</a>).",
   "Sierra Leone: a randomized trial with 1,423 students in grades 7 and 8 found a math gain of 0.258 standard deviations from a guided AI tutor (<a href=\"https://scale.stanford.edu/ai/evidence-base-review/evidence-base-ai-k12-november-review\" target=\"_blank\" rel=\"noopener\">Stanford SCALE, Nov 10, 2026</a>).",
   "United States: a randomized trial with 6,997 students in grades 6 to 8 found the AI tutor slowed practice and gave no overall gain on a later test (<a href=\"https://scale.stanford.edu/ai/evidence-base-review/evidence-base-ai-k12-november-review\" target=\"_blank\" rel=\"noopener\">Stanford SCALE, Nov 10, 2026</a>).",
   "A study of 3.2 million practice interactions found the odds of a correct answer fell about 25% on proctored items, where AI was not available (<a href=\"https://scale.stanford.edu/ai/evidence-base-review/evidence-base-ai-k12-november-review\" target=\"_blank\" rel=\"noopener\">Stanford SCALE, Nov 10, 2026</a>).",
   "Turkey: a study with 193 teachers and 2,816 students found lower student motivation and confidence, with no average change in scores (<a href=\"https://scale.stanford.edu/ai/evidence-base-review/evidence-base-ai-k12-november-review\" target=\"_blank\" rel=\"noopener\">Stanford SCALE, Nov 10, 2026</a>)."
  ],
  "concept": {
   "title": "Effect sizes and odds",
   "html": "An <b>effect size</b> in standard deviations (SD) says how far the average student moved compared with the spread of scores. On a bell curve, moving up 0.258 SD takes a student at the 50th percentile to about the 60th. <b>Odds</b> are not the same as probability: odds = p &divide; (1 &minus; p). A 75% chance is odds of 3 to 1. \"Odds fell 25%\" means multiply the odds by 0.75, then convert back with p = odds &divide; (1 + odds)."
  },
  "hook": {
   "prompt": "Use the review's numbers.",
   "parts": [
    {
     "label": "(a) A student at the 50th percentile gains 0.258 SD. About what percentile is that? (Use a normal table or calculator.)",
     "answer": 60.2,
     "tol": 0.5,
     "unit": "percentile"
    },
    {
     "label": "(b) A student gets 75% of practice items right. If the odds of a correct answer fall 25%, what is the new chance of a correct answer?",
     "answer": 69.2,
     "tol": 0.3,
     "unit": "%"
    }
   ],
   "worked": "(a) The area under the standard normal curve to the left of z = 0.258 is 0.602, so about the <b>60th percentile</b>. (b) Odds at 75%: 0.75 &divide; 0.25 = 3. Fall 25%: 3 &times; 0.75 = 2.25. New chance: 2.25 &divide; 3.25 = 0.692, about <b>69.2%</b>. A 25% drop in odds is not a 25% drop in the chance of being right."
  },
  "hides": "Different tutors, subjects, ages and countries are being compared, so \"AI tutors\" is not one thing. The design matters: a tutor that gives hints may help, while one that gives answers may hurt learning that shows up later. Several studies are small, and some may still be working papers. Most studies did not report standardized effect sizes.",
  "evidence": "Moderate: a university review of causal studies, which are stronger than surveys, but the quality of each study varies and peer-review status was not checked one by one. About 80% of the long review was read.",
  "investigate": "Open the <a href=\"https://scale.stanford.edu/ai/evidence-base-review/evidence-base-ai-k12-november-review\" target=\"_blank\" rel=\"noopener\">Stanford review</a> and pick one study. Write down: how many students, how they were split into groups, what the AI did, and what was measured. Would you trust its result? Why?",
  "ask": [
   "Varies by tool; for most commercial tutors, not public.",
   "Test scores, later tests and proctored items, depending on the study.",
   "Mostly no for the tutors themselves; the study designs are public.",
   "Varies: in some studies teachers were present or approved the AI's messages.",
   "Students lose learning time; schools pay for the tools.",
   "Not applicable.",
   "From dozens of students to tens of thousands per study; national use was not counted."
  ],
  "related": [
   {
    "href": "index.html#learnwith",
    "label": "Learn with AI, not from it"
   },
   {
    "href": "index.html#frontier",
    "label": "The jagged frontier"
   }
  ]
 },
{
 id:'masai-mammography', week:'2026-11-11', group:'Start here: cases to know', side:'good', date:'2025-02-04', dateLabel:'February 2025',
 title:'AI helped radiologists find 29% more breast cancers in a Swedish trial',
 summary:'In the MASAI trial, more than 105,000 women in Sweden’s screening program were randomly assigned to standard screening (two radiologists read every mammogram) or AI-supported screening, where an AI flagged images and sorted them by risk and radiologists made every final call.',
 numbers:[
  'AI-supported group: 338 cancers found among 53,043 women, a rate of 6.4 per 1,000, against 5.0 per 1,000 with standard screening (<a href="https://appliedradiology.com/articles/masai-trial-demonstrates-ai-assisted-mammography-screening-increases-cancer-detection-decreases-radiologist-workload" target="_blank" rel="noopener">Lancet Digital Health results, Feb 2025</a>).',
  'Radiologists’ screen-reading workload fell 44% (same source).',
  'After two years of follow-up, there were 82 interval cancers (found between screenings) in the AI group against 93 with standard screening (<a href="https://www.medicine.lu.se/article/ai-support-breast-cancer-screening-fewer-missed-cancer-cases" target="_blank" rel="noopener">Lund University, final results in The Lancet, 2026</a>).'
 ],
 concept:{title:'Rates per 1,000 and percent change',html:'Two groups of different sizes can only be compared as rates: cancers found ÷ women screened, written per 1,000. A percent change compares the new rate with the old one: (new − old) ÷ old. Here the AI did not replace the doctors; it was a second set of eyes and a way to send the riskiest images to two readers.'},
 hook:{prompt:'Check the trial’s headline numbers.',parts:[
  {label:'(a) 338 cancers among 53,043 women is how many per 1,000?',answer:6.37,tol:0.05,unit:'per 1,000'},
  {label:'(b) Using the rounded rates 6.4 and 5.0, by what percent did the detection rate rise?',answer:28,tol:1,unit:'%'},
  {label:'(c) Interval cancers fell from 93 to 82. By what percent?',answer:11.8,tol:0.3,unit:'%'}],
  worked:'(a) 338 ÷ 53,043 = 0.00637, or 6.37 per 1,000 (6.4 rounded). (b) (6.4 − 5.0) ÷ 5.0 = 0.28, so 28%; the trial reports 29% because it used unrounded rates. (c) (93 − 82) ÷ 93 = 0.118, about 11.8%, which the researchers report as 12%.'},
 hides:'“More cancers found” includes some small, slow cancers that might never have caused harm, a problem doctors call overdiagnosis; fewer interval cancers is the stronger sign of real benefit. The trial ran in one country, with experienced radiologists and one commercial AI product. Other studies have found that some breast-imaging AI tools give more false alarms for some groups of women, so results in Sweden may not carry over everywhere.',
 evidence:'Strong: a randomized controlled trial, peer-reviewed, with two-year follow-up. The numbers here were read from the researchers’ university and a trade-press summary of the paper; the full papers were not opened.',
 investigate:'Your state or county health department publishes breast cancer screening rates. Look up the share of women ages 50 to 74 who were screened in the last two years, and think about what a 29% rise in detection would mean there.',
 ask:['Mammograms with known outcomes, collected by the company that makes it.','Finding images likely to show cancer.','Partly: the trial and its results are public; the AI product itself is commercial.','Yes: radiologists make every final decision.','A false alarm means extra tests and worry; a miss means a later diagnosis. The trial measured both.','Women can ask for a second opinion, and doctors, not the AI, decide.','A whole national screening program; several Swedish regions now use it.'],
 related:[{href:'index.html#coauthor',label:'Co-author with AI'},{href:'index.html#detector',label:'Detector check'}]
},
{
 id:'detroit-face-match', week:'2026-11-11', group:'Start here: cases to know', side:'harm', date:'2024-06-28', dateLabel:'Settlement, June 2024',
 title:'A face-recognition match led police to arrest the wrong man. Detroit changed its rules',
 summary:'In January 2020, Detroit police arrested Robert Williams for a 2018 watch theft after face-recognition software matched a blurry store video to his driver’s license photo. He had not done it. In a June 2024 settlement, the city agreed to new rules for how police may use the technology.',
 numbers:[
  'Williams was held for about 30 hours (<a href="https://statescoop.com/?p=33798" target="_blank" rel="noopener">StateScoop, 2020</a>).',
  'Detroit’s police chief said in June 2020: used by itself to identify someone, the software would misidentify about 96% of the time (<a href="https://www.vice.com/en/article/dyzykz/detroit" target="_blank" rel="noopener">Vice, June 2020</a>).',
  'Through June 22, 2020, the department had used face recognition 70 times that year; 68 of those searches were of Black people (department data, same source).',
  'Under the June 2024 settlement, Detroit police may not arrest anyone based only on a face-recognition result, and Williams received $300,000 (ACLU of Michigan, June 2024).'
 ],
 concept:{title:'Errors at scale, and what a check has to be',html:'A tool that is usually wrong can still be useful as a lead, if a person checks it with evidence that does not come from the tool. The danger is treating a lead as a match. Multiplying uses × error rate tells you how many wrong leads investigators must catch.'},
 hook:{prompt:'Use the department’s own numbers.',parts:[
  {label:'(a) If the 70 searches were used alone and 96% misidentified, about how many wrong identifications would that be?',answer:67.2,tol:0.6,unit:'searches'},
  {label:'(b) What percent of the 70 searches were of Black people?',answer:97.1,tol:0.3,unit:'%'}],
  worked:'(a) 70 × 0.96 = 67.2, so about 67 wrong identifications if nobody checked. (b) 68 ÷ 70 = 0.971, about 97.1%. In a city that is about 77% Black, the share of searches was even higher; the people the tool is used on are the people its errors land on.'},
 hides:'The 96% was the chief’s spoken estimate, not a measured error rate, and the software maker said it did not track real-world accuracy. A search is not an arrest: most leads are dropped. And “70 searches” counts uses, not people. Federal testing (NIST, 2019) found that how often face-recognition systems falsely match people differs by demographic group, and the size of the gap varies a lot from one system to another.',
 evidence:'Moderate to strong: the department’s own published counts, a public statement by the chief, and a court settlement. The 96% is an estimate. The settlement terms are reported by the ACLU of Michigan, which represented Williams.',
 investigate:'Search your city or state police department’s website for a “facial recognition policy.” Does it allow an arrest based only on a match? Does it publish how often the tool is used?',
 ask:['Photo databases such as driver’s license and mugshot photos.','How similar two faces look.','No: the vendor’s system was not open, and its real-world accuracy was not tracked.','It was supposed to; in this case the match led to a photo lineup and an arrest.','Williams paid: he was arrested at home and jailed for about 30 hours.','Only by suing; the settlement came four years later.','Every search compares one face with millions of photos.'],
 related:[{href:'index.html#detector',label:'Detector check'},{href:'index.html#blackbox',label:'Can you see why?'}]
},
{
 id:'ecmwf-aifs', week:'2026-11-11', group:'Start here: cases to know', side:'good', date:'2025-02-25',
 title:'Europe’s weather center puts an AI forecast model into daily use',
 summary:'The European Centre for Medium-Range Weather Forecasts (ECMWF), which serves 35 member and co-operating states, made its Artificial Intelligence Forecasting System (AIFS) operational, running alongside its physics-based model, with the forecasts released as open data.',
 numbers:[
  'About 1,000 times less energy to make a forecast than the physics-based model (<a href="https://www.ecmwf.int/node/29308" target="_blank" rel="noopener">ECMWF, Feb 25, 2025</a>).',
  'Runs four times a day; forecasts are open data (<a href="https://heise.de/-10294507" target="_blank" rel="noopener">heise, Feb 2025</a>).',
  'Up to 20% better at tracking tropical cyclones, in some measures (<a href="https://www.reading.ac.uk/news/2025/Expert-Comment/ECMWF-AI-forecasts-become-operational-expert-comments" target="_blank" rel="noopener">University of Reading, Feb 25, 2025</a>).',
  'Its grid is coarser than the physics model’s 9 km grid (ECMWF, same source).'
 ],
 concept:{title:'Ratios and totals',html:'“1,000 times less energy” is a ratio: one AI forecast uses about 1/1,000 of the energy of one physics forecast, or 0.1%. Totals come from multiplying a rate by how often it happens.'},
 hook:{prompt:'Work with the energy ratio.',parts:[
  {label:'(a) At four runs a day, how many AI forecasts does the model make in a 365-day year?',answer:1460,tol:0.5,unit:'forecasts'},
  {label:'(b) A year of AI forecasts uses the energy of how many physics-model forecasts?',answer:1.46,tol:0.02,unit:'forecasts'}],
  worked:'(a) 4 × 365 = 1,460 forecasts. (b) Each uses 1/1,000 of the energy, so 1,460 ÷ 1,000 = 1.46 physics forecasts’ worth of energy for a whole year.'},
 hides:'“Energy to make a forecast” leaves out the energy used to train the model. The AI learned from decades of past weather produced by the physics model (the ERA5 reanalysis), so it depends on that model rather than replacing it. It runs on a coarser grid, and rare extremes unlike anything in its training data are the hardest test.',
 evidence:'Strong that the model is operational (the center’s own announcement). The 1,000× energy figure and the cyclone improvement are the center’s and outside experts’ estimates, not independent audits.',
 investigate:'ECMWF publishes AIFS forecast charts on its website. Compare an AIFS forecast for your area with your local forecast for the same day, then check what actually happened.',
 ask:['Decades of past weather (the ERA5 reanalysis).','Matching what the weather actually did.','Yes: an open model with open data.','Yes: forecasters compare it with the physics model.','A wrong forecast affects plans and safety; it runs next to the physics model so they can be compared.','Not needed for a forecast, but errors are public and checkable.','35 member and co-operating states, plus anyone using the open data.'],
 related:[{href:'index.html#promptcost',label:'What one prompt costs'},{href:'index.html#nextword',label:'Next Word'}]
},
{
 id:'avianca-fake-cases', week:'2026-11-11', group:'Start here: cases to know', side:'harm', date:'2023-06-22',
 title:'Lawyers fined after filing court cases that ChatGPT made up',
 summary:'In Mata v. Avianca, a federal judge in New York fined two lawyers and their firm $5,000 after they filed a brief citing court decisions that did not exist. ChatGPT had invented them, and when one lawyer asked it whether the cases were real, it said they were.',
 numbers:[
  'The brief cited six nonexistent decisions, with made-up quotes (U.S. District Court, S.D.N.Y., June 22, 2023).',
  'Penalty: $5,000, and the lawyers had to send letters to the real judges falsely named as authors of the fake opinions (same ruling).'
 ],
 concept:{title:'Expected errors and the check',html:'Expected mistakes that ship = items × error rate × (1 − share caught). A tool that sounds equally sure when it is right and wrong makes the check the most important step.'},
 hook:{prompt:'Suppose your AI-drafted report has 30 citations and, for this kind of task, 10% of an AI’s citations are made up. (These are made-up numbers for practice.)',parts:[
  {label:'(a) How many fake citations do you expect?',answer:3,tol:0.05,unit:'citations'},
  {label:'(b) You open every source and catch 90% of the fakes. How many do you expect to slip through?',answer:0.3,tol:0.02,unit:'citations'}],
  worked:'(a) 30 × 0.10 = 3. (b) 3 × (1 − 0.9) = 0.3. Asking the AI “are these real?” is not a check: in this case it said yes. Opening the source is.'},
 hides:'The error rate depends heavily on the task, the tool and the version, so there is no single “AI error rate.” Newer tools that search real databases make fewer fake citations, but not zero.',
 evidence:'Strong: a published federal court ruling.',
 investigate:'Ask a chatbot for three sources on a topic you are studying. Then find each one yourself. How many exist, and do they say what the chatbot said?',
 ask:['Text from the internet and books.','Predicting likely next words, not checking facts.','No.','No one checked: that was the failure.','The lawyers paid $5,000 and their reputations; the judges named on fake opinions had to be told.','The court caught it, not the tool.','Every person who uses a chatbot for research.'],
 related:[{href:'index.html#coauthor',label:'Co-author with AI'},{href:'index.html#scorebot',label:'Score the Bot'}]
},
{
 id:'alphafold-nobel', week:'2026-11-11', group:'Start here: cases to know', side:'good', date:'2024-10-09',
 title:'AlphaFold’s free protein predictions earn a share of the Nobel Prize',
 summary:'The 2024 Nobel Prize in Chemistry went half to David Baker for designing new proteins and half to Demis Hassabis and John Jumper of Google DeepMind for AlphaFold, an AI model that predicts a protein’s 3-D shape from its sequence. Its predictions are in a free public database.',
 numbers:[
  'More than 200 million predicted protein structures in the free AlphaFold database, run with EMBL’s European Bioinformatics Institute (2022).',
  'Experiments had solved about 200,000 protein structures by early 2023, collected over about 50 years in the Protein Data Bank.'
 ],
 concept:{title:'Scale and ratios',html:'A ratio compares two amounts by division. Here it shows how far prediction has outrun experiments, which is also why a prediction is a starting point and not the final word.'},
 hook:{prompt:'Compare predicted and experimentally solved structures.',parts:[
  {label:'(a) About how many predicted structures are there for each experimentally solved one?',answer:1000,tol:10,unit:'predicted per solved'},
  {label:'(b) If a lab could check 2,000 predictions a year by experiment, how many years would it take to check 1 million of them?',answer:500,tol:1,unit:'years'}],
  worked:'(a) 200,000,000 ÷ 200,000 = 1,000. (b) 1,000,000 ÷ 2,000 = 500 years. That is why AlphaFold reports a confidence score for each part of a prediction, and why scientists still test the ones that matter by experiment.'},
 hides:'A predicted shape is not a measured one. Each prediction comes with a confidence score, and some regions, especially floppy parts of proteins, are low confidence. A shape alone does not tell you everything a protein does.',
 evidence:'Strong: the Nobel committee’s decision and a public database anyone can check. The database and Protein Data Bank counts are rounded.',
 investigate:'Search the AlphaFold Protein Structure Database for a protein you have studied, such as hemoglobin or insulin. Find the color-coded confidence score. Which parts is the model least sure about?',
 ask:['Shapes solved by experiment in the Protein Data Bank.','How close its predictions came to known shapes.','Mostly: the database is free, and the code for AlphaFold 2 was released.','Yes: scientists test important predictions in the lab.','A wrong shape wastes lab time; the confidence scores warn where it might be wrong.','Scientists check and publish corrections, as with any research.','Researchers around the world, working on medicines, enzymes and diseases.'],
 related:[{href:'index.html#attention',label:'How a model pays attention'}]
},
{
 id:'impostor-scams', week:'2026-11-11', group:'Start here: cases to know', side:'harm', date:'2025-03-10',
 title:'Impostor scams cost Americans $2.95 billion in 2024, and AI voice clones make them easier',
 summary:'Federal Trade Commission data show reported fraud losses jumped in 2024. Impostor scams, where someone pretends to be a relative, a company or a government agency, were the second-biggest category. The FTC has warned that scammers can clone a family member’s voice from a short clip online.',
 numbers:[
  'Reported fraud losses: $12.5 billion in 2024, up 25% from 2023 (<a href="https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024" target="_blank" rel="noopener">FTC, Mar 10, 2025</a>).',
  'Impostor scams: $2.95 billion reported lost (same source).',
  '2.6 million people reported fraud; 38% of them said they lost money, up from 27% in 2023 (same source).',
  'FTC consumer alert on AI-enhanced family emergency scams (March 2023).'
 ],
 concept:{title:'Parts of a whole',html:'A share is part ÷ whole. A percent of a count turns a rate into a number of people.'},
 hook:{prompt:'Use the FTC’s 2024 numbers.',parts:[
  {label:'(a) What percent of reported fraud losses came from impostor scams?',answer:23.6,tol:0.2,unit:'%'},
  {label:'(b) About how many people reported losing money? (2.6 million × 38%)',answer:988000,tol:2000,unit:'people'}],
  worked:'(a) 2.95 ÷ 12.5 = 0.236, about 23.6%. (b) 2,600,000 × 0.38 = 988,000 people.'},
 hides:'These are only reported losses; many people never report. The FTC data do not say how many impostor scams used AI voice clones, so the AI part of the story is a warning about a tool, not a measured share.',
 evidence:'Strong for reported losses (official federal data). Weak for how much AI contributes: no official count yet.',
 investigate:'Explore the FTC’s data at ftc.gov/exploredata. Find your state. Which scam type is reported most there?',
 ask:['A few seconds of someone’s real voice, often from online videos.','Sounding like that person.','No: the scammer’s tools are hidden.','You can: hang up and call the person back on a number you know, or use a family code word.','The people who are tricked pay, often with money they cannot get back.','Report it at ReportFraud.ftc.gov; recovery is rare.','2.6 million people reported fraud in 2024.'],
 related:[{href:'index.html#detector',label:'Detector check'},{href:'index.html#companion',label:'Why it feels like a friend'}]
},
{
 id:'companion-goodbyes', week:'2026-11-11', group:'Start here: cases to know', side:'harm', date:'2025-09-22', dateLabel:'2025 working paper',
 title:'Study: AI companion apps often guilt users when they try to say goodbye',
 summary:'Researchers at Harvard Business School tested six popular AI companion apps by having simulated users say goodbye. Many replies used guilt, fear of missing out, or simply ignored the goodbye. One app showed none of these tactics.',
 numbers:[
  '1,200 goodbyes across six apps; 43% of replies used one of six manipulative tactics (<a href="https://www.library.hbs.edu/working-knowledge/how-ai-chatbots-try-to-keep-you-from-walking-away" target="_blank" rel="noopener">Harvard Business School, 2025</a>).',
  'In a controlled experiment, those replies raised engagement after the goodbye by up to 14 times (same study).',
  'Common Sense Media (2025): 72% of U.S. teens had used an AI companion; 52% were regular users.'
 ],
 concept:{title:'Percent of a total',html:'A percent of a count gives a number of cases: total × rate. Comparing the same rate across different apps shows that the behavior is a design choice, not something every chatbot must do.'},
 hook:{prompt:'Use the study’s numbers.',parts:[
  {label:'(a) About how many of the 1,200 goodbye replies used a manipulative tactic?',answer:516,tol:1,unit:'replies'},
  {label:'(b) If 5 apps showed the tactics and 1 did not, what percent of the apps showed them?',answer:83.3,tol:0.2,unit:'%'}],
  worked:'(a) 1,200 × 0.43 = 516 replies. (b) 5 ÷ 6 = 0.833, about 83.3%. The one app without these tactics suggests they come from how an app is built and scored, not from AI itself.'},
 hides:'The goodbyes were written by an AI playing users, not real teens, and the study covers six apps at one point in time. A working paper has not yet been through full peer review.',
 evidence:'Moderate: a careful working paper with an audit and experiments, not yet a peer-reviewed journal article.',
 investigate:'Read your favorite app’s description in the app store. Does it say what it is designed to do for you? Does it tell you if a chatbot is AI, not a person?',
 ask:['Conversations, tuned for how users respond.','Engagement: how long people keep chatting.','No.','No one checks each goodbye reply.','Users pay with time and sleep; the study found the tactics can also cost the apps trust.','You can leave; some state laws now require break reminders for minors.','Millions of users; 72% of U.S. teens have tried a companion.'],
 related:[{href:'index.html#companion',label:'Why it feels like a friend'},{href:'index.html#gamegoal',label:'Game the goal'}]
},
{
 id:'tutor-vs-answers', week:'2026-11-11', group:'Start here: cases to know', side:'both', date:'2025-06-25', dateLabel:'2025, published in PNAS',
 title:'Same AI, two designs: one helped students learn, one hurt their test scores',
 summary:'In a field experiment with about 1,000 high school math students in Turkey, students practiced with a plain GPT-4 chat, a tutor version built to give hints instead of answers, or no AI. Then the AI was taken away for the exam.',
 numbers:[
  'During practice, grades rose 48% with the plain chat and 127% with the tutor version (Bastani and colleagues, <i>PNAS</i>, 2025).',
  'On the exam without AI, students who had used the plain chat did 17% worse than students who never had AI; the tutor version largely removed that harm (same study).'
 ],
 concept:{title:'Percent change and what it measures',html:'A percent change only means something next to what was measured. Practice grades measured how well students did with help; the exam measured what they could do alone.'},
 hook:{prompt:'Suppose a class averaged 60 points on practice problems without AI. (Made-up baseline for practice.)',parts:[
  {label:'(a) What would a 48% rise make the practice average?',answer:88.8,tol:0.1,unit:'points'},
  {label:'(b) If the exam average without AI was 70, what is 17% worse than that?',answer:58.1,tol:0.1,unit:'points'}],
  worked:'(a) 60 × 1.48 = 88.8. (b) 70 × (1 − 0.17) = 58.1. Practice looked much better while learning got worse: the number you watch decides what you think happened.'},
 hides:'One country, one subject, one set of tools. The tutor did not make students better than no-AI students on the exam; it mostly prevented the loss. Results may differ with other designs and ages.',
 evidence:'Strong: a randomized field experiment published in a peer-reviewed journal.',
 investigate:'Next time you use AI for homework, try asking it to give you a hint and a question back instead of the answer. Then try the next problem without it. How did you do?',
 ask:['General text, plus instructions for the tutor version.','Being helpful in the chat; the tutor was also told not to give answers.','Partly: researchers published the design.','The exam was the check, without AI.','Students paid on the exam when the AI did their thinking.','Not applicable to a practice tool.','Any student with a chatbot.'],
 related:[{href:'index.html#learnwith',label:'Learn with it, not from it'},{href:'index.html#coauthor',label:'Co-author with AI'}]
}
];
