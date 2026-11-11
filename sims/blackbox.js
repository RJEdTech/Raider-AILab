(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars,atLeast}=BioLab.h;
/* A store screens summer-job applicants with a vendor's score: score = a·(skills test) + b·(months worked) − c·(miles from the store).
   The weights come from what the model was trained on. Applicants, weights and training stories are invented for illustration;
   the patterns are real (see About): Amazon's résumé model, Xerox and commute distance, Houston's secret teacher scores. */
const A=[
 {id:'you',name:'You',t:9,m:6,d:7},
 {id:'ana',name:'Ana',t:6,m:12,d:1},
 {id:'ben',name:'Ben',t:7,m:3,d:2},
 {id:'cam',name:'Cam',t:5,m:9,d:0.5},
 {id:'dee',name:'Dee',t:8,m:4,d:8}
];
const TR={
 store:{name:'Past hires at this store',w:[4,1,3],story:'5 years of who managers hired. Most hires lived close by, so living close became part of the score.'},
 perf:{name:'Last year’s best workers',w:[5,1,0],story:'Ratings of how well last year’s workers did the job. Distance did not predict doing the job well.'},
 nomiles:{name:'Past hires, distance removed',w:[4,1,0],story:'The same past hires, with miles taken out of the model, the way Xerox removed commute distance from its hiring model.'}
};
const SPOTS=2;
const W=sim=>TR[sim.p.train].w;
const score=(sim,a)=>{const w=W(sim);return w[0]*a.t+w[1]*a.m-w[2]*a.d;};
/* rank by score; ties go to the higher skills test */
const ranked=sim=>A.map((a,i)=>({a,i,s:score(sim,a)})).sort((x,y)=>y.s-x.s||y.a.t-x.a.t);
const rankOf=(sim,i)=>ranked(sim).findIndex(r=>r.i===i)+1;
const youIn=sim=>rankOf(sim,0)<=SPOTS;
const cutoff=sim=>ranked(sim)[SPOTS-1].s;
const GS=sim=>sim.gutS;
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const locked=sim=>!!(GS(sim)&&GS(sim).g&&!pend(sim));
const tourOn=sim=>!!(sim.tour&&sim.tour.on);
const shown=sim=>!!(sim.p.show||locked(sim)||tourOn(sim)||sim.st.scored);
const open=sim=>sim.p.box==='open';
const n1=v=>{const r=Math.round(v*10)/10;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):r.toFixed(1)).replace('-','−');};
const sgn=v=>(v<0?'− ':'+ ')+n1(Math.abs(v));
function clearGut(sim){sim.st.appeal=false;if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
const formula=sim=>{const w=W(sim);return `${w[0]} × test + ${w[1]} × months`+(w[2]?` − ${w[2]} × miles`:'');};
const line=(sim,a)=>{const w=W(sim);return `${w[0]} × ${a.t} + ${w[1]} × ${a.m}`+(w[2]?` − ${w[2]} × ${a.d}`:'')+` = ${n1(score(sim,a))}`;};
function wrap(ctx,s,maxW,size,w){ctx.font=(w||400)+' '+size+'px '+FONT;const words=s.split(' ');const out=[];let l='';
 words.forEach(wd=>{const t=l?l+' '+wd:wd;if(ctx.measureText(t).width>maxW&&l){out.push(l);l=wd;}else l=t;});if(l)out.push(l);return out;}

const SIM={
 id:'blackbox',hash:'blackbox',apUnit:2,order:6,tab:'Can you see why?',kind:'Simulation',
 card:'A store ranks job applicants with a secret score. Find out how what it was trained on decides who gets an interview, and what changes when you can see inside.',
 title:'Can you see why? Training data, black boxes and appeals',
 lede:{bio:'A store uses a computer score to pick who gets a summer-job interview. You only see the result. Inside, the score is a weighted sum: weight × test score + weight × months worked − weight × miles from the store. The weights came from whatever the model was trained on. Change the training, open or close the box, and see what an applicant can and cannot find out.',
  honors:'A model trained on past decisions learns to repeat them, including patterns nobody meant to choose, like living close to the store. When the formula and the training data are a trade secret, an applicant cannot find the mistake, so they cannot appeal it.',
  ap:'With score S = a·t + b·m − c·d, an applicant beats a rival when the difference in their weighted features is positive. Training sets a, b and c; a large c turns distance into a proxy for neighborhood, and only an open model lets you show that.'},
 skills:{bio:'Evaluating weighted sums and ranking · Algebra 1',honors:'Weighted sums and inequalities · Algebra 1',ap:'Linear models, proxies and break-even weights · Algebra 1, Algebra 2'},
 scale:'Skills test is 0 to 10, experience is months worked, and distance is miles from the store. Two applicants get interviews; a tie goes to the higher test score. The applicants, weights and training stories are invented for illustration. Nothing you enter leaves this page.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The model',
 controls:[
  {id:'guess',label:'Your gut: do you get an interview?',type:'seg',def:'in',options:[{v:'in',l:'Yes, an interview'},{v:'out',l:'No interview'}]},
  {id:'train',label:'What the model was trained on',type:'seg',def:'store',options:Object.keys(TR).map(k=>({v:k,l:TR[k].name})),noGut:true,onChange:clearGut},
  {id:'box',label:'Can applicants see inside?',type:'seg',def:'closed',options:[{v:'closed',l:'Closed: a trade secret'},{v:'open',l:'Open: anyone can check'}],noGut:true,onChange:sim=>{sim.st.appeal=false;}},
  {id:'show',label:'Show the result now',type:'toggle',def:false,noGut:true,help:'Normally the result appears once you lock in your gut answer or score the applicants.'}
 ],
 actions:[{id:'score',label:'Score the applicants',primary:true,run(sim){sim.st.scored=true;sim.st.grow=0;sim.st.appeal=false;}},
  {id:'appeal',label:'Appeal your result',run(sim){sim.st.scored=true;sim.st.appeal=true;}}],
 init(){return {scored:false,grow:1,appeal:false,t:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.grow<1)st.grow=Math.min(1,st.grow+dt/1.2);},
 metrics:[
  {id:'result',label:'Your result',text:true,get:sim=>shown(sim)?(youIn(sim)?'Interview':'No interview'):'Hidden until you lock in your gut or score the applicants'},
  {id:'rank',label:'Your rank (of 5)',unit:'',d:0,min:1,max:5,get:sim=>shown(sim)&&open(sim)?rankOf(sim,0):null},
  {id:'yours',label:'Your score',unit:'pts',d:1,max:null,get:sim=>shown(sim)&&open(sim)?score(sim,A[0]):null},
  {id:'cut',label:'Score you needed (2nd place)',unit:'pts',d:1,max:null,get:sim=>shown(sim)&&open(sim)?cutoff(sim):null},
  {id:'miles',label:'Points distance cost you',unit:'pts',d:1,lvl:'honors',min:0,max:null,get:sim=>shown(sim)&&open(sim)?W(sim)[2]*A[0].d:null},
  {id:'reason',label:'What the applicant is told',text:true,get:sim=>!shown(sim)?'Nothing yet':open(sim)?'The formula, the training data and every score':'Only the result. The method is a trade secret.'}
 ],
 graphs:[{id:'scores',label:'Score for each applicant',custom:true}],defaultGraph:'scores',
 plot(sim,ctx,box){const v=A.map(a=>score(sim,a)),on=shown(sim)&&open(sim),R=ranked(sim);
  const lo=Math.min(0,...v),hi=Math.max(10,...v);
  const ax=axes(ctx,box,{xmin:0,xmax:5,ymin:Math.floor(lo/10)*10,ymax:Math.ceil(hi*1.1/10)*10,xl:'',yl:'Score (points)',xcats:A.map(a=>a.name)});
  bars(ctx,ax,v.map(x=>on?x:NaN),{colors:A.map((a,i)=>R.findIndex(r=>r.i===i)<SPOTS?PAL['s3']:(i===0?PAL['rj']:PAL['s2']))});
  if(!on)A.forEach((a,i)=>txt(ctx,'?',ax.X(i+.5),ax.Y(0)-10,{s:18,w:700,c:PAL['cv-soft'],a:'center'}));},
 draw(sim,ctx,vdt,k){const st=sim.st,big=k>1.3,kk=big?Math.min(k,1.6):1,on=shown(sim),op=open(sim),G=GS(sim),w=W(sim),R=ranked(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* left: the applicants */
  const LX=8,LW=440;ctx.fillStyle=PAL['card'];rr(ctx,LX,8,LW,214,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  txt(ctx,big?'Applicants (2 interviews)':'Applicants for 2 interview spots',LX+14,8+21*kk,{s:13*kk,w:700});
  const cols=big?[LX+16,LX+118,LX+200,LX+282,LX+LW-14]:[LX+16,LX+110,LX+200,LX+300,LX+LW-14];
  let y=8+42*kk;['',big?'Test':'Skills test','Months',big?'Miles':'Miles away',op&&on?'Score':''].forEach((h,j)=>{if(h)txt(ctx,h,cols[j],y,{s:12*kk,w:700,c:PAL['cv-soft'],a:j===4?'right':'left'});});
  y+=6*kk;const rh=(214-50*kk-14)/5;
  A.forEach((a,i)=>{const top=y+i*rh,inI=on&&R.findIndex(r=>r.i===i)<SPOTS,by=top+rh/2+4*kk;
   if(i===0){ctx.fillStyle=PAL['s4'];ctx.globalAlpha=.1;rr(ctx,LX+8,top+1,LW-16,rh-2,6);ctx.fill();ctx.globalAlpha=1;}
   txt(ctx,a.name,cols[0],by,{s:13*kk,w:700,c:i===0?PAL['s4']:PAL['cv-ink']});
   txt(ctx,String(a.t),cols[1],by,{s:13*kk});txt(ctx,String(a.m),cols[2],by,{s:13*kk});txt(ctx,String(a.d),cols[3],by,{s:13*kk});
   if(op&&on)txt(ctx,n1(score(sim,a)),cols[4]-(big?0:64),by,{s:13*kk,w:700,a:'right',c:big&&inI?PAL['s3']:PAL['cv-ink']});
   if(on&&!big)pill(ctx,inI?'Interview':'No',cols[4]-28,by-4*kk,inI?PAL['s3']:PAL['line'],inI?'#fff':PAL['cv-ink'],11);
   else if(on&&big&&!op)pill(ctx,inI?'Yes':'No',cols[4]-20,by-4*kk,inI?PAL['s3']:PAL['line'],inI?'#fff':PAL['cv-ink'],11*kk);});
  /* left bottom: the model itself */
  const MY=232,MH=210;
  if(!op){ctx.fillStyle='#1f1f22';rr(ctx,LX,MY,LW,MH,12);ctx.fill();
   const cx=LX+LW/2,cy=MY+(big?70:62);ctx.strokeStyle='#d6d6d6';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy-14,13,Math.PI,0);ctx.stroke();ctx.fillStyle='#d6d6d6';rr(ctx,cx-20,cy-14,40,30,5);ctx.fill();ctx.fillStyle='#1f1f22';ctx.beginPath();ctx.arc(cx,cy+0,4,0,7);ctx.fill();
   txt(ctx,'The scoring model',cx,MY+(big?28:24),{s:13*kk,w:700,c:'#fff',a:'center'});
   const L=big?['Trained on: secret','Formula: secret']:['Trained on: a trade secret','What it scores, and how much: a trade secret','Your score: not shared'];
   L.forEach((s,j)=>txt(ctx,s,cx,cy+40*kk+j*19*kk,{s:12.5*kk,c:'#e8e8e8',a:'center'}));}
  else{ctx.fillStyle=PAL['card'];rr(ctx,LX,MY,LW,MH,12);ctx.fill();ctx.strokeStyle=PAL['s4'];ctx.lineWidth=2;ctx.stroke();
   let yy=MY+22*kk;txt(ctx,'The scoring model, open',LX+14,yy,{s:13*kk,w:700});yy+=20*kk;
   txt(ctx,'Trained on: '+TR[sim.p.train].name,LX+14,yy,{s:12.5*kk,w:600});yy+=17*kk;
   if(!big){wrap(ctx,TR[sim.p.train].story,LW-28,12,400).forEach(l=>{txt(ctx,l,LX+14,yy,{s:12,c:PAL['cv-soft']});yy+=15;});yy+=6;}
   txt(ctx,'Score =',LX+14,yy+4*kk,{s:13*kk,w:700});yy+=22*kk;
   const parts=[[w[0],'× test',PAL['s2']],[w[1],'× months',PAL['s3']],[w[2],'× miles',PAL['rj']]];
   let xx=LX+14;parts.forEach((p,j)=>{const s=(j===0?'':(j===2?'− ':'+ '))+p[0]+' '+p[1];txt(ctx,s,xx,yy,{s:14*kk,w:700,c:p[0]?p[2]:PAL['cv-soft']});ctx.font='700 '+(14*kk)+'px '+FONT;xx+=ctx.measureText(s).width+12;});
   yy+=24*kk;if(!big)wrap(ctx,w[2]?'Living farther away costs '+w[2]+' points a mile, though distance is not part of doing the job.':'Distance counts for nothing in this model.',LW-28,12.5,600).forEach(l=>{txt(ctx,l,LX+14,yy,{s:12.5,w:600,c:w[2]?PAL['rj']:PAL['cv-soft']});yy+=16;});}
  /* right: what you get back */
  const X=458,PW=332;ctx.fillStyle=PAL['card'];rr(ctx,X,8,PW,434,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  y=8+22*kk;txt(ctx,'What you get back',X+14,y,{s:13*kk,w:700});y+=22*kk;
  const letter=on?(youIn(sim)?'You have been selected for an interview.':'You have not been selected for an interview.'):'Your result will appear here.';
  ctx.fillStyle=PAL['card2'];const LH=(big?86:92)*kk;rr(ctx,X+10,y-8*kk,PW-20,LH,8);ctx.fill();
  txt(ctx,'Dear applicant,',X+20,y+10*kk,{s:12.5*kk,c:PAL['cv-ink']});
  wrap(ctx,'Thank you for applying. '+letter,PW-40,12.5*kk,on?600:400).forEach((l,j)=>txt(ctx,l,X+20,y+28*kk+j*16*kk,{s:12.5*kk,w:on?600:400,c:on&&!youIn(sim)?PAL['rj']:PAL['cv-ink']}));
  y+=LH+8*kk;
  if(on&&!op){txt(ctx,'Reason given: none',X+14,y+6*kk,{s:12.5*kk,w:700});y+=20*kk;if(!big){wrap(ctx,'The method is the vendor’s trade secret, so you cannot see your score, check your data or find what counted against you.',PW-28,12,400).forEach(l=>{txt(ctx,l,X+14,y,{s:12,c:PAL['cv-soft']});y+=15;});}}
  else if(on&&op){const a=A[0],c=[w[0]*a.t,w[1]*a.m,-w[2]*a.d],labs=['Test','Months','Miles'],cols2=[PAL['s2'],PAL['s3'],PAL['rj']];
   txt(ctx,`Your score: ${n1(score(sim,a))}   ·   Needed: ${n1(cutoff(sim))}`,X+14,y+6*kk,{s:12.5*kk,w:700});y+=16*kk;
   const bx=X+90,bw=PW-130,mx=Math.max(50,...c.map(Math.abs));
   c.forEach((v,j)=>{const by=y+j*20*kk;txt(ctx,labs[j],X+16,by+11*kk,{s:12*kk});const L=bw*Math.abs(v)/mx*st.grow;ctx.fillStyle=cols2[j];ctx.globalAlpha=v<0?.55:.85;
    if(v>=0)rr(ctx,bx,by+2,Math.max(1,L),12*kk,4);else rr(ctx,bx,by+2,Math.max(1,L),12*kk,4);ctx.fill();ctx.globalAlpha=1;txt(ctx,sgn(v),X+PW-14,by+11*kk,{s:12*kk,w:700,a:'right'});});
   y+=64*kk;}
  /* appeal */
  if(st.appeal&&on){ctx.strokeStyle=PAL['line'];ctx.beginPath();ctx.moveTo(X+10,y);ctx.lineTo(X+PW-10,y);ctx.stroke();y+=18*kk;txt(ctx,'Your appeal',X+14,y,{s:13*kk,w:700});y+=16*kk;
   let msg;if(!op)msg='Reply: “The scoring method is proprietary. The decision stands.” You cannot point to an error you cannot see.';
   else if(youIn(sim))msg='Nothing to appeal: you have an interview. You can still check that your data were entered right.';
   else{const w2=[w[0],w[1],0],s2=w2[0]*A[0].t+w2[1]*A[0].m;msg=`You show that miles cost you ${n1(w[2]*A[0].d)} points and are not part of the job. Without miles you score ${n1(s2)}, the top score.`;}
   wrap(ctx,msg,PW-28,12*kk,400).forEach(l=>{if(y<432){txt(ctx,l,X+14,y,{s:12*kk,c:op?PAL['cv-ink']:PAL['rj']});y+=15*kk;}});}
  else if(!on&&pend(sim))txt(ctx,'Work out your score to see the result',X+PW/2,y+10,{s:12*kk,c:PAL['cv-soft'],a:'center'});
  if(G&&G.g&&!big)txt(ctx,'Your gut: '+(G.g.pick==='in'?'an interview':'no interview'),X+14,432,{s:12,w:700,c:PAL['s4']});},
 narrate(sim){const w=W(sim),you=A[0];
  if(!shown(sim))return 'You have the best skills test of the five applicants. The store’s model picks 2 for interviews. <b>Do you get one?</b>';
  const r=youIn(sim),op=open(sim);
  if(sim.p.train==='store'&&!r)return op?`<b>No interview.</b> You score ${n1(score(sim,you))}, ${n1(cutoff(sim)-score(sim,you))} short of the cutoff, and distance cost you ${n1(w[2]*you.d)} points. The model learned “lives close” from past hires. With the box open, you can see it and appeal it.`:'<b>No interview, and no reason given.</b> The model was trained on past hires, who mostly lived nearby, so it learned to count distance against you. With the box closed, you have no way to know that.';
  if(r)return `<b>You get an interview.</b> Trained on ${TR[sim.p.train].name.toLowerCase()}, the model ${w[2]?'still counts distance':'does not count distance'}, and your top test score carries you. Same applicants, different training, different result.`;
  return `No interview under this training: you score ${n1(score(sim,you))} against a cutoff of ${n1(cutoff(sim))}.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'You have the best skills test, but you live 7 miles away. The model was trained on what the picture says. Will you get one of the 2 interviews? Pick one, then lock it in.'},
  lock(sim){const r=youIn(sim)?'in':'out';return {v:sim.p.guess===r?0:1,pick:sim.p.guess,label:sim.p.guess==='in'?'An interview':'No interview'};},
  solve(sim){const r=youIn(sim)?'in':'out';sim.p.guess=r;sim.p.show=true;sim.st.scored=true;return {v:0,pick:r,label:(r==='in'?'An interview':'No interview')+` (your score ${n1(score(sim,A[0]))})`};},
  hint:{bio:'Lock in your gut answer. Then you will work out your own score with the formula the vendor keeps secret.'},
  calc:{unit:'points',d:1,tol:0.4,
   prompt:{bio:sim=>`Suppose a court made the vendor show the formula: <b>score = ${formula(sim)}</b>. You scored 9 on the test, worked 6 months and live 7 miles away. What is <b>your score</b>?`,
    ap:sim=>{const w=W(sim);return `S = ${w[0]}t + ${w[1]}m − ${w[2]}d. You: t = 9, m = 6, d = 7. What is your S?`;}},
   answer:sim=>score(sim,A[0]),
   hint:'Multiply each number by its weight, then add the test and months parts and subtract the miles part.',
   steps(sim){const w=W(sim),R=ranked(sim);return [`Your score: ${line(sim,A[0])}.`,`Second place (the cutoff): ${R[1].a.name}, ${line(sim,R[1].a)}.`,youIn(sim)?`You are in the top 2: <b>an interview</b>.`:`${n1(score(sim,A[0]))} is below ${n1(cutoff(sim))}: <b>no interview</b>${w[2]?`, even though distance cost you ${n1(w[2]*7)} points`:''}.`];}},
  formula(sim){return A.map(a=>`${a.name}: ${line(sim,a)}`).join('<br>');},
  how:{bio:'Multiply each of your numbers by its weight and combine them. Do the same for everyone, rank the scores, and the top 2 get interviews. You can only do this when the formula is open.',
   ap:'S = a·t + b·m − c·d. You beat a rival when a·Δt + b·Δm − c·Δd > 0, where Δ is your value minus theirs. With Δd = 6.5 miles against Cam, any c above 2 erases your 4-point test lead.'},
  compare(sim,g){const r=youIn(sim)?'in':'out',K=sim.ui.calc,self=K&&K.done&&K.correct?' You worked out your own score, which a closed box never lets an applicant do.':'';
   if(g.pick===r)return `Your gut was right: ${r==='in'?'you get an interview':'no interview'}.`+(r==='out'?' The best test score of the five was not enough, because the model learned to count distance.':'')+self;
   return `You predicted ${g.pick==='in'?'an interview':'no interview'}. The model says <b>${r==='in'?'interview':'no interview'}</b>.`+(r==='out'?' Training on past hires taught it that living close matters, and distance outweighed your test score.':'')+self;},
  again(sim){const R=x=>x[Math.floor(Math.random()*x.length)];sim.p.train=R(Object.keys(TR));sim.p.guess='in';sim.p.show=false;sim.st.scored=false;sim.st.appeal=false;}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'Trained on last year’s best workers, score = 5 × test + 1 × months. You scored 9 on the test and worked 6 months. What is your score?',answer:51,tol:0.4,unit:'points',d:0,hint:'5 × 9 + 1 × 6.',explain:'5 × 9 = 45 and 1 × 6 = 6, so 51, the top score of the five. Distance is not in this model at all.'},
  {lvl:'bio',instant:true,q:'The same five applicants get different results depending on what the model was trained on. Why?',choices:['The applicants changed','Training sets the weights, so the model repeats whatever the training data rewarded','The computer is random'],correct:1,explain:'Trained on past hires who lived nearby, the model learned a big weight on distance. Trained on job performance, distance got a weight of 0. The applicants never changed.'},
  {lvl:'bio',instant:true,q:'The box is closed. You think your months worked were entered wrong. What can you do?',choices:['Point to the error in your score','Very little: you cannot see your score or the data it used','Retake the test'],correct:1,explain:'With a trade-secret model, you cannot see the data, the weights or the score, so you cannot show what went wrong. Houston teachers argued exactly this in court in 2017 about their secret evaluation scores.'},
  {lvl:'honors',kind:'num',q:'Trained on past hires, score = 4 × test + 1 × months − 3 × miles. How many points does living 7 miles away cost you?',answer:21,tol:0.4,unit:'points',d:0,hint:'3 × 7.',explain:'3 points a mile × 7 miles = 21 points. Your score is 36 + 6 − 21 = 21, against a cutoff of 27.5. Without the miles term you would score 42, the highest.'},
  {lvl:'honors',instant:true,q:'Why can a weight on distance hurt people the store never meant to screen out?',choices:['Distance is random','Where people live is linked to income and neighborhood, so distance works as a stand-in (a proxy) for them','Long commutes are illegal'],correct:1,explain:'Xerox found that commute distance in its hiring model lined up with poorer neighborhoods and removed it, Cathy O’Neil reports in Weapons of Math Destruction (2016).'},
  {lvl:'ap',instant:true,q:'Against Cam (test 5, months 9, miles 0.5), you have test 9, months 6, miles 7. With a = 4 and b = 1, above what miles weight c do you fall behind Cam?',choices:['c > 1','c > 2','c > 3','c > 6.5'],correct:1,explain:'Your lead is 4(9 − 5) + 1(6 − 9) − c(7 − 0.5) = 16 − 3 − 6.5c = 13 − 6.5c. That is negative when c > 2. At exactly c = 2 you tie, and the tie goes to your higher test score.'},
  {lvl:'ap',kind:'num',q:'Trained on past hires with distance removed, score = 4 × test + 1 × months. What is the gap between your score and second place?',answer:6,tol:0.4,unit:'points',d:0,hint:'You: 4 × 9 + 6. Ana and Dee both score 36.',explain:'You: 36 + 6 = 42. Ana: 24 + 12 = 36. Dee: 32 + 4 = 36. They tie for second; the tie goes to Dee’s higher test. Your lead over second place is 42 − 36 = 6.'}
 ],
 tour:[
  {title:'Five applicants, two interviews',text:'A store gets five summer-job applications and has 2 interview spots. You have the best skills test, 9 out of 10, but you live 7 miles away.',pause:true,setup:sim=>{BioLab.setValues(sim,{train:'store',box:'closed',show:false});sim.st.scored=false;sim.st.appeal=false;},focus:[8,8,440,214]},
  {title:'The black box',text:'The store uses a vendor’s scoring model. What it was trained on and what it counts are a trade secret.',pause:true,focus:[8,232,440,210]},
  {title:'No interview, no reason',text:'You are not selected. The letter gives no reason, and an appeal gets “the method is proprietary.” You cannot argue with a number you cannot see.',pause:true,setup:sim=>{sim.st.scored=true;sim.st.appeal=true;}},
  {title:'Open the box',text:'Inside: score = 4 × test + 1 × months − 3 × miles. It was trained on 5 years of past hires, who mostly lived nearby, so it learned to take 3 points off for every mile. Distance cost you 21 points.',pause:true,setup:sim=>{BioLab.setValues(sim,{box:'open'});sim.st.scored=true;sim.st.appeal=false;},focus:[8,232,440,210]},
  {title:'Different training, different result',text:'Train the same kind of model on how well last year’s workers did the job, and distance gets a weight of 0. You score 51, the top score. The applicants did not change; the training did.',pause:true,setup:sim=>{BioLab.setValues(sim,{train:'perf',box:'open'});sim.st.scored=true;}},
  {lvl:'honors',title:'An appeal that works',text:'Back to the past-hires model, box open. Now your appeal can point to the 21 points distance cost you, and to the fact that distance is not part of the job.',pause:true,setup:sim=>{BioLab.setValues(sim,{train:'store',box:'open'});sim.st.scored=true;sim.st.appeal=true;}}
 ],
 onTourExit(sim){sim.st.appeal=false;},
 lab:{bio:'<p><b>Question:</b> How does what a model is trained on change who gets an interview?</p><ol><li>Open the box. For each of the three training choices, press <b>Score the applicants</b> and record a trial.</li><li>Write down who got the 2 interviews each time.</li></ol><p>Write one sentence: why did the same five applicants get different results?</p>',
  honors:'<p><b>Question:</b> What can an applicant do with an open model that they cannot do with a closed one?</p><ol><li>With the past-hires training, close the box and press <b>Appeal your result</b>. Record what happens.</li><li>Open the box and appeal again. Record what you can now point to.</li></ol><p>Explain why an appeal needs the model to be open, using your two trials.</p>',
  ap:'<p><b>Question:</b> How big can the miles weight get before you lose your interview?</p><ol><li>Write your score minus each rival’s score as a function of the miles weight c, keeping a = 4 and b = 1.</li><li>Find the c where you fall out of the top 2, and check it against the past-hires model (c = 3).</li></ol><p><b>CER:</b> Is it fair to use distance if it predicts who stays in a job? Use the idea of a proxy and the Xerox example.</p>'},
 terms:[
  {t:'Training data',d:'The past examples a model learns from. A model trained on past decisions learns to repeat them.'},
  {t:'Black box',d:'A model whose inputs, rules or data cannot be seen by the people it scores.'},
  {t:'Trade secret',d:'Business information a company keeps private to protect its value, such as a scoring formula.'},
  {t:'Appeal',d:'Asking for a decision to be reviewed. It only works if you can see what the decision was based on.'},
  {t:'Proxy',d:'A feature that stands in for something else, like distance from work standing in for which neighborhood you live in.',lvl:'honors'},
  {t:'Weapon of math destruction',d:'Cathy O’Neil’s name for a model that is secret, used at large scale and does damage to the people it scores.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Score = a × test + b × months − c × miles, with weights set by the training choice: past hires (4, 1, 3), last year’s best workers (5, 1, 0) or past hires with distance removed (4, 1, 0). The top 2 scores get interviews, and a tie goes to the higher test score. Every applicant and weight is invented for illustration.</p><p><b>How training shapes the result.</b> In 2018 Reuters reported that Amazon had stopped using an experimental résumé-screening model trained on 10 years of résumés, most of them from men. It had learned to mark down résumés that included the word “women’s,” as in “women’s chess club captain.”</p><p><b>A proxy, removed.</b> In <i>Weapons of Math Destruction</i> (2016), Cathy O’Neil reports that Xerox found commute distance in its hiring model lined up with poorer neighborhoods, and took it out. She calls a model a weapon of math destruction when it is opaque, used at scale and damaging.</p><p><b>When the box stays closed.</b> Houston ISD scored teachers with EVAAS, a vendor’s value-added model whose formulas and data were treated as trade secrets; teachers could not replicate their own scores. In May 2017 a federal court let the teachers’ due-process claim go forward, and in October 2017 the district settled, agreeing not to use unverifiable scores to terminate teachers and paying $237,000 in legal fees.</p><p><b>Laws (as of November 2026).</b> New York City’s Local Law 144, enforced since July 2023, requires employers that use automated hiring tools to have a yearly bias audit and to tell candidates the tool is being used.</p>'
};
BioLab.register(SIM);
})();
