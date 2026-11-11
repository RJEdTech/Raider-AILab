BioLab.addReview({
attention:{
 questions:[
  {id:'share1',kind:'test',lvl:'bio',
   q:'Clue strength 1, “too big.” The scores are trophy 2, suitcase 0, fit 0.5, and e^score is about 7.39, 1 and 1.65. What percent of “it”’s attention goes to “trophy”?',
   num:{ans:73.6,tol:1,unit:'%'},
   steps:['Add the three: 7.39 + 1 + 1.65 = 10.04.','Divide: 7.39 ÷ 10.04 ≈ 0.736.','About 73.6%: a weaker clue than the default, so the attention is less concentrated.'],
   lab:{set:{end:'big',x:1,show:true},look:'Read <b>Share to “trophy”</b>.'},verify:[['trophy',73.6,0.01]]},
  {id:'even',kind:'test',lvl:'bio',
   q:'With the clue strength at 0, what share of the attention does “fit” get?',
   num:{ans:33.3,tol:0.5,unit:'%'},
   steps:['Every score is 0, and e⁰ = 1.','Each share is 1 ÷ 3.','About 33.3% each: without a clue, attention cannot pick a word out.'],
   lab:{set:{x:0,show:true},look:'Read <b>Share to “fit”</b>.'},verify:[['fit',33.3,0.01]]},
  {id:'prompt',kind:'real',lvl:'bio',
   q:'You ask a chatbot, “My brother texted my friend and he was upset. Why?” It answers about the wrong person. What change best fixes it?',
   choices:['Ask the same question again','Replace “he” with the name of the person you mean','Add “please” to the question'],correct:1,
   steps:['“He” could point to the brother or the friend, like “it” in the trophy sentence.','The model has to split its attention between them and may choose wrong.','Naming the person removes the guess, so the attention has a clear target.']},
  {id:'small',kind:'test',lvl:'honors',
   q:'“Too small,” clue strength 2. The scores are trophy 0, suitcase 4, fit 1. What percent goes to “suitcase”?',
   num:{ans:93.6,tol:1,unit:'%'},
   steps:['e⁰ = 1, e⁴ ≈ 54.60, e¹ ≈ 2.72.','Total ≈ 58.32.','54.60 ÷ 58.32 ≈ 0.936, so about 93.6%.'],
   lab:{set:{end:'small',x:2,show:true},look:'Read <b>Share to “suitcase”</b>.'},verify:[['suitcase',93.6,0.01]]},
  {id:'heatmap',kind:'real',lvl:'honors',
   q:'A news article shows an AI attention heat map and says it “proves why the AI made its decision.” What is the most accurate response?',
   choices:['The heat map is proof, because the weights are exact numbers','A heat map shows where one step looked; researchers disagree about how well that explains the final answer','Heat maps are made up and mean nothing'],correct:1,
   steps:['Attention weights are real numbers the model computed.','But a model has many heads and layers, and Jain and Wallace (2019) showed different weights can give the same answer.','So a heat map is evidence about one step, not proof of why the model decided.']},
  {id:'ninety',kind:'test',lvl:'ap',
   q:'With q = [x, 0], the scores are 2x for trophy, 0 for suitcase and 0.5x for fit. At x = 2.5, what percent of the attention goes to “trophy”?',
   num:{ans:97.1,tol:0.5,unit:'%'},
   steps:['Scores: 2 × 2.5 = 5, 0, and 0.5 × 2.5 = 1.25.','e⁵ ≈ 148.41, e⁰ = 1, e^1.25 ≈ 3.49. Total ≈ 152.90.','148.41 ÷ 152.90 ≈ 0.971, so about 97.1%. The share passes 90% between x = 1.5 (86.6%) and x = 2 (93.6%).'],
   lab:{set:{end:'big',x:2.5,show:true},look:'Read <b>Share to “trophy”</b>.'},verify:[['trophy',97.1,0.01]]}
 ]
}
});
