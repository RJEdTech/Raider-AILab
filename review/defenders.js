BioLab.addReview({
defenders:{
 questions:[
  {id:'pc',kind:'test',lvl:'bio',
   q:'The AI systems found 54 of 70 hidden flaws. What percent, to one decimal place?',
   num:{ans:77.1,tol:0.1,unit:'%'},
   steps:['54 ÷ 70 = 0.7714.','× 100 = 77.1%.']},
  {id:'person',kind:'test',lvl:'bio',
   q:'A town of 20,000 spends $7,300,000 upgrading old water-plant computers. How much is that per person?',
   num:{ans:365,tol:0,unit:'$'},
   steps:['$7,300,000 ÷ 20,000 = $365 per person.','That is the same per-person cost as the U.S. Y2K repairs.']},
  {id:'para',kind:'real',lvl:'bio',
   q:'Your town spent money on flood walls, and there was no flood damage this year. Someone says the walls were a waste. What is a careful reply?',
   choices:['They are right','Maybe, but no damage could also mean the walls worked; check what the water levels were','Walls never work'],correct:1,
   steps:['When prevention works, the disaster does not happen.','So “nothing happened” cannot tell you by itself whether prevention was needed.','Look for evidence: how high did the water get?']},
  {id:'fp',kind:'test',lvl:'honors',
   q:'Of the 54 flaws the AI found, 43 were patched. What percent of found flaws were patched?',
   num:{ans:79.6,tol:0.1,unit:'%'},
   steps:['43 ÷ 54 = 0.796.','About 79.6%.']},
  {id:'grow',kind:'test',lvl:'ap',
   q:'If there were 200,000 security analyst jobs in 2025 and they grow 21% by 2035, about how many jobs is that in 2035?',
   num:{ans:242000,tol:0,unit:'jobs'},
   steps:['200,000 × 1.21 = 242,000.','The 200,000 is a round number for practice; the 21% is the BLS projection.']}
 ]
}
});
