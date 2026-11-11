(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars,atLeast}=BioLab.h;
/* A project in six stages. Each stage has an AI strength and a strength the student sets for themself (0–10).
   Three plans: the AI leads every stage; you lead every stage; or the team, where whoever is stronger leads each stage.
   Plan quality = the average of the stage scores. The AI profile and every rate here are invented for illustration,
   shaped by the findings cited in About (the jagged frontier; models that sound sure but invent facts). */
const ST=[
 {id:'goal',name:'Set the goal and the rules',short:'Goal',ai:3,why:'You know the assignment, your teacher and your audience. The AI only knows what you type.'},
 {id:'src',name:'Find sources',short:'Sources',ai:7,why:'AI searches and summarizes fast, but can invent a source that looks real.'},
 {id:'draft',name:'Write a first draft',short:'Draft',ai:8,why:'Drafting fast and in many styles is where AI is strongest.'},
 {id:'check',name:'Check every claim',short:'Check',ai:3,why:'A model cannot reliably tell its own made-up facts from true ones. You can open the source.'},
 {id:'voice',name:'Make it your voice',short:'Voice',ai:3,why:'Your examples, your opinions, the way you talk: only you have them.'},
 {id:'ship',name:'Decide what ships',short:'Decide',ai:1,why:'Your name goes on it, so the call is yours. The AI has no stake in the result.'}
];
const YID=['y1','y2','y3','y4','y5','y6'];
const PL=[{id:'ai',name:'AI does it all',short:'AI all'},{id:'me',name:'I do it all',short:'Me all'},{id:'team',name:'Team: the stronger one leads each stage',short:'Team'}];
const PID=PL.map(p=>p.id);
const you=sim=>YID.map(k=>sim.p[k]);
/* who leads stage i in plan j: 'ai' or 'me' (a tie on the team goes to you) */
const lead=(sim,j,i)=>j===0?'ai':j===1?'me':(ST[i].ai>you(sim)[i]?'ai':'me');
const stageScore=(sim,j,i)=>lead(sim,j,i)==='ai'?ST[i].ai:you(sim)[i];
const avg=(sim,j)=>ST.reduce((s,x,i)=>s+stageScore(sim,j,i),0)/ST.length;
/* hours: a stage you lead takes 1 hour; a stage the AI leads takes 0.2 hours */
const hours=(sim,j)=>ST.reduce((s,x,i)=>s+(lead(sim,j,i)==='ai'?0.2:1),0);
const mine=(sim,j)=>ST.filter((x,i)=>lead(sim,j,i)==='me').length;
/* errors: if the AI writes the draft, its claims carry the AI error rate; the check stage catches 90% if you lead it, 30% if the AI checks itself */
const aiClaims=(sim,j)=>lead(sim,j,2)==='ai'?sim.p.claims:0;
const catchRate=(sim,j)=>lead(sim,j,3)==='me'?0.9:0.3;
const made=(sim,j)=>aiClaims(sim,j)*sim.p.rate/100;
const shipped=(sim,j)=>made(sim,j)*(1-catchRate(sim,j));
function bestI(sim){let b=0;for(let j=1;j<3;j++)if(avg(sim,j)>avg(sim,b)+1e-9)b=j;return b;}
const tied=sim=>{const b=bestI(sim);return PL.some((p,j)=>j!==b&&Math.abs(avg(sim,j)-avg(sim,b))<1e-9);};
const GS=sim=>sim.gutS;
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const locked=sim=>!!(GS(sim)&&GS(sim).g&&!pend(sim));
const tourOn=sim=>!!(sim.tour&&sim.tour.on);
const shownJ=(sim,j)=>!!(sim.p.show||locked(sim)||tourOn(sim)||(sim.st.done&&sim.st.done[j]));
const shownAll=sim=>[0,1,2].every(j=>shownJ(sim,j));
const n1=v=>{const r=Math.round(v*100)/100;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):(Math.round(r*10)/10===r?r.toFixed(1):r.toFixed(2))).replace('-','−');};
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
const teamLine=sim=>ST.map((x,i)=>stageScore(sim,2,i));

const SIM={
 id:'coauthor',hash:'coauthor',apUnit:3,order:2,tab:'Co-author with AI',kind:'Simulation',
 card:'You and an AI both have jagged strengths. Rate yourself on six stages of a project, then find the plan where each of you covers the other’s low spots.',
 title:'Co-author with AI: who should do what?',
 lede:{bio:'Nobody is good at everything, and neither is AI: both have jagged strengths. On a project, the question is not “Who is smarter?” but “Who should lead each stage?” Rate yourself on six stages, compare three plans by their average stage score, and see where the AI’s mistakes get caught.',
  honors:'Researchers call AI’s uneven skill a jagged frontier: excellent at some tasks, poor at others that look just as easy. Your skills are jagged too. A good team takes the higher of the two lines at each stage, and keeps the stages the AI is weakest at, like checking claims, with a person.',
  ap:'Each plan’s quality is the mean of its six stage scores; the team’s is the mean of max(you, AI) at each stage, so it can never be lower than either plan alone. Errors shipped = claims × the AI’s error rate × (1 − the share caught at the check stage).'},
 skills:{bio:'Mean and comparing values · Grade 6, Algebra 1',honors:'Mean, maximum and percent · Algebra 1',ap:'Means, expected value and products of rates · Algebra 1, Statistics'},
 scale:'Scores are 0 to 10 for how well each stage gets done. A stage you lead takes about 1 hour; one the AI leads takes about 0.2 hours. The AI’s scores, its error rate and the catch rates are invented for illustration. Your scores are yours to set. Nothing you enter leaves this page.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'Your jagged profile (rate yourself 0 to 10)',
 controls:[
  {id:'guess',label:'Your gut: which plan gives the best work?',type:'seg',def:'me',options:PL.map(p=>({v:p.id,l:p.name}))},
  {id:'y1',label:'Me: set the goal and the rules',type:'range',min:0,max:10,step:1,def:6,noGut:true,onChange:clearGut},
  {id:'y2',label:'Me: find sources',type:'range',min:0,max:10,step:1,def:5,noGut:true,onChange:clearGut},
  {id:'y3',label:'Me: write a first draft',type:'range',min:0,max:10,step:1,def:5,noGut:true,onChange:clearGut},
  {id:'y4',label:'Me: check every claim',type:'range',min:0,max:10,step:1,def:6,noGut:true,onChange:clearGut},
  {id:'y5',label:'Me: make it my voice',type:'range',min:0,max:10,step:1,def:8,noGut:true,onChange:clearGut},
  {id:'y6',label:'Me: decide what ships',type:'range',min:0,max:10,step:1,def:7,noGut:true,onChange:clearGut},
  {id:'claims',label:'Claims in the project (facts, quotes, numbers)',type:'range',min:10,max:100,step:10,def:40,lvl:'honors',noGut:true,onChange:clearGut},
  {id:'rate',label:'AI error rate on claims',type:'range',min:0,max:20,step:1,def:5,unit:'%',lvl:'ap',noGut:true,onChange:clearGut,help:'The share of the AI’s facts, quotes and citations that are wrong. It varies a lot by task.'},
  {id:'show',label:'Show the plans’ scores now',type:'toggle',def:false,noGut:true,help:'Normally the scores appear once you lock in your gut answer or compare the plans.'}
 ],
 actions:[{id:'compare',label:'Compare the plans',primary:true,run(sim){sim.st.mode='run';sim.st.j=0;sim.st.hold=0.4;sim.st.done=[false,false,false];}}],
 init(){return {mode:'idle',j:0,hold:0,t:0,done:[false,false,false]};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;
  if(st.mode==='run'){st.hold-=dt;if(st.hold<=0){st.done[st.j]=true;st.j++;st.hold=0.7;sim.infoDirty=true;if(st.j>2)st.mode='done';}}},
 metrics:[
  {id:'best',label:'Plan with the best work',text:true,get:sim=>shownAll(sim)?PL[bestI(sim)].name+(tied(sim)?' (a tie)':''):'Hidden until you lock in your gut or compare the plans'},
  {id:'team',label:'Team plan: average stage score',unit:'/10',d:2,min:0,max:10,get:sim=>shownAll(sim)?avg(sim,2):null},
  {id:'me',label:'I do it all: average stage score',unit:'/10',d:2,min:0,max:10,get:sim=>shownAll(sim)?avg(sim,1):null},
  {id:'ai',label:'AI does it all: average stage score',unit:'/10',d:2,min:0,max:10,get:sim=>shownAll(sim)?avg(sim,0):null},
  {id:'hours',label:'Team plan: hours',unit:'h',d:1,min:0,max:6,get:sim=>shownAll(sim)?hours(sim,2):null},
  {id:'yours',label:'Team plan: stages you lead',unit:'of 6',d:0,min:0,max:6,get:sim=>shownAll(sim)?mine(sim,2):null},
  {id:'errAI',label:'AI does it all: wrong claims that ship',unit:'',d:2,lvl:'honors',min:0,max:null,get:sim=>shownAll(sim)?shipped(sim,0):null},
  {id:'errTeam',label:'Team plan: wrong claims that ship',unit:'',d:2,lvl:'honors',min:0,max:null,get:sim=>shownAll(sim)?shipped(sim,2):null}
 ],
 graphs:[{id:'avg',label:'Average stage score for each plan',custom:true}],defaultGraph:'avg',
 plot(sim,ctx,box){const v=[0,1,2].map(j=>avg(sim,j)),b=bestI(sim),show=[0,1,2].map(j=>shownJ(sim,j));
  const ax=axes(ctx,box,{xmin:0,xmax:3,ymin:0,ymax:10,xl:'',yl:'Average stage score (0 to 10)',xcats:PL.map(p=>p.short)});
  bars(ctx,ax,v.map((x,j)=>show[j]?x:NaN),{colors:PL.map((p,j)=>j===b&&shownAll(sim)?PAL['rj']:PAL['s2'])});
  PL.forEach((p,j)=>{if(!show[j])txt(ctx,'?',ax.X(j+.5),ax.Y(0)-10,{s:18,w:700,c:PAL['cv-soft'],a:'center'});});},
 draw(sim,ctx,vdt,k){const st=sim.st,big=k>1.3,all=shownAll(sim),G=GS(sim),Y=you(sim),b=bestI(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the two jagged lines */
  const CX0=58,CX1=436,CY0=big?60:52,CY1=big?330:340,kk=Math.min(k,1.6);
  ctx.fillStyle=PAL['card'];rr(ctx,8,8,440,434,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  txt(ctx,'Two jagged profiles',22,30*Math.min(k,1.3),{s:13*kk,w:700});
  const X=i=>CX0+(CX1-CX0-20)*(i+0.5)/ST.length,YY=v=>CY1-(CY1-CY0)*v/10;
  ctx.strokeStyle=PAL['g-grid']||PAL['line'];ctx.lineWidth=1;
  for(let v=0;v<=10;v+=2){ctx.beginPath();ctx.moveTo(CX0,YY(v));ctx.lineTo(CX1-12,YY(v));ctx.stroke();txt(ctx,String(v),CX0-8,YY(v)+4,{s:11*Math.min(k,1.3),c:PAL['cv-soft'],a:'right'});}
  /* the team line: the higher of the two at each stage */
  if(all){const T=teamLine(sim);ctx.strokeStyle=PAL['rj'];ctx.globalAlpha=.22;ctx.lineWidth=16;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();T.forEach((v,i)=>i?ctx.lineTo(X(i),YY(v)):ctx.moveTo(X(i),YY(v)));ctx.stroke();ctx.globalAlpha=1;ctx.lineCap='butt';}
  const line=(vals,col,dash)=>{ctx.strokeStyle=col;ctx.lineWidth=3;ctx.setLineDash(dash||[]);ctx.beginPath();vals.forEach((v,i)=>i?ctx.lineTo(X(i),YY(v)):ctx.moveTo(X(i),YY(v)));ctx.stroke();ctx.setLineDash([]);
   vals.forEach((v,i)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(X(i),YY(v),5,0,7);ctx.fill();});};
  line(ST.map(s=>s.ai),PAL['s2'],[7,5]);line(Y,PAL['s4']);
  /* who leads each stage on the team */
  ST.forEach((s,i)=>{const L=wrapW(ctx,big?s.short:s.name,big?60:58,11.5*Math.min(k,1.4));L.forEach((l,j)=>txt(ctx,l,X(i),CY1+18*Math.min(k,1.3)+j*13*Math.min(k,1.4),{s:11.5*Math.min(k,1.4),w:600,a:'center'}));
   if(all){const ld=lead(sim,2,i);pill(ctx,ld==='ai'?'AI':'You',X(i),CY1+(big?50:62)*Math.min(k,1.3),ld==='ai'?PAL['s2']:PAL['s4'],'#fff',11*Math.min(k,1.3));}});
  /* legend */
  const ly=big?54:46,lx=big?262:240;ctx.strokeStyle=PAL['s4'];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+20,ly);ctx.stroke();txt(ctx,'You',lx+26,ly+4,{s:12*kk,w:700,c:PAL['s4']});
  ctx.strokeStyle=PAL['s2'];ctx.setLineDash([7,5]);ctx.beginPath();ctx.moveTo(lx+(big?90:70),ly);ctx.lineTo(lx+(big?110:90),ly);ctx.stroke();ctx.setLineDash([]);txt(ctx,'AI',lx+(big?116:96),ly+4,{s:12*kk,w:700,c:PAL['s2']});
  if(all&&!big){ctx.fillStyle=PAL['rj'];ctx.globalAlpha=.25;ctx.fillRect(lx+122,ly-5,20,10);ctx.globalAlpha=1;txt(ctx,'Team',lx+148,ly+4,{s:12,w:700,c:PAL['rj']});}
  if(!big)txt(ctx,'Each stage: who leads on the team',22,432,{s:11,c:PAL['cv-soft']});
  /* right panel: three plans */
  const PX=458,PW=332;ctx.fillStyle=PAL['card'];rr(ctx,PX,8,PW,434,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  let y=8+22*kk;txt(ctx,'Three plans',PX+14,y,{s:13*kk,w:700});y+=8*kk;
  const rowH=(big?58:86)*kk;
  PL.forEach((p,j)=>{const on=shownJ(sim,j),win=all&&j===b,top=y;
   if(win){ctx.fillStyle=PAL['rj'];ctx.globalAlpha=.1;rr(ctx,PX+8,top,PW-16,rowH-6,8);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=PAL['rj'];ctx.lineWidth=2;rr(ctx,PX+8,top,PW-16,rowH-6,8);ctx.stroke();}
   txt(ctx,big?p.short:(j===2?'Team: stronger one leads':p.name),PX+16,top+17*kk,{s:12.5*kk,w:700});
   txt(ctx,on?n1(avg(sim,j))+' / 10':'?',PX+PW-16,top+17*kk,{s:13*kk,w:700,c:win?PAL['rj']:PAL['cv-ink'],a:'right'});
   if(on){txt(ctx,`${n1(hours(sim,j))} h · you lead ${mine(sim,j)} of 6`,PX+16,top+33*kk,{s:12*kk,c:PAL['cv-soft']});
    if(!big){const m=made(sim,j);txt(ctx,aiClaims(sim,j)?`AI claims: ${sim.p.claims} × ${sim.p.rate}% = ${n1(m)} wrong · ${lead(sim,j,3)==='me'?'you check: 90% caught':'AI self-check: 30% caught'}`:'No AI-written claims',PX+16,top+49*kk,{s:11.5,c:PAL['cv-soft']});
     txt(ctx,aiClaims(sim,j)?`Wrong claims that ship: ${n1(shipped(sim,j))}`:'Wrong AI claims that ship: 0',PX+16,top+65*kk,{s:12,w:700,c:shipped(sim,j)>=1?PAL['rj']:PAL['cv-ink']});}}
   else txt(ctx,pend(sim)&&j===2?'Work out the team’s average yourself':'Not compared yet',PX+16,top+33*kk,{s:12*kk,c:PAL['cv-soft']});
   y+=rowH;});
  if(G&&G.g&&!big)txt(ctx,'Your gut: '+PL[Math.max(0,PID.indexOf(G.g.pick))].name,PX+14,430,{s:12,w:700,c:PAL['s4']});
  else if(all&&!big){const lowAI=ST.map((s,i)=>i).filter(i=>ST[i].ai<Y[i]).length;txt(ctx,`You cover ${lowAI} of the AI’s low spots.`,PX+PW/2,430,{s:12,w:700,c:PAL['cv-ink'],a:'center'});}},
 narrate(sim){const b=bestI(sim),Y=you(sim);
  if(!shownAll(sim))return 'Your line and the AI’s line are both jagged. <b>Which plan does the best work: the AI doing everything, you doing everything, or a team where the stronger one leads each stage?</b>';
  const t=avg(sim,2),m=avg(sim,1),a=avg(sim,0),aiLeads=ST.filter((s,i)=>lead(sim,2,i)==='ai').map(s=>s.short.toLowerCase());
  const err=` If the AI does it all, about ${n1(shipped(sim,0))} wrong claims ship; on the team, ${n1(shipped(sim,2))}.`;
  if(Math.abs(t-m)<1e-9)return `You match or beat the AI at every stage, so the team is the same as doing it all yourself: ${n1(m)} out of 10. Where could the AI still save you time?`+err;
  return `<b>The team scores ${n1(t)}</b>, against ${n1(m)} for you alone and ${n1(a)} for the AI alone. The AI leads ${aiLeads.join(' and ')}; you lead the rest, including checking claims and deciding what ships.`+err;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Look at the two jagged lines. Which plan will have the highest average stage score? Pick one, then lock it in.'},
  lock(sim){const b=bestI(sim),g=Math.max(0,PID.indexOf(sim.p.guess));return {v:avg(sim,b)-avg(sim,g),pick:PID[g],label:PL[g].name};},
  solve(sim){const b=bestI(sim);sim.p.guess=PID[b];sim.p.show=true;sim.st.mode='done';return {v:0,pick:PID[b],label:`${PL[b].name} (${n1(avg(sim,b))} / 10)`};},
  hint:{bio:'Lock in your gut answer. Then you will work out the team’s score yourself.'},
  calc:{unit:'out of 10',d:2,tol:0.05,
   prompt:{bio:sim=>{const Y=you(sim);return `At each stage, the team uses the higher score: you (${Y.join(', ')}) or the AI (${ST.map(s=>s.ai).join(', ')}). Stages in order: goal, sources, draft, check, voice, decide. Take the higher number at each stage, then average the six. What is the <b>team’s average</b>?`;},
    ap:sim=>{const Y=you(sim);return `Team quality = mean of max(you, AI) over the six stages. You: (${Y.join(', ')}). AI: (${ST.map(s=>s.ai).join(', ')}). What is it?`;}},
   answer:sim=>avg(sim,2),
   hint:'Write the higher of the two numbers for each stage, add the six, then divide by 6.',
   steps(sim){const T=teamLine(sim),S=T.reduce((a,b)=>a+b,0);return [`Higher at each stage: ${ST.map((s,i)=>s.short.toLowerCase()+' '+T[i]+' ('+(lead(sim,2,i)==='ai'?'AI':'you')+')').join(', ')}.`,`Sum: ${T.join(' + ')} = ${S}.`,`Average: ${S} ÷ 6 = <b>${n1(S/6)}</b>. You alone: ${n1(avg(sim,1))}. AI alone: ${n1(avg(sim,0))}.`];}},
  formula(sim){return PL.map((p,j)=>`${p.short}: (${ST.map((s,i)=>stageScore(sim,j,i)).join(' + ')}) ÷ 6 = ${n1(avg(sim,j))}`).join('<br>');},
  how:{bio:'For the team, write down the higher score at each stage, add the six, and divide by 6. Do the same with only your scores and only the AI’s to compare.',
   ap:'Team = (1/6) Σ max(yᵢ, aᵢ). Since max(yᵢ, aᵢ) ≥ yᵢ and ≥ aᵢ at every stage, the team mean is at least as high as either plan alone; it is higher exactly when the lines cross.'},
  compare(sim,g){const b=bestI(sim),gi=Math.max(0,PID.indexOf(g.pick)),K=sim.ui.calc,self=K&&K.done&&K.correct?' You worked out the team’s score yourself.':'';
   if(gi===b)return `Your gut was right: ${PL[b].name.toLowerCase()} scores ${n1(avg(sim,b))} out of 10.`+(b===2?' Two jagged lines that cross make a team stronger than either one.':'')+self;
   return `You picked <b>${PL[gi].name.toLowerCase()}</b> (${n1(avg(sim,gi))}). <b>${PL[b].name}</b> scores ${n1(avg(sim,b))}.`+(gi===0?' The AI’s low spots, like checking claims and deciding what ships, pull its average down.':'')+self;},
  again(sim){const R=()=>Math.floor(Math.random()*9)+2;YID.forEach(k=>sim.p[k]=R());sim.p.guess='me';sim.p.show=false;sim.st.mode='idle';sim.st.done=[false,false,false];}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'Your scores: goal 6, sources 5, draft 5, check 6, voice 8, decide 7. The AI’s: 3, 7, 8, 3, 3, 1. What is the team’s average if the stronger one leads each stage?',answer:7,tol:0.05,unit:'out of 10',d:2,hint:'Higher at each stage: 6, 7, 8, 6, 8, 7.',explain:'6 + 7 + 8 + 6 + 8 + 7 = 42, and 42 ÷ 6 = 7. You alone average 37 ÷ 6 ≈ 6.17, and the AI alone 25 ÷ 6 ≈ 4.17.'},
  {lvl:'bio',instant:true,q:'Which stage should stay with a person even when the AI writes most of the draft?',choices:['Making a first draft','Checking every claim against a real source','Rewording a paragraph'],correct:1,explain:'A model can state a made-up fact or citation in the same confident tone as a true one. In 2023, lawyers in Mata v. Avianca were fined $5,000 after filing a brief with court cases ChatGPT had invented. A person opening the sources would have caught them.'},
  {lvl:'bio',instant:true,q:'Your line and the AI’s line cross: each is higher at some stages. What does that mean for the team?',choices:['The team is no better than the stronger partner','The team beats both, because each covers the other’s low spots','The team is the average of the two'],correct:1,explain:'The team takes the higher score at every stage. Where the lines cross, that is higher than either line alone somewhere, so the team’s average beats both.'},
  {lvl:'honors',kind:'num',q:'The AI writes 40 claims and 5% are wrong. You check them all and catch 90%. How many wrong claims are expected to ship?',answer:0.2,tol:0.02,unit:'claims',d:2,hint:'40 × 0.05 × (1 − 0.9).',explain:'40 × 0.05 = 2 wrong claims made. 90% caught leaves 10%: 2 × 0.1 = 0.2. If the AI checks itself and catches 30%, 2 × 0.7 = 1.4 ship.'},
  {lvl:'honors',instant:true,q:'In a 2023 study of 758 BCG consultants, those using GPT-4 did better on tasks inside AI’s frontier. On a task outside it, they were 19 percentage points less likely to get it right than consultants without AI. What does that suggest?',choices:['Never use AI','Use AI everywhere','Know which stages are AI’s low spots, and lead those yourself'],correct:2,explain:'The same tool helped on some tasks and hurt on another. The skill is knowing where the AI’s line dips, which is what the team plan does stage by stage.'},
  {lvl:'ap',kind:'num',q:'An AI writes 60 claims with an 8% error rate. The team catches 85% at the check stage. What is the expected number of wrong claims that ship?',answer:0.72,tol:0.02,unit:'claims',d:2,hint:'60 × 0.08 × 0.15.',explain:'60 × 0.08 = 4.8 wrong claims made. 4.8 × 0.15 = 0.72 expected to ship: less than one, but not zero, so it still pays to check the most important claims twice.'},
  {lvl:'ap',instant:true,q:'Your score is at least the AI’s at every stage. What is the team’s average compared with yours?',choices:['Higher','Exactly the same','Lower'],correct:1,explain:'max(yᵢ, aᵢ) = yᵢ at every stage, so the team mean equals your mean. The AI could still save time, since an AI-led stage takes 0.2 hours instead of 1.'}
 ],
 tour:[
  {title:'Two jagged lines',text:'The orange line is you: a typical student’s self-ratings on six stages of a project. The dashed blue line is the AI: strong at drafting and finding sources, weak at checking claims and at knowing what you and your teacher need.',pause:true,setup:sim=>{BioLab.setValues(sim,{y1:6,y2:5,y3:5,y4:6,y5:8,y6:7,claims:40,rate:5,show:false});sim.st.mode='idle';},focus:[8,8,440,434]},
  {title:'Three plans',text:'The AI could do everything, you could do everything, or you could be a team: the stronger one leads each stage. Which gives the best work?',pause:true,focus:[458,8,332,300]},
  {title:'The team wins',text:'The team takes the higher score at each stage: 6, 7, 8, 6, 8, 7, an average of 7 out of 10. You alone average about 6.2, the AI alone about 4.2. The AI leads sources and the draft; you lead everything else.',pause:true,setup:sim=>{sim.st.mode='done';sim.p.show=true;}},
  {title:'Where mistakes get caught',text:'The AI’s draft has 40 claims, and about 5% are wrong: 2 mistakes. If the AI checks itself, about 1.4 ship. When you check every claim, about 0.2 do. Checking is a person’s job because a model cannot reliably tell its made-up facts from real ones.',pause:true,focus:[458,8,332,300]},
  {lvl:'honors',title:'Your line is yours',text:'Move your sliders to match how you really work. If you are a strong writer, the team may give you the draft too. The point is not who is smarter; it is covering each other’s low spots.',pause:true,setup:sim=>{BioLab.setValues(sim,{y3:9});sim.p.show=true;}}
 ],
 onTourExit(sim){sim.p.show=false;},
 lab:{bio:'<p><b>Question:</b> When does working with AI beat working alone?</p><ol><li>Set the sliders to your honest rating of yourself at each stage. Press <b>Compare the plans</b> and record a trial.</li><li>Raise one of your low stages to 9 and record again. Then lower one of your high stages to 2 and record again.</li><li>Note which stages the AI leads each time.</li></ol><p>Write one sentence: which stages should you lead no matter what, and why?</p>',
  honors:'<p><b>Question:</b> How much does the check stage matter?</p><ol><li>Record a trial with your own ratings.</li><li>Set your “check every claim” score to 2 so the AI checks itself on the team. Record the wrong claims that ship.</li><li>Set it back and raise the number of claims to 100.</li></ol><p>Explain how the number of claims and who checks them change the mistakes that ship.</p>',
  ap:'<p><b>Question:</b> What AI error rate makes checking worth an extra hour?</p><ol><li>Record the wrong claims that ship on the team and with the AI doing it all, at error rates of 2%, 5%, 10% and 20%.</li><li>Write each as claims × rate × (1 − catch rate).</li></ol><p><b>CER:</b> A wrong claim in a published project costs you more than an hour of checking. Using your table, at what error rate would you check every claim yourself?</p>'},
 terms:[
  {t:'Jagged frontier',d:'The uneven line between tasks AI does well and tasks it does badly, even when they look equally hard.'},
  {t:'Co-intelligence',d:'Working with AI as a partner: you each do what you are better at, and you stay in charge of the goal and the final call.'},
  {t:'Human in the loop',d:'A person checks and decides at the key steps, instead of letting the AI’s output go straight out.'},
  {t:'Hallucination',d:'A confident but false statement from an AI model, such as a made-up fact, quote or source.'},
  {t:'Centaur and cyborg',d:'Two ways to work with AI from the BCG study: centaurs split tasks between person and AI; cyborgs weave the two together within a task.',lvl:'honors'},
  {t:'Expected value',d:'The average outcome over many tries: claims × error rate × (1 − catch rate) gives the expected number of mistakes that ship.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Six stages, each scored 0 to 10 for you (your sliders) and for the AI (fixed, invented values). The AI plan uses the AI’s score at every stage, your plan uses yours, and the team uses the higher one, with ties going to you. A stage you lead takes 1 hour and one the AI leads takes 0.2 hours. If the AI writes the draft, its claims carry its error rate; the check stage catches 90% when you lead it and 30% when the AI checks itself. All of these rates are illustrative.</p><p><b>The jagged frontier.</b> Fabrizio Dell’Acqua and colleagues, “Navigating the Jagged Technological Frontier,” Harvard Business School working paper 24-013 (2023): 758 Boston Consulting Group consultants. On tasks inside AI’s frontier, those using GPT-4 finished 12.2% more tasks, 25.1% faster, with more than 40% higher quality. On a task outside it, they were 19 percentage points less likely to get the right answer. The authors describe “centaurs,” who split work between themselves and the AI, and “cyborgs,” who weave the two together.</p><p><b>Co-intelligence.</b> Ethan Mollick, <i>Co-Intelligence: Living and Working with AI</i> (2024), proposes working rules including “be the human in the loop” and “assume this is the worst AI you will ever use.”</p><p><b>When nobody checked.</b> In <i>Mata v. Avianca</i> (U.S. District Court, S.D.N.Y., June 2023), two lawyers and their firm were ordered to pay a $5,000 penalty after filing a brief that cited court decisions ChatGPT had made up.</p><p><b>How this tool was built.</b> A teacher and an AI made it together the same way: the teacher set the goal and the standard, the AI drafted and tested, and the teacher checked the results and decided what went live.</p>'
};
function wrapW(ctx,s,maxW,size){ctx.font='600 '+size+'px '+FONT;const words=s.split(' '),out=[];let line='';words.forEach(w=>{const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=w;}else line=t;});if(line)out.push(line);return out;}
BioLab.register(SIM);
})();
