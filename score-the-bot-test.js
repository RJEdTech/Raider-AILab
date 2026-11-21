/* Test yourself questions for Score the Bot. Steps are 1-based story steps. */
TestYourself.mount({lab:'AILab',id:'scorebot',title:'Raider AILab · Score the Bot: who taught it to bluff?',el:'#ty',scrollTo:'#cv',go:i=>window.NW.go(i),
 questions:[
 {q:'A test gives +1 for a right answer, 0 for a wrong one and 0 for a blank. You have no idea on one question. What gets you the most points?',choices:['Guess: a guess can only help','Leave it blank: a blank is safer','Write “I don’t know”: honesty earns points','Either one: it makes no difference'],answer:0,
  hint:'Compare what a guess can earn with what a blank can earn under this rule.',step:1,stepName:'pop quiz',
  why:'A guess earns +1 or 0; a blank always earns 0. So this rule rewards guessing.'},
 {q:'New rule: right = +1, wrong = −1, blank = 0. A bot that is 70% sure answers 10 such questions. About how many points does it get?',answer:4,tol:.01,unit:'points',
  hint:v=>Math.abs(v-7)<.01?'Wrong answers now cost a point each. Take away the 3 it gets wrong.':'About 7 right (+7) and 3 wrong (−3).',step:4,stepName:'fix the rule',
  why:'+7 − 3 = 4 points. Answering still pays, because it is right more often than wrong.'},
 {q:'With right = +1, wrong = −1 and “I don’t know” = 0, when should the bot answer?',choices:['Only when it is more than 50% sure','Always','Never','Only when it is 100% sure'],answer:0,
  hint:'Answering pays only if right answers outnumber wrong ones.',step:4,stepName:'fix the rule',
  why:'Above 50% sure, the +1s outnumber the −1s. Below it, “I don’t know” scores better.'},
 {q:'A wrong answer costs 2 points. How sure must the bot be for answering to pay? Use p = L ÷ (1 + L), as a percent.',answer:66.7,tol:1,unit:'%',
  hint:'L is what a wrong answer costs: 2. So p = 2 ÷ 3.',step:6,stepName:'formula',
  why:'2 ÷ 3 ≈ 67%. It takes 2 right answers to make up for each wrong one.'},
 {q:'An AI leaderboard counts only right answers. What kind of model does it reward?',choices:['One that guesses, even when it isn’t sure','One that says “I don’t know” when unsure','One that makes the fewest wrong answers','One that gives the shortest answers'],answer:0,
  hint:'Under that rule, is a blank ever better than a guess?',step:7,stepName:'for real',
  why:'If wrong answers cost nothing, guessing always scores at least as well, so the leaderboard rewards bluffing.'}]});
