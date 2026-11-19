(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* A device reachable from the internet is a door anyone can knock on. A password is its lock.
   Possible passwords = (choices per spot)^(length); time to try them all = possibilities ÷ guesses per second.
   The door is open if the device is reachable from the internet AND (its hole is unpatched OR every password can be tried within a day).
   The guessing rate (1,000 a second) is illustrative. The fridge story and its numbers are real (see About). */
const PW={
 date:{l:'admin + today’s date',short:'Today’s date',n:1,len:1,choices:'one: today’s date',combos:()=>1},
 pin6:{l:'6-digit PIN',short:'6-digit PIN',n:10,len:6,choices:'10 digits',combos:()=>1e6},
 word8:{l:'8 lowercase letters',short:'8 letters',n:26,len:8,choices:'26 letters',combos:()=>Math.pow(26,8)},
 mix12:{l:'12 mixed letters and numbers',short:'12 mixed',n:62,len:12,choices:'62 characters (a–z, A–Z, 0–9)',combos:()=>Math.pow(62,12)}
};
const SCN={store:{name:'Supermarket',dev:'Fridge controller',cold:'Fridges'},home:{name:'Your home',dev:'Smart fridge',cold:'Fridge'}};
const DAY=86400;
const combos=sim=>PW[sim.p.pw].combos();
const rate=sim=>sim.p.rate;
const secs=sim=>combos(sim)/rate(sim);
const open=sim=>sim.p.exposed&&(!sim.p.updated||secs(sim)<DAY);
function dur(s){if(s<1)return 'under a second';if(s<120)return DK.n(s,0)+' seconds';const m=s/60;if(m<120)return DK.n(m,1)+' minutes';const h=m/60;if(h<48)return DK.n(h,1)+' hours';const d=h/24;if(d<730)return DK.n(d,0)+' days';const y=d/365;
 if(y<1e6)return DK.n(y,1)+' years';if(y<1e9)return DK.n(y/1e6,1)+' million years';if(y<1e12)return DK.n(y/1e9,1)+' billion years';return DK.n(y/1e12,0)+' trillion years';}
function big(n){if(n<1e6)return DK.n(n,0);if(n<1e9)return DK.n(n/1e6,1)+' million';if(n<1e12)return DK.n(n/1e9,1)+' billion';if(n<1e15)return DK.n(n/1e12,1)+' trillion';return n.toExponential(1).replace('e+',' × 10^');}
const temp=sim=>{const f=Math.min(1,sim.st.hours/6);return open(sim)&&sim.st.night?3+47*f:3;};

const SIM={
 id:'doors',hash:'doors',apUnit:5,order:2,tab:'Doors in your house',kind:'Simulation',
 card:'In October 2026, someone turned off the cold in hundreds of supermarket fridges over the internet. Count the keys a lock really has, and find which fixes shut the door.',
 title:'Doors in your house: how 700 supermarket fridges got hacked',
 lede:{bio:'Tool 2 of 8. In tool 1, a hole was an unlocked door. Here is where the doors are: any device you can reach from the internet, like a fridge, camera or game console, is a door anyone in the world can knock on. Its password is the lock. Count how many keys a stranger would have to try.',
  honors:'Tool 2 of 8. Possible passwords = (choices per spot)<sup>length</sup>. A computer guessing a thousand times a second turns a small number of possibilities into minutes, and a big one into longer than the age of the universe.',
  ap:'Tool 2 of 8. With c choices per character and length L, the key space is c<sup>L</sup>; worst-case time is c<sup>L</sup> ÷ r. Doubling the length squares the key space; doubling the rate only halves the time.'},
 skills:{bio:'Counting possibilities with powers · Algebra 1',ap:'Exponents, orders of magnitude and rates · Algebra 1, Algebra 2'},
 scale:'One building and its connection to the internet. The guessing rate (1,000 tries a second) is illustrative; real rates depend on the device. The supermarket story, temperatures and dates are real (see About).',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The door',
 controls:[
  {id:'guess',label:'Your gut: is a 6-digit PIN safe for a device anyone on the internet can reach?',type:'seg',def:'safe',options:[{v:'safe',l:'Yes, safe enough'},{v:'unsafe',l:'No'}]},
  {id:'scene',label:'Building',type:'seg',def:'store',options:[{v:'store',l:'Supermarket'},{v:'home',l:'Your home'}],noGut:true},
  {id:'pw',label:'The password (the lock)',type:'seg',def:'pin6',options:Object.keys(PW).map(k=>({v:k,l:PW[k].short})),noGut:true,onChange:sim=>{sim.st.night=false;sim.st.hours=0;DK.clearGut(sim);}},
  {id:'updated',label:'Updated to the fixed version (patched)',type:'toggle',def:true,noGut:true,onChange:sim=>{sim.st.night=false;sim.st.hours=0;}},
  {id:'exposed',label:'Reachable from the whole internet',type:'toggle',def:true,noGut:true,onChange:sim=>{sim.st.night=false;sim.st.hours=0;}},
  {id:'rate',label:'Guesses per second',type:'range',min:100,max:10000,step:100,def:1000,unit:'per s',lvl:'ap',noGut:true,onChange:DK.clearGut}
 ],
 actions:[{id:'night',label:'Run the night (6 hours)',primary:true,run(sim){sim.st.night=true;sim.st.hours=0;}},
  {id:'fix',label:'Fix everything',run(sim){BioLab.setValues(sim,{pw:'mix12',updated:true,exposed:false});sim.st.night=false;sim.st.hours=0;}}],
 init(){return {night:false,hours:0,t:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.night&&st.hours<6)st.hours=Math.min(6,st.hours+dt*1.5);},
 metrics:[
  {id:'combos',label:'Passwords to try',unit:'',d:0,max:null,get:sim=>combos(sim)},
  {id:'mins',label:'Time to try them all',unit:'minutes',d:1,max:null,get:sim=>DK.pend(sim)?null:secs(sim)/60},
  {id:'when',label:'In plain words',text:true,get:sim=>DK.pend(sim)?'Work it out first':dur(secs(sim))},
  {id:'door',label:'The door',text:true,get:sim=>!sim.p.exposed?'Closed to the outside: not on the open internet':open(sim)?(!sim.p.updated?'Open: the hole is unpatched, so the password does not matter':'Open: every password can be tried in under a day'):'Locked'},
  {id:'temp',label:'Fridge after the night',unit:'°C',d:0,min:0,max:60,get:sim=>temp(sim)}
 ],
 graphs:[{id:'keys',label:'Passwords to try (log scale)',custom:true}],defaultGraph:'keys',
 plot(sim,ctx,box){const ks=Object.keys(PW),v=ks.map(k=>Math.log10(PW[k].combos()));
  const ax=axes(ctx,box,{xmin:0,xmax:4,ymin:0,ymax:24,xl:'',yl:'Digits in the number of passwords',xcats:ks.map(k=>PW[k].short)});
  bars(ctx,ax,v,{colors:ks.map(k=>k===sim.p.pw?PAL['s2']:PAL['line']),d:0});},
 draw(sim,ctx,vdt,k){const S=SCN[sim.p.scene],P=PW[sim.p.pw],bg=k>1.3,kk=bg?Math.min(k,1.6):1,t=sim.st.t,stg=DK.stage(sim),O=open(sim),hide=DK.pend(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the internet */
  const IX=86,IY=60;ctx.fillStyle=PAL['card2'];[[0,0,34],[30,-12,28],[56,4,26],[-28,6,24]].forEach(c=>{ctx.beginPath();ctx.arc(IX+c[0],IY+c[1],c[2],0,7);ctx.fill();});
  txt(ctx,'The internet',IX+12,IY+6,{s:12.5*kk,w:700,a:'center'});
  /* knocking strangers */
  if(sim.p.exposed&&stg>=1)for(let i=0;i<(bg?2:4);i++){const a=t*0.6+i*1.7;DK.person(ctx,IX-40+i*36,IY+64+Math.sin(a)*3,18,'intruder');}
  /* the building */
  const BX=30,BY=130,BW=bg?370:360,BH=310;DK.card(ctx,BX,BY,BW,BH,{r:10});txt(ctx,S.name,BX+14,BY+22*kk,{s:13*kk,w:700});
  /* the wire */
  ctx.strokeStyle=sim.p.exposed?PAL['s1']:PAL['line'];ctx.lineWidth=3;ctx.setLineDash(sim.p.exposed?[]:[6,6]);ctx.beginPath();ctx.moveTo(IX+60,IY+10);ctx.lineTo(BX+BW-70,IY+10);ctx.lineTo(BX+BW-70,BY+40);ctx.stroke();ctx.setLineDash([]);
  if(!sim.p.exposed){txt(ctx,'Not on the open internet',BX+BW-80,IY+2,{s:12*kk,w:700,c:PAL['s3'],a:'right'});}
  /* the device and its door */
  const DX=BX+BW-120,DY=BY+44;DK.card(ctx,DX,DY,104,96,{fill:PAL['card2'],r:8});txt(ctx,bg?'Controller':S.dev,DX+52,DY+16*kk,{s:12*kk,w:700,a:'center'});
  DK.door(ctx,DX+34,DY+26*kk,36,58,!sim.p.exposed?'locked':O?'open':'locked',kk);
  if(stg===5||stg===6||stg===7)DK.flag(ctx,DX,DY,104,96);
  /* the fridges */
  const nF=bg?3:4,FW=bg?80:64,T=temp(sim);
  for(let i=0;i<nF;i++){const fx=BX+16+i*(FW+12),fy=BY+170;ctx.fillStyle=T>20?'rgba(214,69,65,.18)':'rgba(70,130,200,.16)';rr(ctx,fx,fy,FW,120,6);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
   for(let s=1;s<3;s++){ctx.beginPath();ctx.moveTo(fx+4,fy+s*40);ctx.lineTo(fx+FW-4,fy+s*40);ctx.stroke();}}
  DK.thermo(ctx,BX+BW-40,BY+170,120,T,0,60,8,kk);txt(ctx,DK.n(T,0)+' °C',BX+BW-40,BY+160,{s:13*kk,w:700,a:'center',c:T>8?PAL['s1']:PAL['s2']});
  txt(ctx,S.cold+(sim.st.night?' · hour '+DK.n(sim.st.hours,1)+' of 6':''),BX+16,BY+160,{s:12.5*kk,w:600,c:PAL['cv-soft']});
  /* right: count the keys */
  const X=bg?418:408,W=800-X-10;DK.card(ctx,X,8,W,434);let y=8+24*kk;
  txt(ctx,'Count the keys',X+14,y,{s:13*kk,w:700});y+=24*kk;
  txt(ctx,'Lock: '+P.l,X+14,y,{s:12.5*kk,w:600});y+=22*kk;
  if(sim.p.pw==='date'){y=DK.para(ctx,'The login was the word “admin” and the password was today’s date. Anyone who knows the date has the key: 1 guess.',X+14,y,W-28,{s:12.5*kk,maxY:420});}
  else{txt(ctx,'Choices per spot: '+P.n,X+14,y,{s:12.5*kk});y+=20*kk;txt(ctx,'Spots: '+P.len,X+14,y,{s:12.5*kk});y+=24*kk;
   if(stg===2||stg===3)DK.flag(ctx,X+6,y-62*kk,W-12,64*kk);
   txt(ctx,P.n+'^'+P.len+' = '+big(combos(sim))+' passwords',X+14,y,{s:14*kk,w:700,c:PAL['s2']});y+=26*kk;}
  txt(ctx,'Guessing at '+DK.n(rate(sim),0)+' a second:',X+14,y+4,{s:12.5*kk});y+=24*kk;
  txt(ctx,hide?'? (work it out)':dur(secs(sim)),X+14,y,{s:15*kk,w:700,c:secs(sim)<DAY?PAL['s1']:PAL['s3']});y+=26*kk;
  if(stg===4)DK.flag(ctx,X+6,y-52*kk,W-12,54*kk);
  ctx.strokeStyle=PAL['line'];ctx.beginPath();ctx.moveTo(X+14,y);ctx.lineTo(X+W-14,y);ctx.stroke();y+=22*kk;
  const dl=!sim.p.exposed?'Door closed to the outside':O?'Door: OPEN':'Door: locked';txt(ctx,dl,X+14,y,{s:13.5*kk,w:700,c:O?PAL['s1']:PAL['s3']});y+=20*kk;
  if(!bg){const why=!sim.p.exposed?'Only people inside the building can reach it.':O?(!sim.p.updated?'The device has an unpatched hole, so a stranger can skip the password.':'A computer can try every password in under a day.'):'Patched, and the password would take more than a day to guess.';DK.para(ctx,why,X+14,y,W-28,{s:12,c:PAL['cv-soft'],maxY:430});}
 },
 narrate(sim){const P=PW[sim.p.pw];
  if(DK.pend(sim))return 'A 6-digit PIN has 10 choices for each of 6 spots. Work out how long a computer needs to try them all.';
  if(!sim.p.exposed)return '<b>The door is closed to the outside.</b> The device is not reachable from the open internet, so strangers cannot knock at all. This is the biggest fix.';
  if(!sim.p.updated)return `<b>The door is open.</b> The device has a hole that was never patched, so a stranger can get in without guessing the password at all.${sim.st.night?' Overnight, the fridges warm to '+DK.n(temp(sim),0)+' °C.':''}`;
  if(sim.p.pw==='date')return '<b>The door is open.</b> The password is today’s date, so anyone who knows what day it is has the key. That is how hundreds of French supermarket fridges were reached in October 2026.';
  return `A ${P.short.toLowerCase()} has ${big(combos(sim))} possibilities. At ${DK.n(rate(sim),0)} guesses a second, a computer tries them all in <b>${dur(secs(sim))}</b>, so the door is ${open(sim)?'<b>open</b>: under a day is not safe':'<b>locked</b>'}.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'A store’s fridge controller is reachable from the whole internet. It is patched and its password is a 6-digit PIN. A guessing program tries 1,000 PINs a second. Is that PIN safe enough?'},
  lock(sim){return {v:sim.p.guess==='unsafe'?0:1,pick:sim.p.guess,label:sim.p.guess==='safe'?'Safe enough':'Not safe'};},
  solve(sim){sim.p.guess='unsafe';sim.p.pw='pin6';return {v:0,pick:'unsafe',label:'Not safe: every PIN in '+dur(secs(sim))};},
  hint:{bio:'Lock in your gut. Then you will count the PINs and work out the time.'},
  calc:{unit:'minutes',d:1,tol:0.3,
   prompt:{bio:sim=>`A 6-digit PIN has 10 choices for each spot, so 10 × 10 × 10 × 10 × 10 × 10 = 1,000,000 PINs. A program tries ${DK.n(rate(sim),0)} a second. How many <b>minutes</b> to try them all?`,
    ap:sim=>`Key space 10⁶, rate r = ${DK.n(rate(sim),0)} per second. Worst-case time in minutes?`},
   answer:sim=>1e6/rate(sim)/60,
   hint:'Divide 1,000,000 by the guesses per second to get seconds, then divide by 60.',
   steps(sim){const s=1e6/rate(sim);return [`1,000,000 ÷ ${DK.n(rate(sim),0)} = ${DK.n(s,0)} seconds.`,`${DK.n(s,0)} ÷ 60 = <b>${DK.n(s/60,1)} minutes</b>.`,'Under a day, so the door counts as open. Add letters and length and the time jumps to years.'];}},
  formula(sim){return `10⁶ ÷ ${DK.n(rate(sim),0)} per second = ${DK.n(1e6/rate(sim),0)} s = ${DK.n(1e6/rate(sim)/60,1)} minutes`;},
  how:{bio:'Each spot multiplies the number of possible passwords by the number of choices. Divide that by how many guesses a computer makes each second and you get the time to try every one.',
   ap:'T = c<sup>L</sup> ÷ r. Going from 6 digits to 12 mixed characters multiplies the key space by about 3 × 10<sup>15</sup>.'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You did the counting yourself.':'';
   return (g.pick==='unsafe'?'Your gut was right. ':'A million sounds like a lot, but ')+`a computer tries every 6-digit PIN in about <b>${dur(1e6/rate(sim))}</b>. Twelve mixed letters and numbers would take ${dur(Math.pow(62,12)/rate(sim))}.`+self;},
  again(sim){const r=[500,1000,2000,5000][Math.floor(Math.random()*4)];sim.p.guess='safe';sim.p.pw='pin6';sim.p.rate=r;sim.p.updated=true;sim.p.exposed=true;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'Which change closes the door the most?',choices:['A longer password','Taking the device off the open internet, so strangers cannot reach it at all','Renaming the device'],correct:1,explain:'A longer password makes guessing slower. Taking the device off the open internet means strangers cannot even knock. Both help; the second helps most.'},
  {lvl:'bio',kind:'num',q:'A 4-digit PIN has 10 choices in each of 4 spots. How many PINs are possible?',answer:10000,tol:0,unit:'PINs',d:0,hint:'10 × 10 × 10 × 10.',explain:'10⁴ = 10,000. At 1,000 guesses a second, that is 10 seconds.'},
  {lvl:'bio',instant:true,q:'The device is patched but its password is today’s date. Is the door locked?',choices:['Yes, it is patched','No: anyone who knows the date has the key','Only at night'],correct:1,explain:'A patch closes a hole in the code, but a password anyone can guess is still an open door. The French supermarket controllers used the date as the password.'},
  {lvl:'honors',kind:'num',q:'How many 8-letter lowercase passwords are there, in billions? (26⁸)',answer:208.8,tol:0.5,unit:'billion',d:1,hint:'26⁸ = 208,827,064,576.',explain:'About 208.8 billion. At 1,000 guesses a second, that is about 6.6 years.'},
  {lvl:'honors',instant:true,q:'Danfoss released a fix in August 2025. Which stores were hit in October 2026?',choices:['All of them','Only stores whose controllers were never updated to the fixed version','Only stores with new fridges'],correct:1,explain:'Reports found only units not updated to software 4.3.1 were affected. The lock existed; it was never installed.'},
  {lvl:'ap',kind:'num',q:'At 1,000 guesses a second, how many years to try all 62¹² passwords? Give the answer in trillions of years.',answer:102.4,tol:2,unit:'trillion years',d:1,hint:'62¹² ≈ 3.226 × 10²¹. Divide by 1,000, then by 31,536,000 seconds a year.',explain:'3.226 × 10²¹ ÷ 10³ ÷ 3.1536 × 10⁷ ≈ 1.02 × 10¹⁴ years, about 102 trillion years.'},
  {lvl:'ap',instant:true,q:'Which helps more: doubling the guessing rate or adding one character to a 62-character password?',choices:['Doubling the rate helps the attacker more','Adding one character multiplies the time by 62, which outweighs a doubled rate','They cancel out'],correct:1,explain:'Time = c<sup>L</sup> ÷ r. One more character multiplies the numerator by 62; doubling r only divides by 2.'}
 ],
 tour:[
  {title:'Doors to the outside',text:'Any device you can reach from the internet is a door. A fridge, a camera, a game console: strangers anywhere in the world can knock on it.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{pw:'pin6',updated:true,exposed:true,scene:'store'});sim.st.night=false;sim.st.hours=0;},focus:[10,10,400,170]},
  {title:'The password is the lock',text:'The password is the lock. Its strength is how many keys a stranger would have to try. A 6-digit PIN has 10 choices for each of 6 spots.',pause:true,setup:sim=>{sim.tst=2;},focus:[408,8,382,200]},
  {title:'Count the keys',text:'10 × 10 × 10 × 10 × 10 × 10 = 10⁶, a million PINs. That sounds safe.',pause:true,setup:sim=>{sim.tst=3;},focus:[408,8,382,200]},
  {title:'Computers guess fast',text:'A program trying 1,000 PINs a second tests all million in about 17 minutes. Anything that falls in under a day counts as an open door here.',pause:true,setup:sim=>{sim.tst=4;},focus:[408,150,382,150]},
  {title:'October 11, 2026',text:'French supermarket fridge controllers were on the open internet. The login was “admin” and the password was today’s date. Overnight, someone set up to 700 stores to defrost. Some fridges reached 50 °C after six hours.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{pw:'date',updated:false});sim.st.night=true;sim.st.hours=0;},focus:[10,120,400,330],speed:.5},
  {title:'The lock was already made',text:'The maker had released a fix in August 2025. Stores that installed it, with a strong password, were not affected.',pause:true,setup:sim=>{sim.tst=6;BioLab.setValues(sim,{pw:'mix12',updated:true});sim.st.night=true;sim.st.hours=0;}},
  {lvl:'honors',title:'Close the door completely',text:'Best of all: take the controller off the open internet, so only people inside the building can reach it. Strangers cannot knock on a door they cannot find.',pause:true,setup:sim=>{sim.tst=7;BioLab.setValues(sim,{exposed:false});}}
 ],
 onTourExit(sim){sim.tst=0;sim.st.night=false;sim.st.hours=0;},
 lab:{bio:'<p><b>Question:</b> Which fix keeps the fridges cold?</p><ol><li>Set the password to <b>Today’s date</b>, turn off <b>Updated</b>, and press <b>Run the night</b>. Record the temperature.</li><li>Try one fix at a time: a 12-character password, updating, then taking it off the internet. Run the night and record after each.</li></ol><p>Write one sentence: which fix mattered most, and why?</p>',
  honors:'<p><b>Question:</b> How does password length change the time to guess?</p><ol><li>Record <b>Time to try them all</b> for each password type.</li><li>Use the graph (log scale) to compare them.</li></ol><p>Explain why one more character matters more than it seems.</p>',
  ap:'<p><b>Question:</b> How do rate and length trade off?</p><ol><li>For the 8-letter password, record the time at 100, 1,000 and 10,000 guesses a second.</li><li>Find the length of lowercase password that takes over 100 years at 10,000 a second.</li></ol><p><b>CER:</b> A company says, “Our devices are safe because the password is long.” What else would you ask?</p>'},
 terms:[
  {t:'Internet-exposed',d:'Reachable from anywhere on the internet, not just inside the building.'},
  {t:'Default password',d:'The password a device ships with. Many people never change it, and lists of them are public.'},
  {t:'Brute force',d:'Trying every possible password until one works. Computers can do millions of tries.'},
  {t:'Key space',d:'The number of possible passwords: choices per spot raised to the number of spots.',lvl:'honors'},
  {t:'Operational technology (OT)',d:'Computers that run physical things, like fridges, water pumps and traffic lights.',lvl:'honors'},
  {t:'Order of magnitude',d:'A factor of 10. Comparing 10⁶ with 10²¹ is comparing 6 and 21 orders of magnitude.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Passwords to try = (choices per spot)<sup>length</sup>. Time = passwords ÷ guesses per second. The door counts as open if the device is reachable from the internet and either its hole is unpatched or every password can be tried within a day. The 1,000-a-second rate is invented for illustration; real devices may lock out after a few wrong tries, or allow far faster guessing.</p><p><b>What happened.</b> On the night of October 11, 2026, refrigeration controllers at French supermarkets (reported as up to 700 stores, including Intermarché, Netto, Coopérative U, Carrefour and Monoprix) were set to defrost overnight. Some fridges reached 50 °C after six hours, and one Normandy store reported 80 °C. A second wave on November 2 hit stores in Belgium, Luxembourg, the Netherlands, Sweden, Estonia, Ireland and Portugal (Le Monde, The Guardian, AFP, NBC News).</p><p><b>How the door was open.</b> Danfoss controllers had web pages reachable from the public internet, and many used the username “admin” with the current date as the password through a “code of the day” feature. CERT-FR named the Danfoss AK-SM800 and AK-SC355 (end of life in 2021 and 2016) and also Copeland and Dixell XWEB devices. Claroty found the flaws in 2025; Danfoss released fixed software (4.3.1) in August 2025, and only units not updated were affected.</p><p><b>Who did it.</b> France’s foreign minister blamed a unit of Iran’s Revolutionary Guard on November 9, 2026. Other experts said the attack was easy enough for amateurs. That is part of the lesson: an easy door can be opened by anyone.</p><p><b>A near miss.</b> On November 2, attackers tried to heat fridges holding blood plasma at three French Blood Establishment sites; staff stepped in after the monitoring system raised an alarm.</p>'
};
BioLab.register(SIM);
})();
