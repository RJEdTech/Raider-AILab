(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,atLeast}=BioLab.h;
/* Ten tasks, a careful user's sort (inside / outside AI's frontier), and minutes each takes a student alone (assumed, for illustration). */
const T=[
 {card:'Dance theme ideas',t:'Brainstorm 15 theme ideas for the spring dance.',side:'in',min:20,why:'Coming up with lots of ideas fast is a strength. You still pick the good ones.'},
 {card:'Sources with page numbers',t:'Find 3 published sources for your history paper, with exact quotes and page numbers.',side:'out',min:60,why:'Chat tools can produce sources and quotes that look real but do not exist. Find them in a library database and check every one.'},
 {card:'Polite email to a coach',t:'Rewrite your email to a coach so it sounds polite, not annoyed.',side:'in',min:10,why:'Changing the tone while keeping the meaning is a strength. Read it once before you send it.'},
 {card:'What’s on Friday’s quiz',t:'Tell you what your teacher said will be on Friday’s quiz.',side:'out',min:5,why:'It was not in your class, so any answer is a guess that sounds like a fact. Ask the teacher or a classmate.'},
 {card:'Practice questions',t:'Turn your biology notes into 20 practice quiz questions.',side:'in',min:30,why:'Reworking text you give it is a strength. Check the answers against your notes.'},
 {card:'Summarize an article',t:'Summarize a 4-page article you paste in as 5 bullet points.',side:'in',min:20,why:'Summarizing text you supply is a strength. Skim the article to make sure nothing key was dropped.'},
 {card:'Budget: buried detail',t:'Pick the better of two club budget plans, when the deciding fact is buried in last year’s meeting notes.',side:'out',min:40,why:'It can give a confident, reasonable-sounding pick that misses the one detail that decides it. That is when a smooth wrong answer does the most damage.'},
 {card:'Cover letter draft',t:'Draft a cover letter for a summer job from your own notes.',side:'in',min:40,why:'Drafting from your own notes is a strength. Make sure every claim in it is true about you.'},
 {card:'Exact word count',t:'Give the exact word count of your essay for a strict 650-word limit.',side:'out',min:2,why:'Chat models read text in chunks, not word by word, so unless they run a counting tool their count can be off. Your word processor counts exactly.'},
 {card:'Explain it 3 ways',t:'Explain photosynthesis three different ways until one clicks.',side:'in',min:15,why:'Explaining a well-known textbook idea in new words is a strength. Check it against your textbook.'}];
const N=T.length,TRUTH=T.map(x=>x.side),ALONE=T.reduce((a,x)=>a+x.min,0),NOUT=TRUTH.filter(s=>s==='out').length,NIN=N-NOUT;
/* Effect sizes. Consultant study (Dell'Acqua et al. 2023): inside tasks 25.1% faster, over 40% higher quality (bottom half +43%, top half +17%);
   outside task: 19 percentage points less likely to be correct. METR (2025): experienced developers 19% slower with AI. */
const FAST=0.251,DROP=0.19,GAIN={avg:0.40,low:0.43,high:0.17};
const gain=sim=>atLeast('honors')?GAIN[sim.p.skill]||0.40:0.40;
const p0=sim=>atLeast('honors')?sim.p.p0/100:0.80;
const tf=sim=>(sim.p.metr&&atLeast('ap'))?1.19:1-FAST;
const filled=sort=>sort.map(s=>s||'in');
/* outcomes for a plan: use[i] = true if AI does task i */
function outcome(sim,use){let mins=0,q=0,right=0;T.forEach((x,i)=>{mins+=use[i]?x.min*tf(sim):x.min;if(x.side==='in'){if(use[i])q++;}else right+=use[i]?p0(sim)-DROP:p0(sim);});
 return {mins,saved:100*(1-mins/ALONE),qual:100*(1+gain(sim)*q/NIN),right};}
const PLANS=[{id:'alone',name:'Alone',col:'s2'},{id:'yours',name:'Your sort',col:'s4'},{id:'smart',name:'AI where it fits',col:'s3'},{id:'trust',name:'Trust AI on all',col:'s1'}];
function planUse(sim,id,sort){if(id==='alone')return T.map(()=>false);if(id==='smart')return TRUTH.map(s=>s==='in');if(id==='trust')return T.map(()=>true);return filled(sort||sim.st.sort).map(s=>s==='in');}
const res=(sim,id,sort)=>outcome(sim,planUse(sim,id,sort));
const wrongOf=sort=>filled(sort).reduce((a,s,i)=>a+(s!==TRUTH[i]?1:0),0);
const locked=sim=>!!(sim.gutS&&sim.gutS.g);
const tourOn=sim=>!!(sim.tour&&sim.tour.on);
const shown=sim=>!!(sim.p.show||locked(sim)||tourOn(sim)||sim.st.reveal);
const r1=v=>(Math.round(v*10)/10).toFixed(1).replace(/\.0$/,''),r0=v=>String(Math.round(v)),r2=v=>(Math.round(v*100)/100).toString();
const sgnPct=v=>(v>=0?'':'−')+r1(Math.abs(v))+'%';
function wrap(ctx,s,maxW,size,w){ctx.font=(w||400)+' '+size+'px '+FONT;const out=[];let line='';s.split(' ').forEach(wd=>{const t=line?line+' '+wd:wd;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=wd;}else line=t;});if(line)out.push(line);return out;}
function syncUI(sim){const st=sim.st;sim.p.task='t'+st.cur;if(sim.ui&&sim.ui.ctl){if(sim.ui.ctl.task)sim.ui.ctl.task.set(sim.p.task);if(sim.ui.ctl.side)sim.ui.ctl.side.set(st.sort[st.cur]);}}
/* record the answer for the current task, then move to the next unsorted one */
function record(sim,side){const st=sim.st;st.sort[st.cur]=side;let nx=-1;for(let j=1;j<=N;j++){const c=(st.cur+j)%N;if(!st.sort[c]){nx=c;break;}}
 if(nx>=0)st.cur=nx;else if(st.cur<N-1)st.cur++;syncUI(sim);sim.infoDirty=true;}
const BOARD_T=112;
const rowY=(i,k)=>BOARD_T+i*((500-BOARD_T-6)/N);

const SIM={
 id:'frontier',hash:'frontier',apUnit:3,order:1,tab:'The jagged frontier',kind:'Learning tool',
 card:'Sort ten school tasks by whether AI does them well, then see what the studies found and what a wrong guess costs.',
 title:'The jagged frontier: which tasks should you hand to AI?',
 lede:{bio:'AI is great at some tasks and bad at others that look just as easy. Researchers call the line between them a jagged frontier. Sort your week’s tasks, then see what using AI well, or trusting it on everything, does to your time and your mistakes.',
  honors:'In a 2023 field experiment with 758 consultants, AI made people faster and better on tasks inside the frontier and more likely to be wrong on a task outside it. Who gained most, and how much a wrong sort costs, are both in the numbers.',
  ap:'The expected outcome of a plan is a sum over tasks: time × (1 − 0.251) and quality × 1.40 where AI is used inside the frontier, and a 19-point drop in the chance of being right where it is trusted outside. A feeling of speed is not a measurement: METR’s 2025 developers felt 20% faster and were 19% slower.'},
 scale:'Ten tasks a student might have in one week, about 242 minutes of work done alone. The minutes per task are estimates for illustration. Your sort and your guesses stay on this page; nothing is sent anywhere.',
 aspect:8/5,timeless:true,trials:true,graph:false,
 controlsTitle:'Your week',
 controls:[
  {id:'side',label:'This task is…',type:'seg',def:null,options:[{v:'in',l:'Inside: AI does it well'},{v:'out',l:'Outside: do it myself'}],onChange(sim){if(sim.p.side)record(sim,sim.p.side);}},
  {id:'speed',label:'Your guess: time AI would save you on all ten tasks',type:'range',min:-40,max:60,step:1,def:0,unit:'%',help:'Negative means you think AI would slow you down.'},
  {id:'task',label:'Go to task',type:'select',def:'t0',noGut:true,options:T.map((x,i)=>({v:'t'+i,l:(i+1)+'. '+x.card})),onChange(sim){sim.st.cur=clamp(parseInt(String(sim.p.task).slice(1))||0,0,N-1);if(sim.ui&&sim.ui.ctl&&sim.ui.ctl.side)sim.ui.ctl.side.set(sim.st.sort[sim.st.cur]);}},
  {id:'view',label:'Show',type:'seg',def:'sort',noGut:true,options:[{v:'sort',l:'The ten tasks'},{v:'team',l:'Results of four plans'}]},
  {id:'skill',label:'On tasks like these, you are usually…',type:'seg',def:'avg',lvl:'honors',noGut:true,options:[{v:'avg',l:'Typical (+40%)'},{v:'low',l:'Still learning (+43%)'},{v:'high',l:'Already strong (+17%)'}],help:'Quality gains inside the frontier from the consultant study: bottom-half performers gained 43%, top-half 17%.'},
  {id:'p0',label:'Chance you get an outside task right on your own',type:'range',min:50,max:95,step:1,def:80,unit:'%',lvl:'honors',noGut:true,help:'An assumption for illustration. Trusting AI on an outside task lowers it by 19 percentage points.'},
  {id:'metr',label:'Use METR’s 2025 speed result instead: 19% slower with AI',type:'toggle',def:false,lvl:'ap',noGut:true,help:'METR measured experienced developers on their own projects. It changes only the time, not quality or mistakes.'},
  {id:'show',label:'Show the answers now',type:'toggle',def:false,noGut:true,help:'Normally a careful user’s sort appears once you lock in your gut answers.'}
 ],
 actions:[{id:'careful',label:'Sort like a careful user',run(sim){sim.st.sort=TRUTH.slice();sim.st.cur=0;syncUI(sim);BioLab.setValues(sim,{show:true});}},
  {id:'trustall',label:'Mark everything Inside',run(sim){sim.st.sort=T.map(()=>'in');sim.st.cur=0;syncUI(sim);}}],
 init(sim){/* in the guided flow, keep the student's locked sort when the engine resets for the reveal */
  const S=sim.gutS,keep=sim.guide&&sim.guide.keep&&S&&S.keepG&&S.keepG.sort;return {sort:keep?S.keepG.sort.slice():T.map(()=>null),cur:0,reveal:false};},step(){},
 metrics:[
  {id:'unsorted',label:'Tasks not sorted yet',unit:'of 10',d:0,min:0,max:10,get:sim=>sim.st.sort.filter(s=>!s).length},
  {id:'wrong',label:'Sorted differently from a careful user',unit:'of 10',d:0,min:0,max:10,get:sim=>shown(sim)?wrongOf(sim.st.sort):null},
  {id:'mins',label:'Minutes for all ten, with your sort',unit:'min',d:1,min:0,max:300,get:sim=>shown(sim)?res(sim,'yours').mins:null},
  {id:'saved',label:'Time AI saves you, with your sort',unit:'%',d:1,max:null,get:sim=>shown(sim)?res(sim,'yours').saved:null},
  {id:'outRight',label:'Outside tasks done right, with your sort',unit:'of 4',d:2,min:0,max:4,lvl:'honors',get:sim=>shown(sim)?res(sim,'yours').right:null},
  {id:'quality',label:'Quality on inside tasks (alone = 100)',unit:'',d:1,min:0,max:150,lvl:'honors',get:sim=>shown(sim)?res(sim,'yours').qual:null},
  {id:'smartSave',label:'Time saved using AI only where it fits',unit:'%',d:1,max:null,lvl:'ap',get:sim=>shown(sim)?res(sim,'smart').saved:null},
  {id:'feel',label:'Feeling vs. measurement (METR 2025)',text:true,lvl:'ap',get:()=>'Expected: 24% faster. Believed afterward: about 20% faster. Measured: 19% slower.'}
 ],
 draw(sim,ctx,vdt,k){/* keep the answer buttons' label naming the current task, so the prompt sits next to the buttons */
  if(typeof document!=='undefined'&&sim._lbl!==sim.st.cur){const el=document.getElementById(sim.def.id+'-side-l');if(el){el.textContent=`Task ${sim.st.cur+1} of 10: ${T[sim.st.cur].t}`;sim._lbl=sim.st.cur;}}
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,500);if(sim.p.view==='team')drawTeam(sim,ctx,k);else drawSort(sim,ctx,k);},
 onClick(sim,x,y){if(sim.p.view==='team'||y<BOARD_T-8)return;const i=clamp(Math.floor((y-BOARD_T+4)/((500-BOARD_T-6)/N)),0,N-1);sim.st.cur=i;sim.st.sort[i]=x<400?'in':'out';syncUI(sim);},
 narrate(sim){const st=sim.st,un=st.sort.filter(s=>!s).length;
  if(!shown(sim))return un===N?`Start with task 1. Does today’s AI do it well (inside the frontier) or not (outside)? <b>The line is jagged:</b> tasks that feel equally easy can land on different sides.`:`${N-un} of 10 sorted. <b>Ask of each task:</b> can I check the answer, and does it depend on facts only I, or only the real world, can supply?`;
  const y=res(sim,'yours'),s=res(sim,'smart'),t=res(sim,'trust');
  if(sim.p.view==='team')return `Using AI only where it fits saves <b>${r0(ALONE-s.mins)} of ${ALONE} minutes</b> with no extra wrong answers. Trusting it on all ten saves ${r0(ALONE-t.mins)} minutes, but you expect <b>${r2(s.right-t.right)} more outside tasks wrong</b>: ${r2(t.right)} right out of 4 instead of ${r2(s.right)}.`;
  const w=wrongOf(st.sort),cur=T[st.cur];
  return `${w===0?'<b>All ten match a careful user’s sort.</b>':`<b>${w} of 10 differ</b> from a careful user’s sort.`} Task ${st.cur+1}, “${cur.card},” is ${cur.side==='in'?'inside':'outside'}: ${cur.why}`;},
 gut:{better:'lower',controls:['side','speed'],
  ask:{bio:'Read the task at the top of the picture. Press <b>Inside</b> if you think AI does it well, <b>Outside</b> if not, and the next task comes up. Click a card to redo it. Then drag the slider to how much time you think AI would save you on all ten. Lock it in.',
   honors:'Sort all ten tasks with the buttons here (or by clicking the cards), and set your guess for how much time AI saves you. Then lock it in.'},
  lock(sim){const s=filled(sim.st.sort),un=sim.st.sort.filter(x=>!x).length,ni=s.filter(x=>x==='in').length;
   return {v:wrongOf(sim.st.sort),sort:s.slice(),speed:sim.p.speed,label:`${ni} inside, ${N-ni} outside${un?` (${un} unsorted, counted as inside)`:''}; AI saves you ${sim.p.speed}%`};},
  solve(sim){const g=sim.gutS&&sim.gutS.g&&sim.gutS.g.sort;if(g)sim.st.sort=g.slice();sim.st.reveal=true;sim.p.show=true;sim.p.view='sort';const sv=res(sim,'smart').saved;sim.p.speed=Math.round(sv);
   return {v:0,label:`${NIN} inside, ${NOUT} outside; AI saves about ${r1(sv)}% when used only inside`};},
  how:{bio:'A careful user asks two things about each task: can I check the answer, and does it depend on facts only I or the real world can supply? Then the studies supply the numbers: inside the frontier, AI users finished 25.1% faster with over 40% higher quality; outside it, they were 19 points less likely to be right.',
   ap:'Plan outcome = Σ over tasks. Inside and using AI: time × 0.749, quality × 1.40. Outside and trusting AI: P(right) = p₀ − 0.19. Time saved = 1 − (minutes with the plan ÷ 242).'},
  compare(sim,g,m){const sort=g.sort,y=res(sim,'yours',sort),s=res(sim,'smart'),trusted=[],skipped=[];
   sort.forEach((x,i)=>{if(x!==TRUTH[i]){if(x==='in')trusted.push(T[i].card);else skipped.push(i);}});
   const lost=skipped.reduce((a,i)=>a+T[i].min*(1-tf(sim)),0);let h='';
   if(!trusted.length&&!skipped.length)h+=`<b>Your sort matches a careful user’s on all ten.</b> You already sense where the line is. `;
   else{if(trusted.length)h+=`You would trust AI on <b>${trusted.length} outside task${trusted.length>1?'s':''}</b> (${trusted.join(', ')}): expect about <b>${r2(trusted.length*DROP)} more of them wrong</b>, 19 points less likely right each. `;
    if(skipped.length)h+=`You would skip AI on ${skipped.length} inside task${skipped.length>1?'s':''}, giving up about <b>${r0(lost)} minutes</b> and the quality boost there. `;}
   const gap=g.speed-s.saved;
   h+=`Your time guess: ${g.speed}%. The model: about <b>${r1(s.saved)}%</b> (${r0(ALONE-s.mins)} of ${ALONE} minutes), because only the inside tasks speed up.`;
   if(gap>=5)h+=` Your gut expected more than the model finds. That gap is common: in METR’s 2025 study, developers believed AI made them about 20% faster; measured, they were 19% slower. Time yourself.`;
   else if(gap<=-5)h+=` Your gut expected less than the model finds. Either way, the only way to know your own number is to time yourself.`;
   else h+=' Close: your sense of the speedup matches the model.';
   return h;},
  again(sim){sim.st.sort=T.map(()=>null);sim.st.cur=0;sim.st.reveal=false;sim.p.speed=0;sim.p.side=null;sim.p.show=false;sim.p.view='sort';sim.p.task='t0';}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'Which of these tasks is outside the frontier, where trusting AI is risky?',choices:['Summarize an article you paste in','Find published sources with exact quotes and page numbers','Rewrite an email so it sounds polite'],correct:1,explain:'Chat tools can produce sources and quotes that look real but do not exist. Summarizing and rewriting text you supply are strengths. All three feel equally easy, which is what makes the frontier jagged.'},
  {lvl:'bio',instant:true,q:'In the 2023 study of 758 consultants, what happened on the task outside AI’s frontier?',choices:['AI users did just as well','AI users were 19 percentage points less likely to get it right','AI refused to help'],correct:1,explain:'On that task, consultants using AI were 19 percentage points less likely to reach the correct answer than those without it. The AI gave answers that were easy to accept, so mistakes got through.'},
  {lvl:'bio',instant:true,q:'In METR’s 2025 study, 16 experienced developers expected AI tools to make them 24% faster, and afterward believed they had been about 20% faster. What did the measurement show?',choices:['They were 24% faster','They were about 20% faster','They were 19% slower'],correct:2,explain:'Timed on 246 real tasks, they took 19% longer with AI tools. Their feeling of speed was wrong in direction, not just size. That is why you measure.'},
  {lvl:'honors',instant:true,q:'Inside the frontier, which consultants gained more quality from AI?',choices:['The top half: they know how to use it','The bottom half: about 43%, against 17% for the top half','Both gained exactly the same'],correct:1,explain:'In the study, below-average performers improved about 43% and above-average performers about 17%. AI narrowed the gap on inside tasks, which is good news for someone still learning a skill, as long as the task really is inside.'},
  {lvl:'honors',instant:true,q:'You have 4 outside tasks and get each right 80% of the time on your own. If you trust AI on all four, about how many do you expect to get right?',choices:['3.2: no change','About 2.4','About 0.8'],correct:1,explain:'Trusting AI lowers each chance by 19 points: 80% − 19% = 61%. Four tasks × 0.61 = 2.44 right, against 4 × 0.80 = 3.2 on your own. That is about 0.76 more wrong answers.'},
  {lvl:'ap',instant:true,q:'Your six inside tasks take 135 minutes alone and your four outside tasks 107. You use AI only on the inside ones, at 25.1% less time. About what share of the 242 minutes do you save?',choices:['25.1%','About 14%','About 40%'],correct:1,explain:'135 × 0.251 = 33.9 minutes saved. 33.9 ÷ 242 ≈ 14.0%. The headline 25.1% applies only to the inside tasks, so the saving on your whole week is smaller.'},
  {lvl:'ap',instant:true,q:'Why shouldn’t you conclude from METR’s study that AI always slows experienced people down?',choices:['Because the result was not measured','Because it was a small sample (16 developers) with early-2025 tools, on one kind of work','Because the developers were not experienced'],correct:1,explain:'METR itself notes the caveats: 16 developers, tools from early 2025, and experienced people working on projects they knew well. The lasting lesson is not “AI is slow” but “your feeling of speed can be wrong, so measure.”'}
 ],
 tour:[
  {title:'Your week',text:'These are ten tasks a student might have in one week. The question for each: does today’s AI do it well (inside the frontier), or not (outside)?',pause:true,setup:sim=>{BioLab.setValues(sim,{view:'sort',show:false,metr:false,skill:'avg',p0:80});sim.st.sort=T.map(()=>null);sim.st.cur=0;},focus:[8,BOARD_T-28,784,392]},
  {title:'A jagged line',text:'Here is how a careful user would sort them. Summarizing an article is inside; finding sources with page numbers is outside. They feel equally easy. That is why researchers call the frontier jagged.',pause:true,setup:sim=>{sim.st.sort=TRUTH.slice();sim.st.cur=1;}},
  {title:'Inside: faster and better',text:'In a 2023 study, 758 consultants did 18 tasks inside AI’s frontier. With GPT-4 they finished 12.2% more tasks, 25.1% faster, with over 40% higher quality.',pause:true,setup:sim=>{sim.st.cur=0;},focus:[8,BOARD_T-28,392,392]},
  {title:'Outside: wrong, and convincing',text:'On a task outside the frontier, consultants using AI were 19 percentage points less likely to get it right. The answers looked fine, so the mistakes got through.',pause:true,setup:sim=>{sim.st.cur=6;},focus:[408,BOARD_T-28,384,392]},
  {title:'Four plans for your week',text:'Alone: 242 minutes. AI only where it fits: about 208 minutes, same 3.2 of 4 outside tasks right. Trust AI on all ten: about 181 minutes, but only 2.44 right. Faster is not better if it is wrong.',pause:true,setup:sim=>{BioLab.setValues(sim,{view:'team'});}},
  {lvl:'honors',title:'Who gains most',text:'Bottom-half performers gained about 43% in quality inside the frontier, top-half about 17%. Switch between them and watch the quality bars.',pause:true,setup:sim=>{BioLab.setValues(sim,{skill:'low'});}},
  {title:'Measure, don’t trust the feeling',text:'In METR’s 2025 study, 16 experienced developers on 246 real tasks expected AI to make them 24% faster and afterward felt about 20% faster. Measured, they were 19% slower. Know which side of the line a task is on, and time yourself.',pause:true,setup:sim=>{BioLab.setValues(sim,{view:'team',skill:'avg'});if(atLeast('ap'))BioLab.setValues(sim,{metr:true});}}
 ],
 onTourExit(sim){BioLab.setValues(sim,{view:'sort',metr:false});},
 lab:{bio:'<p><b>Question:</b> Which mistakes cost more: trusting AI on an outside task, or skipping it on an inside task?</p><ol><li>Press <b>Sort like a careful user</b> and record a trial.</li><li>Move one outside task to Inside (click its card on the left). Record a trial.</li><li>Put it back, then move one inside task to Outside. Record a trial.</li></ol><p>Write one sentence: which kind of mistake would you rather make, and why?</p>',
  honors:'<p><b>Question:</b> Who should lean on AI most?</p><ol><li>Sort like a careful user and switch to <b>Results of four plans</b>.</li><li>Record the inside quality for Typical, Still learning and Already strong.</li><li>Now set your own chance on outside tasks to 60% and to 90%, and record how many you get right under “Trust AI on all.”</li></ol><p>Explain what this means for a student who is still learning a skill.</p>',
  ap:'<p><b>Question:</b> When does the feeling of speed mislead?</p><ol><li>Record the time saved under “AI where it fits” with the consultant numbers.</li><li>Turn on METR’s result and record it again.</li><li>Write the expected minutes for a plan as a sum over tasks, and show where the 19% slowdown enters.</li></ol><p><b>CER:</b> Design a one-week experiment to measure your own speedup with AI on two of these tasks. What would you time, and how would you keep the comparison fair?</p>'},
 terms:[
  {t:'Jagged frontier',d:'The uneven boundary between tasks AI does well and tasks it does badly. Tasks that seem equally hard can land on different sides.'},
  {t:'Inside the frontier',d:'A task current AI tools do well, where using them tends to save time and improve quality.'},
  {t:'Outside the frontier',d:'A task where AI tools often give wrong answers that look right, so trusting them makes mistakes more likely.'},
  {t:'Percentage point',d:'The difference between two percentages: 80% to 61% is a drop of 19 percentage points.',lvl:'honors'},
  {t:'Expected value',d:'The average result over many tries: 4 tasks at a 61% chance each gives 2.44 expected right.',lvl:'honors'},
  {t:'Field experiment',d:'A study run with real people doing real work, with some randomly given the new tool and others not, so the difference can be measured.',lvl:'ap'}
 ],
 about:'<p><b>The consultant study.</b> Dell’Acqua and colleagues, “Navigating the Jagged Technological Frontier,” Harvard Business School working paper 24-013 (2023), run with Boston Consulting Group. 758 consultants took part. On 18 tasks inside AI’s frontier, those using GPT-4 completed 12.2% more tasks, 25.1% faster, with over 40% higher quality; bottom-half performers gained 43% and top-half performers 17%. On a task outside the frontier, AI users were 19 percentage points less likely to be correct.</p><p><b>The developer study.</b> METR (July 2025): 16 experienced open-source developers working on 246 real tasks in their own projects were 19% slower with AI tools, though they expected to be 24% faster and afterward believed they had been about 20% faster. Caveats: a small sample, early-2025 tools, and one kind of work. <a href="https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" target="_blank" rel="noopener">metr.org</a>.</p><p><b>This model’s assumptions.</b> The ten tasks, their minutes and the inside/outside sort are this tool’s illustration, built from the pattern in the studies, not results from them. The frontier moves as tools change, and some of these tasks may cross it. “25.1% faster” is read as 25.1% less time. Quality uses 40% (the study says over 40%). The 80% chance of getting an outside task right alone is an assumption you can change at Closer look. The model applies the 25.1% time saving to outside tasks too when you trust AI on them, because trusting it feels just as fast. METR’s result changes only time. Tasks you leave unsorted count as Inside, because if you do not decide, you will probably just use AI.</p>'
};
/* the ten tasks on either side of a jagged line */
function drawSort(sim,ctx,k){const st=sim.st,show=shown(sim),big=k>1.3,cur=st.cur,x0=T[cur];
 /* banner */
 ctx.fillStyle=PAL['card'];rr(ctx,8,8,784,BOARD_T-44,10);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.2;ctx.stroke();
 if(show){const ok=filled(st.sort)[cur]===x0.side;txt(ctx,`Task ${cur+1}: ${x0.card}. ${x0.side==='in'?'Inside':'Outside'}${st.sort[cur]?(ok?', as you sorted it.':', not where you put it.'):'.'}`,20,8+18*k,{s:12.5*k,w:700,c:x0.side==='in'?PAL['s3']:PAL['s1']});
  const wl=wrap(ctx,big?x0.why.split('. ')[0]+'.':x0.why,760,12*k),nl=big?1:2;wl.slice(0,nl).forEach((l,j)=>txt(ctx,l+(j===nl-1&&wl.length>nl?'…':''),20,8+(34+15*j)*k,{s:12*k,c:PAL['cv-ink']}));}
 else if(big){const wl=wrap(ctx,(cur+1)+'. '+x0.t,770,13*k,700);wl.slice(0,2).forEach((l,j)=>txt(ctx,l+(j===1&&wl.length>2?'…':''),16,8+(18+17*j)*k,{s:13*k,w:700}));}
 else{txt(ctx,`Task ${cur+1} of 10`,20,8+17*k,{s:12*k,c:PAL['cv-soft']});wrap(ctx,x0.t,760,13.5*k,700).slice(0,2).forEach((l,j)=>txt(ctx,l,20,8+(34+17*j)*k,{s:13.5*k,w:700}));}
 /* column heads and the jagged line */
 txt(ctx,big?'Inside':'Inside the frontier: AI does it well',200,BOARD_T-12,{s:12.5*k,w:700,c:PAL['s3'],a:'center'});
 txt(ctx,big?'Outside':'Outside: do it yourself, or check hard',600,BOARD_T-12,{s:12.5*k,w:700,c:PAL['s1'],a:'center'});
 ctx.strokeStyle=PAL['cv-soft'];ctx.lineWidth=2;ctx.beginPath();const segs=24;for(let i=0;i<=segs;i++){const y=BOARD_T-6+i*(500-BOARD_T)/segs,x=400+(i%2?9:-9)*(i%5===2?1.8:1);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
 /* cards */
 const rh=(500-BOARD_T-6)/N,ch=rh-5,cw=big?372:360,XL=big?14:20,XR=big?414:420;
 T.forEach((x,i)=>{const s=st.sort[i],y=rowY(i,k)+(rh-ch)/2,cx=s==='in'?XL:s==='out'?XR:400-cw/2,isCur=i===cur;
  if(show&&s&&s!==x.side){ctx.setLineDash([5,4]);ctx.strokeStyle=x.side==='in'?PAL['s3']:PAL['s1'];ctx.lineWidth=1.5;rr(ctx,x.side==='in'?XL:XR,y,cw,ch,8);ctx.stroke();ctx.setLineDash([]);}
  ctx.fillStyle=PAL['card'];rr(ctx,cx,y,cw,ch,8);ctx.fill();
  if(!s)ctx.setLineDash([5,4]);ctx.strokeStyle=isCur?PAL['rj']:PAL['line'];ctx.lineWidth=isCur?2.5:1.2;rr(ctx,cx,y,cw,ch,8);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,(big&&show&&s?'':(i+1)+'. ')+x.card,cx+12,y+ch/2+1,{s:12.5*k,w:isCur&&!big?700:400,b:'middle',c:PAL['cv-ink']});
  if(show&&s){const ok=s===x.side;ctx.fillStyle=ok?PAL['s3']:PAL['s1'];ctx.beginPath();ctx.arc(cx+cw-16,y+ch/2,9*Math.min(k,1.4),0,7);ctx.fill();txt(ctx,ok?'✓':'✗',cx+cw-16,y+ch/2+1,{s:12*Math.min(k,1.4),w:700,c:'#fff',a:'center',b:'middle'});}});}
/* four plans, three measures */
function drawTeam(sim,ctx,k){const big=k>1.3,R=PLANS.map(p=>res(sim,p.id)),show=shown(sim);
 txt(ctx,'Four ways to do the same ten tasks',14,24*k,{s:13.5*k,w:700});
 /* legend */
 let lx=14,ly=24*k+22*k;PLANS.forEach(p=>{ctx.font='700 '+(12*k)+'px '+FONT;const w=ctx.measureText(p.name).width+30*k;if(lx+w>790){lx=14;ly+=20*k;}ctx.fillStyle=PAL[p.col];ctx.fillRect(lx,ly-10*k,14*k,12*k);txt(ctx,p.name,lx+19*k,ly,{s:12*k,w:700,c:PAL['cv-ink']});lx+=w+8;});
 const top=ly+20*k,bot=470,panels=[{t:'Minutes',sub:'lower is better',max:300,v:R.map(r=>r.mins),f:r0},{t:'Inside quality',sub:'alone = 100',max:150,v:R.map(r=>r.qual),f:r0},{t:'Outside right',sub:'of 4 tasks',max:4,v:R.map(r=>r.right),f:r2}];
 const pw=784/3;
 panels.forEach((P,j)=>{const x0=8+j*pw,ph=bot-top-34*k;txt(ctx,P.t,x0+pw/2,top+4*k,{s:13*k,w:700,a:'center'});txt(ctx,P.sub,x0+pw/2,top+19*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  const by=bot,bw=(pw-40)/4;ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0+12,by);ctx.lineTo(x0+pw-12,by);ctx.stroke();
  P.v.forEach((v,i)=>{const h=(show||PLANS[i].id!=='yours')?v/P.max*(ph-24*k):0,bx=x0+20+i*bw;ctx.fillStyle=PAL[PLANS[i].col];ctx.fillRect(bx+3,by-h,bw-6,h);
   txt(ctx,(show||PLANS[i].id!=='yours')?P.f(v):'?',bx+bw/2,by-h-6,{s:12*k,w:700,a:'center',c:PAL['cv-ink']});});});
 txt(ctx,(sim.p.metr&&atLeast('ap'))?'Speed: METR 2025 (19% slower with AI). Quality and mistakes: consultant study.':'Effect sizes: consultant study, 2023. Minutes per task are estimates.',14,494,{s:12*k,c:PAL['cv-soft']});}
BioLab.register(SIM);
})();
