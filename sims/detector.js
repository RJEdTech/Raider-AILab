(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,atLeast}=BioLab.h;
/* A school of 1,700 students. Each essay is AI-written with chance a; the detector flags AI essays with chance d (detection rate)
   and human-written essays with chance f (false positive rate). Optional second group: non-native English writers with their own f. */
const NS=1700;
const nnOn=sim=>!!sim.p.nn;
const nnShare=sim=>nnOn(sim)?(atLeast('honors')?sim.p.nnShare:10)/100:0;
const nnF=sim=>(atLeast('honors')?sim.p.nnFpr:19)/100;
function groups(sim){const a=sim.p.ai/100,d=sim.p.det/100,k=sim.p.essays,s=nnShare(sim);
 const G=[{id:'nat',n:NS*(1-s),f:sim.p.fpr/100}];if(s>0)G.push({id:'nn',n:NS*s,f:nnF(sim)});
 return G.map(g=>{const E=g.n*k;return Object.assign(g,{E,TP:E*a*d,FN:E*a*(1-d),FP:E*(1-a)*g.f,TN:E*(1-a)*(1-g.f),stu:g.n*(1-Math.pow(1-(1-a)*g.f,k))});});}
function tot(sim){const G=groups(sim),T={E:0,TP:0,FN:0,FP:0,TN:0,stu:0};G.forEach(g=>{for(const x in T)T[x]+=g[x];});T.G=G;T.ppv=T.TP/(T.TP+T.FP);return T;}
const GS=sim=>(sim.tour&&sim.tour.on)?null:sim.gutS;
const shown=sim=>!!(sim.p.reveal||(sim.st&&sim.st.peek>=3)||(GS(sim)&&GS(sim).g));
const peekLv=sim=>shown(sim)?3:((sim.st&&sim.st.peek)||0);
const n0=v=>Math.round(v).toLocaleString('en-US'),f1=v=>(Math.round(v*10)/10).toFixed(1),pct=v=>(v*100).toFixed(1)+'%';
const cp=v=>(Math.round(v*10)/10).toString()+'%';
const oneIn=x=>{const r=NS/Math.max(x,1e-9);return r<5?Math.round(100*x/NS)+'% of students':'about 1 in '+n0(r);};
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}

const SIM={
 id:'detector',hash:'detector',apUnit:3,order:3,tab:'Detector check',kind:'Simulation',
 card:'An AI-writing detector checks every essay in a 1,700-student school. Guess how many honest students get flagged, then count them.',
 title:'The AI detector flagged an essay. Was it really AI?',
 lede:{bio:'A detector that is “99% accurate” sounds like it never makes mistakes. Run it on every essay in a big school and even a small error rate lands on real students who wrote their own work.',
  honors:'The chance a flagged essay is really AI depends on how common AI writing is, the detection rate and the false positive rate. For writers the detector misjudges more often, a flag means much less.',
  ap:'Positive predictive value: PPV = d·a / (d·a + f·(1 − a)), for AI share a, detection rate d and false positive rate f. The same algebra as a medical screening test.'},
 scale:'A school of about 1,700 students, every essay in one semester. Counts are expected values, rounded to whole essays or students. Detector settings are illustrative, not the specs of a real product.',
 aspect:16/9,timeless:true,trials:true,graph:false,
 controlsTitle:'The school and the detector',
 controls:[
  {id:'guess',label:'Your gut: honest students wrongly flagged in one semester',type:'range',min:0,max:400,step:1,def:10,unit:' students'},
  {id:'ai',label:'Share of essays really written by AI',type:'range',min:1,max:40,step:1,def:5,unit:'%',noGut:true,onChange:clearGut,help:'Nobody knows the true share at a given school. 5% is an assumption for illustration.'},
  {id:'fpr',label:'False positive rate: human-written essays the detector flags',type:'range',min:0.1,max:10,step:0.1,def:1,unit:'%',noGut:true,onChange:clearGut,help:'Turnitin reported a document-level rate under 1% for documents with at least 20% AI writing (June 2023).'},
  {id:'det',label:'Detection rate: AI-written essays the detector catches',type:'range',min:50,max:99,step:1,def:90,unit:'%',noGut:true,onChange:clearGut,help:'An assumption for illustration. Light editing or rewording can lower it.'},
  {id:'essays',label:'Essays each student turns in per semester',type:'range',min:1,max:10,step:1,def:4,unit:'',noGut:true,onChange:clearGut},
  {id:'nn',label:'Include non-native English writers, whom detectors flag more often',type:'toggle',def:false,noGut:true,onChange:clearGut,help:'In a Stanford study, seven detectors flagged 61% of non-native speakers’ essays as AI on average; all seven agreed on about 19%.'},
  {id:'nnShare',label:'Share of students who are non-native English writers',type:'range',min:1,max:40,step:1,def:10,unit:'%',lvl:'honors',noGut:true,onChange:clearGut,help:'An assumption for illustration, not RJ data.'},
  {id:'nnFpr',label:'False positive rate for non-native writers',type:'range',min:1,max:65,step:1,def:19,unit:'%',lvl:'honors',noGut:true,onChange:clearGut,help:'19% matches the essays all seven detectors flagged in the Stanford study; the average detector flagged 61%.'},
  {id:'reveal',label:'Show the counts now',type:'toggle',def:false,noGut:true,help:'Normally the counts appear once you lock in your gut answer.'}
 ],
 init(){return {peek:0};},step(){},
 metrics:[
  {id:'stu',label:'Honest students wrongly flagged at least once',unit:'students',d:0,min:0,max:600,get:sim=>shown(sim)?tot(sim).stu:null},
  {id:'fp',label:'Human-written essays flagged',unit:'essays',d:0,min:0,max:2000,get:sim=>shown(sim)?tot(sim).FP:null},
  {id:'tp',label:'AI-written essays caught',unit:'essays',d:0,min:0,max:3000,get:sim=>shown(sim)?tot(sim).TP:null},
  {id:'ppv',label:'Chance a flagged essay is really AI',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?100*tot(sim).ppv:null},
  {id:'ppvNN',label:'Same chance, for a non-native writer’s essay',unit:'%',d:1,lvl:'honors',min:0,max:100,get:sim=>{if(!shown(sim)||!nnOn(sim))return null;const g=tot(sim).G[1];return 100*g.TP/(g.TP+g.FP);}},
  {id:'nnPart',label:'Wrongly flagged students who are non-native writers',unit:'%',d:1,lvl:'honors',min:0,max:100,get:sim=>{if(!shown(sim)||!nnOn(sim))return null;const T=tot(sim);return 100*T.G[1].stu/T.stu;}},
  {id:'off',label:'Your gut is off by',unit:'students',d:0,min:0,max:400,get:sim=>shown(sim)?Math.abs(sim.p.guess-tot(sim).stu):null},
  {id:'ppvf',label:'Positive predictive value',text:true,lvl:'ap',get:sim=>{const a=sim.p.ai/100,d=sim.p.det/100,f=sim.p.fpr/100,num=d*a,den=num+f*(1-a);return `PPV = (${d.toFixed(2)} × ${a.toFixed(2)}) / (${d.toFixed(2)} × ${a.toFixed(2)} + ${(+f.toFixed(4))} × ${(1-a).toFixed(2)}) = ${num.toFixed(4)} / ${den.toFixed(4)} = ${(num/den).toFixed(3)}`+(nnOn(sim)?` for native writers. For non-native writers (f = ${nnF(sim).toFixed(2)}): ${(num/(num+nnF(sim)*(1-a))).toFixed(3)}.`:'.');}}
 ],
 draw(sim,ctx,vdt,k){const T=tot(sim),lv=peekLv(sim),G=GS(sim),big=k>1.3,nn=nnOn(sim),q='?';
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  ctx.fillStyle=PAL['cv-bg2'];ctx.fillRect(408,0,392,450);
  const AI=PAL['s1'],HU=PAL['s2'],NN=PAL['s6'];
  /* confusion matrix */
  txt(ctx,big?n0(T.E)+' essays':'Every essay this semester: '+n0(T.E),20,28*k,{s:14*k,w:700});
  txt(ctx,big?NS.toLocaleString('en-US')+' students × '+sim.p.essays:NS.toLocaleString('en-US')+' students × '+sim.p.essays+' essays each',20,28*k+18*k,{s:12*k,c:PAL['cv-soft']});
  const cx=[20,big?150:180,big?275:300],cy=big?[148,196,244,286]:[110,165,225,282],cw=big?120:110;
  const cell=(i,j,s,col,b,sz)=>txt(ctx,s,i?cx[i]+cw/2:cx[0],cy[j],{s:(sz||(j===0||i===0?13:16))*k,w:b?700:400,c:col||PAL['cv-ink'],a:i?'center':'left'});
  cell(1,0,'Flagged',PAL['s4'],1);cell(2,0,big?'Not flagged':'Not flagged',null,1);
  cell(0,1,big?'Really AI':'Really AI-written',AI,1,big?12:13);cell(0,2,big?'Wrote it':'Student wrote it',HU,1,big?12:13);
  if(!big){txt(ctx,n0(T.E*sim.p.ai/100)+' essays',cx[0],cy[1]+18*k,{s:12*k,c:PAL['cv-soft']});txt(ctx,n0(T.E*(1-sim.p.ai/100))+' essays',cx[0],cy[2]+18*k,{s:12*k,c:PAL['cv-soft']});}
  cell(1,1,lv>=1?n0(T.TP):q,AI,1);cell(2,1,lv>=1?n0(T.FN):q);
  cell(1,2,lv>=2?n0(T.FP):q,HU,1);cell(2,2,lv>=2?n0(T.TN):q);
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;[cy[0]+16*k,cy[1]+30*k].forEach(y=>{ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(396,y);ctx.stroke();});
  ctx.strokeStyle=PAL['s4'];ctx.lineWidth=2.5;rr(ctx,cx[1]+6,cy[0]-24*k,cw-12,cy[2]-cy[0]+44*k,8);ctx.stroke();
  if(lv>=2&&nn){const g=T.G[1];txt(ctx,(big?'Non-native: '+n0(g.FP)+' false flags':'Non-native writers: '+n0(g.FP)+' of '+n0(T.FP)+' false flags'),20,cy[2]+44*k,{s:12*k,c:NN,w:700});}
  /* students line */
  const sy=cy[3]+(big?40:(nn&&lv>=2?44:34))*k;
  if(lv>=3){txt(ctx,big?'Students wrongly flagged:':'Honest students wrongly flagged at least once:',20,sy,{s:13*k,w:700});
   pill(ctx,n0(T.stu)+(big?' students':' students, '+oneIn(T.stu)),big?20+80*k:20+150*k,sy+26*k,PAL['rj'],'#fff',13*Math.min(k,1.4));}
  else txt(ctx,big?'Lock in your gut to see':'How many honest students? Lock in your gut to see.',20,sy,{s:12*k,c:PAL['cv-soft']});
  if(G&&G.g)txt(ctx,(big?'Gut: ':'Your gut: ')+Math.round(G.g.guess)+' students',20,436,{s:12*k,w:700,c:PAL['s4']});
  /* waffle of every flagged essay */
  const ft=T.TP+T.FP,U=[1,2,5,10,20,50].find(u=>ft/u<=300)||50,na=Math.round(T.TP/U),nh=Math.round((T.G[0].FP)/U),nnn=nn?Math.round(T.G[1].FP/U):0,n=na+nh+nnn;
  const cols=20,rows=Math.max(1,Math.ceil(n/cols)),sz=Math.min(17,Math.floor((big?170:290)/rows)),gx=424,gy=big?96:90;
  txt(ctx,(big?'Flagged: ':'Every flagged essay: ')+(lv>=1?n0(ft):q),gx,28*k,{s:14*k,w:700});
  txt(ctx,U===1?'Each square is 1 essay':`Each square is ${U} essays`,gx,28*k+18*k,{s:12*k,c:PAL['cv-soft']});
  if(lv>=1)for(let i=0;i<n;i++){const r=Math.floor(i/cols),c=i%cols,x=gx+c*(sz+1),y=gy+r*(sz+1);
   if(lv>=3){ctx.fillStyle=i<na?AI:i<na+nh?HU:NN;}else{ctx.fillStyle=PAL['s4'];ctx.globalAlpha=.7;}ctx.fillRect(x,y,sz,sz);ctx.globalAlpha=1;}
  const by=Math.min(gy+rows*(sz+1)+24*k,big?372:392);
  if(lv>=3){const items=[[AI,(big?'AI: ':'really AI: ')+n0(T.TP)],[HU,(big?'False: ':'wrote it, flagged anyway: ')+n0(T.G[0].FP)]];if(nn)items.push([NN,(big?'Non-native: ':'non-native writer, wrote it: ')+n0(T.G[1].FP)]);
   items.forEach(([c,l],i)=>{const yy=by+i*18*k;ctx.fillStyle=c;ctx.fillRect(gx,yy-11*k,12*k,12*k);txt(ctx,l,gx+18*k,yy,{s:12*k,w:700,c:PAL['cv-ink']});});
   pill(ctx,(big?'Really AI: ':'Flagged essays really AI: ')+pct(T.ppv),big?640:600,436-6*k,PAL['rj'],'#fff',13*Math.min(k,1.4));}
  else if(lv>=1)txt(ctx,big?'Which are really AI?':'Which flagged essays are really AI? Lock in to see.',gx,by,{s:12*k,c:PAL['cv-soft']});
  else txt(ctx,big?'Lock in to see':'Lock in your gut to see the flagged essays.',gx,gy+20*k,{s:12*k,c:PAL['cv-soft']});},
 narrate(sim){const T=tot(sim);
  if(!shown(sim))return `${sim.p.ai}% of ${n0(T.E)} essays are really AI-written. The detector catches ${sim.p.det}% of them and wrongly flags ${cp(sim.p.fpr)} of human-written ones${nnOn(sim)?', and more for non-native writers':''}. <b>How many honest students end up flagged?</b>`;
  let s=`${n0(T.stu)} students who wrote their own essay get flagged at least once this semester, ${oneIn(T.stu)}. `;
  if(nnOn(sim)){const g=T.G[1];s+=`Non-native writers are ${Math.round(nnShare(sim)*100)}% of students but ${Math.round(100*g.stu/T.stu)}% of the wrongly flagged, and a flag on their essay is really AI only ${pct(g.TP/(g.TP+g.FP))} of the time. `;}
  s+=T.ppv<0.5?`<b>Most flags are false alarms here:</b> only ${pct(T.ppv)} of flagged essays are really AI.`:`<b>A flag is a reason for a conversation, not a verdict:</b> ${pct(1-T.ppv)} of flagged essays were written by the student.`;return s;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'The detector wrongly flags only a small share of human-written essays (1% to start). Across 1,700 students turning in several essays each, how many honest students do you think get flagged at least once this semester? Drag the slider here, then lock it in.',
   honors:'Before you build the table: drag the slider here to your gut number of honest students wrongly flagged this semester, then lock it in.'},
  lock(sim){return {v:Math.abs(sim.p.guess-tot(sim).stu),guess:sim.p.guess,label:`${Math.round(sim.p.guess)} students`};},
  solve(sim){const s=tot(sim).stu;sim.p.guess=s;return {v:0,guess:s,label:`about ${n0(s)} students`};},
  how:{bio:'Count essays, not percents. Find how many essays the students wrote themselves, then take the false positive rate of that. For students: the chance one student gets at least one false flag is 1 minus the chance every one of their essays is cleared.',
   honors:'Build a two-way table of essays: really AI or not, flagged or not. Wrongly flagged students = students × [1 − (1 − (1 − a)·f)^k] for k essays each.',
   ap:'P(at least one false flag) = 1 − (1 − (1 − a)f)^k, assuming each essay is judged independently. PPV = d·a / (d·a + f·(1 − a)).'},
  compare(sim,g,m){const T=tot(sim),off=Math.abs(g.guess-m.guess);
   let s=off<Math.max(3,0.1*m.guess)?`Your gut was right on, within ${n0(off)} students. `:`Your gut said ${n0(g.guess)}; the count is <b>about ${n0(m.guess)}</b>. `;
   s+=`That is about ${n0(m.guess)} students (${oneIn(m.guess)}) asked to explain an essay they really wrote. `;
   if(nnOn(sim))s+=`${n0(T.G[1].stu)} of them are non-native English writers. `;
   s+=`And ${pct(1-T.ppv)} of all flagged essays were written by the student. A flag is a reason for a conversation, not a verdict.`;return s;},
  again(sim){const R=a=>a[Math.floor(Math.random()*a.length)];sim.p.ai=R([2,5,10,20]);sim.p.fpr=R([0.5,1,2,4]);sim.p.det=R([70,80,90,95]);sim.p.essays=R([2,4,6,8]);sim.p.guess=10;sim.p.reveal=false;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'A detector wrongly flags 1% of human-written essays. 1,700 students turn in 4 essays each, and 95% of essays are written by the students. About how many human-written essays get flagged this semester?',choices:['None: 1% is basically never','About 6','About 65','About 650'],correct:2,explain:'1,700 × 4 = 6,800 essays. 95% of them, 6,460, are human-written. 1% of 6,460 is about 65 false flags in one semester.'},
  {lvl:'bio',instant:true,q:'Now only 1% of essays are really AI-written. The detector still catches 90% of AI essays and wrongly flags 1% of human ones. When an essay is flagged, how often is it really AI?',choices:['About 99% of the time','About 90% of the time','Less than half the time, about 48%'],correct:2,explain:'Of 6,800 essays, 68 are AI and 61 of them get caught. Of 6,732 human essays, 1% (67) get flagged. 61 of 129 flags is about 48%. When AI writing is rare, false flags can outnumber real ones.'},
  {lvl:'bio',instant:true,q:'For non-native English writers, the detector wrongly flags 19% of human-written essays. If 5% of their essays are AI and it catches 90%, how often is a flag on one of their essays really AI?',choices:['About 90%','About 50%','About 20%'],correct:2,explain:'Per 100 essays: 5 are AI and 4.5 get caught; 95 are human and 18.05 get flagged. 4.5 ÷ (4.5 + 18.05) ≈ 20%. Four out of five flags on their essays are false.'},
  {lvl:'honors',instant:true,q:'In the Stanford study, why did detectors flag non-native speakers’ essays so often?',choices:['Those students used AI more','Detectors key on low perplexity, so simpler, more predictable wording looks machine-like','The essays were longer'],correct:1,explain:'Perplexity measures how surprising the next word is to a language model. Writers with a smaller English vocabulary often choose common, predictable words, which scores as low perplexity, the same signal detectors use for AI text.'},
  {lvl:'honors',instant:true,q:'Turnitin reported a sentence-level false positive rate of about 4%. A student writes a 25-sentence essay entirely on their own. If each sentence were judged independently, what is the chance at least one sentence gets highlighted as AI?',choices:['About 4%','About 25%','About 64%','100%'],correct:2,explain:'P(no sentence flagged) = 0.96²⁵ ≈ 0.36, so P(at least one) ≈ 64%. Real sentences are not independent, but the lesson holds: small per-sentence rates add up across a whole essay.'},
  {lvl:'ap',instant:true,q:'AI share 10%, detection rate 90%, false positive rate 2%. What is the positive predictive value?',choices:['90%','About 83%','98%','About 50%'],correct:1,explain:'PPV = (0.90 × 0.10) / (0.90 × 0.10 + 0.02 × 0.90) = 0.090 / 0.108 ≈ 0.833.'},
  {lvl:'ap',instant:true,q:'This model treats each essay as judged independently. In reality, a writer’s style is similar from essay to essay. How does that change the picture?',choices:['It makes no difference','False flags pile up on the same students: fewer different students flagged, but some flagged again and again','Every student gets flagged at least once'],correct:1,explain:'If one student’s style triggers the detector, it will tend to do so on each essay. Repeat flags on the same writer then say more about their style than about AI use, so a second flag is weaker evidence than it looks.'}
 ],
 tour:[
  {title:'Every essay in a school',text:'1,700 students each turn in 4 essays this semester: 6,800 essays. Say 5% are really AI-written: 340 essays. The other 6,460 the students wrote themselves.',focus:[0,0,408,300],pause:true,setup:sim=>{sim.st.peek=0;BioLab.setValues(sim,{ai:5,fpr:1,det:90,essays:4,nn:false,reveal:false});}},
  {title:'Catching AI',text:'The detector catches 90% of AI-written essays: 306 flagged, 34 missed.',focus:[0,60,408,140],pause:true,setup:sim=>{sim.st.peek=1;}},
  {title:'False flags',text:'It also flags 1% of the 6,460 human-written essays. That sounds tiny, but it is about 65 essays the students really wrote.',focus:[0,120,408,140],pause:true,setup:sim=>{sim.st.peek=2;}},
  {title:'Every flagged essay',text:'306 real catches plus 65 false flags: 371 flags. 82.6% are really AI, so about 1 flag in 6 lands on a student who did their own work.',focus:[408,0,392,450],pause:true,setup:sim=>{sim.st.peek=3;}},
  {title:'Students, not essays',text:'Each student turns in 4 essays, so the chances add up: about 64 students, roughly 1 in 27, get flagged at least once for work they wrote. That is about one student per class of 27.',pause:true,setup:sim=>{sim.st.peek=3;}},
  {title:'Non-native English writers',text:'Now say 10% of students are non-native English writers, and the detector wrongly flags 19% of their essays. They are 10% of students but about 62% of the wrongly flagged. A flag on one of their essays is really AI only about 20% of the time.',pause:true,setup:sim=>{sim.st.peek=3;BioLab.setValues(sim,{nn:true});}},
  {lvl:'honors',title:'Why simpler writing gets flagged',text:'Detectors key on low perplexity: wording a language model finds predictable. Simpler, more common word choices look machine-like, so writers still building their English vocabulary get flagged more.',pause:true,setup:sim=>{sim.st.peek=3;}},
  {lvl:'ap',title:'Positive predictive value',text:'PPV = d·a / (d·a + f·(1 − a)) = 0.90 × 0.05 / (0.90 × 0.05 + 0.01 × 0.95) = 0.045 / 0.0545 ≈ 82.6% for native writers. With f = 0.19 it falls to 0.045 / 0.2255 ≈ 20%.',pause:true,setup:sim=>{sim.st.peek=3;}}
 ],
 onTourExit(sim){sim.st.peek=0;},
 lab:{bio:'<p><b>Question:</b> How does a “small” false positive rate play out in a whole school?</p><ol><li>Turn on <b>Show the counts now</b>.</li><li>Record a trial at false positive rates of 0.5%, 1%, 2% and 4%.</li><li>For each, write down the honest students wrongly flagged and the chance a flagged essay is really AI.</li></ol><p>Write one sentence: what should a teacher do when an essay is flagged?</p>',
  honors:'<p><b>Question:</b> Who carries the false flags?</p><ol><li>Show the counts and include non-native English writers.</li><li>Record the share of wrongly flagged students who are non-native writers at non-native false positive rates of 5%, 19%, 40% and 61%.</li><li>Record the chance a flagged essay is really AI for each group.</li></ol><p>Explain why a detector that is “near-perfect” for one group can be unfair to another.</p>',
  ap:'<p><b>Question:</b> How does the share of AI writing change what a flag means?</p><ol><li>Hold d = 90% and f = 1%. Record PPV at AI shares of 1%, 2%, 5%, 10%, 20% and 40%.</li><li>Check two of them with the PPV formula.</li></ol><p><b>CER:</b> Claim when a detector flag is strong evidence, with evidence from your table and reasoning from Bayes’ rule. Compare with the rapid test tool in Raider MathLab.</p>'},
 terms:[
  {t:'False positive',d:'A flag on an essay the student really wrote.'},
  {t:'Detection rate',d:'The share of AI-written essays the detector catches. Also called sensitivity or the true positive rate.'},
  {t:'Base rate',d:'How common something is before any test. Here, the share of essays really written by AI.'},
  {t:'Confusion matrix',d:'A two-way table of counts: really AI or not, flagged or not.',lvl:'honors'},
  {t:'Perplexity',d:'How surprising each next word is to a language model. Low perplexity means predictable wording, which detectors treat as a sign of AI.',lvl:'honors'},
  {t:'Positive predictive value (PPV)',d:'The chance a flagged essay really is AI-written: true flags ÷ all flags.',lvl:'honors'},
  {t:'Independence',d:'Two results are independent when one tells you nothing about the other. Essays by the same writer are probably not independent.',lvl:'ap'}
 ],
 about:'<p><b>The research.</b> Liang, Zou and colleagues at Stanford (2023) tested seven AI-writing detectors. They were near-perfect on US 8th-graders’ essays but classified 61.22% of non-native English speakers’ TOEFL essays as AI-generated, and all seven flagged about 19% of them. The detectors key on low perplexity, so simpler wording looks machine-like. Source: <a href="https://hai.stanford.edu/news/ai-detectors-biased-against-non-native-english-writers" target="_blank" rel="noopener">Stanford HAI</a>. Turnitin reported (June 2023) a document-level false positive rate under 1% for documents with at least 20% AI writing, and about 4% at the sentence level.</p><p><b>The model.</b> Each essay is AI-written with chance a, and is judged on its own. The detector flags AI essays with chance d and human-written essays with chance f (a separate f for non-native writers when that group is on). Wrongly flagged students = students × [1 − (1 − (1 − a)·f)^k] for k essays each. Counts are expected values. The AI share, detection rate, group size and essays per student are assumptions for illustration, not data from RJ or from any detector company. In reality a writer’s style repeats from essay to essay, so false flags tend to land on the same students again and again.</p><p><b>What a flag means.</b> A flag is a reason for a conversation, not a verdict. If you are ever flagged, ask to talk it through, and keep your drafts and notes: they show how your work came together.</p><p>Same math, different setting: <a href="https://rjedtech.github.io/Raider-MathLab/#rapidtest" target="_blank" rel="noopener">Is the positive real?</a> in Raider MathLab works through a positive home test with the same table.</p>'
};
BioLab.register(SIM);
})();
