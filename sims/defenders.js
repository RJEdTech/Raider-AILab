(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* How defenders win, with real numbers from named sources (see About):
   AI finds and fixes: DARPA AI Cyber Challenge final (Aug 2025): 70 planted flaws, 54 found (77%), 43 patched (61%), 45 minutes per fix on average,
     plus 18 real flaws nobody planted. Y2K: about $100 billion in U.S. repairs (about $365 per American), and January 1, 2000 passed with few problems.
   An alarm and a person: November 2, 2026, blood-plasma fridges at three French Blood Establishment sites; monitoring raised an alarm and staff stepped in.
   The lock that was installed: Danfoss fix (Aug 2025); controllers updated to it were not affected in October 2026.
   The jobs: BLS information security analysts, median pay $129,180 (May 2025), projected growth 21% (2025–2035). */
const AX={planted:70,found:54,patched:43,mins:45,real:18};
const SCN={
 aixcc:{t:'AI that finds and fixes',short:'AI fixes'},
 y2k:{t:'Y2K: the disaster that didn’t happen',short:'Y2K'},
 blood:{t:'An alarm and a person',short:'Alarm'},
 update:{t:'The stores that updated',short:'Updated'},
 jobs:{t:'The jobs this creates',short:'Jobs'}
};
const JOBS=[
 ['Security analyst','Watches the alarms, checks the sign-in records and closes holes.','Median pay $129,180 (May 2025); jobs projected to grow 21% by 2035.'],
 ['Incident responder','Comes in after a break-in to find the intruder and clean up.','The experts with the six-month waiting line.'],
 ['Building and plant security tech','Protects the computers that run fridges, water pumps and power.','The French fridges and Oldsmar were this kind of system.'],
 ['Modernization engineer','Keeps old systems running and replaces them safely.','Like the FAA’s old copper lines and their upgrade.'],
 ['AI security researcher','Builds AI that finds holes and writes the fix first.','Like the teams in DARPA’s AI Cyber Challenge.']
];
const pct=(a,b)=>a/b*100;

const SIM={
 id:'defenders',hash:'defenders',apUnit:5,order:8,tab:'How defenders win',kind:'Learning tool',
 card:'The same AI that breaks in can lock the doors. See AI find and fix flaws, the Y2K repair that worked, an alarm that saved blood plasma, and the jobs this creates.',
 title:'How defenders win, and the jobs it creates',
 lede:{bio:'Tool 8 of 8. Tools 1 to 7 showed why things break. This one shows how people, and AI working with them, keep things standing. The same kind of AI that runs a break-in at machine speed can also find holes and write the patch first. Look at four wins, then at the jobs behind them.',
  honors:'Tool 8 of 8. Defense wins when the fix arrives before the attacker, when an alarm reaches a person in time, and when the lock that exists actually gets installed. Each of those is work people do, and AI can speed up.',
  ap:'Tool 8 of 8. Each win reduces one term from earlier tools: AI patching shrinks the patch window (tool 4), monitoring shrinks dwell time, installing fixes closes doors (tool 2), and more defenders raise capacity in the waiting line (tool 5).'},
 skills:{bio:'Percents from counts · Pre-algebra',honors:'Percents, rates and per-person cost · Algebra 1',ap:'Rates, percents and connecting models · Algebra 1'},
 scale:'Four real cases and five real jobs. Every number is from a named source in About.',
 aspect:16/9,timeless:true,animated:true,trials:false,graph:true,
 controlsTitle:'The wins',
 controls:[
  {id:'guess',label:'Your gut: AI systems searched code with 70 hidden flaws. About how many did they find?',type:'seg',def:'tenth',options:[{v:'tenth',l:'About 1 in 10'},{v:'half',l:'About half'},{v:'most',l:'About 3 in 4'}]},
  {id:'scene',label:'Show',type:'seg',def:'aixcc',options:Object.keys(SCN).map(k=>({v:k,l:SCN[k].short})),noGut:true}
 ],
 actions:[{id:'replay',label:'Replay',primary:true,run(sim){sim.st.a=0;}}],
 init(){return {a:0,t:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;st.a=Math.min(1,st.a+dt/3);},
 metrics:[
  {id:'found',label:'AI challenge: flaws found',unit:'%',d:0,min:0,max:100,get:sim=>DK.pend(sim)?null:pct(AX.found,AX.planted)},
  {id:'patched',label:'AI challenge: flaws patched',unit:'%',d:0,min:0,max:100,get:sim=>pct(AX.patched,AX.planted)},
  {id:'mins',label:'Average time to write a fix',unit:'minutes',d:0,max:null,get:()=>AX.mins},
  {id:'y2k',label:'Y2K repairs per American',unit:'$',d:0,max:null,lvl:'honors',get:()=>365},
  {id:'grow',label:'Security analyst jobs, growth 2025–2035',unit:'%',d:0,max:null,get:()=>21}
 ],
 graphs:[{id:'ax',label:'The AI challenge, by the numbers',custom:true}],defaultGraph:'ax',
 plot(sim,ctx,box){const v=[AX.planted,AX.found,AX.patched],h=DK.pend(sim);const ax=axes(ctx,box,{xmin:0,xmax:3,ymin:0,ymax:80,xl:'',yl:'Flaws',xcats:['Planted','Found','Patched']});bars(ctx,ax,h?[70,NaN,NaN]:v,{colors:[PAL['line'],PAL['s2'],PAL['s3']],d:0});},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,a=sim.st.a,t=sim.st.t,stg=DK.stage(sim),sc=sim.p.scene,hide=DK.pend(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);DK.card(ctx,8,8,784,434);
  txt(ctx,SCN[sc].t,22,8+24*kk,{s:14*kk,w:700});
  if(sc==='aixcc'){const cols=bg?10:14,n=AX.planted,dw=bg?40:30,dh=bg?42:46,gx=22,gy=52*kk;
   for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols),x=gx+c*(dw+6),y=gy+r*(dh+8);const st=hide?'old':(i<AX.patched*a?'locked':i<AX.found*a?'old':'open');DK.door(ctx,x,y,dw,dh,st,kk);}
   const X=bg?492:560;let y=60*kk;if(!bg||true){txt(ctx,hide?'Found: ?':'Found: '+AX.found+' of 70 ('+DK.n(pct(AX.found,70),0)+'%)',X,y,{s:13*kk,w:700,c:PAL['s2']});y+=24*kk;
    txt(ctx,hide?'Patched: ?':'Patched: '+AX.patched+' of 70 ('+DK.n(pct(AX.patched,70),0)+'%)',X,y,{s:13*kk,w:700,c:PAL['s3']});y+=24*kk;
    txt(ctx,'About 45 minutes per fix',X,y,{s:13*kk,w:700});y+=30*kk;
    if(!bg){y=DK.para(ctx,'They also found 18 real holes nobody planted, and the winning systems were released free for anyone to use.',X,y,222,{s:12,c:PAL['cv-soft']});
     y=DK.para(ctx,'Green: found and fixed. Amber: found, not fixed yet. Red: missed.',X,y+10,222,{s:12,c:PAL['cv-soft']});}}
   if(stg===2)DK.flag(ctx,gx-4,gy-4,cols*(dw+6)+2,5*(dh+8)+4);}
  else if(sc==='y2k'){const y0=80*kk;
   txt(ctx,'Old code saved years as two digits: 1999 was just “99.”',22,y0,{s:13*kk,w:600});
   const bx=40,by=y0+30;DK.card(ctx,bx,by,180,90,{fill:PAL['card2']});txt(ctx,'99',bx+90,by+60,{s:40*kk,w:800,a:'center'});
   DK.card(ctx,bx+240,by,180,90,{fill:PAL['card2']});txt(ctx,'00',bx+330,by+60,{s:40*kk,w:800,a:'center',c:PAL['s1']});
   ctx.strokeStyle=PAL['cv-ink'];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+190,by+45);ctx.lineTo(bx+230,by+45);ctx.stroke();
   if(!bg)txt(ctx,'Is 2000 the year 1900?',bx+440,by+50,{s:13,w:700,c:PAL['s1']});
   let y=by+130;txt(ctx,'The U.S. spent about $100 billion fixing it, about $365 per American.',22,y,{s:13*kk,w:700});y+=26*kk;
   txt(ctx,'January 1, 2000: few problems.',22,y,{s:13*kk,w:700,c:PAL['s3']});y+=26*kk;
   if(!bg)DK.para(ctx,'Some people later called it a hoax because nothing happened. But nothing happened because people did the work. When prevention succeeds, it looks like nothing.',22,y,740,{s:12.5,c:PAL['cv-soft']});
   if(stg===3)DK.flag(ctx,16,by+100,768,90);}
  else if(sc==='blood'){const Tm=a<.5?4+60*a:Math.max(4,34-(a-.5)*120);const al=a>.45;
   DK.thermo(ctx,90,70*kk,300,Tm,0,60,25,kk);txt(ctx,DK.n(Tm,0)+' °C',90,60*kk,{s:14*kk,w:700,a:'center',c:Tm>25?PAL['s1']:PAL['s2']});
   let y=80*kk;const X=150;txt(ctx,'November 2, 2026: blood plasma in three French blood banks',X,y,{s:13*kk,w:700});y+=26*kk;
   y=DK.para(ctx,'Attackers tried to heat the plasma fridges to 110 °C.',X,y,600,{s:12.5*kk});y+=6;
   if(al){ctx.fillStyle=PAL['s1'];rr(ctx,X,y,bg?200:260,34,6);ctx.globalAlpha=.5+.5*Math.abs(Math.sin(t*4));ctx.fill();ctx.globalAlpha=1;txt(ctx,'ALARM: temperature rising',X+12,y+22,{s:13*kk,w:700,c:'#fff'});y+=50;}
   if(a>.62){DK.person(ctx,X+20,y+40,40,'helper');y=DK.para(ctx,'The monitoring system raised an alarm, staff stepped in, and the plasma was saved.',X+50,y+20,560,{s:12.5*kk,w:700,c:PAL['s3']});}
   if(stg===4)DK.flag(ctx,16,50,768,330);}
  else if(sc==='update'){const n=bg?12:24,cols=bg?6:12;
   for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols),x=30+c*(bg?118:60),y=70*kk+r*(bg?90:80),up=i%3!==0;
    DK.card(ctx,x,y,bg?100:48,bg?70:60,{fill:up?PAL['card2']:'rgba(214,69,65,.15)',r:6});DK.door(ctx,x+(bg?38:14),y+10,bg?24:20,bg?44:36,up?'locked':'open',kk);}
   let y=70*kk+2*(bg?90:80)+30;txt(ctx,'The fix came out in August 2025.',22,y,{s:13*kk,w:700});y+=24*kk;
   txt(ctx,'Stores whose controllers were updated were not affected.',22,y,{s:13*kk,w:700,c:PAL['s3']});y+=24*kk;
   if(!bg)DK.para(ctx,'The lock existed for over a year. The win is the boring part: someone installing it. (The share of updated stores here is just for the picture.)',22,y,740,{s:12.5,c:PAL['cv-soft']});}
  else{const cw=bg?370:250,chh=bg?120:180;JOBS.slice(0,bg?4:5).forEach((J,i)=>{const c=bg?i%2:i%3,r=bg?Math.floor(i/2):Math.floor(i/3),x=22+c*(cw+10),y=46*kk+r*(chh+10);
    DK.card(ctx,x,y,cw,chh,{fill:PAL['card2'],r:8});txt(ctx,J[0],x+12,y+22*kk,{s:13*kk,w:700,c:PAL['s2']});let yy=DK.para(ctx,J[1],x+12,y+42*kk,cw-24,{s:12*kk,maxY:y+chh-10});if(!bg)DK.para(ctx,J[2],x+12,yy+6,cw-24,{s:12,w:600,c:PAL['cv-soft'],maxY:y+chh-8});});
   if(stg===5)DK.flag(ctx,16,40,768,400);}
 },
 narrate(sim){const sc=sim.p.scene;if(DK.pend(sim))return 'The AI systems found 54 of the 70 hidden flaws. Work out the percent.';
  if(sc==='aixcc')return `In DARPA’s AI Cyber Challenge, AI systems found <b>${AX.found} of ${AX.planted} hidden flaws (77%)</b> and patched ${AX.patched} (61%), about ${AX.mins} minutes per fix. This is the same kind of AI that can break in, pointed at locking doors.`;
  if(sc==='y2k')return 'Y2K was a real bug in old code, and people fixed it in time: about <b>$100 billion</b> in the U.S., roughly $365 per person. Because the work succeeded, it looked like nothing happened.';
  if(sc==='blood')return 'An attacker tried to overheat blood plasma. <b>A monitoring alarm reached a person in time</b>, and staff stopped it. Fast detection is how defenders win at machine speed.';
  if(sc==='update')return 'The fix for the supermarket fridge controllers came out in August 2025. <b>The ones that were updated were not affected</b> in October 2026. Most wins look like this: someone installed the lock.';
  return 'Every win here is work people do: watching alarms, cleaning up, protecting the computers that run water and power, modernizing old systems, and building AI that writes the fix first. The U.S. projects security analyst jobs to grow <b>21% from 2025 to 2035</b>.';},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'In 2025, DARPA hid 70 flaws in real software and challenged teams to build AI that finds and fixes them on its own. About how many of the 70 did the AI systems find?'},
  lock(sim){return {v:sim.p.guess==='most'?0:1,pick:sim.p.guess,label:{tenth:'About 1 in 10',half:'About half',most:'About 3 in 4'}[sim.p.guess]};},
  solve(sim){sim.p.guess='most';sim.p.scene='aixcc';sim.st.a=1;return {v:0,pick:'most',label:'54 of 70, about 3 in 4'};},
  hint:{bio:'Lock in your gut. Then you will turn the count into a percent.'},
  calc:{unit:'%',d:1,tol:0.3,
   prompt:{bio:'The AI systems found <b>54</b> of the <b>70</b> hidden flaws. What <b>percent</b> did they find?',ap:'Found 54 of 70 and patched 43 of 70. Give the percent found.'},
   answer:()=>pct(AX.found,AX.planted),
   hint:'Divide the part by the whole, then multiply by 100.',
   steps(){return ['54 ÷ 70 = 0.771.','0.771 × 100 = <b>77.1%</b>.','They patched 43 of 70, or 61.4%, in about 45 minutes each.'];}},
  formula(){return '54 ÷ 70 = 77.1% found; 43 ÷ 70 = 61.4% patched';},
  how:{bio:'A percent is part ÷ whole × 100.',ap:'Found rate 54/70; patch rate of found 43/54 ≈ 79.6%.'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You found the percent yourself.':'';
   return (g.pick==='most'?'Your gut was right. ':'More than most people expect. ')+'The AI systems found <b>54 of 70 (77%)</b> and fixed 43, about 45 minutes each, and found 18 real flaws nobody had planted. The same speed that makes AI attacks dangerous can make defense fast too.'+self;},
  again(sim){sim.p.guess='tenth';sim.p.scene='aixcc';sim.st.a=0;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'Why did some people call Y2K a hoax afterward?',choices:['Because the bug was fake','Because the repairs worked, so almost nothing went wrong, and success looked like nothing happening','Because computers did not exist'],correct:1,explain:'The bug was real. About $100 billion of U.S. work fixed it in time. When prevention succeeds, people forget it was needed.'},
  {lvl:'bio',kind:'num',q:'The AI systems patched 43 of 70 planted flaws. What percent is that, to the nearest whole percent?',answer:61,tol:0.6,unit:'%',d:0,hint:'43 ÷ 70 × 100.',explain:'43 ÷ 70 = 0.614, about 61%.'},
  {lvl:'bio',instant:true,q:'What saved the blood plasma on November 2, 2026?',choices:['Luck','A monitoring alarm that reached staff in time','The fridge was unplugged'],correct:1,explain:'The monitoring system raised an alarm and staff stepped in. Detection plus a person is how defenders win.'},
  {lvl:'honors',kind:'num',q:'Of the 54 flaws the AI found, 43 were patched. What percent of the found flaws were patched?',answer:79.6,tol:0.3,unit:'%',d:1,hint:'43 ÷ 54 × 100.',explain:'43 ÷ 54 = 0.796, about 79.6%. Finding is not the same as fixing.'},
  {lvl:'honors',kind:'num',q:'$100 billion of Y2K repairs was about $365 per American. About how many Americans does that imply, in millions?',answer:274,tol:2,unit:'million',d:0,hint:'100,000,000,000 ÷ 365.',explain:'$100 billion ÷ $365 ≈ 274 million people, close to the 1999 U.S. population.'},
  {lvl:'ap',instant:true,q:'Which earlier model does AI that writes patches in 45 minutes improve most directly?',choices:['The cluster model (tool 7)','The patch window and dwell time (tools 3 and 4): the door locks sooner and intruders have less time','None'],correct:1,explain:'A faster fix shrinks the time the door is open. Combined with checking the records, it shrinks how long anyone stays inside.'},
  {lvl:'ap',instant:true,q:'BLS projects security analyst jobs to grow 21% from 2025 to 2035. In the waiting-line model (tool 5), what does that do?',choices:['Raises arrivals A','Raises capacity H, which lowers the slope A − H of the backlog','Nothing'],correct:1,explain:'More defenders, and AI tools that help each one handle more cases, both raise H.'}
 ],
 tour:[
  {title:'The same tools, turned to good',text:'In tool 5, AI ran a break-in at machine speed. The same kind of AI can also search code for holes and write the patch before an attacker finds them.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{scene:'aixcc'});sim.st.a=0;}},
  {title:'AI finds and fixes',text:'In DARPA’s 2025 AI Cyber Challenge, AI systems found 54 of 70 hidden flaws and fixed 43, about 45 minutes per fix. They also found 18 real holes nobody had planted.',pause:true,setup:sim=>{sim.tst=2;sim.st.a=0;},speed:.5},
  {title:'Y2K: a repair that worked',text:'Old code stored years as two digits, so 2000 looked like 1900. The U.S. spent about $100 billion fixing it, and January 1, 2000 passed with few problems.',pause:true,setup:sim=>{sim.tst=3;BioLab.setValues(sim,{scene:'y2k'});}},
  {title:'An alarm and a person',text:'On November 2, 2026, attackers tried to overheat blood plasma in French blood banks. An alarm reached staff in time, and the plasma was saved.',pause:true,setup:sim=>{sim.tst=4;BioLab.setValues(sim,{scene:'blood'});sim.st.a=0;},speed:.5},
  {title:'The jobs behind the wins',text:'Every win was work people did. These jobs are growing: the U.S. projects security analyst jobs to grow 21% from 2025 to 2035.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{scene:'jobs'});}}
 ],
 onTourExit(sim){sim.tst=0;sim.st.a=1;},
 lab:{bio:'<p><b>Question:</b> What do the four wins have in common?</p><ol><li>Look at each scene: AI fixes, Y2K, Alarm and Updated.</li><li>For each one, write who did the work and what they did.</li></ol><p>Write one sentence: what do people do in every defender win?</p>',
  honors:'<p><b>Question:</b> Which job would you want, and why?</p><ol><li>Open <b>Jobs</b>. Pick one.</li><li>Find which earlier tool (1 to 7) shows the problem that job solves.</li></ol><p>Explain the connection in two or three sentences.</p>',
  ap:'<p><b>Question:</b> Connect the models.</p><ol><li>For each win, name which variable in tools 2 to 5 it changes (key space, patch window, dwell time, capacity).</li><li>Estimate how much each one changes the result, using those tools.</li></ol><p><b>CER:</b> Which single change would do the most good for a school like RJ? Use your estimates.</p>'},
 terms:[
  {t:'Defender',d:'Anyone who protects systems: IT staff, security teams, and you when you update and use strong passwords.'},
  {t:'Monitoring',d:'Watching systems for signs of trouble and raising alarms when something looks wrong.'},
  {t:'Prevention paradox',d:'When prevention works, nothing bad happens, so people think it was never needed.',lvl:'honors'},
  {t:'Open source',d:'Code anyone can read, use and improve. The AI challenge’s winning systems were released this way.',lvl:'honors'},
  {t:'Defense in depth',d:'Many layers of protection, so one failure is not the whole story: patches, passwords, monitoring and people.',lvl:'ap'}
 ],
 about:'<p><b>AI that finds and fixes.</b> DARPA’s AI Cyber Challenge (with ARPA-H) ended at DEF CON 33 in August 2025. In the final, competitors’ systems found 54 of 70 planted (synthetic) flaws and patched 43, about 45 minutes per patch on average, and also found 18 real flaws that had not been planted. Team Atlanta’s system won, and the finalists’ systems were released as open source (DARPA; CyberScoop; Cybersecurity Dive).</p><p><b>Y2K.</b> In November 1999, the U.S. Commerce Department estimated that businesses and government would spend about $100 billion on Y2K repairs from 1995 to 2001, about $365 per American (Government Executive; Nextgov). A U.S. Senate committee later concluded the work averted major problems.</p><p><b>The blood banks.</b> On November 2, 2026, attackers tried to heat refrigerators holding blood plasma at three French Blood Establishment (EFS) sites to 110 °C; staff stepped in after the monitoring system raised an alarm, and the plasma was not destroyed (DW, Le Monde).</p><p><b>The update.</b> Danfoss released fixed software for its AK-SM800A controllers in August 2025; reports found only units not updated were affected by the October 2026 attacks.</p><p><b>The jobs.</b> The U.S. Bureau of Labor Statistics reports a median pay of $129,180 for information security analysts in May 2025 and projects employment to grow 21% from 2025 to 2035, much faster than average. The other jobs on the cards are real roles described in plain words.</p><p><b>Where to start at RJ.</b> RJ’s cybersecurity and networking classes, and Raider ForensicsLab’s <a href="https://rjedtech.github.io/Raider-ForensicsLab/" target="_blank" rel="noopener">Explore cybersecurity</a> tools.</p>'
};
BioLab.register(SIM);
})();
