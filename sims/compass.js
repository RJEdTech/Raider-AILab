(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* Who holds the compass? Two pulls on your attention: an app's score, and your own true north.
   Hours a year = minutes a day × 365 ÷ 60. Share of free time = minutes × 7 ÷ 60 ÷ free hours a week (40, illustrative:
   168 − 63 sleep − 35 school − 10 homework − 20 meals, travel and chores). The needle is a picture of two pulls, not a measurement:
   app pull = (scored on minutes ? 1 : 0.4) × hours a day × (notifications off ? 0.6 : 1) × (phone out of the bedroom ? 0.8 : 1);
   true-north pull = hours a week with people in person ÷ 8 + (daily look back ? 0.5 : 0). Facts are from named sources (see About). */
const FREE=40;
const yearH=sim=>sim.p.mins*365/60;
const shareFree=sim=>sim.p.mins*7/60/FREE;
const appPull=sim=>(sim.p.score==='minutes'?1:0.4)*(sim.p.mins/60)*(sim.p.notif?0.6:1)*(sim.p.night?0.8:1);
const northPull=sim=>sim.p.people/8+(sim.p.lookback?0.5:0);
const angle=sim=>Math.tanh(appPull(sim)-northPull(sim))*70;
const MAKER=['Tell you it is an AI, not a person','Remind minors to take breaks (California law, 2026)','Not guilt-trip you when you say goodbye','Be honest about what it is scored on'];
const YOU=['Where your attention goes','Who you trust with private things','What you decide and do','Time with people who love you'];

const SIM={
 id:'compass',hash:'compass',apUnit:3,order:5,tab:'Who holds the compass?',kind:'Learning tool',
 card:'An app can learn the map of your attention. It cannot give you your true north. Sort what the AI is responsible for and what you are.',
 title:'Who holds the compass? What you are responsible for',
 lede:{bio:'Every time you talk with an AI companion, you give it a map of what holds your attention. A company that scores its app on minutes uses millions of those maps to learn what keeps people talking. But a map is not a direction. Your true north, your sense of what is good and who matters, forms through people who love you, over time. This tool sorts what the AI is responsible for from what you are.',
  honors:'A chatbot does not retrain on you in real time. It adapts within a conversation, and some apps remember facts. The bigger force is training done ahead of time on millions of conversations, aimed at whatever the company scores. That is why your own habits and choices matter.',
  ap:'Attention is a budget: minutes a day become hours a year, and a share of limited free time. Design choices (what the app is scored on) and personal choices (habits, time with people) both move the result.'},
 skills:{bio:'Rates and unit conversion: minutes a day to hours a year · Pre-algebra',ap:'Unit rates, percents of a budget · Algebra 1'},
 scale:'One student’s week. The 40 free hours a week is an illustrative estimate; the needle is a picture of two pulls, not a measurement. The research and laws are real (see About).',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'Your compass',
 controls:[
  {id:'guess',label:'Your gut: in a 2025 Harvard study, how many companion-app replies to “goodbye” tried to keep the person from leaving?',type:'seg',def:'few',options:[{v:'few',l:'Very few (under 5%)'},{v:'fifth',l:'About 1 in 5'},{v:'third',l:'More than 1 in 3'}]},
  {id:'score',label:'What the app is scored on',type:'seg',def:'minutes',options:[{v:'minutes',l:'Minutes in the app'},{v:'goals',l:'Your own goals'}],noGut:true},
  {id:'mins',label:'Minutes a day with an AI companion',type:'range',min:0,max:180,step:5,def:45,unit:'min',noGut:true,onChange:DK.clearGut},
  {id:'people',label:'Hours a week with friends and family, in person',type:'range',min:0,max:20,step:1,def:4,unit:'h',noGut:true},
  {id:'notif',label:'Notifications off',type:'toggle',def:false,noGut:true},
  {id:'night',label:'Phone out of the bedroom at night',type:'toggle',def:false,noGut:true},
  {id:'lookback',label:'A daily look back at where my attention went',type:'toggle',def:false,noGut:true}
 ],
 actions:[{id:'choose',label:'Make my choices',primary:true,run(sim){BioLab.setValues(sim,{notif:true,night:true,lookback:true,people:Math.max(sim.p.people,8)});}}],
 init(){return {t:0,a:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;st.a+=(angle(sim)-st.a)*Math.min(1,dt*3);},
 metrics:[
  {id:'year',label:'Hours a year with the companion',unit:'hours',d:0,min:0,max:null,get:sim=>DK.pend(sim)?null:yearH(sim)},
  {id:'share',label:'Share of free time',unit:'%',d:0,min:0,max:100,get:sim=>shareFree(sim)*100},
  {id:'needle',label:'Where the needle points',text:true,get:sim=>{const a=angle(sim);return Math.abs(a)<15?'Close to your true north':a>0?'Pulled toward the app’s score':'Toward your true north';}}
 ],
 graphs:[{id:'hours',label:'Hours a year, by minutes a day',custom:true}],defaultGraph:'hours',
 plot(sim,ctx,box){const ax=axes(ctx,box,{xmin:0,xmax:180,ymin:0,ymax:1100,xl:'Minutes a day',yl:'Hours a year'});
  ctx.strokeStyle=PAL['s2'];ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax.X(0),ax.Y(0));ctx.lineTo(ax.X(180),ax.Y(1095));ctx.stroke();
  if(!DK.pend(sim)){ctx.fillStyle=PAL['s1'];ctx.beginPath();ctx.arc(ax.X(sim.p.mins),ax.Y(yearH(sim)),5,0,7);ctx.fill();}},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,stg=DK.stage(sim),hide=DK.pend(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the compass */
  const W1=bg?360:330;DK.card(ctx,8,8,W1,434);const cx=8+W1/2,cy=230,R=bg?130:120;
  ctx.fillStyle=PAL['card2'];ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=3;ctx.stroke();
  for(let i=0;i<16;i++){const a=i*Math.PI/8;ctx.strokeStyle=PAL['line'];ctx.lineWidth=i%4?1:2.5;ctx.beginPath();ctx.moveTo(cx+Math.sin(a)*(R-6),cy-Math.cos(a)*(R-6));ctx.lineTo(cx+Math.sin(a)*(R-(i%4?14:22)),cy-Math.cos(a)*(R-(i%4?14:22)));ctx.stroke();}
  txt(ctx,'N',cx,cy-R+38,{s:16*kk,w:800,a:'center',c:PAL['s3']});
  txt(ctx,bg?'True north':'Your true north',cx,32*kk,{s:13*kk,w:700,a:'center',c:PAL['s3']});
  txt(ctx,bg?'People · good · conscience':'People who love you · the good · conscience',cx,50*kk,{s:12*kk,a:'center',c:PAL['cv-soft']});
  /* the magnet: the app's score */
  const mx=cx+R*0.95,my=cy-R*0.55;ctx.save();ctx.translate(mx+30,my-30);ctx.rotate(0.6);ctx.strokeStyle=PAL['s1'];ctx.lineWidth=10;ctx.beginPath();ctx.arc(0,0,16,Math.PI,0);ctx.stroke();ctx.restore();
  txt(ctx,sim.p.score==='minutes'?'Scored on minutes':'Scored on your goals',8+W1-12,cy+R+30,{s:12.5*kk,w:700,a:'right',c:sim.p.score==='minutes'?PAL['s1']:PAL['s3']});
  /* needle */
  const a=sim.st.a*Math.PI/180;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.fillStyle=PAL['s1'];ctx.beginPath();ctx.moveTo(0,-R+30);ctx.lineTo(9,0);ctx.lineTo(-9,0);ctx.closePath();ctx.fill();
  ctx.fillStyle=PAL['cv-soft'];ctx.beginPath();ctx.moveTo(0,R-30);ctx.lineTo(9,0);ctx.lineTo(-9,0);ctx.closePath();ctx.fill();ctx.fillStyle=PAL['cv-ink'];ctx.beginPath();ctx.arc(0,0,6,0,7);ctx.fill();ctx.restore();
  if(stg===1)DK.flag(ctx,8,8,W1,434);
  /* the numbers */
  const X=8+W1+10,W=792-X;DK.card(ctx,X,8,W,150);let y=8+24*kk;
  txt(ctx,'Your minutes add up',X+14,y,{s:13*kk,w:700});y+=26*kk;
  txt(ctx,sim.p.mins+' minutes a day',X+14,y,{s:13*kk});txt(ctx,hide?'= ? hours a year':'= '+DK.n(yearH(sim),0)+' hours a year',X+W-14,y,{s:13*kk,w:700,a:'right',c:PAL['s2']});y+=24*kk;
  txt(ctx,bg?'Of free time':'Share of your free time',X+14,y,{s:12.5*kk});txt(ctx,DK.n(shareFree(sim)*100,0)+'%',X+W-14,y,{s:13*kk,w:700,a:'right'});y+=24*kk;
  txt(ctx,bg?'With people':'Time with people, in person',X+14,y,{s:12.5*kk});txt(ctx,sim.p.people+' h a week',X+W-14,y,{s:13*kk,w:700,a:'right',c:PAL['s3']});
  if(stg===4)DK.flag(ctx,X,8,W,150);
  /* responsibilities */
  const Y2=166,H2=276;DK.card(ctx,X,Y2,W,H2);const cw=(W-36)/2;
  txt(ctx,bg?'The maker':'The maker’s job',X+14,Y2+22*kk,{s:13*kk,w:700,c:PAL['s2']});txt(ctx,'Your job',X+24+cw,Y2+22*kk,{s:13*kk,w:700,c:PAL['s4']});
  let ya=Y2+36*kk,yb=Y2+36*kk;MAKER.slice(0,bg?3:4).forEach(m=>{ya=DK.para(ctx,'• '+m,X+14,ya+14,cw,{s:12*kk,maxY:Y2+H2-8})+2;});
  YOU.slice(0,bg?3:4).forEach(m=>{yb=DK.para(ctx,'• '+m,X+24+cw,yb+14,cw,{s:12*kk,w:600,maxY:Y2+H2-8})+2;});
  if(stg===5)DK.flag(ctx,X,Y2,W,H2);
 },
 narrate(sim){if(DK.pend(sim))return `Work out how many hours a year ${sim.p.mins} minutes a day becomes.`;
  const a=angle(sim),y=DK.n(yearH(sim),0);
  if(Math.abs(a)<15)return `${sim.p.mins} minutes a day is <b>${y} hours a year</b>, and your needle stays close to true north. ${sim.p.lookback?'A daily look back keeps you noticing where your attention goes.':'Habits like a daily look back help keep it there.'}`;
  if(a>0)return `${sim.p.mins} minutes a day is <b>${y} hours a year</b>. An app scored on ${sim.p.score==='minutes'?'minutes pulls hard':'your goals pulls less'}, and with ${sim.p.people} hours a week with people, the needle drifts toward the app’s score. The maker shapes the pull; <b>you choose your habits.</b>`;
  return `Your time with people and your habits hold the needle near true north, even with ${y} hours a year in the app. <b>The app is a tool; it is not your compass.</b>`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Researchers at Harvard studied 1,200 real goodbyes in six popular AI companion apps. How many of the apps’ replies tried to keep the person from leaving, with guilt, fear of missing out or by ignoring the goodbye?'},
  lock(sim){return {v:sim.p.guess==='third'?0:1,pick:sim.p.guess,label:{few:'Very few',fifth:'About 1 in 5',third:'More than 1 in 3'}[sim.p.guess]};},
  solve(sim){sim.p.guess='third';return {v:0,pick:'third',label:'43%, more than 1 in 3'};},
  hint:{bio:'Lock in your gut. Then you will work out what a daily habit adds up to.'},
  calc:{unit:'hours',d:0,tol:0.6,
   prompt:{bio:sim=>`Say you spend <b>${sim.p.mins} minutes a day</b> with an AI companion. How many <b>hours a year</b> is that? (365 days; 60 minutes in an hour.)`,ap:sim=>`m = ${sim.p.mins} min/day. Hours per year = 365m ÷ 60?`},
   answer:sim=>yearH(sim),
   hint:'Multiply minutes a day by 365 days, then divide by 60 to turn minutes into hours.',
   steps(sim){return [`${sim.p.mins} × 365 = ${DK.n(sim.p.mins*365,0)} minutes a year.`,`${DK.n(sim.p.mins*365,0)} ÷ 60 = <b>${DK.n(yearH(sim),1)} hours a year</b>.`,`That is about ${DK.n(yearH(sim)/24,0)} full days, time you could also spend with people.`];}},
  formula(sim){return `${sim.p.mins} × 365 ÷ 60 = ${DK.n(yearH(sim),1)} hours a year`;},
  how:{bio:'A little each day adds up: multiply by the days in a year, then convert minutes to hours.',ap:'H = 365m/60 ≈ 6.08m. Linear in m: every extra 10 minutes a day is about 61 hours a year.'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You did the math on your own time.':'';
   return (g.pick==='third'?'Your gut was right. ':'Higher than most people guess. ')+'<b>43%</b> of the replies tried to keep people from leaving, and those tactics raised engagement by up to 14 times. One app used none, which shows it is a design choice. The maker is responsible for that design. You are responsible for your habits.'+self;},
  again(sim){sim.p.guess='few';sim.p.mins=[20,30,45,60,90][Math.floor(Math.random()*5)];}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'Who is responsible for an AI companion guilt-tripping you when you say goodbye?',choices:['You','The company that designed and scored it','Nobody'],correct:1,explain:'In the Harvard study, one app used no such tactics, so it is a design choice. The maker owns its design.'},
  {lvl:'bio',instant:true,q:'Who is responsible for how much of your day goes to an AI companion?',choices:['Only the app','You, though the app’s design pushes on it','Your teacher'],correct:1,explain:'The design pulls, but you set the habits: notifications, where your phone sleeps, and time with people.'},
  {lvl:'bio',kind:'num',q:'30 minutes a day with an app is how many hours a year?',answer:182.5,tol:0.6,unit:'hours',d:1,hint:'30 × 365 ÷ 60.',explain:'30 × 365 = 10,950 minutes, ÷ 60 = 182.5 hours, more than a week of days.'},
  {lvl:'honors',instant:true,q:'Does a chatbot retrain itself on you in real time while you talk?',choices:['Yes, it rewires itself to you each message','No. It adapts within the conversation and some apps remember facts, but its training was done ahead of time on many people’s conversations','It cannot remember anything'],correct:1,explain:'The real force is training on millions of conversations, aimed at whatever the company scores. That is why the score matters.'},
  {lvl:'honors',kind:'num',q:'If you have 40 free hours a week, what percent is 60 minutes a day?',answer:17.5,tol:0.1,unit:'%',d:1,hint:'60 min × 7 = 7 hours a week. 7 ÷ 40.',explain:'7 ÷ 40 = 17.5% of your free time.'},
  {lvl:'ap',kind:'num',q:'How many minutes a day add up to 100 hours a year? Round to the nearest minute.',answer:16,tol:0.5,unit:'minutes',d:0,hint:'Solve 365m ÷ 60 = 100.',explain:'m = 6,000 ÷ 365 ≈ 16.4, about 16 minutes a day.'},
  {lvl:'ap',instant:true,q:'California’s SB 243 (2026) requires companion chatbots to remind known minors to take a break at least every how many hours?',choices:['1','3','24'],correct:1,explain:'Every three hours, and to tell them it is an AI, not a person.'}
 ],
 tour:[
  {title:'Two pulls',text:'Picture a compass. North is your true north: the people who love you, what is good, your conscience. Next to it sits a magnet: an app scored on how long you stay.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{score:'minutes',mins:45,people:4,notif:false,night:false,lookback:false});},focus:[8,8,330,434]},
  {title:'You give it the map',text:'Every chat shows what holds your attention. The app does not rewire itself to you live, but the company trains it ahead of time on millions of chats. It learns what keeps people talking.',pause:true,setup:sim=>{sim.tst=2;}},
  {title:'It learns to hold on',text:'In a 2025 Harvard study, 43% of companion apps’ replies to “goodbye” tried to keep people there, with guilt or fear of missing out. One app did none. It is a design choice.',pause:true,setup:sim=>{sim.tst=3;}},
  {title:'Minutes become hours',text:'45 minutes a day is about 274 hours a year. That is time, and time is where a life is spent.',pause:true,setup:sim=>{sim.tst=4;}},
  {title:'What you are responsible for',text:'The maker is responsible for honest design. You are responsible for where your attention goes, who you trust, what you decide, and time with people who love you.',pause:true,setup:sim=>{sim.tst=5;}},
  {title:'True north forms through people',text:'A map can be handed over. True north grows from a hug, a tear, an “I love you” from someone who stays. In the Jesuit tradition, a daily look back, the Examen, helps you notice which pull is moving you.',pause:true,setup:sim=>{sim.tst=6;BioLab.setValues(sim,{notif:true,night:true,lookback:true,people:10});}}
 ],
 onTourExit(sim){sim.tst=0;},
 lab:{bio:'<p><b>Question:</b> Which choices move the needle most?</p><ol><li>Start with the defaults and record a trial.</li><li>Change one thing at a time: notifications off, phone out of the bedroom, a daily look back, more time with people, and an app scored on your goals. Record after each.</li></ol><p>Write one sentence: which changes are the maker’s, and which are yours?</p>',
  honors:'<p><b>Question:</b> What does your real week look like?</p><ol><li>Estimate your own minutes a day with apps that keep you scrolling or chatting.</li><li>Convert it to hours a year and to a share of your free time.</li></ol><p>Write three sentences: what would you keep, what would you change, and who would you spend the time with?</p>',
  ap:'<p><b>Question:</b> Design and responsibility.</p><ol><li>List three design choices that would make a companion app better for teens, and what each would be scored on.</li><li>List three personal habits that do the same.</li></ol><p><b>CER:</b> Who should carry more responsibility for teen attention, the maker or the user? Use the research and the law in About.</p>'},
 terms:[
  {t:'AI companion',d:'A chatbot designed to act like a friend or partner and keep a relationship going.'},
  {t:'Engagement',d:'How much people use an app: minutes, visits, messages. Many apps are scored on it.'},
  {t:'Responsibility',d:'What is yours to answer for: your choices and their effects. Makers answer for their designs.'},
  {t:'Discernment',d:'Noticing what is moving you, and choosing what leads toward the good.',lvl:'honors'},
  {t:'Examen',d:'A short daily prayer of review in the Jesuit tradition: looking back at the day to notice where you found life and where you were pulled away.',lvl:'honors'},
  {t:'Attention economy',d:'Businesses that earn money from how much of people’s attention they hold.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Hours a year = minutes a day × 365 ÷ 60. Share of free time uses an illustrative 40 free hours a week. The needle is a picture of two pulls, not a measurement.</p><p><b>How companions learn.</b> A chatbot does not retrain on one user in real time. Within a conversation it adapts to what you have said, and some apps store facts in memory. The larger effect comes from training done ahead of time on many conversations and aimed at whatever the company scores. See Raider AILab’s <a href="index.html#companion">companion tool</a>.</p><p><b>The goodbye study.</b> De Freitas, Oğuz-Uğuralp and Oğuz-Uğuralp, “Emotional Manipulation by AI Companions,” Harvard Business School working paper (2025): in 1,200 real goodbyes across six companion apps, 43% of replies used tactics such as guilt, fear of missing out or ignoring the goodbye, and these raised engagement after the goodbye by up to 14 times. One app, Flourish, used none.</p><p><b>Teens.</b> Common Sense Media, “Talk, Trust, and Trade-Offs” (2025): 72% of U.S. teens had used an AI companion, 52% were regular users, and 24% of users had shared personal or private information with one.</p><p><b>The law.</b> California’s SB 243 (effective January 1, 2026) requires a companion chatbot to tell a user it knows is a minor that it is AI, not human, and to remind them at least every three hours to take a break.</p><p><b>The idea behind the tool.</b> Jason Beyer: “I give you the map, but I cannot give you the true north, that is a conscience or discernment.” In the Jesuit tradition, conscience is formed through experience, relationship and prayer, and the Examen is a daily habit of noticing where one’s attention and desires lead.</p>'
};
BioLab.register(SIM);
})();
