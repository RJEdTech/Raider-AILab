BioLab.addReview({
blackbox:{
 questions:[
  {id:'ana',kind:'test',lvl:'bio',
   q:'Trained on past hires, score = 4 × test + 1 × months − 3 × miles. Ana scored 6 on the test, worked 12 months and lives 1 mile away. What is her score?',
   num:{ans:33,tol:0.4,unit:'points'},
   steps:['4 × 6 = 24 and 1 × 12 = 12.','3 × 1 = 3 points off for distance.','24 + 12 − 3 = 33, the top score under this training.'],
   lab:{set:{train:'store',box:'open',show:true},look:'Open the model and read the scores in the applicants table.'},verify:[['cut',27.5,0.01]]},
  {id:'perf',kind:'test',lvl:'bio',
   q:'Trained on last year’s best workers, score = 5 × test + 1 × months. Dee scored 8 on the test and worked 4 months. What is her score?',
   num:{ans:44,tol:0.4,unit:'points'},
   steps:['5 × 8 = 40.','1 × 4 = 4.','40 + 4 = 44, second place behind your 51, so you and Dee get the interviews.'],
   lab:{set:{train:'perf',box:'open',show:true},look:'Read <b>Score you needed (2nd place)</b>.'},verify:[['cut',44,0.01],['yours',51,0.01]]},
  {id:'ask',kind:'real',lvl:'bio',
   q:'You are turned down for a job, and the email says an automated system screened your application. Which question is most useful to ask?',
   choices:['Was the computer fast?','What did the system score me on, and can a person review my application?','How much did the software cost?'],correct:1,
   steps:['You can only fix or challenge what you can see.','Asking what it scored and whether a person can review it is asking whether the box is open and whether there is an appeal.','In New York City, employers that use these tools must tell candidates and have them audited each year.']},
  {id:'cost',kind:'test',lvl:'honors',
   q:'Trained on past hires (−3 points a mile), how many more points would you score if you lived 1 mile from the store instead of 7?',
   num:{ans:18,tol:0.4,unit:'points'},
   steps:['Distance now costs 3 × 7 = 21 points.','At 1 mile it would cost 3 × 1 = 3 points.','21 − 3 = 18 more points: a score of 39, the top score. Your address, not your skill, decided it.'],
   lab:{set:{train:'store',box:'open',show:true},look:'Read <b>Points distance cost you</b>.'},verify:[['miles',21,0.01]]},
  {id:'proxy',kind:'real',lvl:'honors',
   q:'A loan model does not use race or income, but it does use ZIP code. Why can it still treat groups differently?',
   choices:['It cannot, because those features are not in the model','ZIP code is linked to income and to neighborhood history, so it can act as a proxy for them','ZIP codes are random numbers'],correct:1,
   steps:['Leaving a feature out does not remove its effect if another feature tracks it.','Where people live is strongly linked to income and, because of past housing rules, to race.','So ZIP code can carry those patterns into the model, the way distance did in the hiring example.']},
  {id:'break',kind:'test',lvl:'ap',
   q:'With a = 4 and b = 1, your score minus Cam’s is 13 − 6.5c, where c is the miles weight. At what c do you and Cam tie?',
   num:{ans:2,tol:0.01,unit:''},
   steps:['Your lead: 4(9 − 5) + 1(6 − 9) − c(7 − 0.5) = 16 − 3 − 6.5c = 13 − 6.5c.','Set 13 − 6.5c = 0.','c = 2. Above 2, Cam passes you; the past-hires model uses c = 3.'],
   lab:{set:{train:'store',box:'open',show:true},look:'Compare your score with Cam’s in the table.'},verify:[['yours',21,0.01]]}
 ]
}
});
