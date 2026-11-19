BioLab.addReview({
mirror:{
 questions:[
  {id:'wavg',kind:'test',lvl:'bio',
   q:'A test is 80% group A (1% wrong) and 20% group B (20% wrong). What is the overall percent wrong?',
   num:{ans:4.8,tol:0.05,unit:'%'},
   steps:['0.8 × 1 = 0.8.','0.2 × 20 = 4.','0.8 + 4 = 4.8% wrong overall, while group B sees 20%.']},
  {id:'def',kind:'test',lvl:'bio',
   q:'With the default test mix (6% of photos from darker-skinned women), what overall accuracy does the program report?',
   num:{ans:97.17,tol:0.05,unit:'%'},
   steps:['Error: 0.94 × 0.8 + 0.06 × 34.7 = 0.752 + 2.082 = 2.834%.','Accuracy: 100 − 2.834 = 97.17%.'],
   lab:{set:{scene:'hidden',share:6,split:true},look:'Read <b>Reported accuracy</b>.'},verify:[['acc',97.166,0.01]]},
  {id:'algo',kind:'real',lvl:'bio',
   q:'A friend says, “The app’s AI is racist, it’s just the math.” What is a more accurate way to put it?',
   choices:['Math cannot be biased, so it must be fine','People chose the data and the test, and the AI repeated the patterns in them; the math made it look neutral','Nobody can know'],correct:1,
   steps:['The program learned from photos people collected.','It was tested on photos people chose, and people reported one average.','The math carried those choices; it did not create them.']},
  {id:'cal',kind:'test',lvl:'honors',
   q:'A student marks 20 answers “100% sure” and gets 15 right. By how many percentage points is the student overconfident?',
   num:{ans:25,tol:0,unit:'points'},
   steps:['15 ÷ 20 = 75% right.','100 − 75 = 25 points overconfident.']},
  {id:'solve',kind:'test',lvl:'ap',
   q:'Group A error 1%, group B error 25%. What share s of group B (in %) makes the overall error exactly 4%?',
   num:{ans:12.5,tol:0.05,unit:'%'},
   steps:['1(1 − s) + 25s = 4.','1 + 24s = 4, so s = 0.125.','12.5% of the test.']}
 ]
}
});
