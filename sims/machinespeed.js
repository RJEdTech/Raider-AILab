(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* Two views.
   Race: a break-in has four stages (look around, get in, get the master keys, take the data). Done by hand, they take about a week
   (48 + 24 + 72 + 24 hours, illustrative). An automated AI tool like ARTEX runs them at machine speed (0.5 + 0.75 + 1.5 + 0.75 = 3.5 hours;
   the FBI reported privileged access in under three hours in some cases). Defenders notice after `notice` hours.
   Line: break-ins needing expert help arrive at A per week; responders finish H per week. Backlog after W weeks = max(0, (A − H)·W);
   a new victim waits backlog ÷ H weeks. Stage times and rates are illustrative; the ARTEX facts are from the FBI (see About).
   Defensive only: the stages are named in plain words, with no methods. */
const ST=['Look around','Get in','Get the master keys','Take the data'];
const HUM=[48,24,72,24],AI=[0.5,0.75,1.5,0.75];
const sum=a=>a.reduce((x,y)=>x+y,0);
const TH=sum(HUM),TA=sum(AI);
const keysAt=a=>a[0]+a[1]+a[2];
const who=sim=>sim.p.who==='ai'?AI:HUM;
const total=sim=>sum(who(sim));
const finishes=(a,n)=>sum(a)<n;
const winner=sim=>{const h=finishes(HUM,sim.p.notice),a=finishes(AI,sim.p.notice);return h&&a?'both':a?'ai':h?'human':'neither';};
const emptied=sim=>sim.p.who==='ai'?(finishes(AI,sim.p.notice)?sim.p.targets:0):(finishes(HUM,sim.p.notice)?1:0);
const backlog=(sim,w)=>Math.max(0,(sim.p.arrive-sim.p.handle)*(w===undefined?sim.p.weeks:w));
const waitW=sim=>backlog(sim)/sim.p.handle;

const SIM={
 id:'machinespeed',hash:'machinespeed',apUnit:5,order:5,tab:'Machine speed: the ARTEX problem',kind:'Simulation',
 card:'An AI attack tool runs a week of break-in work in hours, against many places at once. Race it against defenders who check alerts once a day, then see why the experts have a waiting line.',
 title:'Machine speed: the ARTEX problem',
 lede:{bio:'Tool 5 of 8. In tool 4, attackers got in days before the patch. Here is why they are so fast. In November 2026, the FBI warned about <b>ARTEX</b>, an AI tool that runs every stage of a break-in on its own, at machine speed. It was posted online for security testing, then copied and used by attackers.',
  honors:'Tool 5 of 8. Automation changes two things at once: speed (a week of work in hours) and scale (one person can aim it at many places at the same time). Defenders still work at human speed, and the experts who clean up have more cases than they can handle.',
  ap:'Tool 5 of 8. Speed ratio = T<sub>human</sub> ÷ T<sub>AI</sub>. When arrivals A exceed service H, a queue grows linearly: backlog = (A − H)W, and the wait for a new case is (A − H)W ÷ H.'},
 skills:{bio:'Adding times, ratios and rates · Pre-algebra',honors:'Ratios and linear growth · Algebra 1',ap:'Rates, ratios and a simple queue model · Algebra 1'},
 scale:'Race: hours from the first step of a break-in. Line: weeks of cases for a company that sends experts to help victims. The stage times and rates are invented for illustration. The ARTEX facts come from the FBI’s November 2026 advisory (see About).',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The race and the line',
 controls:[
  {id:'guess',label:'Your gut: defenders check alerts once a day. Who finishes the break-in before anyone notices?',type:'seg',def:'neither',options:[{v:'human',l:'Only the person'},{v:'ai',l:'Only the AI tool'},{v:'both',l:'Both'},{v:'neither',l:'Neither'}]},
  {id:'view',label:'Show',type:'seg',def:'race',options:[{v:'race',l:'The race'},{v:'line',l:'The waiting line'}],noGut:true},
  {id:'who',label:'Who is breaking in',type:'seg',def:'ai',options:[{v:'human',l:'A person, by hand'},{v:'ai',l:'An AI tool like ARTEX'}],noGut:true},
  {id:'notice',label:'Hours until defenders notice and act',type:'range',min:1,max:72,step:1,def:24,unit:'h',noGut:true,onChange:DK.clearGut},
  {id:'targets',label:'Places attacked at the same time',type:'range',min:1,max:200,step:1,def:50,unit:'',lvl:'honors',noGut:true},
  {id:'arrive',label:'New break-ins needing experts, per week',type:'range',min:5,max:60,step:1,def:30,unit:'per week',noGut:true},
  {id:'handle',label:'Cases the experts can finish, per week',type:'range',min:5,max:60,step:1,def:25,unit:'per week',noGut:true},
  {id:'weeks',label:'Weeks',type:'range',min:1,max:52,step:1,def:26,unit:'weeks',noGut:true}
 ],
 actions:[{id:'go',label:'Start the race',primary:true,run(sim){BioLab.setValues(sim,{view:'race'});sim.st.h=0;sim.st.run=true;}},
  {id:'hire',label:'Add AI help for defenders (+10 cases a week)',run(sim){BioLab.setValues(sim,{view:'line',handle:Math.min(60,sim.p.handle+10)});}}],
 init(){return {h:200,run:false,t:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.run){st.h+=dt*(st.h<8?2:30);if(st.h>=200){st.h=200;st.run=false;}}},
 metrics:[
  {id:'tai',label:'AI tool: whole break-in',unit:'hours',d:1,min:0,max:null,get:sim=>TA},
  {id:'thum',label:'By hand: whole break-in',unit:'hours',d:0,min:0,max:null,get:sim=>TH},
  {id:'ratio',label:'Times faster',unit:'×',d:0,max:null,get:sim=>DK.pend(sim)?null:TH/TA},
  {id:'emptied',label:'Places emptied before anyone notices',unit:'',d:0,min:0,max:null,lvl:'honors',get:sim=>emptied(sim)},
  {id:'backlog',label:'Cases waiting for experts',unit:'cases',d:0,min:0,max:null,get:sim=>backlog(sim)},
  {id:'wait',label:'Wait for a new victim',unit:'weeks',d:1,min:0,max:null,get:sim=>waitW(sim)}
 ],
 graphs:[{id:'q',label:'Cases waiting, week by week',custom:true}],defaultGraph:'q',
 plot(sim,ctx,box){const W=52,mx=Math.max(20,backlog(sim,W));const ax=axes(ctx,box,{xmin:0,xmax:W,ymin:0,ymax:mx*1.1,xl:'Week',yl:'Cases waiting'});
  ctx.strokeStyle=PAL['s1'];ctx.lineWidth=2.5;ctx.beginPath();for(let w=0;w<=W;w++){const x=ax.X(w),y=ax.Y(backlog(sim,w));w?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  ctx.fillStyle=PAL['s1'];ctx.beginPath();ctx.arc(ax.X(sim.p.weeks),ax.Y(backlog(sim)),5,0,7);ctx.fill();},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,stg=DK.stage(sim),t=sim.st.t;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  if(sim.p.view==='race'){
   DK.card(ctx,8,8,784,300);const L=bg?140:150,R=772,MX=Math.max(TH,sim.p.notice)+8,X=h=>L+(R-L)*Math.min(h,MX)/MX,h=Math.min(sim.st.h,MX);
   txt(ctx,'Hours from the first step',L,30*kk,{s:12.5*kk,w:700,c:PAL['cv-soft']});
   for(let x=0;x<=MX;x+=24)txt(ctx,String(x),X(x),48*kk,{s:12*kk,c:PAL['cv-soft'],a:'center'});
   const lane=(y,a,lab,c,show)=>{txt(ctx,lab,L-10,y+16,{s:13*kk,w:700,a:'right'});let s=0;a.forEach((d,i)=>{const x0=X(s),x1=X(Math.min(s+d,h));if(h>s){ctx.fillStyle=c[i];rr(ctx,x0,y,Math.max(2,x1-x0),24,4);ctx.fill();}s+=d;});
    const tt=sum(a);if(h>=tt&&show){const lab=(tt<10?DK.n(tt,1):DK.n(tt,0))+' h'+(tt<10?(bg?'':': done before most people check email'):(bg?'':': about a week'));if(X(tt)+8>R-260)txt(ctx,lab,X(tt),y-8,{s:12.5*kk,w:700,a:'right'});else txt(ctx,lab,X(tt)+8,y+17,{s:12.5*kk,w:700});}};
   const C=[PAL['s2'],PAL['s4'],PAL['s1'],'#7a2b2b'];
   const yA=(bg?62:86)*kk,yH=yA+(bg?56:70)*kk;lane(yA,AI,bg?'AI tool':'AI tool (ARTEX)',C,true);lane(yH,HUM,bg?'By hand':'A person, by hand',C,true);
   /* the defenders' line */
   ctx.strokeStyle=PAL['s3'];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X(sim.p.notice),60*kk);ctx.lineTo(X(sim.p.notice),yH+40*kk);ctx.stroke();
   txt(ctx,(bg?'Notice: hour ':'Defenders notice: hour ')+sim.p.notice,X(sim.p.notice)+(sim.p.notice>MX*.6?-6:6),yH+(bg?44:56)*kk,{s:12.5*kk,w:700,c:PAL['s3'],a:sim.p.notice>MX*.6?'right':'left'});
   /* stage key */
   if(!bg){let kx=L;ST.forEach((s,i)=>{ctx.fillStyle=C[i];rr(ctx,kx,286,12,12,3);ctx.fill();txt(ctx,s,kx+16,296,{s:12});ctx.font='400 12px '+FONT;kx+=ctx.measureText(s).width+34;});}
   if(stg===2||stg===3)DK.flag(ctx,L-4,(stg===2?yH:yA)-4,R-L+8,32);
   /* bottom: scale and spread */
   const by=318;DK.card(ctx,8,by,bg?784:470,124);let y=by+22*kk;
   txt(ctx,'One person, many targets',22,y,{s:13*kk,w:700});y+=8;
   const n=Math.min(sim.p.targets,bg?40:80),cols=bg?20:40;for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols),cx=26+c*(bg?36:10.8),cy=y+12+r*(bg?26:22);const hit=emptied(sim)>0&&sim.p.who==='ai';
    ctx.fillStyle=hit?PAL['s1']:PAL['cv-soft'];ctx.globalAlpha=hit?.85:.4;rr(ctx,cx,cy,bg?26:8,bg?16:14,2);ctx.fill();ctx.globalAlpha=1;}
   if(!bg)DK.para(ctx,sim.p.who==='ai'?`${sim.p.targets} places at once. ${emptied(sim)} emptied before hour ${sim.p.notice}.`:'By hand, one place at a time.',22,by+108,440,{s:12,w:600,c:PAL['cv-soft']});
   if(!bg){const X2=488,W2=304;DK.card(ctx,X2,by,W2,124);let y2=by+22;txt(ctx,'Why it is hard to stop',X2+14,y2,{s:13,w:700});y2+=8;
    y2=DK.para(ctx,'Posted online in July 2026 “for authorized testing,” then pulled on October 8. Copies kept spreading: over 1,600 found running by early November.',X2+14,y2+12,W2-28,{s:12});}
   if(stg===4)DK.flag(ctx,8,by,784,124);
  }else{
   /* the waiting line */
   DK.card(ctx,8,8,784,434);let y=8+24*kk;txt(ctx,bg?'Expert responders':'The experts who help after a break-in',22,y,{s:13*kk,w:700});
   const A=sim.p.arrive,H=sim.p.handle,B=backlog(sim);y+=30*kk;
   /* arrivals -> door -> done */
   const dx=bg?520:560;DK.door(ctx,dx,y,44,80,'locked',kk);txt(ctx,'Responders',dx+22,y+100*kk,{s:12.5*kk,w:700,a:'center',c:PAL['s3']});
   txt(ctx,'In: '+A+' a week',30,y+16,{s:13*kk,w:700,c:PAL['s1']});txt(ctx,'Out: '+H+' a week',dx+60,y+16,{s:13*kk,w:700,c:PAL['s3']});
   const shown=Math.min(Math.round(B),bg?24:60),per=bg?12:20,step=bg?34:24;for(let i=0;i<shown;i++){const c=i%per,r=Math.floor(i/per),x=dx-30-c*step,yy=y+40+r*24+Math.sin(t*2+i)*1.5;
    if(x>20){ctx.fillStyle=PAL['s1'];ctx.globalAlpha=.75;rr(ctx,x,yy,bg?24:16,14,3);ctx.fill();ctx.globalAlpha=1;}}
   y+=150*kk;ctx.strokeStyle=PAL['line'];ctx.beginPath();ctx.moveTo(22,y);ctx.lineTo(778,y);ctx.stroke();y+=28*kk;
   const hide=DK.pend(sim);
   txt(ctx,'After '+sim.p.weeks+' weeks: '+DK.n(B,0)+' cases waiting',22,y,{s:14*kk,w:700});y+=26*kk;
   txt(ctx,'A new victim waits about '+(hide?'?':DK.n(waitW(sim),1))+' weeks',22,y,{s:14*kk,w:700,c:B>0?PAL['s1']:PAL['s3']});y+=28*kk;
   if(!bg)DK.para(ctx,A>H?`Only ${A-H} more cases come in each week than go out, but the line grows by ${A-H} every week and never shrinks on its own.`:'The experts keep up, so the line does not grow.',22,y,740,{s:12.5,c:PAL['cv-soft']});
   if(stg===5||stg===6)DK.flag(ctx,16,y-60*kk,768,64*kk);
  }
 },
 narrate(sim){if(sim.p.view==='line'){const A=sim.p.arrive,H=sim.p.handle;if(A<=H)return `The experts finish ${H} cases a week and ${A} arrive, so <b>no line builds up</b>. More responders, or AI that helps them, is how defenders catch up.`;
   return `${A} break-ins a week arrive and the experts finish ${H}. After ${sim.p.weeks} weeks, <b>${DK.n(backlog(sim),0)} cases are waiting</b>, and a new victim waits about ${DK.n(waitW(sim),1)} weeks for help.`;}
  if(DK.pend(sim))return 'Add up the hours for each stage, then compare the two.';
  const w=winner(sim);
  return `The AI tool finishes the whole break-in in <b>${DK.n(TA,1)} hours</b>; by hand it takes ${TH} hours, about a week. Defenders notice at hour ${sim.p.notice}, so ${w==='ai'?'<b>only the AI tool finishes first</b>, at '+(sim.p.who==='ai'?sim.p.targets+' places at once':'machine speed'):w==='both'?'<b>both finish</b> before anyone looks':w==='human'?'only the person finishes':'<b>defenders win the race</b>'}.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'A break-in has four stages: look around, get in, get the master keys, take the data. By hand that takes about a week. Defenders check their alerts once a day. Who finishes before anyone notices: a person working by hand, an AI tool like ARTEX, both or neither?'},
  lock(sim){const r=winner(sim);return {v:sim.p.guess===r?0:1,pick:sim.p.guess,label:{human:'Only the person',ai:'Only the AI tool',both:'Both',neither:'Neither'}[sim.p.guess]};},
  solve(sim){sim.p.view='race';sim.st.h=200;const r=winner(sim);sim.p.guess=r;return {v:0,pick:r,label:{human:'Only the person',ai:'Only the AI tool',both:'Both',neither:'Neither'}[r]+` (AI tool: ${DK.n(TA,1)} h; by hand: ${TH} h)`};},
  hint:{bio:'Lock in your gut. Then you will compare how long each one takes.'},
  calc:{unit:'times faster',d:0,tol:0.6,after:'lock',
   prompt:{bio:`By hand, the four stages take ${HUM.join(' + ')} hours. The AI tool takes ${AI.join(' + ')} hours. How many <b>times faster</b> is the AI tool?`,
    ap:`T<sub>human</sub> = Σ(${HUM.join(', ')}) h, T<sub>AI</sub> = Σ(${AI.join(', ')}) h. Find T<sub>human</sub> ÷ T<sub>AI</sub>.`},
   answer:()=>TH/TA,
   hint:'Add each list to get two totals, then divide the bigger one by the smaller one.',
   steps(){return [`By hand: ${HUM.join(' + ')} = ${TH} hours (a week).`,`AI tool: ${AI.join(' + ')} = ${TA} hours.`,`${TH} ÷ ${TA} = <b>${DK.n(TH/TA,0)} times faster</b>.`];}},
  formula(sim){return `${TH} h ÷ ${TA} h = ${DK.n(TH/TA,0)}× faster; defenders notice at hour ${sim.p.notice}`;},
  how:{bio:'Add each list of times to get the whole break-in. Dividing one total by the other tells you how many times faster.',
   ap:'Speed ratio = T<sub>h</sub>/T<sub>AI</sub> = 168/3.5 = 48. With detection at hour n, the attacker wins whenever T &lt; n.'},
  compare(sim,g){const r=winner(sim),c=sim.ui.calc,self=c&&c.done&&c.correct?' You found the 48× yourself.':'';
   return (g.pick===r?'Your gut was right. ':'')+`The AI tool is done in <b>${DK.n(TA,1)} hours</b>, long before defenders look at hour ${sim.p.notice}. By hand, the same work takes ${TH} hours, so the person is caught. That is the asymmetry: attackers moved to machine speed, and most defenders still work at human speed.`+self;},
  again(sim){sim.p.guess='neither';sim.p.view='race';sim.p.notice=[2,6,12,24,48,72][Math.floor(Math.random()*6)];sim.st.h=200;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'What made ARTEX different from a person breaking in by hand?',choices:['It was slower but quieter','It ran every stage on its own at machine speed, and one person could aim it at many places at once','It only worked on old phones'],correct:1,explain:'The FBI said it automated reconnaissance through taking data, sometimes reaching privileged access in under three hours, and let people with little skill run complex attacks on many targets.'},
  {lvl:'bio',kind:'num',q:'Experts finish 20 cases a week and 24 new ones arrive. How many cases are waiting after 10 weeks?',answer:40,tol:0,unit:'cases',d:0,hint:'(24 − 20) × 10.',explain:'4 extra cases a week × 10 weeks = 40 cases waiting.'},
  {lvl:'bio',instant:true,q:'The tool’s maker took it down in October. Why was it still a problem in November?',choices:['It came back by itself','Copies had already spread; once code is public, taking down the original does not remove the copies','It never existed'],correct:1,explain:'The FBI said it continued to spread online, with over 1,600 exposed copies found running by early November.'},
  {lvl:'honors',kind:'num',q:'In the line view (30 in, 25 out, 26 weeks), how long does a new victim wait for experts, in weeks?',answer:5.2,tol:0.05,unit:'weeks',d:1,hint:'Backlog = (30 − 25) × 26 = 130. Divide by 25.',explain:'130 ÷ 25 = 5.2 weeks. A small gap of 5 a week becomes more than a month of waiting in half a year.'},
  {lvl:'honors',instant:true,q:'Which change shrinks the waiting line?',choices:['More break-ins','Making the experts’ capacity bigger than arrivals, by hiring or by tools that help them','Waiting longer'],correct:1,explain:'The line shrinks only when cases finished per week exceed cases arriving. That is why defending with AI, and training more people, both matter.'},
  {lvl:'ap',kind:'num',q:'Arrivals 40 a week, capacity 32. After how many weeks has the wait for a new victim reached 6 months (26 weeks)?',answer:104,tol:0,unit:'weeks',d:0,hint:'Wait = 8W ÷ 32 = W ÷ 4. Set W ÷ 4 = 26.',explain:'W = 104 weeks, two years. At that point the line keeps growing by 8 a week.'},
  {lvl:'ap',instant:true,q:'Doubling the number of places one operator attacks at once does what to the responders’ arrivals A?',choices:['Nothing','Raises A, and if A > H the backlog grows faster: slope (A − H)','Halves the backlog'],correct:1,explain:'Scale raises arrivals. The backlog’s slope is A − H, so every extra break-in per week adds to the slope.'}
 ],
 tour:[
  {title:'Four stages of a break-in',text:'A break-in has four stages: look around, get in, get the master keys, then take the data. Done by hand, that takes a person about a week.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{view:'race',who:'human',notice:24,targets:50});sim.st.h=200;}},
  {title:'Defenders notice once a day',text:'Here, defenders check their alerts once a day. By hand, the attacker is still getting the master keys when someone notices. Defenders win.',pause:true,setup:sim=>{sim.tst=2;sim.st.h=0;sim.st.run=true;},speed:.5},
  {title:'Machine speed',text:'An AI tool like ARTEX runs all four stages by itself. The FBI said it sometimes reached the master keys in under three hours. Here it is done in 3.5 hours, 48 times faster.',pause:true,setup:sim=>{sim.tst=3;BioLab.setValues(sim,{who:'ai'});sim.st.h=0;sim.st.run=true;},speed:.5},
  {title:'One person, many places',text:'It also runs against many places at once, and people with little skill can use it. It was pulled offline in October, but copies keep spreading.',pause:true,setup:sim=>{sim.tst=4;}},
  {title:'The waiting line',text:'Every break-in needs experts to clean up. If 30 arrive a week and the experts finish 25, the line grows by 5 every week.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{view:'line',arrive:30,handle:25,weeks:26});}},
  {lvl:'honors',title:'Why help is months away',text:'After 26 weeks, 130 cases wait and a new victim waits over 5 weeks. In the episode, Nicole Perlroth said one expert firm had a backlog of more than six months.',pause:true,setup:sim=>{sim.tst=6;}}
 ],
 onTourExit(sim){sim.tst=0;sim.st.run=false;sim.st.h=200;},
 lab:{bio:'<p><b>Question:</b> How fast would defenders have to notice to stop the AI tool?</p><ol><li>In the race, set <b>Hours until defenders notice</b> to 24, 12, 6, 3 and 2. Record a trial each time.</li><li>Note when the AI tool stops finishing first.</li></ol><p>Write one sentence: what does this mean for a school that checks alerts once a day?</p>',
  honors:'<p><b>Question:</b> How does the waiting line respond to small changes?</p><ol><li>Set arrivals to 30. Record the wait with capacity 25, 28, 30 and 35.</li><li>Use the graph to see the slope each time.</li></ol><p>Explain why a small gap matters so much over half a year.</p>',
  ap:'<p><b>Question:</b> Model the backlog.</p><ol><li>Write the backlog and wait as functions of A, H and W.</li><li>Find the capacity needed to clear a backlog of 130 in 8 weeks if arrivals stay at 30.</li></ol><p><b>CER:</b> Is the best response more responders, AI tools for defenders, or fewer open doors? Use your model.</p>'},
 terms:[
  {t:'Automation',d:'A machine doing steps on its own that a person used to do one by one.'},
  {t:'Machine speed',d:'The pace of a computer doing a job: hours or minutes for what took people days.'},
  {t:'Incident response',d:'The experts who come in after a break-in to find the intruder, clean up and recover.'},
  {t:'Backlog',d:'Work that has piled up waiting to be done.'},
  {t:'Privileged access (master keys)',d:'An account that can open almost everything in a system, like an administrator.',lvl:'honors'},
  {t:'Dual use',d:'A tool that can protect or harm, depending on who uses it. Security testing tools are dual use.',lvl:'honors'},
  {t:'Queue',d:'A waiting line. When arrivals beat service, it grows at the rate arrivals − service.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Race: four stages with times of 48, 24, 72 and 24 hours by hand and 0.5, 0.75, 1.5 and 0.75 hours for an automated tool, all invented for illustration; the attacker wins if the total is less than the hours until defenders notice. Line: backlog = max(0, (arrivals − capacity) × weeks), and the wait for a new case is backlog ÷ capacity. Real response teams also prioritize the worst cases first.</p><p><b>ARTEX.</b> In November 2026 the FBI issued an advisory about ARTEX, which it described as an open-source, AI-driven agent platform that “malicious cyber actors” had used to target organizations since August 2026. It automates intrusions from reconnaissance through taking data, in some cases reaching privileged access in under three hours, and lets people with limited skill run complex operations against many targets. It was first posted to GitHub in July 2026, described as for authorized security testing, and removed on October 8; the FBI said copies continued to spread, with over 1,600 publicly exposed instances found by early November. The FBI did not link it to the November outages. (Newsweek, Just the News, November 2026.)</p><p><b>Defenders.</b> The FBI’s advice included shrinking what faces the internet, tightening sign-ins and permissions, and saving sign-in and audit records before cleaning up. In the <i>Plain English</i> episode, Nicole Perlroth described a backlog of more than six months at Mandiant and said CrowdStrike was turning away breach victims.</p><p><b>What this tool leaves out on purpose.</b> It names the stages of a break-in in plain words and shows none of the methods. It is about why defense is hard, not how to attack.</p>'
};
BioLab.register(SIM);
})();
