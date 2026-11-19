BioLab.addReview({
jobs:{
 questions:[
  {id:'flat',kind:'test',lvl:'bio',
   q:'AI lets each worker do 50% more, and demand stays the same. What percent of workers are still needed?',
   num:{ans:66.7,tol:0.1,unit:'%'},
   steps:['1 ÷ 1.5 = 0.667.','About 66.7% of the workers, a third fewer.']},
  {id:'def',kind:'test',lvl:'bio',
   q:'With a 30% speed-up and 40% more demand, what is the change in jobs? (Round to one decimal.)',
   num:{ans:7.7,tol:0.1,unit:'%'},
   steps:['1.40 ÷ 1.30 = 1.0769.','1.0769 − 1 = +7.7%.'],
   lab:{set:{prod:30,demand:40},look:'Read <b>Change in jobs (your model)</b>.'},verify:[['change',7.69,0.01]]},
  {id:'exp',kind:'real',lvl:'bio',
   q:'A website says, “This job is 90% exposed to AI, so it will disappear.” What is the best reply?',
   choices:['True, exposure means replacement','Exposure means AI can do or help with many tasks; whether jobs shrink also depends on demand','Exposure is made up'],correct:1,
   steps:['BLS says its exposure ratings do not measure job losses.','Software developers are very exposed and projected to grow.','Look at demand and tasks before deciding.']},
  {id:'break',kind:'test',lvl:'honors',
   q:'A 25% speed-up. How much must demand grow (in %) for jobs to stay the same?',
   num:{ans:25,tol:0,unit:'%'},
   steps:['Jobs stay level when 1 + d = 1 + g.','d = 25%.']},
  {id:'two',kind:'test',lvl:'ap',
   q:'Speed-up 20% each year for 2 years; demand grows 10% each year. Percent change in workers after 2 years? (Round to one decimal.)',
   num:{ans:-16,tol:0.1,unit:'%'},
   steps:['Factor: (1.1 ÷ 1.2)² = 0.9167² ≈ 0.8403.','0.8403 − 1 ≈ −16.0%.']}
 ]
}
});
