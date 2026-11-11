/* Raider AILab: AI in the News. Real stories, good and bad, each with sourced numbers,
   the math to check, and the "Questions to ask any AI" run on the story.
   New weeks go at the TOP. Fields: see the project doc "In the News lab pages", plus:
   side: 'good' | 'harm' | 'both'   ask: [7 short answers, in the order of the 7 questions]
   group: optional heading that replaces "Week of …" */
window.RAIDER_NEWS = [
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
