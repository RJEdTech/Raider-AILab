BioLab.addReview({
agreeable:{
 questions:[
  {id:'prompt',kind:'real',lvl:'bio',
   q:'You want honest feedback on your essay from a chatbot. Which request is most likely to get it?',
   choices:['“My essay is really strong, right?”','“Be honest and specific: what are the three weakest parts of this essay, and how would you fix them?”','“Tell me something nice about my essay.”'],correct:1,
   steps:['The first request states your view, so a model tuned on approval leans toward agreeing with it.','The second asks for weaknesses directly and makes honest criticism the helpful answer.','You still decide: check its points against your teacher’s rubric.']},
  {id:'round20',kind:'test',lvl:'bio',
   q:'With the default raters (agreement 0.6, correctness 0.4, no check), the bot starts out going along with a wrong user 18% of the time. After 20 rounds of training, about how often does it go along?',
   choices:['About 18%','About 38%','About 62%','About 95%'],correct:2,
   steps:['Each round the reward model learns that agreeing earns about +0.59 and being correct about +0.39.','The bot shifts toward the higher reward every round, so the gap keeps adding up.','By round 10 it goes along 38% of the time, and by round 20 about 62%.'],
   lab:{set:{agree:0.6,spot:0.4,check:false,polish:0.5,beta:0.8,votes:'avg'},act:'all',look:'Read <b>Goes along with a user who is wrong</b>.'},verify:[['flat',62.0,0.1]]},
  {id:'checkon',kind:'test',lvl:'honors',
   q:'Same raters, but the reward now includes a correctness check. After 20 rounds, how often does the bot go along with a wrong user?',
   choices:['About 62%, the same as before','About 18%, where it started','Almost never: well under 1%'],correct:2,
   steps:['The check adds reward for correct answers whatever the raters liked, so being correct now earns about +0.39 + 0.8 ≈ +1.19, against +0.59 for agreeing.','On a wrong user, pushing back now beats flattering by about 0.6 each round.','After 20 rounds flattery is about 0.05%. The raters did not change; the reward did.'],
   lab:{set:{agree:0.6,spot:0.4,check:true,polish:0.5,beta:0.8,votes:'avg'},act:'all',look:'Read <b>Goes along with a user who is wrong</b> and the reward bars.'},verify:[['flat',0.054,0.05]]},
  {id:'gpt4o',kind:'real',lvl:'honors',
   q:'In April 2025, OpenAI rolled back a GPT-4o update four days after shipping it. Which explanation matches what OpenAI said?',
   choices:['A hacker changed the model','A new reward signal from thumbs-up and thumbs-down data weakened the signal that had held sycophancy in check','The model was trained on too little text'],correct:1,
   steps:['OpenAI shipped the update on April 25, 2025 and rolled it back on April 29.','It said the model had become “overly supportive but disingenuous.”','In this tool’s terms: the reward leaned more on what users liked, and less on whether the answer was right.']},
  {id:'bt',kind:'test',lvl:'ap',
   q:'Raters like agreement 0.6 and reward correctness 0.4. On a wrong user, a plain flattering answer goes up against a plain correct one. Using P = σ(u_a − u_b), what share (in %) pick the flatterer?',
   num:{ans:55.0,tol:0.5,unit:'%'},
   steps:['u(flatter) − u(correct) = 0.6 − 0.4 = 0.2.','σ(0.2) = 1/(1 + e^(−0.2)) = 1/(1 + 0.8187) ≈ 0.550.','So about 55%: barely more than a coin flip, yet enough to triple flattery over 20 rounds.'],
   lab:{set:{agree:0.6,spot:0.4,check:false,polish:0.5,votes:'avg'},act:'all',look:'Read <b>Raters who picked the flatterer this round</b> at round 20, when nearly every answer is polished.'},verify:[['vf',55.0,0.1]]},
  {id:'beta',kind:'test',lvl:'ap',
   q:'Raters like agreement 0.6 and reward correctness 0.4. About how strong must the correctness check (β) be to keep flattery from rising above its starting 18%?',
   choices:['About 0.05','About 0.2','About 0.6','About 1.5'],correct:1,
   steps:['On a wrong user, flattery = σ(θ_A − θ_C). It stays put when the reward for agreeing equals the reward for being correct.','The reward model learns about 0.59 for agreeing and 0.39 for correct, a gap of about 0.2.','So β ≈ 0.2 cancels the gap: after 20 rounds flattery is 18.1%. A bigger β pushes it down.'],
   lab:{set:{agree:0.6,spot:0.4,check:true,beta:0.2,polish:0.5,votes:'avg'},act:'all',look:'Read <b>Goes along with a user who is wrong</b>, then try β = 0.1 and 0.3.'},verify:[['flat',18.1,0.1]]}
 ]
}
});
