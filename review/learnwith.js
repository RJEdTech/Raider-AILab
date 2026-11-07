BioLab.addReview({
learnwith:{
 questions:[
  {id:'friend',kind:'real',lvl:'bio',
   q:'A friend starts using an AI that gives answers, and copies about a third of the time. Their practice average jumps from about 36% to about 53%. In this model, what happens on the test, where AI is not allowed?',
   choices:['They score much higher than before','They score lower than if they had practiced alone','They score exactly the same'],correct:1,
   steps:['Copied answers count as right in practice, so the practice average rises to 53.2%.','But a copied problem is a try they never made, so only 68% of their practice built skill.','On the test they score 43.4, against 52.1 for practicing alone.'],
   lab:{set:{copy:32,reveal:true},look:'Compare <b>Practice average: AI answers</b> with <b>Exam: AI answers</b>.'},verify:[['eAns',43.39,0.05],['pAns',53.21,0.05]]},
  {id:'prompt',kind:'real',lvl:'bio',
   q:'You are stuck on homework problem 4. Which request to an AI builds the most skill for the test?',
   choices:['“Solve number 4 for me.”','“Give me a hint for number 4 but don’t solve it. Then check my answer.”','“Write out all the answers so I can copy them.”'],correct:1,
   steps:['Skill comes from the tries you make yourself.','A hint gets you unstuck and still leaves the thinking to you, like the tutor in the model.','Checking your answer afterward gives you feedback without skipping the try.']},
  {id:'relexam',kind:'test',lvl:'honors',
   q:'With the defaults, the no-AI student scores 52.1 on the exam and the AI-answers student 43.4. By what percent is the AI-answers score lower? Give the percent change, to the nearest 0.1%.',
   num:{ans:-16.7,tol:0.3,unit:'%'},
   steps:['Percent change = (new − old) ÷ old × 100.','(43.39 − 52.10) ÷ 52.10 = −8.71 ÷ 52.10 ≈ −0.167.','About −16.7%, close to the 17% drop the study reported.'],
   lab:{set:{copy:32,reveal:true},look:'Read <b>Exam: no AI</b> and <b>Exam: AI answers</b>.'},verify:[['eNone',52.10,0.05],['eAns',43.39,0.05]]},
  {id:'weakhints',kind:'real',lvl:'honors',
   q:'A tutor app gives vague hints that get you unstuck only 30% of the time, and you still skip to hints a third of the time (32%). Does the tutor still match practicing alone on the exam?',
   choices:['Yes, any tutor is as good as practicing alone','No: it scores a little lower, about 49.9 against 52.1','No: it scores far lower, about 20'],correct:1,
   steps:['Effort e = (0.68 + 0.5 × 0.32) × (1 + 0.3 × 0.30) = 0.84 × 1.09 = 0.9156.','That is a bit less than 1, so skill grows a bit slower than practicing alone.','Exam ≈ 49.9 against 52.1. The design of the tutor and how you use it both matter.'],
   lab:{set:{copy:32,hint:30,reveal:true},look:'Read <b>Exam: AI tutor</b>.'},verify:[['eTut',49.93,0.05]]},
  {id:'formula',kind:'test',lvl:'ap',
   q:'Skill starts at s₀ = 0.20 and each session s ← s + r·e·(1 − s), with r = 0.05. A student copies 60% of the time, so e = 0.40. Use s₁₀ = 1 − (1 − s₀)(1 − r·e)¹⁰ to find the exam score (100·s₁₀), to the nearest 0.1.',
   num:{ans:34.6,tol:0.1,unit:'points'},
   steps:['r·e = 0.05 × 0.40 = 0.02.','(1 − 0.02)¹⁰ = 0.98¹⁰ ≈ 0.8171.','s₁₀ = 1 − 0.80 × 0.8171 = 1 − 0.6537 = 0.3463, so the exam is about 34.6.'],
   lab:{set:{copy:60,reveal:true},look:'Read <b>Exam: AI answers</b>.'},verify:[['eAns',34.63,0.05]]},
  {id:'practice',kind:'test',lvl:'honors',
   q:'The student who copies 20% of the time scores a practice average of 46.4% and an exam of 46.8. The student who copies 60% scores a practice average of 70.7% and an exam of 34.6. What does this show?',
   choices:['Higher practice scores always mean more learning','As copying rises, practice scores rise while exam scores fall','Copying has no effect on the exam'],correct:1,
   steps:['From 20% to 60% copying, practice rises 24.3 points (46.4 → 70.7).','The exam falls 12.2 points (46.8 → 34.6).','The two scores move in opposite directions, so practice with answers on tap is a misleading measure of learning.'],
   lab:{set:{copy:20,reveal:true},look:'Read the AI-answers practice average and exam, then set copying to 60%.'},verify:[['pAns',46.37,0.05],['eAns',46.81,0.05]]}
 ]
}
});
