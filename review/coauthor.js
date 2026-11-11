BioLab.addReview({
coauthor:{
 questions:[
  {id:'teamavg',kind:'test',lvl:'bio',
   q:'Your scores: goal 4, sources 8, draft 3, check 7, voice 6, decide 8. The AI’s: 3, 7, 8, 3, 3, 1. What is the team’s average if the stronger one leads each stage?',
   num:{ans:6.83,tol:0.05,unit:'out of 10'},
   steps:['Higher at each stage: 4, 8, 8, 7, 6, 8.','Sum: 4 + 8 + 8 + 7 + 6 + 8 = 41.','41 ÷ 6 ≈ 6.83. Only the draft goes to the AI this time, because this student is the stronger researcher.'],
   lab:{set:{y1:4,y2:8,y3:3,y4:7,y5:6,y6:8,show:true},look:'Read <b>Team plan: average stage score</b>.'},verify:[['team',6.83,0.01]]},
  {id:'hrs',kind:'test',lvl:'bio',
   q:'On the team, the AI leads 2 stages (0.2 hours each) and you lead 4 (1 hour each). How many hours does the project take?',
   num:{ans:4.4,tol:0.05,unit:'hours'},
   steps:['AI stages: 2 × 0.2 = 0.4 hours.','Your stages: 4 × 1 = 4 hours.','Total 4.4 hours, against 6 hours doing it all yourself.'],
   lab:{set:{y1:6,y2:5,y3:5,y4:6,y5:8,y6:7,show:true},look:'Read <b>Team plan: hours</b>.'},verify:[['hours',4.4,0.01]]},
  {id:'cite',kind:'real',lvl:'bio',
   q:'An AI gives you a quote and a source for your history paper. What should you do before you use it?',
   choices:['Use it, because the AI sounded sure','Find and open the source yourself and confirm the quote is really there','Ask the AI if it is sure'],correct:1,
   steps:['A model can invent quotes and sources in the same confident tone as real ones.','Asking the AI again is the AI checking itself, which misses many of its own mistakes.','Opening the source is the check stage, and it is a person’s job.']},
  {id:'ship',kind:'test',lvl:'honors',
   q:'The AI writes 80 claims with a 5% error rate. You check every claim and catch 90%. How many wrong claims are expected to ship?',
   num:{ans:0.4,tol:0.02,unit:'claims'},
   steps:['80 × 0.05 = 4 wrong claims made.','You catch 90%, so 10% remain.','4 × 0.1 = 0.4 expected to ship. If the AI checked itself (30% caught), 4 × 0.7 = 2.8 would.'],
   lab:{set:{y1:6,y2:5,y3:5,y4:6,y5:8,y6:7,claims:80,show:true},look:'Read <b>Team plan: wrong claims that ship</b>.'},verify:[['errTeam',0.4,0.01]]},
  {id:'frontier',kind:'real',lvl:'honors',
   q:'A classmate says, “AI is better than me at writing, so I will let it do my whole project.” Using this tool, what is the strongest reply?',
   choices:['AI is never better at writing','Being better at one stage does not make it better at every stage; its low spots, like checking claims and knowing your teacher’s goal, would pull the work down','Teachers can always tell'],correct:1,
   steps:['The AI’s line is jagged: high on drafting, low on checking and on knowing the assignment.','“AI does it all” uses its low scores too, so its average falls.','The team keeps the AI where it is strong and the person where it is weak.']},
  {id:'rate',kind:'test',lvl:'ap',
   q:'The AI writes 40 claims with a 12% error rate and checks itself, catching 30%. How many wrong claims are expected to ship?',
   num:{ans:3.36,tol:0.02,unit:'claims'},
   steps:['40 × 0.12 = 4.8 wrong claims made.','30% caught leaves 70%.','4.8 × 0.7 = 3.36 expected to ship. With you checking at 90%, 4.8 × 0.1 = 0.48.'],
   lab:{set:{claims:40,rate:12,show:true},look:'Read <b>AI does it all: wrong claims that ship</b>.'},verify:[['errAI',3.36,0.01]]}
 ]
}
});
