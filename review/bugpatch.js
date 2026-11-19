BioLab.addReview({
bugpatch:{
 questions:[
  {id:'words',kind:'real',lvl:'bio',
   q:'Your friend says, “The update is just there to make me buy a new phone.” What do most updates actually contain?',
   choices:['New ads','Patches: fixes for bugs and holes that were found','Nothing; they are for show'],correct:1,
   steps:['Code is written by people, so it has mistakes (bugs).','Some bugs let attackers in. Those are holes (vulnerabilities).','Updates are mostly patches that close those holes.']},
  {id:'two',kind:'test',lvl:'bio',
   q:'A game console has 3 layers of code. Each works 99% of days. What percent of days do all 3 work?',
   num:{ans:97.03,tol:0.05,unit:'%'},
   steps:['As decimals: 0.99, 0.99, 0.99.','0.99 × 0.99 × 0.99 = 0.970299.','About 97.03%.']},
  {id:'eol',kind:'test',lvl:'bio',
   q:'With the bottom floor 4 years past its last fix, it works 99.9% − 4 × 0.5% of days. What percent is that?',
   num:{ans:97.9,tol:0.05,unit:'%'},
   steps:['4 × 0.5 = 2 points.','99.9 − 2 = 97.9%.','Every year without fixes costs half a point in this model.'],
   lab:{set:{eol:true,years:4},look:'Read <b>Bottom floor works</b>.'},verify:[['bottom',97.9,0.01]]},
  {id:'bad',kind:'test',lvl:'honors',
   q:'Everything works 98.9% of days. About how many days a year does something break?',
   num:{ans:4,tol:0.1,unit:'days'},
   steps:['1 − 0.989 = 0.011 of days.','365 × 0.011 = 4.015.','About 4 days a year.']},
  {id:'ap1',kind:'test',lvl:'ap',
   q:'A system has n layers, each working with chance 0.998. What is the smallest n for which P(all work) drops below 99%?',
   num:{ans:6,tol:0,unit:'layers'},
   steps:['Solve 0.998ⁿ < 0.99.','n > ln(0.99) ÷ ln(0.998) = 5.02.','So n = 6 layers.']}
 ]
}
});
