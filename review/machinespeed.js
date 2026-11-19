BioLab.addReview({
machinespeed:{
 questions:[
  {id:'add',kind:'test',lvl:'bio',
   q:'An AI tool takes 0.5, 0.75, 1.5 and 0.75 hours for the four stages. How many hours in all?',
   num:{ans:3.5,tol:0.01,unit:'hours'},
   steps:['0.5 + 0.75 = 1.25.','1.25 + 1.5 = 2.75 (the master keys).','2.75 + 0.75 = 3.5 hours.']},
  {id:'line',kind:'test',lvl:'bio',
   q:'35 cases arrive a week and experts finish 30. How many are waiting after 12 weeks?',
   num:{ans:60,tol:0,unit:'cases'},
   steps:['5 more arrive than leave each week.','5 × 12 = 60 cases waiting.'],
   lab:{set:{view:'line',arrive:35,handle:30,weeks:12},look:'Read <b>Cases waiting for experts</b>.'},verify:[['backlog',60,0.01]]},
  {id:'dual',kind:'real',lvl:'bio',
   q:'A tool made to test a company’s own defenses gets copied by attackers. What is this an example of?',
   choices:['A tool that only helps','Dual use: the same tool can protect or harm depending on who uses it','A tool that does not work'],correct:1,
   steps:['Security testers use attack tools on their own systems to find holes first.','The same tool in someone else’s hands attacks other people’s systems.','That is why releasing powerful tools publicly is a hard choice.']},
  {id:'wait',kind:'test',lvl:'honors',
   q:'Arrivals 30 a week, capacity 25. After 52 weeks, how many weeks does a new victim wait?',
   num:{ans:10.4,tol:0.05,unit:'weeks'},
   steps:['Backlog = (30 − 25) × 52 = 260.','Wait = 260 ÷ 25 = 10.4 weeks.'],
   lab:{set:{view:'line',arrive:30,handle:25,weeks:52},look:'Read <b>Wait for a new victim</b>.'},verify:[['wait',10.4,0.01]]},
  {id:'clear',kind:'test',lvl:'ap',
   q:'A backlog of 130 cases, arrivals 30 a week. What weekly capacity clears it in exactly 10 weeks?',
   num:{ans:43,tol:0,unit:'cases a week'},
   steps:['The line shrinks by (H − 30) a week.','(H − 30) × 10 = 130.','H − 30 = 13, so H = 43.']}
 ]
}
});
