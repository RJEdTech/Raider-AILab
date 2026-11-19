BioLab.addReview({
dwell:{
 questions:[
  {id:'rt',kind:'test',lvl:'bio',
   q:'An intruder copies 2,000 records a day for 7 days. How many records?',
   num:{ans:14000,tol:0,unit:'records'},
   steps:['Amount = rate × time.','2,000 × 7 = 14,000 records.']},
  {id:'stay',kind:'test',lvl:'bio',
   q:'With the defaults (in on day 1, nobody checking), how many days is the intruder inside by day 14?',
   num:{ans:13,tol:0,unit:'days'},
   steps:['They got in on day 1.','The patch locked the door but did not remove them.','14 − 1 = 13 days.'],
   lab:{set:{entry:1,patch:7,install:1,check:false},look:'Read <b>Days inside in all</b>.'},verify:[['inside',13,0.01]]},
  {id:'alert',kind:'real',lvl:'bio',
   q:'You get an email: “New sign-in to your account from a device in another country.” It was not you. What should you do first?',
   choices:['Ignore it, your password is strong','Change your password and sign out of all other sessions','Delete the email'],correct:1,
   steps:['That alert is your account checking its own sign-in records.','A sign-in you did not make means someone may already be inside.','Changing the password locks the door; signing out other sessions removes whoever is inside.']},
  {id:'chk',kind:'test',lvl:'honors',
   q:'Entry day 2, patch installed day 6, records checked the next day, 1,500 records a day. How many records are copied?',
   num:{ans:7500,tol:0,unit:'records'},
   steps:['Found on day 7, the day after the patch.','Days inside: 7 − 2 = 5.','1,500 × 5 = 7,500 records.'],
   lab:{set:{entry:2,patch:5,install:1,check:true,rate:1500},look:'Read <b>Records copied</b>.'},verify:[['recs',7500,0.5]]},
  {id:'fn',kind:'test',lvl:'ap',
   q:'Without checking, an intruder entering on day e stays to day 14. At r = 2,500 a day, what entry day gives a loss of 25,000 records?',
   num:{ans:4,tol:0,unit:''},
   steps:['25,000 = 2,500 × (14 − e).','14 − e = 10.','e = 4.']}
 ]
}
});
