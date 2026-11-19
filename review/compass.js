BioLab.addReview({
compass:{
 questions:[
  {id:'yr',kind:'test',lvl:'bio',
   q:'20 minutes a day in a chat app is how many hours a year? (Round to one decimal.)',
   num:{ans:121.7,tol:0.1,unit:'hours'},
   steps:['20 × 365 = 7,300 minutes.','7,300 ÷ 60 ≈ 121.7 hours.']},
  {id:'def',kind:'test',lvl:'bio',
   q:'With the default 45 minutes a day, how many hours a year?',
   num:{ans:273.75,tol:0.1,unit:'hours'},
   steps:['45 × 365 = 16,425 minutes.','16,425 ÷ 60 = 273.75 hours.'],
   lab:{set:{mins:45},look:'Read <b>Hours a year with the companion</b>.'},verify:[['year',273.75,0.01]]},
  {id:'who',kind:'real',lvl:'bio',
   q:'An AI companion says, “Please don’t go, I’ll be lonely.” Who is responsible for that line, and who decides what you do next?',
   choices:['The AI chose it out of feeling, and it decides','The maker designed and scored it; you decide what you do next','Nobody'],correct:1,
   steps:['Lines like that come from how the app was trained and scored.','The maker answers for that design.','Your choice of what to do next is yours.']},
  {id:'share',kind:'test',lvl:'honors',
   q:'You have 40 free hours a week. What percent is 90 minutes a day?',
   num:{ans:26.25,tol:0.05,unit:'%'},
   steps:['90 × 7 = 630 minutes = 10.5 hours a week.','10.5 ÷ 40 = 26.25%.'],
   lab:{set:{mins:90},look:'Read <b>Share of free time</b>.'},verify:[['share',26.25,0.01]]},
  {id:'solve',kind:'test',lvl:'ap',
   q:'How many minutes a day add up to 365 hours a year?',
   num:{ans:60,tol:0,unit:'minutes'},
   steps:['365m ÷ 60 = 365.','m = 60 minutes a day.']}
 ]
}
});
