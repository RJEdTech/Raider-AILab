BioLab.addReview({
datacenter:{
 questions:[
  {id:'split',kind:'test',lvl:'bio',
   q:'Homes use 10 TWh and a data center uses 5 TWh. Old grid costs are $600M, split by electricity used. What do homes pay now, in $ millions?',
   num:{ans:400,tol:0,unit:'$ million'},
   steps:['Homes’ share: 10 ÷ 15 = 2/3.','2/3 × $600M = $400M.']},
  {id:'def',kind:'test',lvl:'bio',
   q:'With the defaults (tight grid, 3 TWh, data center pays 50% of new costs), how much does one home’s bill change per year?',
   num:{ans:63.46,tol:0.1,unit:'$'},
   steps:['Old-cost share: 700 × 10 ÷ 13 = 538.46.','New costs: 450 × 50% = 225.','538.46 + 225 − 700 = 63.46 million ÷ 1,000,000 homes = $63.46.'],
   lab:{set:{view:'bill',grid:'tight',size:3,charge:50},look:'Read <b>Change per home per year</b>.'},verify:[['home',63.46,0.01]]},
  {id:'head',kind:'real',lvl:'bio',
   q:'A post says, “The new data center will drain our town’s water.” Which question helps most?',
   choices:['How big is the building?','What cooling design does it use, and is its water drinking water or treated wastewater?','Who owns it?'],correct:1,
   steps:['Evaporative cooling uses water up; closed loops reuse it.','Treated wastewater is not the town’s drinking water.','Those two facts change the answer most.']},
  {id:'spare',kind:'test',lvl:'honors',
   q:'Spare grid ($20M per TWh), 3 TWh, data center pays 50% of new costs. Change per home per year? (Use a minus sign for a drop.)',
   num:{ans:-131.54,tol:0.1,unit:'$'},
   steps:['538.46 + 0.5 × 60 = 568.46.','568.46 − 700 = −131.54 million.','÷ 1,000,000 homes = −$131.54.'],
   lab:{set:{view:'bill',grid:'spare',size:3,charge:50},look:'Read <b>Change per home per year</b>.'},verify:[['home',-131.54,0.01]]},
  {id:'be',kind:'test',lvl:'ap',
   q:'Tight grid, 2 TWh. What share a (in %) charged to the data center makes the home change zero? (Round to one decimal.)',
   num:{ans:61.1,tol:0.2,unit:'%'},
   steps:['Old share: 700 × 10 ÷ 12 = 583.33.','583.33 + (1 − a) × 300 = 700, so (1 − a) = 0.3889.','a ≈ 61.1%.']}
 ]
}
});
