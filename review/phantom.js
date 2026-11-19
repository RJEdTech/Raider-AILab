BioLab.addReview({
phantom:{
 questions:[
  {id:'rat',kind:'test',lvl:'bio',
   q:'A dose goes from 50 mg to 600 mg. How many times bigger is it?',
   num:{ans:12,tol:0,unit:'times'},
   steps:['Divide new by old.','600 ÷ 50 = 12 times.']},
  {id:'oldsmar',kind:'test',lvl:'bio',
   q:'At Oldsmar the setting went from about 100 to 11,100 ppm. How many times the normal amount?',
   num:{ans:111,tol:0,unit:'times'},
   steps:['11,100 ÷ 100 = 111.']},
  {id:'first',kind:'real',lvl:'bio',
   q:'A friend shares a headline: “Hackers shut down city’s power.” It is two hours old. What is the most careful thing to say?',
   choices:['That proves hackers did it','It might be true; let’s see what evidence comes out before we repeat it','It is definitely fake'],correct:1,
   steps:['First reports often rely on early statements.','Causes are sometimes revised later, as at Oldsmar.','Holding a story loosely is not the same as calling it fake.']},
  {id:'pct',kind:'test',lvl:'honors',
   q:'A reading goes from 8 to 20. What is the percent increase?',
   num:{ans:150,tol:0,unit:'%'},
   steps:['Change: 20 − 8 = 12.','12 ÷ 8 = 1.5.','150% increase.']},
  {id:'ev',kind:'real',lvl:'ap',
   q:'Which statement is best supported by the evidence on Oldsmar?',
   choices:['An outside hacker attacked the plant','The cause was not confirmed, but the plant’s setup had real weaknesses','Nothing happened at all'],correct:1,
   steps:['The FBI could not confirm an intrusion.','The setting change and the response were real.','The Windows 7 and remote-access weaknesses were documented either way.']}
 ]
}
});
