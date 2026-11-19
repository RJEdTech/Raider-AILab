BioLab.addReview({
cluster:{
 questions:[
  {id:'exp',kind:'test',lvl:'bio',
   q:'The chance of a power flicker on a given school day is 2%. A school year has 180 days. About how many flickers should you expect?',
   num:{ans:3.6,tol:0.05,unit:'flickers'},
   steps:['Expected count = tries × chance.','180 × 0.02 = 3.6.','So 3 or 4 a year is normal, not a sign of a problem.']},
  {id:'yr',kind:'test',lvl:'bio',
   q:'With an average of 2 big outages a week, the tool says a week with 5 or more has a 5.27% chance. About how many such weeks a year?',
   num:{ans:2.74,tol:0.05,unit:'weeks'},
   steps:['52 × 0.0527 = 2.74.'],
   lab:{set:{rate:2,k:5},look:'Read <b>Cluster weeks expected per year</b>.'},verify:[['expect',2.74,0.02]]},
  {id:'ill',kind:'real',lvl:'bio',
   q:'You learn a new word and suddenly hear it everywhere. What is going on?',
   choices:['Everyone started using it this week','The frequency illusion: you notice it now, so it seems more common','A coincidence that proves something'],correct:1,
   steps:['The word was always there.','Once you know it, your brain flags it.','The same thing happens with outage news.']},
  {id:'l3',kind:'test',lvl:'honors',
   q:'With an average of 3 big outages a week, P(5 or more) ≈ 18.47%. About how many such weeks a year?',
   num:{ans:9.6,tol:0.1,unit:'weeks'},
   steps:['52 × 0.1847 ≈ 9.6.','Raising the average from 2 to 3 more than triples the cluster weeks.'],
   lab:{set:{rate:3,k:5},look:'Read <b>Cluster weeks expected per year</b>.'},verify:[['expect',9.6,0.05]]},
  {id:'p0',kind:'test',lvl:'ap',
   q:'For λ = 2, what is P(X = 0), the chance of a week with no big outages, as a percent?',
   num:{ans:13.53,tol:0.02,unit:'%'},
   steps:['P(X = 0) = e^(−λ) = e^(−2).','e^(−2) ≈ 0.1353, or 13.53%.']}
 ]
}
});
