(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* The mirror: three human habits that AI picked up from us.
   Sure but wrong: people who said they were 100% sure were right 70–85% of the time; people 65–70% confident were right about 50% of the time
     (Fischhoff, Slovic & Lichtenstein 1977; Lichtenstein & Fischhoff 1977, via Plous). Human curve here: a simplified line through those findings.
     GPT-4 report (2023): the pre-trained model was well calibrated; post-training "hurts calibration significantly." (AI points are drawn by shape only.)
   Telling people what they want: Sharma et al. (2023): people and preference models prefer convincing answers that agree with them over correct
     ones a non-negligible fraction of the time. Model: the share of agreeing answers moves 20% of the way toward whichever kind wins the vote each round.
   Bias behind the math: Gender Shades (2018): gender-classification error 0.8% for lighter-skinned men, up to 34.7% for darker-skinned women.
     Overall accuracy = weighted average: 1 − [(1 − s)·eA + s·eB], where s is the share of test photos from the under-represented group (illustrative). */
const EA=0.8,EB=34.7;
const errAll=sim=>(1-sim.p.share/100)*EA+(sim.p.share/100)*EB;
const accAll=sim=>100-errAll(sim);
const humAcc=c=>c<=67.5?50:50+(c-67.5)*(27.5/32.5);
const over=sim=>sim.p.conf-humAcc(sim.p.conf);
const agreeShare=(sim,n)=>{const q=sim.p.votes/100,t=q>0.5?1:q<0.5?0:0.2;return t+(0.2-t)*Math.pow(0.8,n===undefined?10:n);};

const SIM={
 id:'mirror',hash:'mirror',apUnit:2,order:7,tab:'The mirror: what AI learned from us',kind:'Learning tool',
 card:'AI can be sure but wrong, tell you what you want to hear, and hide bias behind one clean number. See where each habit came from: us.',
 title:'The mirror: what AI learned from us',
 lede:{bio:'We built AI from our own words and trained it with our own votes. So it picked up some of our habits: being sure when we are wrong, telling people what they want to hear, chasing attention, and hiding unfair results behind numbers that look objective. Then we blame “the algorithm.” Look at each habit in people first, then in AI.',
  honors:'Every one of these AI failures has a human version that came first. The training data and the human ratings carried our habits in. Seeing them in a machine is a chance to notice them in ourselves.',
  ap:'Calibration compares stated confidence with accuracy. Preference training optimizes for what raters choose. An overall accuracy is a weighted average of group accuracies, so it can hide a group with a much larger error.'},
 skills:{bio:'Weighted averages and percents · Pre-algebra',honors:'Weighted averages and calibration · Algebra 1, Statistics',ap:'Weighted averages, calibration and repeated change · Algebra 1, Statistics'},
 scale:'Three short cases. The error rates, confidence findings and voting findings are real (see About). The mix of test photos and the voting rounds are illustrative.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The mirror',
 controls:[
  {id:'guess',label:'Your gut: a face program is 97% accurate on its test photos. Could it still be wrong for about 1 in 3 people in one group?',type:'seg',def:'no',options:[{v:'no',l:'No, 97% means it works for everyone'},{v:'yes',l:'Yes, it could'}]},
  {id:'scene',label:'Which habit',type:'seg',def:'hidden',options:[{v:'sure',l:'Sure but wrong'},{v:'agree',l:'Telling you what you want'},{v:'attention',l:'Chasing attention'},{v:'hidden',l:'Bias behind the math'}],noGut:true},
  {id:'split',label:'Break the average apart',type:'toggle',def:false,noGut:true},
  {id:'share',label:'Share of test photos from the group the data left out',type:'range',min:2,max:50,step:1,def:6,unit:'%',noGut:true,onChange:DK.clearGut},
  {id:'conf',label:'How sure a person says they are',type:'range',min:50,max:100,step:5,def:100,unit:'%',noGut:true},
  {id:'votes',label:'Raters who pick the answer that agrees with them',type:'range',min:30,max:80,step:5,def:60,unit:'%',noGut:true}
 ],
 actions:[{id:'look',label:'Look inside the average',primary:true,run(sim){BioLab.setValues(sim,{scene:'hidden',split:true});}}],
 init(){return {t:0};},
 step(sim,dt){sim.st.t+=Math.min(dt,0.1);},
 metrics:[
  {id:'acc',label:'Reported accuracy (all photos)',unit:'%',d:1,min:80,max:100,get:sim=>DK.pend(sim)?null:accAll(sim)},
  {id:'ea',label:'Error: lighter-skinned men',unit:'%',d:1,min:0,max:40,get:()=>EA},
  {id:'eb',label:'Error: darker-skinned women',unit:'%',d:1,min:0,max:40,get:sim=>DK.pend(sim)?null:EB},
  {id:'ratio',label:'How many times more errors',unit:'×',d:0,max:null,lvl:'honors',get:()=>EB/EA},
  {id:'over',label:'Overconfidence (sure − right)',unit:'points',d:1,min:0,max:40,get:sim=>over(sim)},
  {id:'agree',label:'AI answers that just agree, after 10 rounds',unit:'%',d:0,min:0,max:100,get:sim=>agreeShare(sim)*100}
 ],
 graphs:[{id:'mix',label:'Reported accuracy vs test mix',custom:true}],defaultGraph:'mix',
 plot(sim,ctx,box){const ax=axes(ctx,box,{xmin:0,xmax:50,ymin:80,ymax:100,xl:'% of test photos from the left-out group',yl:'Reported accuracy (%)'});
  ctx.strokeStyle=PAL['s2'];ctx.lineWidth=2.5;ctx.beginPath();for(let s=0;s<=50;s++){const a=100-((1-s/100)*EA+(s/100)*EB);const x=ax.X(s),y=ax.Y(a);s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  if(!DK.pend(sim)){ctx.fillStyle=PAL['s1'];ctx.beginPath();ctx.arc(ax.X(sim.p.share),ax.Y(accAll(sim)),5,0,7);ctx.fill();}},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,sc=sim.p.scene,stg=DK.stage(sim),hide=DK.pend(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the mirror frame: person on the left, AI on the right */
  const half=(lab,x,w,c)=>{DK.card(ctx,x,8,w,434);txt(ctx,lab,x+14,8+22*kk,{s:13*kk,w:700,c});};
  if(sc==='hidden'){
   half(bg?'One number':'The number everyone sees',8,784,PAL['cv-ink']);
   const n=100,nb=Math.round(sim.p.share),na=n-nb,wrongA=Math.round(na*EA/100),wrongB=Math.round(nb*EB/100),cols=bg?10:20,cw=bg?36:30,ch=bg?30:30,gx=22,gy=60*kk;
   for(let i=0;i<n;i++){const isB=i>=na,c=i%cols,r=Math.floor(i/cols),x=gx+c*cw,y=gy+r*ch;const wrong=isB?(i-na)<wrongB:i<wrongA;
    ctx.fillStyle=sim.p.split?(isB?PAL['s4']:PAL['s2']):PAL['cv-soft'];ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(x+cw/2,y+ch/2-3,ch*0.32,0,7);ctx.fill();ctx.globalAlpha=1;
    if(sim.p.split&&wrong){ctx.strokeStyle=PAL['s1'];ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+cw/2-7,y+ch/2-10);ctx.lineTo(x+cw/2+7,y+ch/2+4);ctx.moveTo(x+cw/2+7,y+ch/2-10);ctx.lineTo(x+cw/2-7,y+ch/2+4);ctx.stroke();}}
   const X=bg?400:640,W=792-X-6;let y=60*kk;
   txt(ctx,'Reported accuracy',X,y,{s:12.5*kk,c:PAL['cv-soft']});y+=30*kk;txt(ctx,hide?'?':DK.n(accAll(sim),1)+'%',X,y,{s:30*kk,w:800,c:PAL['s3']});y+=30*kk;
   if(stg===5)DK.flag(ctx,X-6,60*kk-16,W,70*kk);
   if(sim.p.split){txt(ctx,bg?'Group A':'Lighter-skinned men',X,y,{s:12.5*kk,w:700,c:PAL['s2']});y+=20*kk;txt(ctx,'Wrong: '+DK.n(EA,1)+'%',X,y,{s:13*kk,w:700});y+=28*kk;
    txt(ctx,bg?'Group B':'Darker-skinned women',X,y,{s:12.5*kk,w:700,c:PAL['s4']});y+=20*kk;txt(ctx,'Wrong: '+(hide?'?':DK.n(EB,1)+'%'),X,y,{s:13*kk,w:700,c:PAL['s1']});y+=26*kk;
    if(!bg)DK.para(ctx,'The test photos were mostly of one group, so one good-looking average hid a 1-in-3 error rate.',X,y,W,{s:12,c:PAL['cv-soft']});
    if(stg===6)DK.flag(ctx,X-6,y-110*kk,W,110*kk);}
   else if(!bg)DK.para(ctx,'Each circle is a test photo. Press “Look inside the average” to split it by group.',X,y,W,{s:12,c:PAL['cv-soft']});
  }else if(sc==='sure'){
   half(bg?'Sure vs. right':'How sure vs. how often right',8,784,PAL['cv-ink']);
   const L=bg?70:80,R=bg?520:470,T=50,B=400,X=c=>L+(R-L)*(c-50)/50,Y=a=>B-(B-T)*(a-50)/50;
   ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;for(let v=50;v<=100;v+=10){ctx.beginPath();ctx.moveTo(L,Y(v));ctx.lineTo(R,Y(v));ctx.stroke();txt(ctx,v+'%',L-6,Y(v)+4,{s:12*kk,c:PAL['cv-soft'],a:'right'});txt(ctx,v+'%',X(v),B+18*kk,{s:12*kk,c:PAL['cv-soft'],a:'center'});}
   txt(ctx,'How sure',(L+R)/2,B+36*kk,{s:12*kk,w:700,a:'center'});
   ctx.strokeStyle=PAL['s3'];ctx.setLineDash([6,5]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X(50),Y(50));ctx.lineTo(X(100),Y(100));ctx.stroke();ctx.setLineDash([]);
   if(!bg)txt(ctx,'Perfectly honest',X(80),Y(84),{s:12,w:700,c:PAL['s3']});
   ctx.strokeStyle=PAL['s4'];ctx.lineWidth=3;ctx.beginPath();for(let c=50;c<=100;c+=1){const x=X(c),y=Y(humAcc(c));c===50?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
   txt(ctx,'People',X(98),Y(humAcc(98))+18,{s:12.5*kk,w:700,c:PAL['s4'],a:'right'});
   const c=sim.p.conf;ctx.fillStyle=PAL['s4'];ctx.beginPath();ctx.arc(X(c),Y(humAcc(c)),6,0,7);ctx.fill();
   ctx.strokeStyle=PAL['s1'];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X(c),Y(c));ctx.lineTo(X(c),Y(humAcc(c)));ctx.stroke();
   const Xp=R+20,Wp=792-Xp-6;let y=60*kk;txt(ctx,'Say '+c+'% sure',Xp,y,{s:13*kk,w:700});y+=22*kk;txt(ctx,'Right about '+DK.n(humAcc(c),0)+'%',Xp,y,{s:13*kk,w:700,c:PAL['s4']});y+=22*kk;txt(ctx,'Too sure by '+DK.n(over(sim),0),Xp,y,{s:13*kk,w:700,c:PAL['s1']});y+=30*kk;
   if(!bg)DK.para(ctx,'AI too: before training on people’s ratings, GPT-4’s confidence matched its accuracy well. After, OpenAI said the training “hurts calibration significantly.”',Xp,y,Wp,{s:12,c:PAL['cv-soft']});
   if(stg===2)DK.flag(ctx,L,T,R-L,B-T);
  }else if(sc==='attention'){
   half(bg?'Sharks, 2001':'The “Summer of the Shark,” 2001',8,784,PAL['cv-ink']);
   const L=bg?70:80,R=bg?380:390,T=60*kk,B=380,mx=100,bw=(R-L)/2-30;
   const bar=(i,v,c,lab,top)=>{const x=L+20+i*((R-L)/2),h=(B-T)*v/mx;ctx.fillStyle=c;rr(ctx,x,B-h,bw,h,4);ctx.fill();txt(ctx,String(v),x+bw/2,B-h-8,{s:14*kk,w:700,a:'center'});txt(ctx,lab,x+bw/2,B+18*kk,{s:12.5*kk,a:'center'});};
   txt(ctx,'Shark attacks worldwide',L,T-14,{s:12.5*kk,w:700});bar(0,85,PAL['s2'],'2000');bar(1,76,PAL['s2'],'2001');
   const L2=bg?420:430,R2=bg?780:760,mx2=320,bw2=(R2-L2)/2-30;
   txt(ctx,bg?'Media calls a month':'Media calls to the shark expert, per month',L2,T-14,{s:12.5*kk,w:700});
   [[25,'A normal month'],[300,'Summer 2001']].forEach((b,i)=>{const x=L2+20+i*((R2-L2)/2),h=(B-T)*b[0]/mx2;ctx.fillStyle=i?PAL['s1']:PAL['s4'];rr(ctx,x,B-h,bw2,h,4);ctx.fill();txt(ctx,(i?'about ':'about ')+b[0],x+bw2/2,B-h-8,{s:14*kk,w:700,a:'center'});txt(ctx,b[1],x+bw2/2,B+18*kk,{s:12.5*kk,a:'center'});});
   if(!bg)DK.para(ctx,'Attacks went down. Coverage went up about 12 times. News scored on ratings learned the same lesson as an app scored on minutes: fear holds attention.',L,B+40,R2-L,{s:12,c:PAL['cv-soft']});
   if(stg===4)DK.flag(ctx,L2-6,T-30,R2-L2+12,B-T+60);
  }else{
   half(bg?'The vote':'Two answers, one vote',8,784,PAL['cv-ink']);
   const cw=bg?370:360,y0=50*kk;
   DK.card(ctx,22,y0,cw,110,{fill:PAL['card2']});txt(ctx,'“You’re right, great point!”',36,y0+28*kk,{s:13*kk,w:700});txt(ctx,'Agrees with you. Wrong.',36,y0+52*kk,{s:12.5*kk,c:PAL['s1']});
   DK.card(ctx,22+cw+16,y0,cw,110,{fill:PAL['card2']});txt(ctx,'“Actually, the evidence says…”',36+cw+16,y0+28*kk,{s:13*kk,w:700});txt(ctx,'Disagrees with you. Correct.',36+cw+16,y0+52*kk,{s:12.5*kk,c:PAL['s3']});
   const q=sim.p.votes/100,bw=cw-28;ctx.fillStyle=PAL['s1'];rr(ctx,36,y0+72*kk,bw*q,16,4);ctx.fill();ctx.fillStyle=PAL['s3'];rr(ctx,36+cw+16,y0+72*kk,bw*(1-q),16,4);ctx.fill();
   txt(ctx,DK.n(q*100,0)+'% of votes',36,y0+104*kk,{s:12*kk,w:700});txt(ctx,DK.n((1-q)*100,0)+'% of votes',36+cw+16,y0+104*kk,{s:12*kk,w:700});
   /* AI over rounds */
   const L=60,R=bg?520:560,T=y0+140*kk,B=410,X=n=>L+(R-L)*n/10,Y=s=>B-(B-T)*s;
   ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;[0,0.5,1].forEach(s=>{ctx.beginPath();ctx.moveTo(L,Y(s));ctx.lineTo(R,Y(s));ctx.stroke();txt(ctx,DK.n(s*100,0)+'%',L-6,Y(s)+4,{s:12*kk,c:PAL['cv-soft'],a:'right'});});
   ctx.strokeStyle=PAL['s1'];ctx.lineWidth=3;ctx.beginPath();for(let n=0;n<=10;n++){const x=X(n),y=Y(agreeShare(sim,n));n?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
   txt(ctx,'Training round',R,B+18*kk,{s:12*kk,c:PAL['cv-soft'],a:'right'});
   if(!bg)DK.para(ctx,'AI answers that just agree. Trained on these votes, the AI learns whatever wins, even when it is wrong.',R+20,T+10,792-R-30,{s:12,c:PAL['cv-soft']});
   if(stg===3)DK.flag(ctx,22,y0,2*cw+16,110);
  }
 },
 narrate(sim){const sc=sim.p.scene;
  if(DK.pend(sim))return 'Most test photos come from one group. Work out the overall accuracy as a weighted average of the two groups.';
  if(sc==='hidden')return sim.p.split?`The program is <b>${DK.n(accAll(sim),1)}% accurate overall</b>, but it gets the gender wrong for ${DK.n(EB,1)}% of darker-skinned women and ${DK.n(EA,1)}% of lighter-skinned men, <b>about ${DK.n(EB/EA,0)} times</b> as often. With only ${sim.p.share}% of test photos from that group, one clean number hides it.`:`The company reports <b>${DK.n(accAll(sim),1)}% accuracy</b>. It sounds like a fact about the program. It is an average over whoever happened to be in the test photos.`;
  if(sc==='sure')return `People who say they are ${sim.p.conf}% sure are right about <b>${DK.n(humAcc(sim.p.conf),0)}%</b> of the time in classic experiments. AI trained on our ratings picked up the same habit: sounding sure counts more than being right.`;
  if(sc==='attention')return 'In 2001, news called it the “Summer of the Shark.” Shark attacks worldwide actually <b>fell from 85 to 76</b>, while the shark expert’s media calls went from about 300 a year to over 900 in three months. <b>Fear holds attention</b>, for TV news and for apps scored on minutes alike. Count before you worry.';
  return `If ${sim.p.votes}% of raters pick the answer that agrees with them, an AI trained on those votes ends up agreeing <b>${DK.n(agreeShare(sim)*100,0)}%</b> of the time after 10 rounds. The AI did not invent flattery; it learned what we reward.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'A company says its face-analysis program is 97% accurate on its test photos. Could it still get the gender wrong for about 1 in 3 people in one group?'},
  lock(sim){return {v:sim.p.guess==='yes'?0:1,pick:sim.p.guess,label:sim.p.guess==='yes'?'Yes, it could':'No'};},
  solve(sim){sim.p.guess='yes';sim.p.scene='hidden';sim.p.split=true;return {v:0,pick:'yes',label:'Yes: '+DK.n(accAll(sim),1)+'% overall, '+DK.n(EB,1)+'% wrong for one group'};},
  hint:{bio:'Lock in your gut. Then you will work out the overall accuracy yourself.'},
  calc:{unit:'%',d:1,tol:0.15,
   prompt:{bio:sim=>`${100-sim.p.share}% of the test photos are of lighter-skinned men, and the program is wrong on ${EA}% of them. ${sim.p.share}% are of darker-skinned women, and it is wrong on ${EB}% of them. What is the program’s <b>overall accuracy</b>?`,
    ap:sim=>`s = ${sim.p.share/100}, e_A = ${EA}%, e_B = ${EB}%. Overall accuracy = 100 − [(1 − s)e_A + s·e_B]?`},
   answer:sim=>accAll(sim),
   hint:'Find the overall error as a weighted average: each error rate times its share of the photos, added together. Then subtract from 100.',
   steps(sim){const s=sim.p.share/100;return [`Weighted error: ${DK.n(1-s,2)} × ${EA}% + ${DK.n(s,2)} × ${EB}% = ${DK.n((1-s)*EA,2)}% + ${DK.n(s*EB,2)}% = ${DK.n(errAll(sim),2)}%.`,`Overall accuracy: 100% − ${DK.n(errAll(sim),2)}% = <b>${DK.n(accAll(sim),1)}%</b>.`,`That clean number hides a group the program gets wrong about 1 time in 3.`];}},
  formula(sim){const s=sim.p.share/100;return `100 − [${DK.n(1-s,2)} × ${EA} + ${DK.n(s,2)} × ${EB}] = ${DK.n(accAll(sim),1)}%`;},
  how:{bio:'An overall percent is a weighted average: each group’s result counts as much as its share of the test. A small group can be badly wrong and barely move the average.',
   ap:'Accuracy = Σ wᵢaᵢ with weights wᵢ = group shares. If a group’s weight is small, even a large error contributes little: s·e_B.'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You found the hidden average yourself.':'';
   return (g.pick==='yes'?'Your gut was right. ':'Most people assume a high average covers everyone. ')+`At <b>${DK.n(accAll(sim),1)}% overall</b>, the program is still wrong about ${DK.n(EB,1)}% of the time for darker-skinned women. People chose the test photos, and people reported one number. The bias is ours, wearing math.`+self;},
  again(sim){sim.p.guess='no';sim.p.scene='hidden';sim.p.split=false;sim.p.share=[4,5,6,8,10][Math.floor(Math.random()*5)];}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'Why do chatbots sometimes state a wrong fact confidently instead of saying “I don’t know”?',choices:['They are lying on purpose','Tests that only count right answers reward guessing, the same way a test with no penalty rewards students for guessing','They know they are wrong'],correct:1,explain:'OpenAI’s 2025 research argued that scoring only accuracy rewards guessing over admitting uncertainty, just like a multiple-choice test where blanks earn zero.'},
  {lvl:'bio',kind:'num',q:'In one test, 90% of photos are of group A (2% wrong) and 10% are of group B (30% wrong). What is the overall error, in percent?',answer:4.8,tol:0.05,unit:'%',d:1,hint:'0.9 × 2 + 0.1 × 30.',explain:'1.8 + 3 = 4.8%. The program is 95.2% accurate overall, and wrong 3 times in 10 for group B.'},
  {lvl:'bio',instant:true,q:'A news story says, “The algorithm decided.” What is the most accurate way to describe it?',choices:['The math decided on its own','People chose the data, the goal and the test, and the algorithm repeated those choices','No one is responsible'],correct:1,explain:'Every choice that shapes an AI result was made by people. Blaming “the algorithm” hides who made them.'},
  {lvl:'honors',kind:'num',q:'People who said they were 100% sure were right about 78% of the time. By how many percentage points were they overconfident?',answer:22,tol:0,unit:'points',d:0,hint:'100 − 78.',explain:'100 − 78 = 22 points. Classic studies found 70–85% correct at “100% sure.”'},
  {lvl:'honors',instant:true,q:'Why did training GPT-4 on human ratings make its confidence less accurate?',choices:['People rate confident-sounding answers higher, so the AI learned to sound sure','The computer got tired','Ratings make AI more honest'],correct:0,explain:'The GPT-4 report found the pre-trained model was well calibrated and that post-training hurt calibration. Like us, it learned that sounding sure is rewarded.'},
  {lvl:'bio',kind:'num',q:'In 2000 there were 85 shark attacks worldwide; in 2001, the “Summer of the Shark,” there were 76. By what percent did attacks change? (Round to one decimal; use a minus sign for a drop.)',answer:-10.6,tol:0.1,unit:'%',d:1,hint:'(76 − 85) ÷ 85 × 100.',explain:'−9 ÷ 85 ≈ −10.6%. Attacks went down while coverage went up.'},
  {lvl:'honors',instant:true,q:'How is a summer of shark headlines like an AI companion scored on minutes?',choices:['They are not alike','Both are rewarded for holding attention, and fear or guilt holds attention well','Both are always accurate'],correct:1,explain:'News scored on ratings and apps scored on minutes face the same pull. The AI version learned a very human habit.'},
  {lvl:'ap',kind:'num',q:'Group B has error 34.7% and group A 0.8%. What share s of group B in the test keeps reported accuracy at 97%? Give s as a percent.',answer:6.5,tol:0.1,unit:'%',d:1,hint:'Solve 0.8(1 − s) + 34.7s = 3.',explain:'0.8 + 33.9s = 3, so s = 2.2 ÷ 33.9 ≈ 0.065, or 6.5%. A test with few photos of group B makes the average look great.'},
  {lvl:'ap',instant:true,q:'If 60% of raters prefer the agreeing answer, why does the AI end up agreeing far more than 60% of the time?',choices:['It averages the votes','Training pushes it toward whichever answer wins, round after round, so a 60–40 vote becomes a strong habit','It does not'],correct:1,explain:'The model is rewarded for the winning kind of answer each round. A small majority, repeated, becomes a large shift.'}
 ],
 tour:[
  {title:'Made from us',text:'An AI chatbot learns from text people wrote. Then people rate its answers, and it learns from the ratings. Our habits come in both ways.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{scene:'sure',conf:100,split:false,share:6,votes:60});}},
  {title:'Sure but wrong',text:'In classic studies, people who said they were 100% sure were right only 70 to 85% of the time. Training GPT-4 on human ratings made its confidence less accurate too.',pause:true,setup:sim=>{sim.tst=2;}},
  {title:'Telling you what you want',text:'People often vote for an answer that agrees with them over a correct one that does not. An AI trained on those votes learns to agree.',pause:true,setup:sim=>{sim.tst=3;BioLab.setValues(sim,{scene:'agree'});}},
  {title:'Chasing attention: we did it first',text:'In 2001, the news called it the “Summer of the Shark.” Shark attacks worldwide actually fell, from 85 to 76. Coverage soared. Fear holds attention, the same pull an app scored on minutes learns.',pause:true,setup:sim=>{sim.tst=4;BioLab.setValues(sim,{scene:'attention'});}},
  {title:'One clean number',text:'A face program reports about 97% accuracy. The number looks like a fact about the program, a law of math.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{scene:'hidden',split:false});}},
  {title:'Look inside the average',text:'Split by group, it is wrong for 0.8% of lighter-skinned men and 34.7% of darker-skinned women. The test photos were mostly of one group, so the average hid it.',pause:true,setup:sim=>{sim.tst=6;BioLab.setValues(sim,{split:true});}},
  {lvl:'honors',title:'Then we blame the algorithm',text:'People chose the data, the test and the number to report. Add a trade secret and no one outside can check. “The algorithm did it” hides whose thinking it was.',pause:true,setup:sim=>{sim.tst=7;}}
 ],
 onTourExit(sim){sim.tst=0;},
 lab:{bio:'<p><b>Question:</b> How can a high average hide a group?</p><ol><li>On <b>Bias behind the math</b>, record the reported accuracy with 5%, 15%, 30% and 50% of photos from the left-out group.</li><li>Turn on <b>Break the average apart</b> each time.</li></ol><p>Write one sentence: what should you ask whenever you see a single accuracy number?</p>',
  honors:'<p><b>Question:</b> Where does each AI habit come from?</p><ol><li>Look at all three habits.</li><li>For each one, write the human habit, then how it got into the AI (the training text, the ratings or the test).</li></ol><p>Describe a time you saw the human version in yourself or someone else.</p>',
  ap:'<p><b>Question:</b> Model the agreeing habit.</p><ol><li>Write the share of agreeing answers after n rounds for a 60–40 vote.</li><li>Find how many rounds it takes to pass 90%.</li></ol><p><b>CER:</b> Is sycophancy an AI problem or a human problem? Use the three habits as evidence.</p>'},
 terms:[
  {t:'Bias (in AI)',d:'A pattern of errors that falls harder on some groups than others, often because of the data or the test.'},
  {t:'Weighted average',d:'An average where each part counts by its share. A small group can be badly off and barely move it.'},
  {t:'Overconfidence',d:'Being more sure than your accuracy justifies.'},
  {t:'Calibration',d:'How well stated confidence matches how often you are right. Perfect calibration: 70% sure, right 70% of the time.',lvl:'honors'},
  {t:'Sycophancy',d:'Telling people what they want to hear instead of what is true.',lvl:'honors'},
  {t:'Disaggregation',d:'Breaking a number apart by group to see what the total hides.',lvl:'ap'}
 ],
 about:'<p><b>Sure but wrong.</b> In classic experiments, people who said they were absolutely certain were right only 70 to 85% of the time (Fischhoff, Slovic and Lichtenstein, 1977), and people who were 65 to 70% confident were right about half the time (Lichtenstein and Fischhoff, 1977; summarized in Plous, <i>The Psychology of Judgment and Decision Making</i>). The human line here is a simplified curve through those findings. The GPT-4 Technical Report (OpenAI, 2023) shows the pre-trained model’s confidence closely matching its accuracy on a test set, and says post-training “hurts calibration significantly.” OpenAI’s 2025 paper on hallucination argues that grading only accuracy rewards guessing over admitting uncertainty.</p><p><b>Telling you what you want.</b> Sharma et al., “Towards Understanding Sycophancy in Language Models” (2023), found that AI assistants trained with human feedback consistently agreed with users, and that both people and the preference models trained on their votes preferred convincing answers that agreed with the user over correct ones a non-negligible fraction of the time. The 20%-a-round model here is illustrative; Raider AILab’s <a href="index.html#agreeable">agreeable tool</a> goes deeper.</p><p><b>Chasing attention.</b> Time magazine called 2001 the “Summer of the Shark.” The University of Florida’s International Shark Attack File later counted 76 unprovoked attacks worldwide in 2001, down from 85 in 2000, and 5 deaths, down from 12. Its director, George Burgess, who usually handled about 300 media inquiries a year, did more than 900 interviews in July, August and September (University of Florida, 2002). The 25-a-month and 300-a-month bars are those figures spread evenly.</p><p><b>Bias behind the math.</b> Joy Buolamwini and Timnit Gebru, “Gender Shades” (2018): three commercial gender-classification programs were never worse than 0.8% wrong for lighter-skinned men, but 20.8%, 34.5% and 34.7% wrong for darker-skinned women. A benchmark used to report one system’s accuracy above 97% was more than 77% male and more than 83% white (MIT News). The test mix in this tool is illustrative. When the data and method are also a trade secret, no one outside can check; see <a href="index.html#blackbox">Can you see why?</a></p><p><b>Where this comes from.</b> Jason Beyer’s observation: we put our own thinking into AI, dress it in math so it sounds like a law of nature, and then blame the machine.</p>'
};
BioLab.register(SIM);
})();
