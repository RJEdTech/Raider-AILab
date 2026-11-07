(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,atLeast}=BioLab.h;
/* Three students practice the same skill for 10 sessions, then take an exam with no AI.
   Skill s runs 0 to 1. Each session: practice score is what the student gets right that day (with any help),
   then skill grows by s += r * e * (1 - s), where e is the share of real effort (tries made before seeing an answer).
   Defaults are calibrated so the averages land near Bastani et al. (PNAS 2025). The curve shapes are an illustration. */
const N=10,S0=0.20,GBONUS=0.3;
const MODES=[{k:'none',l:'No AI',c:'s2'},{k:'ans',l:'AI that gives answers',c:'s1'},{k:'tut',l:'AI tutor (hints only)',c:'s3'}];
const SH={none:'No AI',ans:'AI answers',tut:'AI tutor'};
function par(sim){const ap=atLeast('ap');return {c:sim.p.copy/100,h:atLeast('honors')?sim.p.hint/100:0.7,r:ap?sim.p.rate:0.05,skip:ap?sim.p.skip:0.5};}
function effort(mode,P){if(mode==='none')return 1;if(mode==='ans')return 1-P.c;return ((1-P.c)+P.skip*P.c)*(1+GBONUS*P.h);}
function run(mode,P){let s=S0;const prac=[],skill=[s];const e=effort(mode,P);
 for(let n=0;n<N;n++){const p=mode==='none'?s:mode==='ans'?P.c+(1-P.c)*s:s+P.h*(1-s);prac.push(100*p);s=s+P.r*Math.min(e,1/P.r)*(1-s);skill.push(s);}
 const avg=prac.reduce((a,b)=>a+b,0)/N;return {prac,skill,avg,exam:100*s,e};}
function model(sim){const P=par(sim);const o={P};MODES.forEach(m=>o[m.k]=run(m.k,P));return o;}
const GS=sim=>(sim.tour&&sim.tour.on)?null:sim.gutS;
/* while the student works out the copier's first session ("Your turn"), the exam bars stay hidden */
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const shown=sim=>!!(sim.p.reveal||(sim.st&&sim.st.peek)||(GS(sim)&&GS(sim).g&&!pend(sim)));
/* "Your turn": the answer-AI student's skill after session 1, in % */
const s1Ans=sim=>{const P=par(sim),e=1-P.c;return 100*(S0+P.r*e*(1-S0));};
const p2=v=>(Math.round(v*100)/100).toString(),rs=v=>(+v.toFixed(3)).toString();
const r0=v=>Math.round(v),f1=v=>(Math.round(v*10)/10).toFixed(1);
const rel=(a,b)=>{const x=Math.round((a/b-1)*100);return (x>0?'+':x<0?'−':'')+Math.abs(x)+'%';};
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}

const SIM={
 id:'learnwith',hash:'learnwith',apUnit:3,order:2,tab:'Learn with it, not from it',kind:'Simulation',
 skills:{bio:'Closing a fixed share of a gap, session after session (a recursive sequence) · Algebra 2 (sequences)',honors:'Recursive sequences: s ← s + r·e·(1 − s), and percent change · Algebra 2 (sequences)',ap:'Recursive and explicit formulas, s₁₀ = 1 − (1 − s₀)(1 − r·e)¹⁰ · Algebra 2 (sequences, exponential functions)'},
 card:'Three students practice the same math skill: no AI, AI that gives answers, or an AI tutor. Predict who does best on the test without AI.',
 title:'Learn with AI, not from it',
 lede:{bio:'Three students practice the same skill for 10 sessions, then take a test with no AI allowed. The math: each session closes a fixed share of the gap between a student’s skill and 100%, and only real tries count. An AI that hands over answers raises practice scores, but a copied answer is not a try.',
  honors:'Practice scores measure what you can do with help. The exam measures what you can do alone. Change how often the student copies and how good the tutor’s hints are, and watch the two scores split apart.',
  ap:'Each session, skill grows by s ← s + r·e·(1 − s), where e is the share of real effort: tries made before seeing an answer. The defaults are calibrated to a field experiment with about 1,000 high school students.'},
 scale:'One student, 10 practice sessions on one skill, then one exam without AI. Scores are percent correct. The defaults match a real study’s averages; the curve shapes are an illustration.',
 aspect:16/9,timeless:true,trials:true,graph:false,
 controlsTitle:'The student',
 controls:[
  {id:'gAns',label:'Your gut: exam score for the student who used AI answers',type:'range',min:0,max:100,step:1,def:60,unit:''},
  {id:'gTut',label:'Your gut: exam score for the student who used the AI tutor',type:'range',min:0,max:100,step:1,def:60,unit:''},
  {id:'copy',label:'How often the student copies instead of trying first',type:'range',min:0,max:100,step:1,def:32,unit:'%',noGut:true,onChange:clearGut,help:'With the answer AI, copying means reading the answer before trying. The tutor never hands over answers, so a student who would copy jumps straight to hints instead.'},
  {id:'hint',label:'Hint quality: how often a hint gets the student unstuck',type:'range',min:0,max:100,step:5,def:70,unit:'%',lvl:'honors',noGut:true,onChange:clearGut,help:'A good hint points to the next step without giving it away. Better hints raise tutor practice scores and add a little learning from the feedback.'},
  {id:'rate',label:'Learning rate r: how much one full session of real effort closes the gap',type:'range',min:0.02,max:0.12,step:0.005,def:0.05,unit:'',lvl:'ap',noGut:true,onChange:clearGut},
  {id:'skip',label:'Effort credit when the student skips to hints (tutor still makes them do each step)',type:'range',min:0,max:1,step:0.05,def:0.5,unit:'',lvl:'ap',noGut:true,onChange:clearGut},
  {id:'reveal',label:'Show the exam scores now',type:'toggle',def:false,noGut:true,help:'Normally the exam scores appear once you lock in your gut answer.'}
 ],
 init(){return {peek:0};},step(){},
 metrics:[
  {id:'pNone',label:'Practice average: no AI',unit:'%',d:1,min:0,max:100,get:sim=>model(sim).none.avg},
  {id:'pAns',label:'Practice average: AI answers',unit:'%',d:1,min:0,max:100,get:sim=>model(sim).ans.avg},
  {id:'pTut',label:'Practice average: AI tutor',unit:'%',d:1,min:0,max:100,get:sim=>model(sim).tut.avg},
  {id:'eNone',label:'Exam: no AI',unit:'%',d:1,min:0,max:100,get:sim=>model(sim).none.exam},
  {id:'eAns',label:'Exam: AI answers',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?model(sim).ans.exam:null},
  {id:'gapc',label:'Share of the gap closed each session',text:true,get:sim=>{const P=model(sim).P;if(pend(sim))return 'Hidden until you check your calculation.';return `No AI: ${p2(100*P.r)}%. AI answers: ${p2(100*P.r)}% × ${p2(1-P.c)} = ${p2(100*P.r*(1-P.c))}%.`;}},
  {id:'eTut',label:'Exam: AI tutor',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?model(sim).tut.exam:null},
  {id:'off',label:'Your gut is off by (both guesses)',unit:'points',d:1,min:0,max:200,get:sim=>{if(!shown(sim))return null;const M=model(sim);return Math.abs(sim.p.gAns-M.ans.exam)+Math.abs(sim.p.gTut-M.tut.exam);}},
  {id:'study',label:'Compared with no AI (the study reported practice +48% and +127%, exam −17% and about the same)',text:true,lvl:'honors',get:sim=>{const M=model(sim);return `AI answers: practice ${rel(M.ans.avg,M.none.avg)}, exam `+(shown(sim)?rel(M.ans.exam,M.none.exam):'?')+`. AI tutor: practice ${rel(M.tut.avg,M.none.avg)}, exam `+(shown(sim)?rel(M.tut.exam,M.none.exam):'?')+'.';}},
  {id:'eff',label:'Effort e per session',text:true,lvl:'ap',get:sim=>{const M=model(sim),P=M.P;return `No AI: e = 1. AI answers: e = 1 − ${P.c.toFixed(2)} = ${M.ans.e.toFixed(2)}. Tutor: e = (${(1-P.c).toFixed(2)} + ${P.skip.toFixed(2)} × ${P.c.toFixed(2)}) × (1 + ${GBONUS} × ${P.h.toFixed(2)}) = ${M.tut.e.toFixed(3)}.`;}}
 ],
 draw(sim,ctx,vdt,k){const M=model(sim),show=shown(sim),G=GS(sim),big=k>1.3;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  ctx.fillStyle=PAL['cv-bg2'];ctx.fillRect(536,0,264,450);
  /* practice chart */
  const L=58,T=Math.max(78,46*k+24),W=big?384:420,H=378-T,X=i=>L+(i)*(W/(N-1)),Y=v=>T+H-v/100*H;
  txt(ctx,big?'Practice scores':'Practice scores, with any help allowed',L-40,26*k,{s:14*k,w:700});
  /* legend */
  let lx=L-40;const ly=26*k+20*k;MODES.forEach(m=>{const lab=big?SH[m.k]:m.l;ctx.font='600 '+(12*k)+'px '+FONT;const w=ctx.measureText(lab).width;ctx.strokeStyle=PAL[m.c];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(lx,ly-4*k);ctx.lineTo(lx+18,ly-4*k);ctx.stroke();txt(ctx,lab,lx+24,ly,{s:12*k,w:600,c:PAL['cv-ink']});lx+=w+24+18*k;});
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;for(let v=0;v<=100;v+=25){ctx.beginPath();ctx.moveTo(L,Y(v));ctx.lineTo(L+W,Y(v));ctx.stroke();txt(ctx,String(v),L-8,Y(v)+4*k,{s:12*k,c:PAL['cv-soft'],a:'right'});}
  for(let i=0;i<N;i+=(big?3:1))txt(ctx,String(i+1),X(i),T+H+18*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  if(big)txt(ctx,'10',X(N-1),T+H+18*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  txt(ctx,'Practice session',L+W/2,T+H+38*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  MODES.forEach(m=>{const pr=M[m.k].prac;ctx.strokeStyle=PAL[m.c];ctx.lineWidth=3;ctx.beginPath();pr.forEach((v,i)=>{i?ctx.lineTo(X(i),Y(v)):ctx.moveTo(X(i),Y(v));});ctx.stroke();
   ctx.fillStyle=PAL[m.c];pr.forEach((v,i)=>{ctx.beginPath();ctx.arc(X(i),Y(v),3.5,0,7);ctx.fill();});});
  /* end-of-line values, pushed apart so they never overlap */
  const ends=MODES.map(m=>({y:Y(M[m.k].prac[N-1]),v:M[m.k].prac[N-1],c:PAL[m.c]})).sort((a,b)=>a.y-b.y);const gap=16*k;
  for(let i=1;i<ends.length;i++)if(ends[i].y-ends[i-1].y<gap)ends[i].y=ends[i-1].y+gap;
  ends.forEach(e=>txt(ctx,r0(e.v)+'%',L+W+8,e.y+4*k,{s:12*k,w:700,c:e.c}));
  /* exam panel */
  const bx0=556,bw=big?66:58,bg=big?14:26,BT=96,BH=270,BY=v=>BT+BH-v/100*BH;
  txt(ctx,big?'Exam, no AI':'The exam: no AI allowed',668,26*k,{s:14*k,w:700,a:'center'});
  txt(ctx,big?'faded = practice avg':'Faded bar = practice average',668,26*k+18*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx0-6,BY(0));ctx.lineTo(792,BY(0));ctx.stroke();
  MODES.forEach((m,i)=>{const x=bx0+i*(bw+bg),R=M[m.k],col=PAL[m.c],vis=m.k==='none'||show;
   ctx.globalAlpha=.22;ctx.fillStyle=col;ctx.fillRect(x,BY(R.avg),bw,BY(0)-BY(R.avg));ctx.globalAlpha=1;
   if(vis){ctx.fillStyle=col;ctx.fillRect(x+8,BY(R.exam),bw-16,BY(0)-BY(R.exam));txt(ctx,f1(R.exam),x+bw/2,BY(R.exam)-8,{s:14*k,w:700,c:PAL['cv-ink'],a:'center'});}
   else txt(ctx,'?',x+bw/2,BY(R.avg)-10*k,{s:20*k,w:700,c:col,a:'center'});
   txt(ctx,big?['None','Ans.','Tutor'][i]:['No AI','Answers','Tutor'][i],x+bw/2,BY(0)+18*k,{s:12*k,w:600,c:PAL['cv-ink'],a:'center'});
   /* gut ticks */
   if(G&&G.g&&m.k!=='none'){const gv=m.k==='ans'?G.g.gAns:G.g.gTut;ctx.strokeStyle=PAL['s4'];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-2,BY(gv));ctx.lineTo(x+bw+2,BY(gv));ctx.stroke();}});
  if(G&&G.g)txt(ctx,big?'Gold line = gut':'Gold line = your gut',668,BY(0)+40*k,{s:12*k,w:700,c:PAL['s4'],a:'center'});
  else if(!show)txt(ctx,big?'Lock in to see':'Lock in your gut to see',668,BY(0)+40*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  if(show&&!big){const re=M.P.r*M.ans.e;txt(ctx,'AI answers: 1 − 0.80 × '+(1-re).toFixed(3)+'¹⁰ = '+(M.ans.exam/100).toFixed(3),668,BY(0)+60*k,{s:12*k,w:700,c:PAL['s1'],a:'center'});}},
 narrate(sim){const M=model(sim),P=M.P,show=shown(sim);
  if(pend(sim))return `Your guesses are locked. <b>Before the exam scores appear,</b> work out the answer-AI student’s skill after one session.`;
  if(!show)return `With answers on tap, the copier’s practice average is ${f1(M.ans.avg)}%, against ${f1(M.none.avg)}% for the student with no AI. <b>Practice scores count help. The exam does not.</b> Predict the two hidden exam scores.`;
  const dA=M.ans.exam-M.none.exam,dT=M.tut.exam-M.none.exam;
  if(P.c<0.005)return `This student always tries first, so the answer AI changes nothing: everyone gets the full practice. <b>In this model, skill grows only from the tries a student makes.</b>`;
  let s=`The answer-AI student copied ${r0(P.c*100)}% of the time, so only ${r0(M.ans.e*100)}% of the practice built skill: exam ${f1(M.ans.exam)} against ${f1(M.none.exam)} with no AI. `;
  s+=dT>=-0.5?`<b>The tutor kept the learning</b> (exam ${f1(M.tut.exam)}) because it makes the student do the steps.`:`<b>Even the tutor falls behind here</b> (exam ${f1(M.tut.exam)}): weak hints and skipping straight to them cut the real effort.`;return s;},
 gut:{better:'lower',controls:['gAns','gTut'],
  ask:{bio:'The student with no AI scores 52 on the exam (the solid blue bar). Drag the two sliders here to predict the exam scores of the student who used AI answers and the one who used the AI tutor. Then lock it in.',
   honors:'The no-AI student’s exam score is the solid bar on the picture. Set your gut exam scores for the other two students, then lock them in.'},
  lock(sim){return {v:Math.abs(sim.p.gAns-model(sim).ans.exam)+Math.abs(sim.p.gTut-model(sim).tut.exam),gAns:sim.p.gAns,gTut:sim.p.gTut,label:`AI answers ${r0(sim.p.gAns)}, AI tutor ${r0(sim.p.gTut)}`};},
  solve(sim){const M=model(sim);sim.p.gAns=M.ans.exam;sim.p.gTut=M.tut.exam;return {v:0,gAns:M.ans.exam,gTut:M.tut.exam,label:`AI answers ${f1(M.ans.exam)}, AI tutor ${f1(M.tut.exam)}`};},
  hint:{bio:'Lock in your two guesses. Then you will work out one session of learning by hand.'},
  calc:{unit:'%',d:2,tol:0.1,
   prompt:{bio:sim=>{const P=par(sim);return `The student using AI answers starts at <b>20%</b> skill. A session of full effort closes <b>${p2(100*P.r)}%</b> of the gap between their skill and 100%. They copy <b>${r0(100*P.c)}%</b> of the time, so only ${p2(1-P.c)} of each session is real effort. What is their skill after session 1, in %?`;},
    ap:sim=>{const P=par(sim);return `Use s ← s + r·e·(1 − s) with s₀ = 0.20, r = ${rs(P.r)} and copy rate ${p2(P.c)} (so e = 1 − copy rate). What is the answer-AI student’s skill after session 1, in %?`;}},
   answer:s1Ans,
   hint:'First find the gap: 100% − 20%. Then take the share of it that one session closes, and add that to 20%.',
   steps(sim){const P=par(sim),e=1-P.c,sh=P.r*e,add=sh*80;
    return [`The gap to mastery: 100% − 20% = 80%.`,`Share of the gap closed this session: ${rs(P.r)} × ${p2(e)} = ${(+sh.toFixed(4))}.`,`Skill gained: ${(+sh.toFixed(4))} × 80% = ${(+add.toFixed(2))}%. New skill: 20% + ${(+add.toFixed(2))}% = <b>${(+s1Ans(sim).toFixed(2))}%</b>.`,`Without copying, the same session would add ${rs(P.r)} × 1 × 80% = ${(+(100*P.r*0.8).toFixed(2))}%, reaching ${(+(20+100*P.r*0.8).toFixed(2))}%.`];}},
  formula(sim){const M=model(sim),P=M.P,re=P.r*M.ans.e;
   const one=`Session 1: 0.20 + ${rs(P.r)} × ${p2(M.ans.e)} × 0.80 = ${(S0+re*(1-S0)).toFixed(4)}`;
   const ten=`After 10 sessions: s₁₀ = 1 − 0.80 × (1 − ${(+re.toFixed(4))})¹⁰ = ${(M.ans.exam/100).toFixed(3)}, so the exam is ${f1(M.ans.exam)}. No AI: 1 − 0.80 × (1 − ${rs(P.r)})¹⁰ = ${(M.none.exam/100).toFixed(3)}.`;
   return one+'<br>'+ten;},
  how:{bio:'The model gives each student credit for learning only on the problems they really tried. Copying an answer scores a point in practice but skips the thinking, so it builds no skill. The tutor never hands over answers, so the student still does the work.',
   ap:'Exam = 100·s₁₀, where s₀ = 0.20 and each session s ← s + r·e·(1 − s). Answer AI: e = 1 − copy rate. Tutor: e = (tries first + skip credit × skips) × (1 + 0.3 × hint quality).'},
  compare(sim,g,m){const M=model(sim),offA=Math.abs(g.gAns-m.gAns),offT=Math.abs(g.gTut-m.gTut),drop=M.none.exam-M.ans.exam,lift=M.ans.avg-M.none.avg;
   let s='';
   if(offA<4&&offT<4)s=`Your gut was right on, within ${r0(offA)} and ${r0(offT)} points. You already sense that practice with answers is not the same as learning. `;
   else s=`Your gut was off by <b>${r0(offA)} points</b> for the answer-AI student and <b>${r0(offT)} points</b> for the tutor student. `;
   if(drop>0.5)s+=`The answer-AI student practiced <b>${r0(lift)} points higher</b> than the no-AI student, then scored <b>${r0(drop)} points lower</b> on the exam (${f1(M.ans.exam)} vs. ${f1(M.none.exam)}). `;
   else s+=`With copying this low, the answer AI barely hurts: the exam is ${f1(M.ans.exam)} vs. ${f1(M.none.exam)}. `;
   if(M.P.c>0.005)s+=`Copying ${r0(100*M.P.c)}% of the time cut the share of the gap closed each session from ${p2(100*M.P.r)}% to ${p2(100*M.P.r*M.ans.e)}%. `;
   s+=M.tut.exam>=M.none.exam-0.5?`The tutor student scored ${f1(M.tut.exam)}: with hints instead of answers, the effort e stayed at ${M.tut.e.toFixed(2)}.`:`The tutor student scored ${f1(M.tut.exam)}: with these hints and this much skipping, the effort e fell to ${M.tut.e.toFixed(2)}.`;
   const K=sim.ui&&sim.ui.calc;if(K&&K.done&&K.correct)s+=' You also worked out one session of learning yourself.';return s;},
  again(sim){const R=a=>a[Math.floor(Math.random()*a.length)];sim.p.copy=R([10,20,32,45,60,75,90]);sim.p.hint=R([30,50,70,85,100]);sim.p.gAns=60;sim.p.gTut=60;sim.p.reveal=false;}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'A student who never copies starts at 20% skill. Each session of full effort closes 5% of the gap between their skill and 100%. What is their skill after one session, in %?',answer:24,tol:0.1,unit:'%',d:1,hint:'The gap is 100% − 20%. Find 5% of it and add that to 20%.',explain:'The gap is 80%. 5% of 80% is 0.05 × 80 = 4. So skill goes from 20% to 24%. The next session closes 5% of a smaller gap (76%), so it adds a little less: 3.8.'},
  {lvl:'bio',instant:true,q:'During practice, the student using AI answers averages about 53% and the student with no AI about 36%. Who scores higher on the exam, where AI is not allowed?',choices:['The AI-answers student','The no-AI student','They tie'],correct:1,explain:'With the defaults, the no-AI student scores 52.1 and the AI-answers student 43.4, about 17% lower. The copied answers raised practice scores without closing any of the gap.'},
  {lvl:'bio',instant:true,q:'Set copying to 0%: the student always tries first and only then looks at the AI’s answer. What happens to the AI-answers student’s exam score?',choices:['It matches the no-AI student’s exam score','It drops even lower','It goes to 100'],correct:0,explain:'With no copying, effort e = 1, the same as the no-AI student, so each session closes the same 5% of the gap. The exam matches: 52.1.'},
  {lvl:'honors',kind:'num',q:'The copier (32% copying, r = 0.05) has skill 22.72% after session 1. What is their skill after session 2, in %?',answer:25.35,tol:0.05,unit:'%',d:2,hint:'Same rule as before, but the gap is now 100% − 22.72%.',explain:'The gap is 77.28%. Each session closes 0.05 × 0.68 = 3.4% of it: 0.034 × 77.28 = 2.63. 22.72 + 2.63 = 25.35%.'},
  {lvl:'honors',instant:true,q:'A teacher looks only at practice scores to judge which study method works. With the defaults, which method looks best, and which is best on the exam?',choices:['The tutor looks best and is best','AI answers looks better than no AI in practice, but does worse on the exam','All three look the same'],correct:1,explain:'Practice: AI answers 53 vs. no AI 36. Exam: 43.4 vs. 52.1. A score earned with help measures the student plus the help, so it can rise while learning falls.'},
  {lvl:'honors',instant:true,q:'Raise hint quality from 70% to 100% and drop copying to 0%. What happens to the tutor student’s exam score compared with no AI?',choices:['It falls below no AI','It rises above no AI','It stays exactly equal'],correct:1,explain:'Every try counts fully and good hints add learning from feedback: e = 1 × (1 + 0.3 × 1.0) = 1.3, and the exam rises to about 59.2, against 52.1 with no AI.'},
  {lvl:'ap',kind:'num',q:'The copier closes 0.05 × 0.68 = 3.4% of the gap each session, starting from s₀ = 0.20. The no-AI student reaches 52.1% after 10 sessions. How many whole sessions does the copier need to reach 52.1%?',answer:15,tol:0,unit:'sessions',d:0,hint:'Solve 1 − 0.80 × 0.966ⁿ ≥ 0.521 with logarithms, then round up.',explain:'0.966ⁿ ≤ 0.479 ÷ 0.80 = 0.599. n ≥ ln(0.599) ÷ ln(0.966) ≈ 14.8, so 15 sessions: half again as much practice for the same skill.'},
  {lvl:'ap',instant:true,q:'With copy 32%, hint quality 70% and skip credit 0.5, what is the tutor student’s effort e?',choices:['0.68','0.84','about 1.02','1.30'],correct:2,explain:'e = (0.68 + 0.5 × 0.32) × (1 + 0.3 × 0.7) = 0.84 × 1.21 = 1.0164. Just above 1, so the tutor student learns about as fast as the no-AI student.'}
 ],
 tour:[
  {title:'Three students, one skill',text:'Three students practice the same math skill for 10 sessions. One uses no AI. One uses an AI that gives answers. One uses an AI tutor that gives hints and makes them try. Each starts at 20% correct.',focus:[0,0,536,450],pause:true,setup:sim=>{sim.st.peek=0;BioLab.setValues(sim,{reveal:false});}},
  {title:'No AI: slow and steady',text:'The blue line climbs from 20% to about 50% as the student practices. Every problem is a real try, so all of it builds skill.',focus:[0,0,536,450],pause:true,setup:sim=>{sim.st.peek=0;}},
  {title:'AI answers: practice soars',text:'The red line starts higher right away. This student copies about a third of the time, and every copied answer counts as correct, so the practice average is about 53%, nearly 50% higher than with no AI.',focus:[0,0,536,450],pause:true,setup:sim=>{sim.st.peek=0;}},
  {title:'AI tutor: help without answers',text:'The green line is highest: a hint gets the student unstuck 70% of the time, so practice averages about 81%. But the tutor never gives the answer, so the student still does each step.',focus:[0,0,536,450],pause:true,setup:sim=>{sim.st.peek=0;}},
  {title:'The exam: no AI allowed',text:'Now the AI is gone. No AI: 52. AI answers: 43, about 17% lower, even though that student practiced far higher than the no-AI student. AI tutor: 52.5, about the same as no AI.',focus:[536,0,264,450],pause:true,setup:sim=>{sim.st.peek=1;}},
  {title:'Why practice lied',text:'Practice scores count you plus the help. The exam counts only you. Skill grows only from the problems you really try, and copying skips the try.',pause:true,setup:sim=>{sim.st.peek=1;}},
  {lvl:'honors',title:'Better hints, no copying',text:'Give the tutor 100% hint quality and have the student always try first. Now the tutor student scores about 59 on the exam, above the no-AI student’s 52. A well-designed tutor can add learning.',pause:true,setup:sim=>{sim.st.peek=1;BioLab.setValues(sim,{hint:100,copy:0});}},
  {lvl:'honors',title:'The model',text:'Each session s ← s + r·e·(1 − s). With r = 0.05 and e = 0.68 for the copier, the gap to mastery closes only 3.4% a session instead of 5%. Over 10 sessions that adds up to a 17% lower exam.',pause:true,setup:sim=>{sim.st.peek=1;BioLab.setValues(sim,{hint:70,copy:32});}}
 ],
 onTourExit(sim){sim.st.peek=0;},
 lab:{bio:'<p><b>Question:</b> How much copying does it take to hurt the exam?</p><ol><li>Turn on <b>Show the exam scores now</b>.</li><li>Set copying to 0%, 20%, 40%, 60% and 80%. Record a trial at each.</li><li>For each, write down the AI-answers student’s practice average and exam score.</li></ol><p>Write one sentence: what happens to practice and exam scores as copying goes up?</p>',
  honors:'<p><b>Question:</b> When does a tutor beat practicing alone?</p><ol><li>Show the exam scores. Set copying to 32%.</li><li>Record the tutor student’s exam at hint quality 30%, 50%, 70%, 85% and 100%.</li><li>Repeat with copying at 0%.</li></ol><p>Find the hint quality where the tutor student first matches the no-AI student. Explain why copying moves that point.</p>',
  ap:'<p><b>Question:</b> How does a small effort gap grow over 10 sessions?</p><ol><li>Show the exam scores. Record the exam for each mode at r = 0.03, 0.05, 0.08 and 0.12.</li><li>Use s₁₀ = 1 − (1 − s₀)(1 − r·e)¹⁰ to check one value by hand.</li></ol><p><b>CER:</b> Claim how the learning rate changes the cost of copying, with evidence from your table and reasoning from the formula.</p>'},
 terms:[
  {t:'Practice score',d:'The share of practice problems you get right, with whatever help you used.'},
  {t:'Retrieval practice',d:'Trying to recall or solve something before you look at the answer. It builds memory better than rereading.'},
  {t:'Field experiment',d:'A study run in a real setting (here, real classrooms) where groups get different treatments, so you can compare what happened.',lvl:'honors'},
  {t:'Guardrail',d:'A limit built into a tool. The study’s tutor version was built to give hints instead of answers.',lvl:'honors'},
  {t:'Diminishing returns',d:'Each step of effort closes a fixed share of the remaining gap, so gains shrink as you get closer to mastery: s ← s + r·e·(1 − s).',lvl:'ap'}
 ],
 about:'<p><b>The study.</b> Bastani and colleagues (PNAS, 2025, “Generative AI without guardrails can harm learning”) ran a field experiment with about 1,000 high school math students in Turkey. During practice, grades rose 48% with a plain GPT-4 interface (GPT Base) and 127% with a tutor version designed to protect learning (GPT Tutor). On the exam after access was removed, GPT Base students did 17% worse than students who never had AI, while GPT Tutor largely removed that harm. Source: <a href="https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education" target="_blank" rel="noopener">Knowledge at Wharton</a>.</p><p>A separate randomized trial with 194 Harvard physics students (Kestin and colleagues, Scientific Reports, 2025) found learning gains more than double those of an in-class active-learning session, with a carefully designed AI tutor. Source: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/" target="_blank" rel="noopener">PMC</a>.</p><p><b>The model.</b> Skill starts at s₀ = 0.20. Each session, practice score = s with no AI, copy rate + (1 − copy rate)·s with AI answers (copied answers are counted as right, though real AI answers are sometimes wrong), and s + hint quality·(1 − s) with the tutor. Then s ← s + r·e·(1 − s). Effort e is 1 with no AI, 1 − copy rate with AI answers, and (tries first + skip credit × skips) × (1 + 0.3 × hint quality) with the tutor. The exam is 100·s after 10 sessions.</p><p><b>What is real and what is illustration.</b> The defaults (copy 32%, hint quality 70%, r = 0.05, skip credit 0.5, the 0.3 feedback bonus) were chosen so the model’s averages land near the study’s: practice +49% and +126%, exam −17% and about the same. The study reported averages, not these curves. The curve shapes, the starting skill and every setting are assumptions for illustration. Real students differ, and real learning depends on sleep, interest, the teacher and much more.</p>'
};
BioLab.register(SIM);
})();
