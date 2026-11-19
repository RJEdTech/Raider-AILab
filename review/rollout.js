BioLab.addReview({
rollout:{
 questions:[
  {id:'pct',kind:'test',lvl:'bio',
   q:'A bad update reaches 1% of a district’s 4,000 laptops before it is stopped. How many laptops break?',
   num:{ans:40,tol:0,unit:'laptops'},
   steps:['1% = 0.01.','0.01 × 4,000 = 40 laptops.']},
  {id:'all',kind:'test',lvl:'bio',
   q:'The same bad update goes to all 1,000 laptops at once. How many break?',
   num:{ans:1000,tol:0,unit:'laptops'},
   steps:['Every laptop installs it at hour 0.','The mistake is noticed later, after all have it.','All 1,000 break.'],
   lab:{set:{plan:'all',bad:true},look:'Read <b>Laptops broken</b>.'},verify:[['broken',1000,0.5]]},
  {id:'why',kind:'real',lvl:'bio',
   q:'Your school updates 30 teachers’ laptops on Monday and everyone else on Thursday. Why?',
   choices:['The IT team is behind','If the update has a problem, it shows up on 30 laptops instead of all of them','Teachers like updates more'],correct:1,
   steps:['An update can have a hidden mistake.','A small first group finds it while the damage is small.','Then the rest get it once it looks safe.']},
  {id:'late',kind:'test',lvl:'honors',
   q:'Rings of 1%, 10% and everyone go out 12 hours apart. A mistake is noticed at hour 13. How many of 1,000 laptops break?',
   num:{ans:100,tol:0,unit:'laptops'},
   steps:['Ring 1 at hour 0, ring 2 at hour 12, ring 3 due at hour 24.','At hour 13, rings 1 and 2 are out: 10% of laptops.','10% of 1,000 = 100.'],
   lab:{set:{plan:'rings',bad:true,wait:12,detect:13},look:'Read <b>Laptops broken</b>.'},verify:[['broken',100,0.5]]},
  {id:'cost',kind:'test',lvl:'ap',
   q:'Rings of 1% and 10% with a 12-hour wait. How many laptop-hours do 1,000 laptops spend waiting for a good fix?',
   num:{ans:22680,tol:1,unit:'laptop-hours'},
   steps:['N[(1 − 0.01)w + (1 − 0.10)w] = 1,000 × (0.99 × 12 + 0.90 × 12).','= 1,000 × (11.88 + 10.8) = 22,680.'],
   lab:{set:{plan:'rings',bad:false,wait:12},look:'Read <b>Laptop-hours left waiting</b>.'},verify:[['waith',22680,1]]}
 ]
}
});
