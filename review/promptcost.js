BioLab.addReview({
promptcost:{
 questions:[
  {id:'you30',kind:'real',lvl:'bio',
   q:'You send 30 prompts a day. Using Google’s 0.24 Wh per prompt and 12 Wh for a full phone charge, how many phone charges is that per day?',
   num:{ans:0.6,tol:0.02,unit:'charges'},
   steps:['Energy = 30 × 0.24 Wh = 7.2 Wh.','Phone charges = 7.2 ÷ 12 = 0.6.','So a day of your prompts is a little over half a phone charge.'],
   lab:{set:{perDay:30,count:'google',reveal:true},look:'Read <b>Your prompts in a day, in phone charges</b>.'},verify:[['youCh',0.6,0.005]]},
  {id:'headline',kind:'real',lvl:'bio',
   q:'A headline says “One AI prompt uses 45 mL of water.” Another says “0.26 mL.” What should you ask first?',
   choices:['Which number is bigger','What each one counted, and who measured it','Which website is more popular'],correct:1,
   steps:['Both are company self-reports with no shared standard.','45 mL is Mistral’s life-cycle count for one response; 0.26 mL is Google’s serving-only median.','Different boundaries and different models give different numbers, so the first question is what was counted.']},
  {id:'altman',kind:'test',lvl:'honors',
   q:'OpenAI’s CEO said an average ChatGPT query uses about 0.34 Wh. With a 12 Wh phone charge, how many such queries equal one charge? Round to the nearest tenth.',
   num:{ans:35.3,tol:0.1,unit:'prompts'},
   steps:['Prompts per charge = 12 ÷ 0.34.','12 ÷ 0.34 ≈ 35.29.','About 35, compared with 50 using Google’s median. Note that this is an average, Google’s is a median, and no method was published for the 0.34.'],
   lab:{set:{count:'altman',reveal:true},look:'Read <b>Prompts per phone charge</b>.'},verify:[['ppc',35.29,0.02]]},
  {id:'schoolwater',kind:'real',lvl:'honors',
   q:'By Mistral’s life-cycle count (45 mL per response), how many liters of water would a school of 1,700 students use in one day at 20 prompts each?',
   num:{ans:1530,tol:5,unit:'L'},
   steps:['Responses = 1,700 × 20 = 34,000.','Water = 34,000 × 45 mL = 1,530,000 mL = 1,530 L.','By Google’s serving-only count (0.26 mL), the same day is 8.84 L. The boundary changes the answer by about 170 times.'],
   lab:{set:{count:'mistral',show:'water',reveal:true},look:'Read <b>Water per prompt</b> and the school bar.'},verify:[['ml',45,0.001]]},
  {id:'worldshare',kind:'test',lvl:'honors',
   q:'If all 8 billion people sent 20 prompts a day at 0.24 Wh for a year, what share of the 415 TWh all data centers used in 2024 would that be? Give a percent to the nearest tenth.',
   num:{ans:3.4,tol:0.1,unit:'%'},
   steps:['Energy = 8 × 10⁹ × 20 × 0.24 Wh × 365 = 1.40 × 10¹³ Wh = 14.0 TWh.','Share = 14.0 ÷ 415 ≈ 0.034.','About 3.4%. Data centers run much more than chat prompts.'],
   lab:{set:{perDay:20,count:'google'},look:'Read <b>Everyone on Earth for a year, as a share of all data centers in 2024</b>.'},verify:[['worldPct',3.377,0.01]]},
  {id:'growth',kind:'test',lvl:'ap',
   q:'The IEA reported about 415 TWh for data centers in 2024 and projects about 945 TWh in 2030. What constant yearly growth rate connects them? Give a percent to the nearest tenth.',
   num:{ans:14.7,tol:0.2,unit:'%'},
   steps:['945 = 415 × (1 + g)⁶, so (1 + g)⁶ = 945 ÷ 415 ≈ 2.277.','1 + g = 2.277^(1/6) ≈ 1.147.','g ≈ 14.7% a year, which doubles the total about every 5 years (ln 2 ÷ ln 1.147 ≈ 5.05).']}
 ]
}
});
