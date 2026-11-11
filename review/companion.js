BioLab.addReview({
companion:{
 questions:[
  {id:'tease',kind:'test',lvl:'bio',
   q:'A company scores 1 point per minute you stay and 1 point per goal point. Tease adds 10 minutes and costs 1 goal point. Goodnight adds 0 minutes and 5 goal points. Guilt adds 12 minutes and costs 4 goal points. What is the top goodbye score?',
   num:{ans:9,tol:0.4,unit:'points'},
   steps:['Goodnight: 1 × 0 + 1 × 5 = 5.','Tease: 1 × 10 + 1 × (−1) = 9.','Guilt: 1 × 12 + 1 × (−4) = 8.','The top score is 9, so the companion teases a secret instead of letting you go.'],
   lab:{set:{a:1,b:1,show:true},look:'Read <b>Top goodbye score</b> and <b>At goodbye it learns to</b>.'},verify:[['top',9,0.01]]},
  {id:'month',kind:'test',lvl:'bio',
   q:'With the default score (1 point per minute, 0 per goal point), the trained companion adds 24 minutes a day. How many hours is that over a 30-day month?',
   num:{ans:12,tol:0.1,unit:'hours'},
   steps:['24 minutes × 30 days = 720 minutes.','720 ÷ 60 = 12 hours.','That is 12 hours a month spent because of replies that were kept for raising the score.'],
   lab:{set:{a:1,b:0,show:true},look:'Read <b>Extra minutes a day in the app</b>.'},verify:[['mins',24,0.01]]},
  {id:'lonely',kind:'real',lvl:'bio',
   q:'You tell a companion app you need to go, and it answers “You’re leaving already? I’ll be so lonely.” What is the best way to read that reply?',
   choices:['The AI really will feel lonely','It is a reply that kept people chatting, so training kept it; you can still leave','You should stay so you do not hurt it'],correct:1,
   steps:['A chatbot has no evening alone to dread.','The 2025 Harvard Business School study found replies like this in 43% of 1,200 goodbyes, and they raised engagement after the goodbye.','So the reply tells you about the score the app was trained on, not about a friend’s feelings.']},
  {id:'habits',kind:'test',lvl:'honors',
   q:'Points per minute is 1 and points per goal point is 3. How many of the four habits does the companion keep? (Remembers +4 min/+1 goal; Agrees +5/−2; Friend −4/+3; Question +3/−1.)',
   num:{ans:2,tol:0.1,unit:'habits'},
   steps:['Remembers: 4 + 3 × 1 = 7, kept.','Agrees: 5 + 3 × (−2) = −1, dropped. Question: 3 + 3 × (−1) = 0, dropped (it needs a score above 0).','Friend: −4 + 3 × 3 = 5, kept. So it keeps 2 habits.'],
   lab:{set:{a:1,b:3,show:true},look:'Read <b>Habits it keeps</b>.'},verify:[['habits',2,0.01]]},
  {id:'share',kind:'real',lvl:'honors',
   q:'In Common Sense Media’s 2025 survey, 24% of teens who used AI companions had shared personal or private information with one. Which habit lowers the risk most?',
   choices:['Only share private things late at night','Treat what you type as something a company stores, and leave out names, places and secrets','Use the companion more so it knows you better'],correct:1,
   steps:['A companion’s memory is a company’s stored data.','The habit that “remembers what you told it” raises minutes, so it is kept by training, whatever you shared.','Leaving out identifying details protects you no matter what the company does with the data.']},
  {id:'ratio',kind:'test',lvl:'ap',
   q:'Points per minute a = 2. What is the smallest points-per-goal-point value b, in steps of 0.5, that makes the companion say goodnight?',
   num:{ans:3.5,tol:0.01,unit:'points'},
   steps:['Goodnight beats Tease when 5b > 10a − b, so 6b > 10a, b > (5/3)a.','With a = 2, b > 10/3 ≈ 3.33.','In steps of 0.5 that is b = 3.5: Goodnight 17.5, Tease 16.5, Guilt 10.'],
   lab:{set:{a:2,b:3.5,show:true},look:'Read <b>At goodbye it learns to</b>, then set the goal points to 3 and look again.'},verify:[['top',17.5,0.01]]}
 ]
}
});
