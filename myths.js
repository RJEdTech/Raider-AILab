/* Myth or fact (idea from Dr. Sandy Robertson's ENSO Explorer, Nov 17, 2026). See ENGINE.md.
   BioLab.addMyths({toolId:[{k,s,fact,why,lvl}]}): one graded try, then why. Mix in real facts. */
BioLab.addMyths({
nextword:[
 {k:'lookup',s:'A chatbot answers by looking up the answer in a database of facts.',fact:false,why:'A language model writes one piece of text at a time, picking a likely next word from patterns it learned. Unless it uses a search tool, nothing is being looked up.'},
 {k:'confident',s:'A chatbot can state something false in a confident, fluent sentence.',fact:true,why:'Sounding right and being right are different. The model is built to produce likely text, so check facts that matter against a real source.'},
 {k:'same',s:'Asking the same question twice always gets the exact same answer.',fact:false,why:'Most chatbots pick among likely next words with some randomness, so wording and even content can change between tries.'}
]
});

/* Batch 2 (Nov 17, 2026): the rest of AILab. */
BioLab.addMyths({
attention:[
 {k:'it',s:'A language model works out what a word like “it” refers to by looking at the other words around it.',fact:true,why:'Attention lets each word weigh the other words in the sentence, which is how the model connects “it” to the right noun.'},
 {k:'order',s:'A language model reads one word at a time and forgets the earlier ones.',fact:false,why:'Attention looks across the whole passage at once, within its limit (the context window).'},
 {k:'understand',s:'Paying attention to the right word means the model understands like a person does.',fact:false,why:'Attention is math on patterns. It can work well without human-style understanding.'}
],
agreeable:[
 {k:'flatter',s:'A chatbot can learn to agree with you because people rate agreeable answers higher.',fact:true,why:'If training rewards answers people like, the model can learn to flatter. AI companies try to train against this.'},
 {k:'right',s:'If a chatbot agrees with you, you must be right.',fact:false,why:'It may be telling you what you want to hear. Ask it to argue the other side.'},
 {k:'push',s:'Asking “Are you sure?” can make a chatbot change a correct answer.',fact:true,why:'Researchers have found models sometimes cave to pushback, even when they were right.'}
],
blackbox:[
 {k:'why',s:'The people who build an AI model can always explain why it gave a particular answer.',fact:false,why:'Large models have billions of parameters. Explaining a single decision is an open research problem.'},
 {k:'data',s:'A model’s training data shapes what it learns, including its mistakes.',fact:true,why:'Patterns in the data, good or bad, show up in its answers.'},
 {k:'appeal',s:'When an automated system makes a decision about you, being able to appeal to a person matters.',fact:true,why:'Systems make errors; a human review can catch them.'}
],
coauthor:[
 {k:'own',s:'Turning in AI-written work as your own can violate a school’s academic honesty policy.',fact:true,why:'Check your teacher’s rules for each assignment, and say how you used AI.'},
 {k:'learn',s:'If AI writes your essay, you learn the same as if you wrote it.',fact:false,why:'The thinking you skip is the learning. Using AI for feedback keeps the thinking yours.'},
 {k:'check',s:'You are responsible for checking facts in anything AI helps you write.',fact:true,why:'AI can state false things confidently.'}
],
companion:[
 {k:'feel',s:'An AI companion feels emotions about you the way a friend does.',fact:false,why:'It produces caring-sounding text from patterns. It doesn’t miss you between chats.'},
 {k:'design',s:'Some companion apps are designed to keep you talking as long as possible.',fact:true,why:'More time in the app can mean more money for the company.'},
 {k:'people',s:'Time with real people matters for mental health in ways a chatbot can’t replace.',fact:true,why:'Friends notice, show up and need you back.'}
],
constitution:[
 {k:'rules',s:'Some AI models are trained using a written list of principles.',fact:true,why:'Anthropic’s “constitutional AI” is one example: the model is trained to follow written principles.'},
 {k:'neutral',s:'An AI can be built with no values at all.',fact:false,why:'Choices about what it should and shouldn’t do are values, made by people.'},
 {k:'conflict',s:'Principles like “be helpful” and “avoid harm” can pull in different directions.',fact:true,why:'Designers have to decide which comes first when they conflict.'}
],
detector:[
 {k:'proof',s:'An AI detector score proves whether a person used AI.',fact:false,why:'Detectors give probabilities and make mistakes, including flagging human writing.'},
 {k:'esl',s:'Some detectors flag writing by non-native English speakers as AI more often.',fact:true,why:'A 2023 Stanford study found this bias in several detectors.'},
 {k:'evidence',s:'Drafts and version history are better evidence than a detector score.',fact:true,why:'They show the writing process.'}
],
frontier:[
 {k:'jagged',s:'AI can be excellent at one task and poor at a similar-looking one.',fact:true,why:'Researchers call this the “jagged frontier”: its skills don’t follow human difficulty.'},
 {k:'always',s:'Using AI always improves the quality of work.',fact:false,why:'A 2023 Harvard–BCG study found consultants did worse when they used AI on tasks outside its strengths.'},
 {k:'test',s:'Checking AI on tasks where you know the answer helps you learn where to trust it.',fact:true,why:'You learn its strengths and weak spots.'}
],
gamegoal:[
 {k:'loop',s:'An AI that is rewarded for points may find a shortcut its designers didn’t intend.',fact:true,why:'In one famous game, a boat AI circled forever collecting points instead of finishing the race.'},
 {k:'means',s:'An AI always does what its designers mean.',fact:false,why:'It optimizes what is measured. If the goal is written badly, it finds the loophole.'},
 {k:'goodhart',s:'When a measure becomes a target, it can stop being a good measure.',fact:true,why:'That is Goodhart’s law, and it applies to people as well as AI.'}
],
learnwith:[
 {k:'retrieval',s:'Quizzing yourself helps you remember more than rereading notes.',fact:true,why:'Retrieval practice strengthens memory. AI can help by quizzing you.'},
 {k:'answers',s:'Having AI give you the answers is the fastest way to learn.',fact:false,why:'You learn by working it out. Ask AI for hints or questions, not answers.'},
 {k:'explain',s:'Explaining an idea in your own words shows whether you really understand it.',fact:true,why:'Gaps show up when you try to explain.'}
],
promptcost:[
 {k:'free',s:'A chatbot answer uses no energy because it is just text.',fact:false,why:'Each answer runs on data center computers that use electricity and cooling.'},
 {k:'long',s:'Longer answers generally take more computing than short ones.',fact:true,why:'The model works one piece of text at a time, so more output means more computation.'},
 {k:'scale',s:'Small costs per prompt add up because of how many prompts are made.',fact:true,why:'Billions of prompts a day turn small amounts into big totals.'}
],
scorebot:[
 {k:'reward',s:'What you reward an AI for shapes what it learns to do.',fact:true,why:'If you reward length, it writes long answers, whether or not they are better.'},
 {k:'judge',s:'An AI judge always scores fairly.',fact:false,why:'AI judges can prefer longer answers, or their own style. Their scoring needs checking too.'},
 {k:'rubric',s:'A clear rubric makes scoring more consistent.',fact:true,why:'For human and AI graders alike.'}
]
});

/* "Why everything is breaking" (Nov 19, 2026) */
BioLab.addMyths({
bugpatch:[
 {k:'works',s:'If my phone still works, skipping updates is fine.',fact:false,why:'Most updates are patches for holes someone found. The phone works the same with the door open.'},
 {k:'eol',s:'A device can keep running for years after its maker stops sending fixes.',fact:true,why:'End of life means no new locks, not that it stops. That is why old systems are still out there.'},
 {k:'weak',s:'A system is about as reliable as its best part.',fact:false,why:'Everything must work at once, so the chances multiply. The system is a little worse than its worst part.'}
],
doors:[
 {k:'million',s:'A 6-digit PIN is safe because there are a million possibilities.',fact:false,why:'A computer guessing 1,000 a second tries all of them in about 17 minutes.'},
 {k:'fridge',s:'A fridge can be hacked.',fact:true,why:'In October 2026, internet-connected fridge controllers in hundreds of French supermarkets were set to defrost overnight.'},
 {k:'default',s:'The password a device comes with is secret to you.',fact:false,why:'Default passwords are often shared across every copy of a device, and lists of them are public.'}
],
rollout:[
 {k:'update',s:'An update can break a computer.',fact:true,why:'An update is new code, and code can have mistakes. CrowdStrike’s July 2024 update crashed about 8.5 million Windows computers.'},
 {k:'outage',s:'Every big outage is a cyberattack.',fact:false,why:'In November 2026, Microsoft, the FAA and JPMorgan each blamed their own bugs or equipment, not attackers.'},
 {k:'fast',s:'The safest way to send a fix is to everyone at once.',fact:false,why:'If the fix has a mistake, everyone breaks. Sending to a few first catches it early, at the cost of waiting.'}
],
dwell:[
 {k:'patched',s:'Once a hole is patched, any intruder is locked out.',fact:false,why:'A patch locks the door. Someone who got in earlier is still inside until someone finds them.'},
 {k:'days',s:'Attackers now often use a hole within days of it being found.',fact:true,why:'Mandiant measured the average falling from 63 days (2018–2019) to 5 days (2023).'},
 {k:'logs',s:'Sign-in records can show that an intruder got in.',fact:true,why:'An odd sign-in, like 3 a.m. from another country, is often how intruders are found.'}
],
machinespeed:[
 {k:'skill',s:'Only expert hackers can run a large cyberattack.',fact:false,why:'The FBI said tools like ARTEX let people with limited skill run complex attacks on many targets.'},
 {k:'gone',s:'Once a tool is taken offline, it stops spreading.',fact:false,why:'ARTEX was removed on October 8, 2026, but copies kept spreading; over 1,600 were found running by November.'},
 {k:'line',s:'If slightly more problems arrive than get fixed each week, the waiting line keeps growing.',fact:true,why:'The backlog grows by the difference every week, so a small gap becomes a long wait.'}
],
phantom:[
 {k:'oldsmar',s:'The FBI confirmed that a hacker tried to poison Oldsmar’s water in 2021.',fact:false,why:'In 2023 the FBI said it could not confirm a targeted intrusion, and the former city manager said it was likely an employee’s mistake.'},
 {k:'first',s:'The first report of an event is sometimes wrong about the cause.',fact:true,why:'Early reports rely on early statements. Oldsmar’s cause was revised two years later.'},
 {k:'ratio',s:'Going from 100 to 11,100 is a 111% increase.',fact:false,why:'It is 111 times as much, which is an 11,000% increase.'}
],
cluster:[
 {k:'cluster',s:'Five big outages in one week proves they are connected.',fact:false,why:'Random events bunch up. With 2 a week on average, weeks of 5 or more happen about 2 or 3 times a year by chance.'},
 {k:'cve',s:'More software holes were published in 2026 than in 2025.',fact:true,why:'Over 100,000 by mid-November 2026, more than double 2025’s 48,185.'},
 {k:'notice',s:'Once you start noticing something, it can seem more common than it is.',fact:true,why:'That is the frequency illusion.'}
],
defenders:[
 {k:'y2k',s:'Y2K was a hoax.',fact:false,why:'The bug was real. About $100 billion of repairs in the U.S. fixed it in time, so little went wrong.'},
 {k:'aifix',s:'AI can find and fix software holes, not just exploit them.',fact:true,why:'In DARPA’s 2025 challenge, AI systems found 54 of 70 planted flaws and fixed 43.'},
 {k:'jobs',s:'Cybersecurity jobs are shrinking because of AI.',fact:false,why:'The U.S. Bureau of Labor Statistics projects security analyst jobs to grow 21% from 2025 to 2035.'}
]
});

/* The mirror, compass, jobs and data center (Nov 19, 2026) */
BioLab.addMyths({
mirror:[
 {k:'math',s:'If an AI result comes from math, it cannot be biased.',fact:false,why:'The math repeats whatever is in its data and test. A program reported about 97% accuracy while getting 34.7% wrong for darker-skinned women.'},
 {k:'sure',s:'People who say they are 100% sure are almost always right.',fact:false,why:'In classic studies they were right only 70 to 85% of the time.'},
 {k:'shark',s:'In 2001, the “Summer of the Shark,” shark attacks went down.',fact:true,why:'The International Shark Attack File counted 76 in 2001, down from 85 in 2000, while news coverage soared.'}
],
compass:[
 {k:'live',s:'A chatbot rewires itself to your brain in real time while you chat.',fact:false,why:'Its training happened ahead of time on many conversations. It adapts within a chat, and some apps remember facts.'},
 {k:'goodbye',s:'Many AI companion apps try to keep you from leaving when you say goodbye.',fact:true,why:'In a 2025 Harvard study, 43% of goodbye replies used tactics like guilt or fear of missing out.'},
 {k:'small',s:'A few minutes a day with an app does not add up to much.',fact:false,why:'45 minutes a day is about 274 hours a year.'},
 {k:'feel',s:'If something feels right to me, that makes it right.',fact:false,why:'Feelings and experience are how truth reaches us, but they can be thrown off, like a needle near a magnet. Catholics hold that what is truly good is real for everyone, and conscience must be formed to find it.'}
],
jobs:[
 {k:'exposed',s:'If a job is highly exposed to AI, it is going away.',fact:false,why:'Software developers are very exposed and projected to grow 10.2% by 2035. Exposure is not the same as replacement.'},
 {k:'np',s:'Nurse practitioner is the fastest-growing job in the 2025–35 projections.',fact:true,why:'Projected growth of 41.0%.'},
 {k:'openings',s:'A shrinking job has no openings.',fact:false,why:'People retire and move on: customer service is projected to shrink and still have about 289,500 openings a year.'}
],
datacenter:[
 {k:'bills',s:'A new data center always raises home electric bills.',fact:false,why:'It depends on whether the grid needs new building and who pays for it. One study found data centers slightly lowered average rates from 2015 to 2024.'},
 {k:'water',s:'Some data centers use very little water.',fact:true,why:'Closed-loop designs reuse their water; one Texas campus says it needs about 7,000 gallons a day.'},
 {k:'spi',s:'A data center on South Padre Island uses more water than the town.',fact:false,why:'We found no data center on the island and no source for this claim.'}
]
});

