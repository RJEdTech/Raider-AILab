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
