(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,axes,atLeast,fmtNum}=BioLab.h;
/* 100 questions. The bot's confidence on question i is c_i = 0.03 + 0.96·u^a with u = (i + 0.5)/100: a spread from a few % to 99%.
   a = 0.6 for a review sheet (average 63%), a = 2.2 for hard trivia (average 33%). Confidence is calibrated unless the
   Deep dive "overconfident" switch is on: then the real chance of being right is c^1.6. */
const QUIZ={review:{a:0.6,l:'Review sheet',name:'your review sheet'},hard:{a:2.2,l:'Hard trivia',name:'a hard trivia set'}};
const GAM=1.6,N=100;
const CONF={};Object.keys(QUIZ).forEach(k=>{CONF[k]=Array.from({length:N},(_,i)=>0.03+0.96*Math.pow((i+0.5)/N,QUIZ[k].a));});
const conf=sim=>CONF[QUIZ[sim.p.quiz]?sim.p.quiz:'review'];
const over=sim=>!!(sim.p.over&&atLeast('ap'));
const real=(sim,c)=>over(sim)?Math.pow(c,GAM):c;
const R=sim=>atLeast('honors')?sim.p.right:1;
const L=sim=>+sim.p.harm;
/* The bot answers when its expected points for answering beat "I don't know": c·R + (1 − c)·W > I, i.e. c > (I − W)/(R − W). */
const thrOf=(r,w,i)=>(i-w)/(r-w);
const thr=sim=>thrOf(R(sim),sim.p.wrong,sim.p.blank);
function outcome(sim,t){if(t===undefined)t=thr(sim);const r=R(sim),w=sim.p.wrong,b=sim.p.blank,l=L(sim);let right=0,wrong=0,blank=0,score=0,n=0;
 conf(sim).forEach(c=>{const p=real(sim,c);if(c>t){n++;right+=p;wrong+=1-p;score+=p*r+(1-p)*w;}else{blank++;score+=b;}});
 return {t,n,right,wrong,blank,score,net:right-l*wrong};}
/* The rule that is best for your group: answer only when right·1 > harm·wrong, i.e. p > L/(1 + L). */
const bestT=sim=>{const t=L(sim)/(1+L(sim));return over(sim)?Math.pow(t,1/GAM):t;};
function setRuleFor(sim,tau){const r=R(sim);let w=-tau*r/(1-tau),b=0;if(w<-5){w=-5;b=tau*(r+5)-5;}sim.p.wrong=w;sim.p.blank=b;}
const f1=v=>(v<-0.05?'−':'')+Math.abs(v).toFixed(1),f0=v=>String(Math.round(v)),s1=v=>(v>0.05?'+':'')+f1(v);
const sg=v=>(v>0?'+':v<0?'−':'')+(Math.round(Math.abs(v)*100)/100);
const pct=v=>Math.round(v*100)+'%';
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
const TOUR=sim=>!!(sim.tour&&sim.tour.on);
/* "Your turn": the break-even accuracy for your group, p = L/(1 + L). Its verdicts stay hidden until the student checks it. */
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const brk=sim=>L(sim)/(1+L(sim));
const p1=v=>(Math.round(v*1000)/10).toFixed(1)+'%';
const nn=v=>(+(+v).toFixed(2)).toString();
const GS=sim=>TOUR(sim)?null:sim.gutS;
/* index of the first answered question for a threshold (confidences are sorted low to high) */
const cut=(sim,t)=>{const c=conf(sim);let i=0;while(i<N&&c[i]<=t)i++;return i;};

const SIM={
 id:'scorebot',hash:'scorebot',apUnit:2,order:1,tab:'Score the Bot',kind:'Simulation',
 skills:{bio:'Expected value: chance right × points + chance wrong × points, and a break-even point · Statistics, Algebra 1 (linear equations)',honors:'Expected value and a threshold inequality, p > (I − W)/(R − W) · Statistics, Algebra 1 (linear inequalities)',ap:'Expected value, thresholds and calibration · AP Statistics, Algebra 2'},
 card:'Write the grading rule for a quiz-taking bot, then watch whether it learns to guess or to say “I don’t know.”',
 title:'Score the Bot: what you reward is what you get',
 lede:{bio:'An AI system gets better at whatever it is scored on. The math is expected value: average points = chance right × points for right + chance wrong × points for wrong. If a wrong answer costs nothing, a guess always averages more than 0, so a bot chasing points guesses every time. OpenAI researchers argue this is one big reason chatbots state false facts with confidence.',
  honors:'The bot picks whatever earns the most points on average. It answers only when p·R + (1 − p)·W beats the points for “I don’t know,” so your rule sets a confidence threshold.',
  ap:'Solving p·R + (1 − p)·W > I gives the threshold p > (I − W)/(R − W). If the bot’s confidence is off, the threshold has to account for its real accuracy, not what it claims.'},
 scale:'100 questions, sorted from the one the bot is least sure about (left) to the one it is most sure about (right). Counts are averages over many runs of the same quiz.',
 aspect:16/9,timeless:true,trials:true,graph:true,
 controlsTitle:'Your grading rule',
 controls:[
  {id:'wrong',label:'Points for a wrong answer',type:'range',min:-5,max:0,step:0.25,def:0,unit:' pts',onChange:clearGut,help:'0 means a wrong answer costs nothing. A negative number is a penalty.'},
  {id:'blank',label:'Points for “I don’t know”',type:'range',min:0,max:1,step:0.05,def:0,unit:' pts',onChange:clearGut},
  {id:'right',label:'Points for a right answer',type:'range',min:0.5,max:2,step:0.25,def:1,unit:' pts',lvl:'honors',noGut:true,onChange:clearGut},
  {id:'harm',label:'A wrong answer your group believes costs as much as…',type:'seg',def:2,noGut:true,onChange:clearGut,options:[{v:1,l:'1 right answer helps'},{v:2,l:'2 right answers help'},{v:3,l:'3 right answers help'}],help:'You study the wrong fact, then have to unlearn it. This sets how much worse a wrong answer is for you than a right answer is good.'},
  {id:'quiz',label:'The questions',type:'seg',def:'review',noGut:true,onChange:clearGut,options:[{v:'review',l:'Review sheet: it knows a lot'},{v:'hard',l:'Hard trivia: it is often unsure'}]},
  {id:'over',label:'The bot is overconfident',type:'toggle',def:false,lvl:'ap',noGut:true,onChange:clearGut,help:'When it feels c sure, it is really right only c^1.6 of the time: 50% sure means about 33% right. An assumption for illustration.'}
 ],
 init(){return {};},step(){},
 metrics:[
  {id:'acc',label:'Right answers (accuracy)',unit:'of 100',d:1,min:0,max:100,get:sim=>outcome(sim).right},
  {id:'err',label:'Wrong answers (error rate)',unit:'of 100',d:1,min:0,max:100,get:sim=>outcome(sim).wrong},
  {id:'abst',label:'“I don’t know” (abstention rate)',unit:'of 100',d:0,min:0,max:100,get:sim=>outcome(sim).blank},
  {id:'net',label:'Net help to your group',unit:'pts',d:1,min:-110,max:60,get:sim=>outcome(sim).net},
  {id:'score',label:'The bot’s score under your rule',unit:'pts',d:1,lvl:'honors',min:null,max:null,get:sim=>outcome(sim).score},
  {id:'thr',label:'The bot answers only when more than this sure',unit:'%',d:1,lvl:'honors',min:0,max:100,get:sim=>clamp(100*thr(sim),0,100)}
 ],
 graphs:[{id:'pen',label:'What the bot does as the penalty grows',custom:true}],defaultGraph:'pen',
 plot(sim,ctx,box){const ax=axes(ctx,box,{xmin:-5,xmax:0,ymin:0,ymax:100,xl:'Points for a wrong answer',yl:'Out of 100 questions'});
  const w0=sim.p.wrong,lines=[['right',PAL['s3'],'Right'],['wrong',PAL['s1'],'Wrong'],['blank',PAL['muted'],'I don’t know']];
  lines.forEach(([k,col])=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();for(let w=-5;w<=0.0001;w+=0.05){sim.p.wrong=w;const o=outcome(sim);const px=ax.X(w),py=ax.Y(o[k]);w<-4.99?ctx.moveTo(px,py):ctx.lineTo(px,py);}ctx.stroke();});
  sim.p.wrong=w0;ctx.strokeStyle=PAL['rj'];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ax.X(w0),box.T);ctx.lineTo(ax.X(w0),box.T+box.H);ctx.stroke();
  const lgx=box.L+box.W-140;rr(ctx,lgx-8,box.T+4,136,64,6);ctx.fillStyle=PAL['card'];ctx.globalAlpha=.9;ctx.fill();ctx.globalAlpha=1;
  lines.forEach(([k,col,lab],i)=>{const y=box.T+16+i*19,x=lgx;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+18,y);ctx.stroke();txt(ctx,lab,x+24,y,{s:13,c:PAL['muted'],b:'middle'});});},
 draw(sim,ctx,vdt,k){const o=outcome(sim),c=conf(sim),t=o.t,G=GS(sim),big=k>1.3;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the rule */
  const ps=14*Math.min(k,1.5);
  txt(ctx,big?'Your rule':'Your grading rule',20,30*Math.min(k,1.3),{s:13*k,w:700,c:PAL['cv-ink'],b:'middle'});
  ctx.font='700 '+ps+'px '+FONT;
  const chips=[['Right '+sg(R(sim)),PAL['s3']],['Wrong '+sg(sim.p.wrong),PAL['s1']],['“I don’t know” '+sg(sim.p.blank),'#6b7280']];
  let cx=(big?150:180)*Math.min(k,1.3);chips.forEach(([s,col])=>{const w=ctx.measureText(s).width+ps*1.1;pill(ctx,s,cx+w/2,30*Math.min(k,1.3),col,'#fff',ps);cx+=w+10;});
  /* the strip of 100 questions */
  const X0=40,X1=780,pitch=(X1-X0)/N,bw=pitch*0.76,top=96*Math.min(k,1.25),hs=big?150:170,bot=top+hs;
  const ic=cut(sim,t);
  for(let i=0;i<N;i++){const x=X0+i*pitch,p=real(sim,c[i]);
   if(i>=ic){ctx.fillStyle=PAL['s3'];ctx.fillRect(x,bot-p*hs,bw,p*hs);ctx.fillStyle=PAL['s1'];ctx.fillRect(x,top,bw,(1-p)*hs);}
   else{ctx.fillStyle=PAL['line'];ctx.globalAlpha=.55;ctx.fillRect(x,top,bw,hs);ctx.globalAlpha=1;ctx.fillStyle=PAL['cv-soft'];ctx.globalAlpha=.35;ctx.fillRect(x,bot-p*hs,bw,2);ctx.globalAlpha=1;}
   if(over(sim)&&i>=ic&&i%4===0){ctx.fillStyle=PAL['cv-ink'];ctx.fillRect(x-0.5,bot-c[i]*hs-1,bw+1,2.5);}}
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;ctx.strokeRect(X0-2,top-2,X1-X0+4,hs+4);
  const xc=X0+ic*pitch-(pitch-bw)/2;
  /* region labels */
  const ly=bot+20*k;
  if(ic>0&&ic<N){ctx.strokeStyle=PAL['cv-ink'];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xc,top-14);ctx.lineTo(xc,bot+6);ctx.stroke();}
  const tl=ic>=N?'It never answers':ic===0?'It answers every question':'It answers when more than '+pct(t)+' sure';
  const tx=ic===0||ic>=N?400:clamp(xc,X0+150*k,X1-150*k);
  pill(ctx,tl,tx,top-26*Math.min(k,1.2),PAL['rj'],'#fff',13*Math.min(k,1.4));
  if(ic>0)txt(ctx,'“I don’t know”: '+o.blank,Math.max(X0+4,Math.min(xc-8,X0+ic*pitch/2+60*k)),ly,{s:12*k,w:700,c:PAL['cv-soft'],a:ic<N?'right':'center'});
  if(ic<N)txt(ctx,'Answers: '+o.n,ic===0?400:Math.min(X1-4,xc+8),ly,{s:12*k,w:700,c:PAL['cv-ink'],a:ic===0?'center':'left'});
  if(ic===0)txt(ctx,'← least sure',X0,ly,{s:12*k,c:PAL['cv-soft'],a:'left'});
  txt(ctx,'→ most sure',X1,ly,{s:12*k,c:PAL['cv-soft'],a:'right'});
  /* gut and math marks */
  const mark=(tt,col,lab,dy)=>{const i=cut(sim,tt),x=X0+i*pitch-(pitch-bw)/2;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bot);ctx.stroke();ctx.setLineDash([]);txt(ctx,lab,clamp(x,X0+40*k,X1-40*k),bot+dy,{s:12*k,w:700,c:col,a:'center'});};
  if(G&&G.g&&G.m){if(Math.abs(G.g.t-t)>1e-9)mark(G.g.t,PAL['s4'],'Your rule',40*k);}
  /* tallies */
  const ty=bot+(big?52:58)*k,th=Math.min(450-ty-6,62*k),tw=182,gap=10,tx0=(800-4*tw-3*gap)/2;
  const tile=(i,lab,val,col)=>{const x=tx0+i*(tw+gap);rr(ctx,x,ty,tw,th,10);ctx.fillStyle=PAL['card'];ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();
   txt(ctx,val,x+tw/2,ty+th*0.52,{s:24*Math.min(k,1.5),w:700,c:col,a:'center',b:'middle'});txt(ctx,lab,x+tw/2,ty+th-8*Math.min(k,1.4),{s:12*k,c:PAL['cv-soft'],a:'center'});};
  tile(0,'right',f1(o.right),PAL['s3']);tile(1,'wrong',f1(o.wrong),PAL['s1']);tile(2,big?'don’t know':'“I don’t know”',f0(o.blank),PAL['cv-soft']);tile(3,big?'net help':'net help: '+f1(o.right)+' − '+L(sim)+' × '+f1(o.wrong),s1(o.net),PAL['rj']);
  sim._L={rule:[10,6,780,48*Math.min(k,1.3)],strip:[X0-8,top-44,X1-X0+16,hs+80],tiles:[tx0-6,ty-6,4*tw+3*gap+12,th+12]};},
 narrate(sim){const o=outcome(sim),c=conf(sim),l=L(sim),lo=Math.round(100*c[0]);
  if(pend(sim))return `Your rule is locked: the bot answers ${o.n} questions and says “I don’t know” to ${o.blank}. <b>Before the math checks it,</b> work out how sure an answer must be to help your group.`;
  if(o.n===N)return `With these points a guess never loses anything, so the bot <b>answers all 100 questions</b>, even the one it is only ${lo}% sure of. On average ${f0(o.wrong)} of its answers are wrong, and each one sounds just as sure as the right ones. For your group that nets ${s1(o.net)}.`;
  if(o.n===0)return `This rule makes “I don’t know” worth more than any answer, so <b>the bot never answers</b>. No wrong answers, but no help either.`;
  const bt=bestT(sim),gap=thr(sim)-bt;
  const verdict=Math.abs(cut(sim,thr(sim))-cut(sim,bt))===0?' <b>That is the best rule for your group:</b> it answers exactly when a right answer is worth more to you than the risk of a wrong one.':gap<0?` <b>It still answers some questions it should skip:</b> for your group a guess pays off only above ${pct(l/(1+l))} real accuracy.`:` <b>It is now too cautious:</b> it skips questions it would usually get right.`;
  return `A guess now pays off for the bot only when it is more than ${pct(thr(sim))} sure, so it answers ${o.n} questions and says “I don’t know” to ${o.blank}. About ${f1(o.right)} right and ${f1(o.wrong)} wrong.`+verdict;},
 gut:{better:'higher',controls:['wrong','blank'],
  ask:{bio:'A right answer is worth 1 point. Set the points for a <b>wrong answer</b> and for <b>“I don’t know”</b> here. Remember: each wrong answer your group trusts costs as much as 2 right answers help. Aim for the most real help: few wrong answers, without losing too many right ones. Then lock it in.',
   honors:'Set the wrong-answer and “I don’t know” points by feel to get the most net help for your group, then lock in your rule.'},
  lock(sim){const o=outcome(sim);return {v:o.net,t:o.t,o,label:`wrong ${sg(sim.p.wrong)}, “I don’t know” ${sg(sim.p.blank)}: about ${f1(o.right)} right, ${f1(o.wrong)} wrong`};},
  solve(sim){setRuleFor(sim,bestT(sim));const o=outcome(sim);return {v:o.net,t:o.t,o,label:`wrong ${sg(sim.p.wrong)}, “I don’t know” ${sg(sim.p.blank)}: about ${f1(o.right)} right, ${f1(o.wrong)} wrong`};},
  hint:{bio:'Lock in your rule. Then you will work out the break-even point for your group yourself.'},
  calc:{unit:'%',d:1,tol:0.5,
   prompt:{bio:sim=>`A right answer helps your group <b>1</b> point. A wrong answer your group trusts costs <b>${L(sim)}</b> point${L(sim)===1?'':'s'}. If the bot’s answer is right with chance p, answering is worth p × 1 − (1 − p) × ${L(sim)} to your group on average. At what p (in %) is that exactly 0, so answering just breaks even?`,
    ap:sim=>`Your group gains +1 from a right answer and loses ${L(sim)} from a wrong one it trusts. Write the expected help from answering a question the bot gets right with real chance p, set it to 0, and solve. What is the break-even p, in %?`},
   answer:sim=>100*brk(sim),
   hint:'Expand: p − L + L·p = 0. Collect the p terms, then divide.',
   steps(sim){const l=L(sim);
    return [`p × 1 − (1 − p) × ${l} = 0, so p − ${l} + ${l}p = 0.`,`${1+l}p = ${l}, so p = ${l} ÷ ${1+l} = <b>${p1(brk(sim))}</b>.`,`An answer helps your group only when it is right more than ${p1(brk(sim))} of the time. A wrong-answer score of −${l} (with “I don’t know” at 0) puts the bot’s own line in the same place: (0 + ${l}) ÷ (1 + ${l}) = ${p1(brk(sim))}.`];}},
  formula(sim){const o=outcome(sim),l=L(sim),r=R(sim),w=sim.p.wrong,b=sim.p.blank;
   const bot=`(I − W) ÷ (R − W) = (${nn(b)} + ${nn(-w)}) ÷ (${nn(r)} + ${nn(-w)}) = ${p1(thr(sim))}`;
   return `Your group: p × 1 > (1 − p) × ${l}, so p > ${l} ÷ ${1+l} = ${p1(brk(sim))}${over(sim)?`; this bot is right c^1.6 of the time, so its felt confidence must pass (${l}/${1+l})^(1/1.6) = ${p1(bestT(sim))}`:''}.<br>The bot answers when ${bot}.<br>Net help = right − ${l} × wrong = ${f1(o.right)} − ${l} × ${f1(o.wrong)} = ${s1(o.net)}.`;},
  how:{bio:'The math asks one question for each answer: is it worth the risk? If a wrong answer costs your group twice what a right one is worth, an answer is worth giving only when it is right more than 2 times out of 3. Set the penalty for wrong equal to that harm, and a point-chasing bot draws its line in exactly that spot.',
   honors:'The bot answers when p > (I − W)/(R − W). Your group gains p − L(1 − p) from an answer, which is positive when p > L/(1 + L). Pick W and I so the two thresholds match: with R = 1 and I = 0, that means W = −L.',
   ap:'Net help is Σ over answered questions of [(1 + L)p_i − L]. It is largest when the bot answers exactly the questions with p_i > L/(1 + L). If the bot is overconfident (p = c^1.6), the confidence threshold must rise to c* = (L/(1 + L))^(1/1.6).'},
  compare(sim,g,m){const G=g.o,Mo=m.o,d=m.v-g.v;
   if(d<0.05)return `Your rule was right on. The bot answers ${G.n} questions, gets about ${f1(G.right)} right and ${f1(G.wrong)} wrong, and your group nets ${s1(G.net)}: the most this bot can give you. You matched the penalty to the real cost of a wrong answer.`;
   const fewer=G.wrong-Mo.wrong,lost=G.right-Mo.right;
   const trade=fewer>0?`The math’s rule cuts wrong answers from ${f1(G.wrong)} to ${f1(Mo.wrong)} (${f1(fewer)} fewer wrong facts for your group to study)${lost>0.05?`, at a cost of ${f1(lost)} right answers`:', and it keeps more right answers too'}.`:`Your rule was too strict. The math’s rule lets the bot answer more: ${f1(-lost)} more right answers for ${f1(-fewer)} more wrong ones.`;
   const K=sim.ui&&sim.ui.calc,self=K&&K.done&&K.correct?' You also worked out the break-even point yourself.':'';
   return trade+` Net help goes from <b>${s1(g.v)}</b> to <b>${s1(m.v)}</b>. ${G.n===N?'Your rule never penalized a guess, so every guess had a positive expected value and the bot answered all 100.':''}`+self;},
  again(sim){sim.p.quiz=sim.p.quiz==='review'?'hard':'review';sim.p.wrong=0;sim.p.blank=0;}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'Right +1, wrong −1, “I don’t know” 0. The bot is 60% sure of an answer. How many points does answering earn on average?',answer:0.2,tol:0.01,unit:'points',d:2,hint:'Chance right × 1, plus chance wrong × (−1).',explain:'0.6 × 1 + 0.4 × (−1) = 0.6 − 0.4 = +0.2 points. “I don’t know” earns 0, so the bot answers.'},
  {lvl:'bio',instant:true,q:'The rule is right +1, wrong 0, “I don’t know” 0. The bot is only 10% sure of an answer. What does a bot chasing points do?',choices:['It says “I don’t know”','It guesses','It skips the quiz'],correct:1,explain:'A guess earns 0.1 × 1 + 0.9 × 0 = 0.1 points on average. “I don’t know” earns 0. So the bot guesses on every question, and about 90% of those guesses are wrong.'},
  {lvl:'bio',instant:true,q:'OpenAI tested two of its models on hard fact questions (SimpleQA). One got 24% right, 75% wrong and skipped 1%. The other got 22% right, 26% wrong and skipped 52%. On a leaderboard that counts only right answers, which ranks higher?',choices:['The one that skipped 52%','The one that skipped 1%','They tie'],correct:1,explain:'Counting only accuracy, 24% beats 22%. But that model gave 75 wrong answers per 100 against 26. Scoring only accuracy rewards guessing, which is the problem OpenAI described in “Why language models hallucinate” (2025).'},
  {lvl:'honors',instant:true,q:'Rule: right +1, wrong −1, “I don’t know” 0. How sure must the bot be before answering pays off?',choices:['Any chance above 0%','More than 25%','More than 50%','More than 75%'],correct:2,explain:'(I − W)/(R − W) = (0 + 1)/(1 + 1) = 0.5. Below 50%, a guess loses points on average; above it, a guess gains.'},
  {lvl:'honors',instant:true,q:'Score those two SimpleQA results with right +1, wrong −1, skip 0. Which model scores higher?',choices:['24% right, 75% wrong','22% right, 26% wrong','They tie'],correct:1,explain:'24 − 75 = −51 and 22 − 26 = −4. Change the rule and the ranking flips: the model that abstains more often now wins by 47 points.'},
  {lvl:'ap',instant:true,q:'The old SAT gave +1 for right, −1/4 for wrong and 0 for blank, with 5 answer choices. What is the expected score of a pure random guess?',choices:['−0.25','0','+0.05','+0.2'],correct:1,explain:'(1/5)(1) + (4/5)(−1/4) = 0.2 − 0.2 = 0. Random guessing gains nothing on average, so the penalty removes the reward for blind guessing. The redesigned SAT dropped the penalty in 2016.'},
  {lvl:'ap',instant:true,q:'Rule: right +1, wrong −2, “I don’t know” +0.2. Above what confidence does the bot answer?',choices:['66.7%','73.3%','40%','20%'],correct:1,explain:'(I − W)/(R − W) = (0.2 + 2)/(1 + 2) = 2.2/3 ≈ 0.733. Partial credit for “I don’t know” raises the bar for answering.'}
 ],
 tour:[
  {title:'100 questions',text:'Each bar is one question, sorted from the one the bot is least sure about (left) to the one it is most sure about (right). Green is the chance its answer is right. Red is the chance it is wrong.',focus:sim=>sim._L?sim._L.strip:[30,60,760,250],pause:true,setup:sim=>BioLab.setValues(sim,{wrong:0,blank:0,right:1,harm:2,quiz:'review',over:false})},
  {title:'No penalty: guess on everything',text:'Right +1, wrong 0, “I don’t know” 0. A guess can only help, so the bot answers all 100, even the one it is only 7% sure of. On average: 63 right and 37 wrong.',pause:true},
  {title:'What that costs your group',text:'Say each wrong answer your group trusts costs as much as 2 right answers help. Then 63 − 2 × 37 = −11. A bot trained to guess hurts more than it helps.',focus:sim=>sim._L?sim._L.tiles:[30,330,740,110],pause:true},
  {title:'Add a penalty',text:'Make a wrong answer cost 1 point. Now a guess pays off only above 50% sure. The bot answers 70 questions: about 53.4 right and 16.6 wrong. Net help jumps to +20.1.',pause:true,setup:sim=>BioLab.setValues(sim,{wrong:-1})},
  {title:'Match the penalty to the harm',text:'Make a wrong answer cost 2 points, the same as its harm to your group. The bot answers only above 67% sure: about 41.7 right, 8.3 wrong, 50 “I don’t know.” Net help: +25.1, the most this bot can give you.',pause:true,setup:sim=>BioLab.setValues(sim,{wrong:-2})},
  {title:'Too harsh',text:'At −4 the bot answers only above 80% sure. Wrong answers fall to 3.2, but it skips questions it would usually get right. Right answers fall to 27.8 and net help drops to +21.4.',pause:true,setup:sim=>BioLab.setValues(sim,{wrong:-4})},
  {lvl:'honors',title:'The threshold formula',text:'The bot answers when p·R + (1 − p)·W > I, so p > (I − W)/(R − W). Partial credit for “I don’t know” works too: wrong −1 and “I don’t know” +0.25 give (0.25 + 1)/2 = 62.5%.',pause:true,setup:sim=>BioLab.setValues(sim,{wrong:-1,blank:0.25})},
  {lvl:'ap',title:'An overconfident bot',text:'Now the bot feels more sure than it is: 50% sure means about 33% right. The black ticks show how sure it feels. With wrong −2, net help falls from +25.1 to +12.9. The best rule now needs a steeper penalty, about −3.5, for net help of +16.4.',pause:true,setup:sim=>BioLab.setValues(sim,{wrong:-2,blank:0,over:true})}
 ],
 lab:{bio:'<p><b>Question:</b> How does the penalty for a wrong answer change what the bot does?</p><ol><li>Keep “I don’t know” at 0. Set wrong to 0, −0.5, −1, −2, −3 and −5, and record a trial each time.</li><li>Graph <b>Trials</b> with the wrong-answer points on x and right, wrong and “I don’t know” on y.</li><li>Switch to <b>Hard trivia</b> and repeat.</li></ol><p>Write one sentence: with wrong = 0, what is the expected value of a guess the bot is 10% sure of, and what does the bot do with it?</p>',
  honors:'<p><b>Question:</b> Are there different rules that make the bot act the same way?</p><ol><li>Find the threshold for wrong −1, “I don’t know” 0.</li><li>Now set “I don’t know” to 0.5. What wrong-answer points give the same threshold? Check with the tool.</li><li>Change the points for a right answer to 2 and find a rule with the same threshold again.</li></ol><p>Use (I − W)/(R − W) to explain why only the threshold matters to the bot.</p>',
  ap:'<p><b>Question:</b> How should the rule change if the bot is overconfident?</p><ol><li>With harm 2, find the best rule (most net help) with the overconfident switch off. Record the threshold.</li><li>Turn the switch on. Find the best rule again.</li></ol><p><b>CER:</b> Claim how the best threshold changes, use your data, and reason from c* = (L/(1 + L))^(1/1.6).</p>'},
 terms:[
  {t:'Hallucination',d:'A confident answer from an AI that is false. It often comes from guessing when the system is unsure.'},
  {t:'Abstain',d:'Decline to answer, for example by saying “I don’t know.”'},
  {t:'Accuracy',d:'The share of all questions answered correctly.'},
  {t:'Error rate',d:'The share of all questions answered wrongly. Skipped questions are neither right nor wrong.'},
  {t:'Expected value',d:'The average result if the same choice were made many times: p·(points if right) + (1 − p)·(points if wrong).',lvl:'honors'},
  {t:'Threshold',d:'The confidence above which answering pays off: (I − W)/(R − W).',lvl:'honors'},
  {t:'Calibration',d:'How well confidence matches reality. A calibrated bot that feels 70% sure is right 70% of the time.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> The bot sees 100 questions. On question i its confidence is c = 0.03 + 0.96·u^a with u = (i + 0.5)/100: a = 0.6 for the review sheet (average 63%) and a = 2.2 for hard trivia (average 33%). These spreads are assumptions for illustration. The bot answers when c·R + (1 − c)·W > I, the choice that earns the most points on average. Counts are expected values: the average over many runs. “Net help” assumes a right answer is worth +1 to your group and a wrong answer you trust costs the amount you pick. At Deep dive, the overconfident bot is really right c^1.6 of the time, also an assumption.</p><p><b>The real research.</b> OpenAI, “Why language models hallucinate” (September 5, 2025, <a href="https://openai.com/index/why-language-models-hallucinate/" target="_blank" rel="noopener">openai.com/index/why-language-models-hallucinate</a>), argues that standard training and evaluation reward guessing over admitting uncertainty. Its example, from SimpleQA results in the GPT-5 system card: gpt-5-thinking-mini abstained 52%, was accurate 22% and wrong 26%; o4-mini abstained 1%, was accurate 24% and wrong 75%.</p><p><b>A familiar parallel.</b> The SAT once took off a quarter point for each wrong multiple-choice answer. The redesigned SAT dropped that penalty in March 2016.</p><p><b>Working with it.</b> A chatbot can be asked to say how sure it is, or to say “I don’t know” when it is unsure. Whether its stated confidence matches how often it is right is the calibration question at Deep dive.</p>'
};
BioLab.register(SIM);
})();
