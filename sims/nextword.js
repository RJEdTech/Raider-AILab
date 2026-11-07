(function(){
'use strict';
const {clamp,txt,rr,rng,PAL,FONT,axes,legend,atLeast,fmtNum}=BioLab.h;
/* Three short original training passages. The model reads one, lower-cased, with "." kept as its own token.
   opts are the four choices for the gut question "what most often comes after the?" (shown in this order). */
const PASS={
 recipe:{l:'Recipe',name:'a recipe for scrambled eggs',opts:['pan','eggs','salt','butter'],
  text:'Crack the eggs into the bowl. Whisk the eggs with a pinch of salt. Melt the butter in the pan. Pour the eggs into the pan. Stir the eggs slowly. Take the pan off the heat when the eggs look soft. Serve the eggs on toast.'},
 game:{l:'Game recap',name:'a soccer game recap',opts:['game','team','Raiders','crowd'],
  text:'The Raiders won the game two to one. The other team scored first. Then the Raiders pressed hard and the keeper made a big save. In the second half the Raiders scored twice. The crowd cheered and the team celebrated the win.'},
 news:{l:'Announcements',name:'the morning announcements',opts:['school','library','bus','robotics'],
  text:'Good morning. The library is open after school today. The robotics club meets after school in the lab. The bus for the game leaves after lunch. Bring your ID to the library. The choir meets in the chapel after school. Have a great day.'}
};
const ORDER=['recipe','game','news'];
const EPS=0.0005;          /* total chance shared by every word that never followed this context: real models never give a token exactly zero */
const CUE='the',MAXT=80;
const low=w=>w.toLowerCase();
function build(key){const P=PASS[key];if(P.m)return P.m;
 const disp=P.text.split(/\s+/),toks=['.'],map=[-1];
 disp.forEach((w,di)=>{const c=w.toLowerCase().replace(/[^a-z0-9']/g,'');if(c){toks.push(c);map.push(di);}if(/\.$/.test(w)){toks.push('.');map.push(di);}});
 const bi={},tri={},inc=(o,a,b)=>{(o[a]=o[a]||{})[b]=(o[a][b]||0)+1;};
 for(let i=0;i<toks.length-1;i++){inc(bi,toks[i],toks[i+1]);if(i>0)inc(tri,toks[i-1]+' '+toks[i],toks[i+1]);}
 const V=[...new Set(toks)];const nice={};disp.forEach((w,i)=>{const c=w.replace(/[^A-Za-z0-9']/g,'');const start=i===0||/\.$/.test(disp[i-1]);if(c&&!start)nice[low(c)]=c;});
 P.m={disp,toks,map,V,bi,tri,nice,str:' '+toks.join(' ')+' ',words:toks.filter(t=>t!=='.').length};return P.m;}
const M=sim=>build(PASS[sim.p.passage]?sim.p.passage:'recipe');
const nice=(m,w)=>w==='.'?'. (end)':(m.nice[w]||w);
const ord=sim=>atLeast('honors')&&+sim.p.order===2?2:1;
/* The next-word distribution after a context, at temperature T: P_i ∝ exp(log p_i / T). */
function dist(m,ctxT,order,T){let tab=null,key,back=false;
 if(order===2&&ctxT.length>=2){const k2=ctxT[ctxT.length-2]+' '+ctxT[ctxT.length-1];if(m.tri[k2]){tab=m.tri[k2];key=k2;}else back=true;}
 if(!tab){key=ctxT[ctxT.length-1];tab=m.bi[key]||{};}
 let tot=0;for(const w in tab)tot+=tab[w];const nSeen=Object.keys(tab).length,un=m.V.length-nSeen,eps=un>0&&tot>0?EPS:0;
 const rows=m.V.map(w=>{const c=tab[w]||0;const p0=tot>0?(c?(1-eps)*c/tot:eps/un):1/m.V.length;return {w,c,p0};});
 const lg=rows.map(r=>Math.log(r.p0)/T),mx=Math.max(...lg);let Z=0;rows.forEach((r,i)=>{r.e=Math.exp(lg[i]-mx);Z+=r.e;});rows.forEach(r=>{r.p=r.e/Z;});
 rows.sort((a,b)=>b.p-a.p||b.c-a.c||(a.w<b.w?-1:1));
 const unseenP=rows.reduce((s,r)=>s+(r.c?0:r.p),0);
 return {rows,tot,key,back,unseenP,order:back?1:order};}
const cur=sim=>dist(M(sim),sim.st.toks,ord(sim),sim.p.temp);
const cueRows=sim=>{const m=M(sim),tab=m.bi[CUE]||{};let tot=0;for(const w in tab)tot+=tab[w];return {tab,tot};};
const cueCount=(sim,w)=>{const {tab}=cueRows(sim);return tab[low(w)]||0;};
const topOpt=sim=>{const o=PASS[sim.p.passage].opts;let bi=0;o.forEach((w,i)=>{if(cueCount(sim,w)>cueCount(sim,o[bi]))bi=i;});return bi;};
const TOUR=sim=>!!(sim.tour&&sim.tour.on);
const GS=sim=>sim.gutS&&sim.gutS.g?sim.gutS:null;
/* while the student works out their word's share ("Your turn"), the counts stay hidden */
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const shown=sim=>!!(sim.p.show||(GS(sim)&&!pend(sim))||sim.st.toks.length>2||TOUR(sim));
/* the student's pick (the locked one if there is one) and its share of the words after "the" */
const myW=sim=>{const g=sim.gutS&&sim.gutS.g;return g&&g.w?g.w:PASS[sim.p.passage].opts[+sim.p.guess]||PASS[sim.p.passage].opts[0];};
const shareOf=(sim,w)=>{const {tot}=cueRows(sim);return tot?100*cueCount(sim,w)/tot:0;};
const pr1=v=>(Math.round(v*10)/10).toString()+'%';
function sample(sim){const d=cur(sim);let u=sim.st.r(),i=0;for(;i<d.rows.length-1;i++){u-=d.rows[i].p;if(u<=0)break;}return d.rows[i].w;}
function write(sim,n){for(let i=0;i<n&&sim.st.toks.length<MAXT;i++)sim.st.toks.push(sample(sim));sim.infoDirty=true;}
function startOver(sim,seed){sim.st.toks=['.',CUE];sim.st.r=rng(seed||sim.st.seed||7);sim.infoDirty=true;}
/* stats on the words the model wrote after the prompt */
function stats(sim){const t=sim.st.toks,m=M(sim),key=sim.p.passage+'|'+t.length+'|'+t[t.length-1];if(sim.st._sk===key)return sim.st._s;
 const pairs=[];for(let i=2;i<t.length;i++)pairs.push(t[i-1]+' '+t[i]);
 const seen=pairs.filter(p=>{const [a,b]=p.split(' ');return m.bi[a]&&m.bi[a][b];}).length,distinct=new Set(pairs).size;
 let best=0;const s=t.slice(1);for(let i=0;i<s.length;i++){for(let j=s.length;j>i+best-1&&j>i;j--){const seg=s.slice(i,j);if(m.str.indexOf(' '+seg.join(' ')+' ')>=0){const n=seg.filter(x=>x!=='.').length;if(n>best)best=n;break;}}}
 const r={n:pairs.length,words:t.slice(2).filter(x=>x!=='.').length,seen:pairs.length?100*seen/pairs.length:null,variety:pairs.length?100*distinct/pairs.length:null,copy:best};
 sim.st._sk=key;sim.st._s=r;return r;}
const pc=v=>Math.round(v*100)+'%';
const pc1=v=>(Math.round(v*1000)/10)+'%';  /* one decimal, trailing zero dropped */
const q=w=>'“'+w+'”';
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
function relabel(sim){const w=sim.ui&&sim.ui.ctlW&&sim.ui.ctlW.guess;if(!w)return;const key=sim.p.passage;if(w._rl===key)return;w._rl=key;
 const o=PASS[key].opts;w.querySelectorAll('.seg button').forEach((b,i)=>{if(o[i])b.textContent=o[i];});}
function newPassage(sim){startOver(sim);clearGut(sim);relabel(sim);}
/* lay out words in a box; returns positions so we can highlight */
function flow(ctx,words,x0,y0,w,lh,fs,bold){ctx.font='700 '+fs+'px '+FONT;const sp=ctx.measureText(' ').width;let x=x0,y=y0,lines=1;const pos=[];
 words.forEach(s=>{const ww=ctx.measureText(s).width;if(x>x0&&x+ww>x0+w){x=x0;y+=lh;lines++;}pos.push({x,y,w:ww});x+=ww+sp;});return {pos,lines,h:lines*lh};}
function genWords(sim){const t=sim.st.toks,m=M(sim),out=[];let cap=true;
 for(let i=1;i<t.length;i++){const w=t[i];if(w==='.'){if(out.length)out[out.length-1].s+='.';else out.push({s:'.',i});cap=true;continue;}
  let s=nice(m,w);if(cap)s=s.charAt(0).toUpperCase()+s.slice(1);cap=false;const prev=t[i-1];out.push({s,i,odd:i>=2&&!(m.bi[prev]&&m.bi[prev][w])});}
 return out;}

const SIM={
 id:'nextword',hash:'nextword',apUnit:1,order:1,tab:'Next Word',kind:'Simulation',
 skills:{bio:'Conditional relative frequency: count(the, next word) ÷ count(the) · Statistics (two-way tables and conditional probability)',ap:'Conditional probability, softmax with temperature, and entropy · AP Statistics, Precalculus (exponents and logarithms)'},
 card:'Build a tiny language model from one short passage, guess the word it will write next, then watch it write with the temperature turned up or down.',
 title:'Next Word: build a tiny language model',
 lede:{bio:'A chatbot writes one word at a time. Each time, it asks one question: given what came before, which word is likely next? This tiny model answers by counting: the chance of a word after “the” is the number of times it follows “the” divided by the number of times “the” appears.',
  honors:'This toy is an n-gram model. A bigram model looks at one word of context and a trigram model looks at two. Real chatbots use the same idea with far longer context and pieces of words called tokens.',
  ap:'The model turns counts into probabilities p_i, then reshapes them with a temperature T: P_i ∝ exp(log p_i / T). That is a softmax over log-probabilities, the same knob real language models expose.'},
 scale:'One short passage of about 45 words is the model’s entire training text. A large model like Meta’s Llama 3 trained on more than 15 trillion tokens.',
 aspect:4/3,timeless:true,trials:true,graph:true,
 controlsTitle:'Your model',
 controls:[
  {id:'guess',label:'Your guess: the word that most often comes right after “the”',type:'seg',def:0,options:[{v:0,l:'pan'},{v:1,l:'eggs'},{v:2,l:'salt'},{v:3,l:'butter'}]},
  {id:'passage',label:'Training text',type:'seg',def:'recipe',noGut:true,onChange:newPassage,options:ORDER.map(k=>({v:k,l:PASS[k].l})),help:'Each passage is short and original. The model knows nothing but the passage you pick.'},
  {id:'temp',label:'Temperature: how adventurous the picks are',type:'range',min:0.1,max:3,step:0.1,def:1,noGut:true,help:'Low: it almost always takes the most likely word. 1: it picks in proportion to the counts. High: long shots get a real chance.'},
  {id:'order',label:'Context: words the model looks back at',type:'seg',def:1,lvl:'honors',noGut:true,options:[{v:1,l:'1 word (bigram)'},{v:2,l:'2 words (trigram)'}],help:'With 2 words, if that pair never appeared in the passage, the model falls back to 1 word.'},
  {id:'show',label:'Show the counts now',type:'toggle',def:false,noGut:true,help:'Normally the counts appear once you lock in your guess or the model writes a word.'}
 ],
 actions:[
  {id:'next',label:'Write the next word',primary:true,run(sim){write(sim,1);}},
  {id:'ten',label:'Write 10 more words',run(sim){write(sim,10);}},
  {id:'clear',label:'Start over',run(sim){startOver(sim);}}
 ],
 init(sim){const st={toks:['.',CUE],seed:7};st.r=rng(7);return st;},step(){},
 metrics:[
  {id:'top',label:'Chance of the most likely next word',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?100*cur(sim).rows[0].p:null},
  {id:'words',label:'Words written',unit:'words',d:0,min:0,max:80,get:sim=>stats(sim).words},
  {id:'seen',label:'Word pairs that appear in the passage',unit:'%',d:0,min:0,max:100,get:sim=>stats(sim).seen},
  {id:'variety',label:'Different word pairs',unit:'%',d:0,min:0,max:100,get:sim=>stats(sim).variety},
  {id:'copy',label:'Longest stretch copied word for word',unit:'words',d:0,lvl:'honors',min:0,max:null,get:sim=>stats(sim).copy},
  {id:'ent',label:'Uncertainty about the next word (entropy)',unit:'bits',d:2,lvl:'ap',min:0,max:null,get:sim=>shown(sim)?cur(sim).rows.reduce((s,r)=>s-(r.p>0?r.p*Math.log2(r.p):0),0):null}
 ],
 graphs:[{id:'tcurve',label:'Next-word chances vs. temperature',custom:true}],defaultGraph:'tcurve',
 plot(sim,ctx,box){const m=M(sim),T0=sim.p.temp,d=cur(sim),top=d.rows.slice(0,3).map(r=>r.w);
  const ax=axes(ctx,box,{xmin:0,xmax:3,ymin:0,ymax:100,xl:'Temperature',yl:'Chance (%)'});
  if(!shown(sim)){txt(ctx,'Lock in your guess to see the chances',box.L+box.W/2,box.T+box.H/2,{s:13,c:PAL['muted'],a:'center'});return;}
  const lines=top.map((w,i)=>({w,lab:nice(m,w),col:PAL['s'+(i+1)]}));lines.push({w:null,lab:'words never seen next',col:PAL['muted'],dash:true});
  lines.forEach(L=>{ctx.strokeStyle=L.col;ctx.lineWidth=2.5;ctx.setLineDash(L.dash?[6,5]:[]);ctx.beginPath();for(let T=0.1;T<=3.0001;T+=0.05){const dd=dist(m,sim.st.toks,ord(sim),T);const v=L.w?dd.rows.find(r=>r.w===L.w).p:dd.unseenP;const px=ax.X(T),py=ax.Y(100*v);T<0.11?ctx.moveTo(px,py):ctx.lineTo(px,py);}ctx.stroke();ctx.setLineDash([]);});
  ctx.strokeStyle=PAL['rj'];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ax.X(T0),box.T);ctx.lineTo(ax.X(T0),box.T+box.H);ctx.stroke();
  const lx=box.L+box.W-178;lines.forEach((L,i)=>{const y=box.T+14+i*19;ctx.strokeStyle=L.col;ctx.lineWidth=3;ctx.setLineDash(L.dash?[5,4]:[]);ctx.beginPath();ctx.moveTo(lx,y);ctx.lineTo(lx+18,y);ctx.stroke();ctx.setLineDash([]);txt(ctx,L.lab,lx+24,y,{s:13,c:PAL['muted'],b:'middle'});});},
 draw(sim,ctx,vdt,k){relabel(sim);const m=M(sim),P=PASS[sim.p.passage],sh=shown(sim),d=cur(sim),t=sim.st.toks,wide=k<1.3,H=600;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,H);
  const fs=wide?15*k:12*k,lh=fs*(wide?1.5:1.38),hs=fs,pad=14,hh=hs*2.3;
  const box=(x,y,w,h,fill,stroke)=>{if(w<4||h<4)return;rr(ctx,x,y,w,h,10);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}};
  const ctxW=d.order===2?[t[t.length-2],t[t.length-1]]:[t[t.length-1]];
  /* panel 1: the training text */
  const x1=14,W1=wide?440:772;
  const fl=flow(ctx,m.disp,x1+pad,0,W1-2*pad,lh,fs);
  /* panel 2: what comes next */
  const x2=wide?468:14,W2=wide?318:772;
  const nb=wide?6:3,rh=wide?fs*1.9:fs*1.5,tick=atLeast('honors')&&Math.abs(sim.p.temp-1)>0.05;
  const G=GS(sim),onCue=t.length===2&&ctxW[ctxW.length-1]===CUE,gw=G&&sh&&onCue?low(PASS[sim.p.passage].opts[G.g.i]):null,extra=gw&&!d.rows.slice(0,nb).some(r=>r.w===gw);
  const back=d.back&&ord(sim)===2;
  const h1n=hh+fl.h+8,h2n=hh+(back?lh:0)+(nb+1)*rh+(extra?rh:0)+(tick?rh*0.8:0)+8;
  const h1=wide?Math.max(h1n,h2n):h1n,h2=wide?h1:h2n,y1=8,y2=wide?8:8+h1+10;
  box(x1,y1,W1,h1,PAL['cv-bg2']);
  txt(ctx,'What the model read',x1+pad,y1+hs*1.5,{s:hs,w:700,c:PAL['cv-ink']});
  txt(ctx,m.words+' words',x1+W1-pad,y1+hs*1.5,{s:12*k,c:PAL['cv-soft'],a:'right'});
  const oy=y1+hh+fs*0.9;
  const hiCtx=new Set(),hiNext=new Set();
  for(let i=ctxW.length-1;i<m.toks.length-1;i++){let ok=true;for(let j=0;j<ctxW.length;j++)if(m.toks[i-ctxW.length+1+j]!==ctxW[j])ok=false;if(!ok)continue;
   for(let j=0;j<ctxW.length;j++){const di=m.map[i-ctxW.length+1+j];if(di>=0&&m.toks[i-ctxW.length+1+j]!=='.')hiCtx.add(di);}
   const dn=m.map[i+1];if(dn>=0&&m.toks[i+1]!=='.')hiNext.add(dn);}
  m.disp.forEach((w,i)=>{const p=fl.pos[i],y=oy+p.y;
   if(hiCtx.has(i)){ctx.fillStyle=PAL['s4'];ctx.globalAlpha=.35;rr(ctx,p.x-2,y-fs*0.95,p.w+4,fs*1.3,4);ctx.fill();ctx.globalAlpha=1;}
   const nx=sh&&hiNext.has(i);
   txt(ctx,w,p.x,y,{s:fs,w:nx?700:400,c:nx?PAL['s2']:PAL['cv-ink']});
   if(nx){ctx.strokeStyle=PAL['s2'];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,y+3);ctx.lineTo(p.x+p.w,y+3);ctx.stroke();}});
  box(x2,y2,W2,h2,PAL['cv-bg2']);
  const ctxLabel=ctxW.length===1&&ctxW[0]==='.'?'a period':ctxW.map(w=>w==='.'?'.':nice(m,w)).join(' ').replace(' .','.');
  txt(ctx,'After '+q(ctxLabel)+' comes…',x2+pad,y2+hs*1.5,{s:hs,w:700,c:PAL['cv-ink']});
  if(back)txt(ctx,'That word pair never appeared, so it uses 1 word.',x2+pad,y2+hh+fs*0.4,{s:12*k,c:PAL['cv-soft']});
  sim._L={pass:[x1,y1,W1,h1],bars:[x2,y2,W2,h2]};
  const by0=y2+hh+(back?lh:0);
  if(!sh){txt(ctx,'?',x2+W2/2,by0+rh*1.7,{s:44*Math.min(k,1.3),w:700,c:PAL['cv-soft'],a:'center'});
   txt(ctx,pend(sim)?'Count first: your word’s share.':'Lock in your guess to see the counts.',x2+W2/2,by0+rh*2.9,{s:12*k,c:PAL['cv-soft'],a:'center'});}
  else{const rows=d.rows.slice(0,nb),rest=d.rows.slice(nb).reduce((s,r)=>s+r.p,0);
   const items=rows.map(r=>({lab:nice(m,r.w),p:r.p,c:r.c,w:r.w,p0:r.p0}));items.push({lab:'all others',p:rest,c:null,w:null});
   ctx.font='700 '+fs+'px '+FONT;const pw=ctx.measureText(wide?'99.9% · 12/12':'99.9%').width+10;
   ctx.font='700 '+fs+'px '+FONT;const wl=Math.max(...items.map(it=>ctx.measureText(it.lab).width))+12;
   const bx=x2+pad+wl,bw=Math.max(30,W2-2*pad-wl-pw);
   items.forEach((it,i)=>{const y=by0+i*rh+rh*0.5;const col=it.w===null?PAL['muted']:(i===0?PAL['s3']:PAL['s2']);const mark=gw&&it.w===gw;
    txt(ctx,it.lab,x2+pad,y+fs*0.35,{s:fs,w:mark||i===0?700:400,c:mark?PAL['s4']:PAL['cv-ink']});
    ctx.fillStyle=PAL['line'];ctx.globalAlpha=.5;rr(ctx,bx,y-5*k,bw,10*k,4);ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle=col;rr(ctx,bx,y-5*k,Math.max(3,bw*it.p),10*k,4);ctx.fill();
    if(atLeast('honors')&&it.p0!==undefined&&Math.abs(sim.p.temp-1)>0.05){ctx.strokeStyle=PAL['cv-ink'];ctx.lineWidth=2;const xx=bx+bw*it.p0;ctx.beginPath();ctx.moveTo(xx,y-8*k);ctx.lineTo(xx,y+8*k);ctx.stroke();}
    txt(ctx,pc1(it.p)+(wide&&it.c?' · '+it.c+'/'+d.tot:''),x2+W2-pad,y+fs*0.35,{s:fs,w:700,c:PAL['cv-ink'],a:'right'});});
   if(tick){const yt=by0+(nb+1+(extra?1:0))*rh+rh*0.35;ctx.strokeStyle=PAL['cv-ink'];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x2+pad+3,yt-7*k);ctx.lineTo(x2+pad+3,yt+5*k);ctx.stroke();txt(ctx,'= its chance at temperature 1',x2+pad+12,yt+4*k,{s:12*k,c:PAL['cv-soft']});}
   if(extra)txt(ctx,'Your guess, '+q(PASS[sim.p.passage].opts[G.g.i])+': '+cueCount(sim,gw)+' of '+d.tot+' times',x2+pad,by0+(nb+1)*rh+rh*0.5+fs*0.35,{s:fs,w:700,c:PAL['s4']});}
  /* panel 3: what the model has written */
  const y3=Math.max(y1+h1,y2+h2)+12,x3=14,W3=772;
  const gw2=genWords(sim),odd=gw2.some(g=>g.odd);const room=H-8-y3-hh-(odd?lh:0)-8;const maxL=Math.max(1,Math.floor(room/lh));
  let start=0,fl3=flow(ctx,gw2.map(g=>g.s),x3+pad,0,W3-2*pad,lh,fs,true);
  while(fl3.lines>maxL&&start<gw2.length-1){start++;fl3=flow(ctx,['…'].concat(gw2.slice(start).map(g=>g.s)),x3+pad,0,W3-2*pad,lh,fs,true);}
  const h3=H-8-y3;
  box(x3,y3,W3,h3,PAL['card'],PAL['line']);
  txt(ctx,'What the model has written',x3+pad,y3+hs*1.5,{s:hs,w:700,c:PAL['cv-ink']});
  txt(ctx,'temperature '+sim.p.temp.toFixed(1),x3+W3-pad,y3+hs*1.5,{s:12*k,c:PAL['cv-soft'],a:'right'});
  sim._L.gen=[x3,y3,W3,h3];
  const shownW=(start?[{s:'…',i:-1}]:[]).concat(gw2.slice(start)),oy3=y3+hh+fs*0.9,lastI=t.length-1;
  shownW.forEach((g,j)=>{const p=fl3.pos[j];const isCtx=g.i>lastI-ctxW.length&&g.i>=0;
   if(isCtx){ctx.fillStyle=PAL['s4'];ctx.globalAlpha=.35;rr(ctx,p.x-2,oy3+p.y-fs*0.95,p.w+4,fs*1.3,4);ctx.fill();ctx.globalAlpha=1;}
   txt(ctx,g.s,p.x,oy3+p.y,{s:fs,w:700,c:g.odd?PAL['s1']:PAL['cv-ink']});
   if(g.odd){ctx.strokeStyle=PAL['s1'];ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(p.x,oy3+p.y+3);ctx.lineTo(p.x+p.w,oy3+p.y+3);ctx.stroke();ctx.setLineDash([]);}});
  if(odd)txt(ctx,'Red: a word pair that never appears in the passage',x3+pad,oy3+fl3.h+fs*0.3,{s:12*k,c:PAL['s1'],w:700});},
 narrate(sim){const m=M(sim),d=cur(sim),t=sim.st.toks,T=sim.p.temp,top=d.rows[0],s=stats(sim);
  if(pend(sim))return `Your guess is locked. <b>Now count:</b> every “the” in the passage is highlighted. How often is your word the one right after it?`;
  if(!shown(sim))return `The model has read only ${PASS[sim.p.passage].name}. It just wrote ${q(CUE)}. <b>Which word does it think comes next?</b> It decides by counting what followed ${q(CUE)} in the passage.`;
  const last=t[t.length-1]==='.'?'the end of a sentence':q(nice(m,t[t.length-1]));
  let tail='';if(T<=0.4)tail=` At temperature ${T.toFixed(1)} it almost always takes the favorite, <b>so the same phrases keep coming back</b>.`;
  else if(T>=2)tail=` At temperature ${T.toFixed(1)}, long shots get a real chance: words that never followed this context now have <b>${pc(d.unseenP)}</b> combined, so the text drifts into nonsense.`;
  else tail=` At temperature ${T.toFixed(1)} it picks roughly in proportion to the counts, so it usually sounds like the passage but does not copy it exactly.`;
  const base=d.tot>0&&top.c?`After ${last}, ${q(nice(m,top.w))} came next ${top.c} of ${d.tot} times in the passage, so it gets <b>${pc(top.p)}</b> right now.`:`After ${last}, the top word has <b>${pc(top.p)}</b>.`;
  return base+tail+(s.n&&s.seen<100?` ${Math.round(100-s.seen)}% of the word pairs it wrote never appear in the passage.`:'');},
 gut:{better:'higher',controls:['guess'],lockLabel:'Lock in my guess',
  ask:{bio:'The model has read the passage in the picture and just wrote “the”. Which word do you think most often comes right after “the” in that passage? Pick one here, then lock it in.',
   honors:'Before you see any counts: which word most often follows “the” in this passage? Pick one here and lock it in.'},
  lock(sim){const i=+sim.p.guess,w=PASS[sim.p.passage].opts[i];return {v:cueCount(sim,w),i,w,label:q(w)};},
  solve(sim){const i=topOpt(sim),w=PASS[sim.p.passage].opts[i],{tot}=cueRows(sim);sim.p.guess=i;startOver(sim);const c=cueCount(sim,w);return {v:c,i,w,label:`${q(w)}, which follows “the” ${c} of ${tot} times`};},
  hint:{bio:'Lock in your guess. Then you will count your word’s share yourself.'},
  calc:{unit:'%',d:1,tol:1,
   prompt:{bio:sim=>{const {tot}=cueRows(sim);return `In the passage, “the” appears <b>${tot}</b> times (highlighted). Count how many of them are followed right away by <b>${q(myW(sim))}</b>, your pick. What percent of the time does ${q(myW(sim))} come right after “the”? That share is the chance the model gives it at temperature 1.`;},
    ap:sim=>`Find the maximum-likelihood estimate p(${myW(sim)} | the) = count(the, ${myW(sim)}) ÷ count(the) from the passage, as a percent.`},
   answer:sim=>shareOf(sim,myW(sim)),
   hint:'Look at the word right after each highlighted “the”. Count the matches, then divide by the number of “the”s.',
   steps(sim){const w=myW(sim),{tot}=cueRows(sim),c=cueCount(sim,w);
    return [`“the” appears ${tot} times with a word after it.`,`${q(w)} comes right after “the” ${c} time${c===1?'':'s'}.`,`${c} ÷ ${tot} = ${(c/tot).toFixed(3)}, so <b>${pr1(shareOf(sim,w))}</b>.`];}},
  formula(sim){const m=PASS[sim.p.passage].opts[topOpt(sim)],{tot}=cueRows(sim),c=cueCount(sim,m),g=sim.gutS&&sim.gutS.g&&sim.gutS.g.w,line=`p(${m} | the) = count(the, ${m}) ÷ count(the) = ${c} ÷ ${tot} = ${pr1(100*c/tot)}`;
   if(!g||low(g)===low(m))return line;const cg=cueCount(sim,g);return line+`<br>Your pick: p(${g} | the) = ${cg} ÷ ${tot} = ${pr1(100*cg/tot)}`;},
  how:{bio:'The math is counting. Find every “the” in the passage and look at the word right after it. The word that shows up there most often is the best bet, and its share of the count is its chance.',
   ap:'Maximum-likelihood bigram estimate: p(w | the) = count(the, w) / count(the). The best single prediction is the word with the largest count.'},
  compare(sim,g,m){const {tot}=cueRows(sim),diff=m.v-g.v,all=(M(sim).toks.filter(x=>x===low(g.w)).length);
   const tail=' That is the whole trick of a language model: count what follows what, then bet on it. A real chatbot makes the same kind of bet with a neural network that learned from trillions of words.';
   const K=sim.ui&&sim.ui.calc,self=K&&K.done&&K.correct?' You also counted your word’s share yourself.':'';
   if(diff<=0)return `Your gut was right on. If you predicted the word after every “the” in this passage, ${q(g.w)} would be right <b>${g.v} times out of ${tot}</b>, more than any other word. You just did what a language model does.`+tail+self;
   return `If you predicted the word after every “the” in this passage, your pick ${q(g.w)} would be right <b>${g.v} time${g.v===1?'':'s'} out of ${tot}</b>. The count’s pick ${q(m.w)} would be right <b>${m.v} times out of ${tot}</b>: ${diff} more right guess${diff===1?'':'es'}.`+(g.v===0&&all>0?` ${q(g.w)} shows up ${all} time${all===1?'':'s'} in the passage, but never right after “the”: a common word is not the same as a common <i>next</i> word.`:'')+tail+self;},
  again(sim){const i=ORDER.indexOf(sim.p.passage);sim.p.passage=ORDER[(i+1)%ORDER.length];sim.p.guess=0;sim.p.show=false;startOver(sim);relabel(sim);}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'Game recap: “The Raiders won the game two to one. The other team scored first. Then the Raiders pressed hard and the keeper made a big save. In the second half the Raiders scored twice. The crowd cheered and the team celebrated the win.” “The” appears 10 times. What percent of the time does “Raiders” come right after it?',answer:30,tol:1,unit:'%',d:0,hint:'Count the “the Raiders” pairs (capital letters count too), then divide by 10.',explain:'“the Raiders” appears 3 times: “The Raiders won”, “the Raiders pressed” and “the Raiders scored”. 3 ÷ 10 = 30%. A model trained on this recap gives “Raiders” a 30% chance after “the”.'},
  {lvl:'bio',instant:true,q:'In the recipe, “the” is followed by “eggs” 6 times out of 12. At temperature 1, what chance does the model give “eggs” after “the”?',choices:['100%','50%','25%','8%'],correct:1,explain:'At temperature 1 the chance is the count share: 6 ÷ 12 = 50%. So half the time it writes “eggs” and half the time something else, mostly “pan” (3 of 12, 25%). That is why the same prompt can give different text.'},
  {lvl:'bio',instant:true,q:'You turn the temperature down to 0.1 and press Write 10 more words. What happens?',choices:['The writing gets more varied','It repeats the same phrases','It stops writing'],correct:1,explain:'At temperature 0.1, “eggs” (6 of 12) gets almost 100% after “the”, and “into” and “the” win their turns too, so the recipe model writes “the eggs into the eggs into the…”. Low temperature is safe and repetitive.'},
  {lvl:'bio',instant:true,q:'You turn the temperature up to 3. Why does the text turn into nonsense?',choices:['The model learns new words','Long shots get a real chance, including words that never came next in the passage','The passage gets shuffled'],correct:1,explain:'Temperature flattens the chances. After “the” in the recipe at temperature 3, words that never followed “the” share about 19% of the chance, up from 0.05% at temperature 1. Pick enough of those and the sentences fall apart.'},
  {lvl:'honors',instant:true,q:'Switch from 1 word of context (bigram) to 2 words (trigram). What happens to the longest stretch the model copies word for word from the passage?',choices:['It gets longer','It gets shorter','It stays the same'],correct:0,explain:'In the recipe, 38 of the 42 two-word pairs have only one word that ever follows them. So the trigram model mostly has one choice, and it ends up retracing the passage. More context makes text more sensible, but with too little training text it starts to memorize.'},
  {lvl:'honors',instant:true,q:'Why can a model trained only on the recipe never write the word “pizza”?',choices:['It knows pizza does not belong in this recipe','“pizza” never appears in its training text, so it has no token for it','The temperature is too low'],correct:1,explain:'This toy can only choose among the words it has read. Real models split text into subword tokens, so they can spell new words, but they still lean on patterns from their training data.'},
  {lvl:'ap',instant:true,q:'After some word, the counts give three words chances of 0.6, 0.3 and 0.1. At temperature T = 0.5, what does the top word’s chance become?',choices:['60%','67%','78%','90%'],correct:2,explain:'P_i ∝ exp(log p_i / 0.5) = p_i². So 0.36, 0.09 and 0.01, which sum to 0.46. The top word gets 0.36 ÷ 0.46 ≈ 78%.'},
  {lvl:'ap',instant:true,q:'As T grows without limit, what do the next-word chances approach?',choices:['All the chance goes to the most likely word','Every word in the vocabulary gets the same chance','They stay the same as at T = 1'],correct:1,explain:'log p_i / T → 0 for every word, so every exp(·) → 1 and the softmax becomes uniform over the vocabulary. As T → 0 the opposite happens: all the chance goes to the top word (greedy decoding).'}
 ],
 tour:[
  {title:'Everything the model knows',text:'This passage is the model’s whole training text: 46 words of a recipe. It has no idea what eggs are. All it has is which words came after which.',focus:sim=>sim._L?sim._L.pass:[14,8,440,220],pause:true,setup:sim=>{BioLab.setValues(sim,{passage:'recipe',temp:1,order:1,show:true});startOver(sim,7);}},
  {title:'Count what comes next',text:'Every highlighted “the” is followed by a word, shown in blue. Count them: eggs 6 times, pan 3, butter, bowl and heat once each. That is 12 in all, so “eggs” gets 6 ÷ 12 = 50%.',focus:sim=>sim._L?sim._L.bars:[468,8,318,220],pause:true},
  {title:'Write one word',text:'To write, the model rolls weighted dice: “eggs” wins half the time, “pan” a quarter of the time. The new word becomes the context, and it counts again for the word after that.',pause:true,setup:sim=>{startOver(sim,7);write(sim,1);}},
  {title:'Low temperature: the favorite every time',text:'At temperature 0.2 the model nearly always takes the top word. Here it wrote 10 words and fell into a loop: “the eggs into the eggs into…”. Safe, but stuck.',pause:true,setup:sim=>{BioLab.setValues(sim,{temp:0.2});startOver(sim,7);write(sim,10);},focus:sim=>sim._L?sim._L.gen:[14,250,772,200]},
  {title:'High temperature: word salad',text:'At temperature 3 the long shots get a real chance, even words that never followed in the passage. The red words are pairs the passage never had. The text stops making sense.',pause:true,setup:sim=>{BioLab.setValues(sim,{temp:3});startOver(sim,7);write(sim,10);},focus:sim=>sim._L?sim._L.gen:[14,250,772,200]},
  {title:'In between',text:'At temperature 1 the model picks in proportion to the counts. It sounds like the passage, mixes its pieces in new ways, and sometimes says things the passage never said.',pause:true,setup:sim=>{BioLab.setValues(sim,{temp:1});startOver(sim,7);write(sim,10);}},
  {lvl:'honors',title:'More context',text:'With 2 words of context (a trigram model), the choices narrow. In a passage this short, most word pairs have only one follower, so the model starts retracing the passage: here it copied 8 words in a row. Real models read thousands of tokens of context and learn from far more text, so they can use long context without just copying.',pause:true,setup:sim=>{BioLab.setValues(sim,{temp:1,order:2});startOver(sim,7);write(sim,20);}},
  {title:'A real chatbot',text:'A real chatbot does the same job: predict the next token from what came before, then repeat. But it uses a neural network instead of a count table, reads far more context, and trained on trillions of tokens. Meta’s Llama 3 trained on more than 15 trillion.',pause:true,setup:sim=>{BioLab.setValues(sim,{order:1,temp:1});startOver(sim,7);}}
 ],
 lab:{bio:'<p><b>Question:</b> What temperature makes text that is both varied and sensible?</p><ol><li>Pick a training text. Set the temperature to 0.2. Press <b>Start over</b>, then <b>Write 10 more words</b> twice. Record a trial.</li><li>Repeat at temperatures 0.6, 1.0, 1.5, 2.0 and 3.0.</li><li>Graph <b>Trials</b> with temperature on x. Plot <b>Different word pairs</b> (variety) and <b>Word pairs that appear in the passage</b> (sense).</li></ol><p>Write one sentence: where do both stay high?</p>',
  honors:'<p><b>Question:</b> Does more context make the model smarter, or just a better copier?</p><ol><li>At temperature 1, write 20 words with 1 word of context. Record the <b>Longest stretch copied word for word</b>.</li><li>Press <b>Start over</b>, switch to 2 words of context, and repeat. Do five runs of each.</li><li>Compare the averages.</li></ol><p>Explain why a trigram model trained on 45 words mostly retraces the passage, and why real models need enormous training sets to use long context.</p>',
  ap:'<p><b>Question:</b> How does temperature reshape a probability distribution?</p><ol><li>With the context “the”, record the chance of the top word and the <b>entropy</b> at T = 0.2, 0.5, 1, 2 and 3.</li><li>Check one value by hand with P_i = p_i^(1/T) / Σ p_j^(1/T).</li></ol><p><b>CER:</b> Claim how T changes entropy, use your table as evidence, and reason from the formula: what happens as T → 0 and as T → ∞?</p>'},
 terms:[
  {t:'Language model',d:'A program that predicts the next piece of text from the text before it. Chatbots write by repeating that prediction over and over.'},
  {t:'Training text',d:'The text a model learns its patterns from. This toy has one short passage; real models train on trillions of tokens.'},
  {t:'Temperature',d:'A setting that sharpens or flattens the next-word chances. Low means predictable; high means more random.'},
  {t:'Token',d:'The unit a model reads and writes. Here a token is a whole word or a period. Real models use subword pieces, so a long word may be several tokens.',lvl:'honors'},
  {t:'Context',d:'The tokens the model looks back at when it predicts the next one. A bigram model uses 1, a trigram model uses 2, and real models use thousands.',lvl:'honors'},
  {t:'n-gram model',d:'A model that predicts the next token from counts of the previous n − 1 tokens. Bigram: n = 2. Trigram: n = 3.',lvl:'honors'},
  {t:'Softmax with temperature',d:'P_i = exp(z_i / T) / Σ exp(z_j / T). With z_i = log p_i, this is P_i ∝ p_i^(1/T).',lvl:'ap'},
  {t:'Entropy',d:'H = −Σ P_i log₂ P_i, the average uncertainty in bits. 0 bits means the next word is certain.',lvl:'ap'}
 ],
 about:'<p><b>How this toy works.</b> The passage is lower-cased and split into words, with each period kept as its own token. The model counts how often each word follows each word (bigram) or each pair of words (trigram). At temperature 1, a word’s chance is its count divided by the total count for that context. Every word that never followed the context shares a tiny 0.05% of the chance, because real models never give any token exactly zero. Temperature reshapes the chances: P_i ∝ exp(log p_i / T). If a two-word context never appeared, the trigram model falls back to one word. All three passages are original text written for this tool.</p><p><b>How real models differ.</b> A real large language model uses a neural network over subword tokens, reads thousands of tokens of context at once, and learns from enormous training sets. Meta reported that Llama 3 was trained on more than 15 trillion tokens (Meta, “Introducing Meta Llama 3,” April 2024). The core job is the same: predict the next token from what came before, then repeat. Chat apps add more training on top so the model follows instructions, but each reply is still written one token at a time.</p><p><b>Watch next:</b> 3Blue1Brown, “Large Language Models explained briefly” (November 2024), a short video on how the prediction works inside a real model.</p>'
};
BioLab.register(SIM);
})();
