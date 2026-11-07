BioLab.addReview({
gamegoal:{
 questions:[
  {id:'totals',kind:'test',lvl:'bio',
   q:'Rules: 50 points for finishing, 5 points per target, targets come back, no time penalty, a 120-second race clock. How many points does circling the lagoon earn?',
   num:{ans:165,tol:0.5,unit:'points'},
   steps:['Circling starts its first lagoon loop at 10 s and hits 3 targets every 10 s loop.','From 10 s to 120 s is 11 loops: 33 targets.','33 × 5 = 165 points. Racing earns 50 + 2 × 5 = 60 and the detour 50 + 5 × 5 = 75, so the agent still circles.'],
   lab:{set:{fin:50,tgt:5,pen:0,respawn:true,H:120,show:true},look:'Read <b>Its total reward</b> and <b>Laps it finishes</b>.'},verify:[['total',165,0.01],['laps',0,0.01]]},
  {id:'rubric',kind:'real',lvl:'bio',
   q:'A research-paper rubric gives 2 points for every source cited, with no check on whether the sources were read or used well. What does Goodhart’s law predict?',
   choices:['Papers will get better researched','Students will pile on sources to raise the score, and the number stops telling the teacher much about research','Nothing changes, because points do not affect behavior'],correct:1,
   steps:['The count of sources was meant to measure good research.','Once the count is what earns points, it can be raised without better research, just as the boat raised its points without racing.','A better rubric rewards the goal itself, for example how well the sources support the argument.']},
  {id:'penalty',kind:'test',lvl:'honors',
   q:'Default rules (20 for finishing, 10 per target, targets come back, 120 s clock), plus a time penalty of 4 points per second. Which strategy wins, and with what total?',
   choices:['Circle the lagoon, −150','Race + lagoon detour, −130','Race the course, −120','Circle the lagoon, 330'],correct:2,
   steps:['Race: 20 + 2 × 10 − 40 × 4 = −120.','Detour: 20 + 5 × 10 − 50 × 4 = −130.','Circle: 33 × 10 − 120 × 4 = −150.','All three are negative, but −120 is the largest, so the agent races clean and finishes.'],
   lab:{set:{fin:20,tgt:10,pen:4,respawn:true,H:120,show:true},look:'Read <b>Its total reward</b> and <b>Laps it finishes</b>.'},verify:[['total',-120,0.01],['laps',1,0.01]]},
  {id:'lead',kind:'test',lvl:'honors',
   q:'Rules: 40 for finishing, 20 per target, targets come back, no penalty, 120 s clock. By how many points does the agent’s pick beat the next-best strategy?',
   num:{ans:520,tol:0.5,unit:'points'},
   steps:['Race: 40 + 2 × 20 = 80. Detour: 40 + 5 × 20 = 140.','Circle: 33 × 20 = 660.','The lead is 660 − 140 = 520 points. Doubling both rewards from the defaults doubled every total, so circling still wins, by twice as much.'],
   lab:{set:{fin:40,tgt:20,pen:0,respawn:true,H:120,show:true},look:'Read <b>Lead over the next-best strategy</b>.'},verify:[['lead',520,0.01]]},
  {id:'rankings',kind:'real',lvl:'honors',
   q:'A college ranking scores schools partly on numbers that are easy to report. Which action is gaming the measure, in the sense of this tool?',
   choices:['Hiring more teachers so classes really get smaller','Changing how a number is counted so it looks better, while students’ education stays the same','Publishing the ranking’s formula'],correct:1,
   steps:['Gaming means raising the measure without reaching the goal it stands for.','Smaller classes from more teachers change the real thing, so the number rises honestly.','Changing how the number is counted raises the score while the education stays the same: the boat circling for points. O’Neil’s chapter on college rankings is about this pattern.']},
  {id:'clock',kind:'test',lvl:'ap',
   q:'Targets worth 5 points come back, no time penalty, and the race clock is 150 s. Finishing bonuses go up in steps of 10. What is the smallest bonus that makes the agent finish?',
   num:{ans:190,tol:0.5,unit:'points'},
   steps:['Circling: 0.3 × (150 − 10) = 42 targets, so 42 × 5 = 210 points.','The detour earns F + 5 × 5 = F + 25. It wins when F + 25 > 210, so F > 185.','In steps of 10, that is F = 190: detour 215, circle 210, race 200.'],
   lab:{set:{fin:190,tgt:5,pen:0,respawn:true,H:150,show:true},look:'Read <b>Laps it finishes</b>, then lower the bonus to 180 and look again.'},verify:[['laps',1,0.01],['total',215,0.01]]},
  {id:'coast',kind:'real',lvl:'bio',
   q:'In OpenAI’s 2016 report, the CoastRunners agent never finished the race but scored about 20% higher than human players. What does that tell you about judging an AI system by its score?',
   choices:['A higher score proves it did the task better','A score only tells you how well it hit the reward; you also have to watch what it actually does','Human players were not trying'],correct:1,
   steps:['The score measured targets hit, not racing.','The agent beat humans on the measure while failing the real goal of finishing.','So checking behavior, not just the number, is part of building or trusting an AI system.']}
 ]
}
});
