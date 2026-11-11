(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars,atLeast}=BioLab.h;
/* Attention from the word "it" to three candidate words, with 2-number key vectors:
   feature 1 = "can be too big to fit inside something", feature 2 = "can be too small to hold something".
   The query from "it … too big" is [x, 0]; from "it … too small" it is [0, x]. Score = q·k; weight = e^score ÷ Σ e^score.
   A real model has hundreds of features per word and spreads attention over every word; the vectors here are invented so you can check every number. */
const C=[{w:'trophy',k:[2,0]},{w:'suitcase',k:[0,2]},{w:'fit',k:[0.5,0.5]}];
const TOK=['The','trophy','didn’t','fit','in','the','suitcase','because','it','was','too','END'];
const CI={1:0,6:1,3:2},IT=8;
const q=sim=>sim.p.end==='big'?[sim.p.x,0]:[0,sim.p.x];
const sc=sim=>{const Q=q(sim);return C.map(c=>Q[0]*c.k[0]+Q[1]*c.k[1]);};
const ex=sim=>sc(sim).map(s=>Math.exp(s));
const wts=sim=>{const e=ex(sim),S=e.reduce((a,b)=>a+b,0);return e.map(v=>v/S);};
const topI=sim=>{const w=wts(sim);let b=0;for(let i=1;i<3;i++)if(w[i]>w[b]+1e-12)b=i;return b;};
/* the word the sentence means: trophy for "too big", suitcase for "too small" */
const refI=sim=>sim.p.end==='big'?0:1;
const refPct=sim=>100*wts(sim)[refI(sim)];
const GS=sim=>sim.gutS;
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const locked=sim=>!!(GS(sim)&&GS(sim).g&&!pend(sim));
const tourOn=sim=>!!(sim.tour&&sim.tour.on);
const shown=sim=>!!(sim.p.show||locked(sim)||tourOn(sim)||sim.st.ran);
const f2=v=>(Math.round(v*100)/100).toString().replace('-','−');
const f1=v=>(Math.round(v*10)/10).toFixed(1);
const pc=v=>f1(v)+'%';
const vec=a=>'['+a.map(f2).join(', ')+']';
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
const GUESS=[{v:'33',l:'About a third (33%)',n:33.3},{v:'60',l:'A little over half (60%)',n:60},{v:'85',l:'Most of it (85%)',n:85},{v:'100',l:'All of it (100%)',n:100}];

const SIM={
 id:'attention',hash:'attention',apUnit:1,order:2,tab:'How a model pays attention',kind:'Simulation',
 card:'Inside a language model, every word decides how much to “pay attention” to each other word. Work out where the word “it” looks, then change one word and watch the attention move.',
 title:'How a model pays attention: what does “it” mean?',
 lede:{bio:'“The trophy didn’t fit in the suitcase because it was too big.” You know “it” means the trophy. A language model works that out with attention: “it” gives each earlier word a match score, and the scores are turned into shares that add up to 100%. Find the share that goes to “trophy,” then change “big” to “small.”',
  honors:'Attention turns match scores into shares with the softmax: weight = e^score ÷ (the sum of e^score for every word). Exponentials stretch the gaps, so a score just 2 or 3 points higher can take most of the attention.',
  ap:'Each word has a query q and a key k. The match score is the dot product q·k, and the weights are softmax(q·k). Real transformers also divide by √d, the length of the vectors (Vaswani et al., 2017), which keeps the scores from getting so large that one word takes everything.'},
 skills:{bio:'Percents and proportional shares · Grade 7, Algebra 1',honors:'Exponential functions and the softmax · Algebra 2',ap:'Dot products and the softmax function · Algebra 2, Precalculus'},
 scale:'Each word here has a 2-number key: [can be too big to fit inside something, can be too small to hold something]. Real models use hundreds or thousands of numbers per word and spread a little attention over every word; these values are invented so you can check every step. Nothing you enter leaves this page.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The sentence',
 controls:[
  {id:'guess',label:'Your gut: what share of “it”’s attention goes to the word it means?',type:'seg',def:'60',options:GUESS.map(g=>({v:g.v,l:g.l}))},
  {id:'end',label:'…because it was too…',type:'seg',def:'big',options:[{v:'big',l:'big'},{v:'small',l:'small'}],noGut:true,onChange:clearGut},
  {id:'x',label:'How strongly the last word points to size',type:'range',min:0,max:3,step:0.25,def:1.5,noGut:true,onChange:clearGut,help:'This is the size of the query vector from “it … too big” (or “small”). At 0, “it” has no clue to go on.'},
  {id:'show',label:'Show the attention now',type:'toggle',def:false,noGut:true,help:'Normally the shares appear once you lock in your gut answer or run the model.'}
 ],
 actions:[{id:'run',label:'Run the model on “it”',primary:true,run(sim){sim.st.ran=true;sim.st.grow=0;}}],
 init(){return {ran:false,grow:1,disp:null,t:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.grow<1)st.grow=Math.min(1,st.grow+dt/1.2);
  const w=wts(sim);if(!st.disp)st.disp=w.slice();st.disp=st.disp.map((v,i)=>v+(w[i]-v)*Math.min(1,dt*5));},
 metrics:[
  {id:'top',label:'“It” pays the most attention to',text:true,get:sim=>shown(sim)?'“'+C[topI(sim)].w+'”':'Hidden until you lock in your gut or run the model'},
  {id:'ref',label:'Share to the word “it” means',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?refPct(sim):null},
  {id:'trophy',label:'Share to “trophy”',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?100*wts(sim)[0]:null},
  {id:'suitcase',label:'Share to “suitcase”',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?100*wts(sim)[1]:null},
  {id:'fit',label:'Share to “fit”',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?100*wts(sim)[2]:null},
  {id:'sum',label:'Sum of e^score',unit:'',d:2,lvl:'honors',max:null,get:sim=>shown(sim)?ex(sim).reduce((a,b)=>a+b,0):null},
  {id:'q',label:'Query from “it”',text:true,lvl:'ap',get:sim=>`q = ${vec(q(sim))}; scores q·k: trophy ${f2(sc(sim)[0])}, suitcase ${f2(sc(sim)[1])}, fit ${f2(sc(sim)[2])}`}
 ],
 graphs:[{id:'share',label:'Attention share from “it”',custom:true}],defaultGraph:'share',
 plot(sim,ctx,box){const w=wts(sim).map(v=>100*v),on=shown(sim),r=refI(sim);
  const ax=axes(ctx,box,{xmin:0,xmax:3,ymin:0,ymax:100,xl:'',yl:'Share of attention (%)',xcats:C.map(c=>c.w)});
  bars(ctx,ax,w.map(v=>on?v:NaN),{colors:C.map((c,i)=>i===r?PAL['rj']:PAL['s2'])});
  if(!on)C.forEach((c,i)=>txt(ctx,'?',ax.X(i+.5),ax.Y(0)-10,{s:18,w:700,c:PAL['cv-soft'],a:'center'}));},
 draw(sim,ctx,vdt,k){const p=sim.p,st=sim.st,big=k>1.3,on=shown(sim),G=GS(sim),r=refI(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  const disp=st.disp||wts(sim),grow=on?(st.ran?st.grow:1):0;
  /* the sentence */
  const words=TOK.map(t=>t==='END'?p.end+'.':t);
  const fs=big?Math.min(16*k,22):17;
  const show=big?[1,3,6,7,8,9,10,11]:words.map((w,i)=>i);
  ctx.font='600 '+fs+'px '+FONT;
  const gap=big?9:8,ws=show.map(i=>ctx.measureText(words[i]).width+(big?14:16));
  let tot=ws.reduce((a,b)=>a+b,0)+gap*(show.length-1);
  let x0=Math.max(12,400-tot/2);const pos={};
  const TY=big?112:150,BH=fs+16;
  show.forEach((i,j)=>{pos[i]={x:x0,w:ws[j]};x0+=ws[j]+gap;});
  /* arcs from "it" to the candidates */
  const itp=pos[IT];
  Object.keys(CI).forEach(ti=>{ti=+ti;const ci=CI[ti],P=pos[ti];if(!P)return;const wv=disp[ci]*grow;
   const x1=itp.x+itp.w/2,x2=P.x+P.w/2,h=22+Math.abs(x1-x2)*(big?0.28:0.22);
   ctx.strokeStyle=ci===r?PAL['rj']:PAL['s2'];ctx.globalAlpha=on?0.25+0.75*Math.min(1,wv*1.6):0.25;ctx.lineWidth=on?1.5+16*wv:2;
   if(!on)ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(x1,TY-2);ctx.bezierCurveTo(x1,TY-h,x2,TY-h,x2,TY-2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
   const lx=(x1+x2)/2,ly=TY-h*0.75-8;
   if(on&&(!big||ci===r)){const t=pc(100*wts(sim)[ci]);ctx.font='700 '+(13*Math.min(k,1.5))+'px '+FONT;const tw=ctx.measureText(t).width+12;ctx.fillStyle=PAL['card'];rr(ctx,lx-tw/2,ly-10*Math.min(k,1.5),tw,18*Math.min(k,1.5),6);ctx.fill();
    txt(ctx,t,lx,ly+3*Math.min(k,1.5),{s:13*Math.min(k,1.5),w:700,c:ci===r?PAL['rj']:PAL['cv-ink'],a:'center'});}
   else if(!on)txt(ctx,'?',lx,ly+4,{s:15,w:700,c:PAL['cv-soft'],a:'center'});});
  /* token boxes, tinted by attention (the heat map) */
  show.forEach(i=>{const P=pos[i],ci=CI[i],isIt=i===IT;
   let fill=PAL['card'];ctx.fillStyle=fill;rr(ctx,P.x,TY,P.w,BH,8);ctx.fill();
   if(ci!==undefined&&on){ctx.fillStyle=ci===r?PAL['rj']:PAL['s2'];ctx.globalAlpha=0.08+0.8*disp[ci]*grow;rr(ctx,P.x,TY,P.w,BH,8);ctx.fill();ctx.globalAlpha=1;}
   ctx.strokeStyle=isIt?PAL['s4']:(i===11?PAL['s4']:PAL['line']);ctx.lineWidth=isIt||i===11?2.5:1.2;rr(ctx,P.x,TY,P.w,BH,8);ctx.stroke();
   const dark=ci!==undefined&&on&&disp[ci]*grow>0.55;
   txt(ctx,words[i],P.x+P.w/2,TY+BH/2+fs*0.35,{s:fs,w:600,c:dark?'#fff':PAL['cv-ink'],a:'center'});});
  if(big){const a=pos[1],b=pos[3];txt(ctx,'…',(a.x+a.w+b.x)/2,TY+BH/2+5,{s:fs,c:PAL['cv-soft'],a:'center'});const c=pos[6];txt(ctx,'…',(b.x+b.w+c.x)/2,TY+BH/2+5,{s:fs,c:PAL['cv-soft'],a:'center'});}
  txt(ctx,'“it” is asking: which word was too '+p.end+'?',itp.x+itp.w/2,TY+BH+20*Math.min(k,1.4),{s:12.5*Math.min(k,1.5),w:700,c:PAL['s4'],a:'center'});
  /* the table: word, key, score, e^score, share */
  const X=16,W=768,Y0=TY+BH+36*Math.min(k,1.4);
  ctx.fillStyle=PAL['card'];rr(ctx,X,Y0,W,440-Y0,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  const kk=big?Math.min(k,1.6):1,cols=big?[X+16,X+250,X+480,X+W-16]:[X+16,X+118,X+262,X+452,X+566,X+W-16];
  const heads=big?['Word','Score','e^score','Share']:['Word','Key: [big, small]','Score = q·k','e^score','Share of attention',''];
  let y=Y0+22*kk;
  heads.forEach((h,j)=>{if(h)txt(ctx,h,cols[j],y,{s:12*kk,w:700,c:PAL['cv-soft'],a:big&&j===3?'right':'left'});});
  const Q=q(sim);if(!big)txt(ctx,'q = '+vec(Q),cols[2]+92,y,{s:12*kk,w:700,c:PAL['s4']});
  y+=8*kk;const rh=(big?27:30)*kk,s=sc(sim),e=ex(sim),w=wts(sim),hideNums=!on;
  C.forEach((c,i)=>{const top=y;if(on&&i===r){ctx.fillStyle=PAL['rj'];ctx.globalAlpha=.1;rr(ctx,X+8,top,W-16,rh,8);ctx.fill();ctx.globalAlpha=1;}
   const by=top+rh/2+4*kk;
   txt(ctx,'“'+c.w+'”',cols[0],by,{s:13*kk,w:700});
   if(big){txt(ctx,(atLeast('ap')&&!on)?'?':f2(s[i]),cols[1],by,{s:12.5*kk});txt(ctx,hideNums?'?':f2(e[i]),cols[2],by,{s:12.5*kk});txt(ctx,hideNums?'?':pc(100*w[i]),cols[3],by,{s:13*kk,w:700,c:i===r?PAL['rj']:PAL['cv-ink'],a:'right'});}
   else{txt(ctx,vec(c.k),cols[1],by,{s:12.5});
    txt(ctx,atLeast('ap')&&!on?'?':(`${f2(Q[0])}×${f2(c.k[0])} + ${f2(Q[1])}×${f2(c.k[1])} = ${f2(s[i])}`),cols[2],by,{s:12.5});
    txt(ctx,hideNums?'?':'e^'+f2(s[i])+' = '+f2(e[i]),cols[3],by,{s:12.5});
    const bw=130,bx=cols[4];ctx.fillStyle=PAL['line'];rr(ctx,bx,top+rh/2-6,bw,12,6);ctx.fill();
    if(on){ctx.fillStyle=i===r?PAL['rj']:PAL['s2'];rr(ctx,bx,top+rh/2-6,Math.max(3,bw*disp[i]*grow),12,6);ctx.fill();}
    txt(ctx,hideNums?'?':pc(100*w[i]),cols[5],by,{s:13,w:700,c:i===r?PAL['rj']:PAL['cv-ink'],a:'right'});}
   y+=rh;});
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(X+10,y+2);ctx.lineTo(X+W-10,y+2);ctx.stroke();y+=18*kk;
  const S=e.reduce((a,b)=>a+b,0);
  txt(ctx,'Total',cols[0],y,{s:12.5*kk,w:700});
  if(big){txt(ctx,hideNums?'?':f2(S),cols[2],y,{s:12.5*kk,w:700});txt(ctx,on?'100%':'?',cols[3],y,{s:12.5*kk,w:700,a:'right'});}
  else{txt(ctx,hideNums?'Sum = ?':'Sum = '+f2(S),cols[3],y,{s:12.5,w:700});txt(ctx,on?'100%':'?',cols[5],y,{s:12.5,w:700,a:'right'});
   txt(ctx,'Share = e^score ÷ sum',cols[4],y,{s:12,c:PAL['cv-soft']});}
  y+=16*kk;
  if(pend(sim))txt(ctx,'Work out the share for “'+C[r].w+'” to see the numbers',400,Math.min(y+8*kk,432),{s:12*kk,c:PAL['cv-soft'],a:'center'});
  else if(on&&!big)txt(ctx,`The model reads “it” as “${C[topI(sim)].w}”: ${pc(100*w[topI(sim)])} of its attention.`,400,Math.min(y+8,432),{s:13,w:700,c:PAL['cv-ink'],a:'center'});
  if(G&&G.g&&!big)txt(ctx,'Your gut: '+(GUESS.find(g=>g.v===G.g.pick)||GUESS[1]).l,X+16,432,{s:12,w:700,c:PAL['s4']});},
 narrate(sim){const p=sim.p,w=wts(sim),r=refI(sim),t=topI(sim);
  if(!shown(sim))return 'The word “it” gives every earlier word a match score. The scores become shares of attention that add up to 100%. <b>How much of “it”’s attention goes to the word you know it means?</b>';
  if(p.x===0)return 'With no clue from the last word, every score is 0, so every word gets the same share: 33.3% each. <b>Attention needs a difference in scores to pick anything out.</b>';
  return `“It” sends <b>${pc(100*w[r])}</b> of its attention to “${C[r].w}”, ${pc(100*w[2])} to “fit” and ${pc(100*w[1-r])} to “${C[1-r].w}”. Change “${p.end}” to “${p.end==='big'?'small':'big'}” and the same sentence points to the ${p.end==='big'?'suitcase':'trophy'} instead: one word moved the attention.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'“It” refers to one of the earlier words. Attention splits 100% among “trophy,” “suitcase” and “fit.” What share do you think goes to the word “it” really means? Pick one, then lock it in.'},
  lock(sim){const g=GUESS.find(x=>x.v===sim.p.guess)||GUESS[1];return {v:Math.abs(refPct(sim)-g.n),pick:g.v,label:g.l};},
  solve(sim){sim.p.show=true;sim.st.ran=true;sim.st.grow=1;const best=GUESS.reduce((a,b)=>Math.abs(b.n-refPct(sim))<Math.abs(a.n-refPct(sim))?b:a);sim.p.guess=best.v;return {v:0,pick:best.v,label:pc(refPct(sim))};},
  hint:{bio:'Lock in your gut answer. Then you will work out the share yourself, the way the model does.'},
  calc:{unit:'%',d:1,tol:1,
   prompt:{bio:sim=>{const s=sc(sim),e=ex(sim),r=refI(sim);return `The match scores are trophy ${f2(s[0])}, suitcase ${f2(s[1])} and fit ${f2(s[2])}. The model raises e to each score: e<sup>${f2(s[0])}</sup> ≈ ${f2(e[0])}, e<sup>${f2(s[1])}</sup> ≈ ${f2(e[1])}, e<sup>${f2(s[2])}</sup> ≈ ${f2(e[2])}. A word’s share = its number ÷ the total of all three. What percent of the attention goes to “<b>${C[r].w}</b>”?`;},
    honors:sim=>{const s=sc(sim),r=refI(sim);return `Scores: trophy ${f2(s[0])}, suitcase ${f2(s[1])}, fit ${f2(s[2])}. Use share = e<sup>score</sup> ÷ (e<sup>trophy</sup> + e<sup>suitcase</sup> + e<sup>fit</sup>). What percent goes to “<b>${C[r].w}</b>”?`;},
    ap:sim=>{const Q=q(sim),r=refI(sim);return `q = ${vec(Q)}. Keys: trophy [2, 0], suitcase [0, 2], fit [0.5, 0.5]. Score each word with q·k, then apply the softmax. What percent of the attention goes to “<b>${C[r].w}</b>”?`;}},
   answer:refPct,
   hint:'Find e to the power of each score (or use the values given). Add the three. Divide the one you want by the total and multiply by 100.',
   steps(sim){const s=sc(sim),e=ex(sim),S=e.reduce((a,b)=>a+b,0),r=refI(sim),Q=q(sim),out=[];
    if(atLeast('ap'))out.push(`Scores: trophy ${vec(Q)}·[2, 0] = ${f2(s[0])}, suitcase ${vec(Q)}·[0, 2] = ${f2(s[1])}, fit ${vec(Q)}·[0.5, 0.5] = ${f2(s[2])}.`);
    out.push(`e<sup>score</sup>: ${C.map((c,i)=>c.w+' '+f2(e[i])).join(', ')}.`);
    out.push(`Total: ${e.map(f2).join(' + ')} = ${f2(S)}.`);
    out.push(`“${C[r].w}”: ${f2(e[r])} ÷ ${f2(S)} = ${(e[r]/S).toFixed(3)}, so <b>${pc(100*e[r]/S)}</b> of the attention.`);return out;}},
  formula(sim){const e=ex(sim),S=e.reduce((a,b)=>a+b,0);return C.map((c,i)=>`${c.w}: ${f2(e[i])} ÷ ${f2(S)} = ${pc(100*e[i]/S)}`).join('<br>');},
  how:{bio:'Turn each match score into a positive number with e<sup>score</sup>, add them up, and divide each one by the total. The shares always add to 100%, and the biggest score gets far more than its fair share.',
   ap:'softmax(s)<sub>i</sub> = e<sup>s<sub>i</sub></sup> ÷ Σ e<sup>s<sub>j</sub></sup>, with s = q·k. Adding the same number to every score leaves the shares unchanged; multiplying every score by a number above 1 sharpens them.'},
  compare(sim,g){const v=refPct(sim),gg=GUESS.find(x=>x.v===g.pick)||GUESS[1],K=sim.ui.calc,self=K&&K.done&&K.correct?' You also worked out the share yourself, the same way the model does.':'';
   if(Math.abs(v-gg.n)<8)return `Close: ${pc(v)} of “it”’s attention goes to “${C[refI(sim)].w}.” A score gap of ${f2(sc(sim)[refI(sim)]-sc(sim)[2])} points was enough to claim most of the attention.`+self;
   return `You guessed ${gg.l.toLowerCase()}. The model sends <b>${pc(v)}</b> to “${C[refI(sim)].w}.” `+(v>gg.n?'Exponentials stretch small score gaps into big differences in share.':'With a weak clue, the scores are close, so the attention stays spread out.')+self;},
  again(sim){const R=x=>x[Math.floor(Math.random()*x.length)];sim.p.end=R(['big','small']);sim.p.x=R([0.5,1,1.5,2,2.5,3]);sim.p.guess='60';sim.p.show=false;sim.st.ran=false;}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'Three words get e^score values of 20, 1 and 2 (rounded). What percent of the attention goes to the word with 20?',answer:100*20/23,tol:1,unit:'%',d:1,hint:'20 ÷ (20 + 1 + 2), then × 100.',explain:'20 + 1 + 2 = 23. 20 ÷ 23 ≈ 0.870, so about 87%. The other two share the last 13%.'},
  {lvl:'bio',instant:true,q:'You change “too big” to “too small.” Where does “it”’s attention go?',choices:['Still mostly to “trophy”','Mostly to “suitcase”','Evenly to all three words'],correct:1,explain:'A suitcase can be too small to hold something; a trophy cannot. The query from “it … too small” matches the suitcase’s key, so the suitcase gets the high score and most of the attention.'},
  {lvl:'bio',instant:true,q:'When the clue strength is 0, every match score is 0. What share does each of the three words get?',choices:['0% each','33.3% each','100% each'],correct:1,explain:'e⁰ = 1 for all three, so each share is 1 ÷ 3 ≈ 33.3%. With nothing to tell them apart, attention spreads evenly.'},
  {lvl:'honors',kind:'num',q:'Scores: trophy 2, suitcase 0, fit 0.5. What percent of the attention goes to “trophy”? (e² ≈ 7.389, e⁰ = 1, e^0.5 ≈ 1.649)',answer:100*Math.exp(2)/(Math.exp(2)+1+Math.exp(0.5)),tol:1,unit:'%',d:1,hint:'7.389 ÷ (7.389 + 1 + 1.649).',explain:'Total ≈ 10.038. 7.389 ÷ 10.038 ≈ 0.736, so about 73.6%. That is the clue strength set to 1.'},
  {lvl:'honors',instant:true,q:'You add 5 to every word’s score. What happens to the shares?',choices:['They stay the same','The top word gets more','They all become equal'],correct:0,explain:'Each e^(s + 5) = e⁵ · e^s, so every number is multiplied by e⁵ and the e⁵ cancels when you divide by the total. Only differences between scores matter.'},
  {lvl:'ap',kind:'num',q:'q = [3, 0]. Keys: trophy [2, 0], suitcase [0, 2], fit [0.5, 0.5]. What percent of the attention goes to “trophy”?',answer:100*Math.exp(6)/(Math.exp(6)+1+Math.exp(1.5)),tol:1,unit:'%',d:1,hint:'Scores are 6, 0 and 1.5. Then apply the softmax.',explain:'e⁶ ≈ 403.4, e⁰ = 1, e^1.5 ≈ 4.48. Total ≈ 408.9. 403.4 ÷ 408.9 ≈ 98.7%. Doubling the query made the attention far sharper.'},
  {lvl:'ap',instant:true,q:'Why do transformers divide the scores by √d (the vector length) before the softmax?',choices:['To make the shares add to 100%','Because long vectors give large dot products, and very large scores send almost all the attention to one word','To make every share equal'],correct:1,explain:'The softmax already makes shares add to 100%. Dot products of long vectors grow large, and huge score gaps push the softmax to nearly 0% and 100%, which makes learning harder. Dividing by √d keeps the scores in a workable range (Vaswani et al., 2017).'}
 ],
 tour:[
  {title:'A sentence you understand',text:'“The trophy didn’t fit in the suitcase because it was too big.” You know “it” is the trophy. A language model has to work that out from the words alone.',pause:true,setup:sim=>{BioLab.setValues(sim,{end:'big',x:1.5,show:false});sim.st.ran=false;},focus:[0,40,800,140]},
  {title:'Match scores',text:'“It” compares itself with each earlier word and gives it a match score. Here each word has a 2-number key: [can be too big to fit inside something, can be too small to hold something]. “It … too big” scores trophy 3, suitcase 0, fit 0.75.',pause:true,setup:sim=>{sim.st.ran=true;sim.st.grow=1;},focus:[16,180,768,260]},
  {title:'Scores become shares',text:'The model raises e to each score and divides by the total, so the shares add to 100%. e³ ≈ 20.1 is so much bigger than the others that “trophy” takes 86.6% of the attention.',pause:true,focus:[16,180,768,260]},
  {title:'Change one word',text:'Now the sentence ends “too small.” A suitcase can be too small to hold something, so the suitcase gets the high score and 86.6% of the attention. One word moved where “it” looks.',pause:true,setup:sim=>{BioLab.setValues(sim,{end:'small'});sim.st.ran=true;sim.st.grow=0;}},
  {lvl:'honors',title:'Sharper or softer',text:'Lower the clue strength and the shares spread out; at 0 they are 33.3% each. Raise it and the top word takes almost everything. Exponentials turn small score gaps into big share gaps.',pause:true,setup:sim=>{BioLab.setValues(sim,{end:'big',x:0.5});sim.st.ran=true;}},
  {lvl:'ap',title:'Query · key',text:'Each score is a dot product q·k. Real transformers have many “heads” doing this at once with vectors of 64 or more numbers, and divide each score by √d first so the softmax does not saturate.',pause:true,setup:sim=>{BioLab.setValues(sim,{end:'big',x:3});sim.st.ran=true;},focus:[16,180,768,260]}
 ],
 onTourExit(sim){},
 lab:{bio:'<p><b>Question:</b> How does the strength of the clue change where attention goes?</p><ol><li>Keep “too big.” Set the clue strength to 0, run the model, and record a trial.</li><li>Raise the strength by 0.5 at a time up to 3, recording a trial each time.</li><li>Repeat two of your settings with “too small.”</li></ol><p>Write one sentence about how the share to the right word changes as the clue gets stronger.</p>',
  honors:'<p><b>Question:</b> Does the share grow in a straight line as the clue gets stronger?</p><ol><li>Record the share to “trophy” at strengths 0, 0.5, 1, 1.5, 2, 2.5 and 3.</li><li>Graph share against strength.</li></ol><p>Describe the shape and explain it using e<sup>score</sup>.</p>',
  ap:'<p><b>Question:</b> At what clue strength does the right word first get more than 90% of the attention?</p><ol><li>Write the share to “trophy” as a function of x, using q = [x, 0].</li><li>Solve for the share = 0.9 and check your answer with the tool.</li></ol><p><b>CER:</b> Is a 99% attention share proof that the model “understands” the sentence? Use the idea that attention is one step among many layers.</p>'},
 terms:[
  {t:'Attention',d:'The step in a language model where each word decides how much to draw on every other word. The shares add up to 100%.'},
  {t:'Match score',d:'How well two words fit together for the question one of them is asking. Higher scores get more attention.'},
  {t:'Softmax',d:'Turning scores into shares: raise e to each score, then divide by the total. The biggest score gets more than its fair share.'},
  {t:'Query and key',d:'Each word has a query (what it is looking for) and a key (what it offers). The match score is the dot product of one word’s query with another word’s key.',lvl:'honors'},
  {t:'Attention head',d:'One set of query and key vectors. Real models run many heads at once, each picking up a different kind of link between words.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Three candidate words have invented 2-number keys. The query from “it” is [x, 0] for “too big” and [0, x] for “too small.” Score = q·k and share = e<sup>score</sup> ÷ Σ e<sup>score</sup>. A real transformer computes attention from every word to every word, in many heads and layers at once, with learned vectors hundreds of numbers long, and divides scores by √d.</p><p><b>The sentence.</b> The trophy-and-suitcase sentence is a Winograd schema, a test of whether a system can tell what a pronoun refers to when only common sense decides it: Hector Levesque, Ernest Davis and Leora Morgenstern, “The Winograd Schema Challenge” (2012).</p><p><b>Where attention comes from.</b> Ashish Vaswani and colleagues, “Attention Is All You Need” (2017), introduced the transformer and scaled dot-product attention, softmax(QK<sup>T</sup> ÷ √d)V. The models behind today’s chatbots are built on it.</p><p><b>What attention weights hide.</b> Researchers disagree about how much attention weights explain a model’s choices: Sarthak Jain and Byron Wallace, “Attention is not Explanation” (2019), and Sarah Wiegreffe and Yuval Pinter, “Attention is not not Explanation” (2019). A high weight shows where one step looked, not why the whole model answered as it did.</p><p><b>Two kinds of attention.</b> A model splits 100% of its attention among words. You split 24 hours among everything you do, and apps are scored on how much of it they get. Pew Research Center (December 2024, a survey of 1,391 U.S. teens ages 13 to 17) found that 46% say they are online almost constantly, up from 24% a decade earlier.</p>'
};
BioLab.register(SIM);
})();
