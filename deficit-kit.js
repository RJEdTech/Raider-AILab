/* Raider AILab, "Why everything is breaking" section (Nov 19, 2026): shared drawing helpers.
   One picture runs through every tool: code is a building, a bug is a mistake in it, a vulnerability (hole) is a mistake
   that works like an unlocked door, a patch is a new lock, and "end of life" means the builder stopped making locks.
   Loaded after engine.js and before the sims. Exposes BioLab.dk. */
(function(){
'use strict';
const {txt,rr,PAL,FONT}=BioLab.h;
const DK={};
/* wrap text to a width; returns lines */
DK.wrap=function(ctx,s,maxW,size,w){ctx.font=(w||400)+' '+size+'px '+FONT;const out=[];String(s).split('\n').forEach(par=>{let l='';par.split(' ').forEach(wd=>{const t=l?l+' '+wd:wd;if(ctx.measureText(t).width>maxW&&l){out.push(l);l=wd;}else l=t;});out.push(l);});return out;};
/* draw wrapped text, returns the y after the last line */
DK.para=function(ctx,s,x,y,maxW,o){o=o||{};const size=o.s||12.5,lh=o.lh||size*1.3;DK.wrap(ctx,s,maxW,size,o.w).forEach((l,i)=>{if(o.maxY&&y+i*lh>o.maxY)return;txt(ctx,l,x,y+i*lh,{s:size,w:o.w||400,c:o.c||PAL['cv-ink'],a:o.a||'left'});});return y+DK.wrap(ctx,s,maxW,size,o.w).length*lh;};
/* a panel card */
DK.card=function(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle=o.fill||PAL['card'];rr(ctx,x,y,w,h,o.r||12);ctx.fill();ctx.strokeStyle=o.stroke||PAL['line'];ctx.lineWidth=o.lw||1.5;ctx.stroke();};
/* a door: state 'open' (red, ajar), 'locked' (green, padlock), 'old' (amber, worn lock), 'wall' (no door) */
DK.door=function(ctx,x,y,w,h,state,k){k=k||1;const c=state==='open'?PAL['s1']:state==='locked'?PAL['s3']:state==='old'?PAL['s4']:PAL['line'];
 ctx.fillStyle=PAL['card2'];rr(ctx,x,y,w,h,3);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=2;rr(ctx,x,y,w,h,3);ctx.stroke();
 if(state==='open'){ctx.fillStyle=c;ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(x+2,y+2);ctx.lineTo(x+w*.62,y+h*.12);ctx.lineTo(x+w*.62,y+h*.96);ctx.lineTo(x+2,y+h-2);ctx.closePath();ctx.fill();ctx.globalAlpha=1;}
 else if(state==='locked'||state==='old'){DK.lock(ctx,x+w/2,y+h*.58,Math.min(w,h)*.32,c,state==='old');}
};
/* a padlock centred at x,y, size s */
DK.lock=function(ctx,x,y,s,c,worn){ctx.strokeStyle=c;ctx.lineWidth=Math.max(1.5,s*.18);ctx.beginPath();ctx.arc(x,y-s*.35,s*.42,Math.PI,0);ctx.stroke();ctx.fillStyle=c;rr(ctx,x-s*.6,y-s*.35,s*1.2,s*.95,s*.15);ctx.fill();
 if(worn){ctx.strokeStyle=PAL['card'];ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-s*.4,y-s*.1);ctx.lineTo(x+s*.1,y+s*.4);ctx.moveTo(x+s*.15,y-s*.2);ctx.lineTo(x+s*.45,y+s*.2);ctx.stroke();}
 else{ctx.fillStyle=PAL['card'];ctx.beginPath();ctx.arc(x,y+s*.08,s*.14,0,7);ctx.fill();}};
/* a simple person: kind 'you' | 'intruder' | 'helper' */
DK.person=function(ctx,x,y,s,kind){const c=kind==='intruder'?PAL['s1']:kind==='helper'?PAL['s2']:PAL['s4'];ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y-s*.62,s*.26,0,7);ctx.fill();rr(ctx,x-s*.32,y-s*.3,s*.64,s*.62,s*.22);ctx.fill();
 if(kind==='intruder'){ctx.fillStyle='#1f1f22';rr(ctx,x-s*.24,y-s*.7,s*.48,s*.12,2);ctx.fill();}};
/* a laptop at x,y (top-left), w wide; state 'old' | 'new' | 'broken' | 'wait' */
DK.laptop=function(ctx,x,y,w,state){const h=w*.62,c=state==='broken'?PAL['s1']:state==='new'?PAL['s3']:state==='wait'?PAL['s2']:PAL['cv-soft'];
 ctx.fillStyle=c;ctx.globalAlpha=state==='old'?.45:.9;rr(ctx,x,y,w,h,2);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle=PAL['line'];ctx.fillRect(x-w*.1,y+h,w*1.2,Math.max(1.5,w*.1));};
/* a thermometer: value v between lo and hi, with a red line at warn */
DK.thermo=function(ctx,x,y,h,v,lo,hi,warn,k){k=k||1;const w=12*k,f=Math.max(0,Math.min(1,(v-lo)/(hi-lo)));ctx.fillStyle=PAL['card2'];rr(ctx,x-w/2,y,w,h,w/2);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
 ctx.fillStyle=v>=warn?PAL['s1']:PAL['s2'];rr(ctx,x-w/2+2,y+h-(h-4)*f-2,w-4,(h-4)*f,(w-4)/2);ctx.fill();
 const wy=y+h-(h-4)*(warn-lo)/(hi-lo)-2;ctx.strokeStyle=PAL['s1'];ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(x-w,wy);ctx.lineTo(x+w,wy);ctx.stroke();ctx.setLineDash([]);};
/* the "new layer" outline used in walkthrough stages */
DK.flag=function(ctx,x,y,w,h){ctx.strokeStyle=PAL['s1'];ctx.lineWidth=3;rr(ctx,x-3,y-3,w+6,h+6,12);ctx.stroke();};
/* walkthrough stage: 99 when no walkthrough is running */
DK.stage=sim=>(sim.tour&&sim.tour.on)?(sim.tst||1):99;
DK.pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
DK.locked=sim=>!!(sim.gutS&&sim.gutS.g&&!DK.pend(sim));
DK.clearGut=function(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}};
DK.n=function(v,d){if(!Number.isFinite(v))return '—';const s=v.toLocaleString('en-US',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});return s.replace('-','−');};
DK.pct=(v,d)=>DK.n(v*100,d===undefined?1:d)+'%';
/* the section's shared "Start here" line, added to every lede at Bio level */
DK.path=['bugpatch','doors','rollout','dwell','machinespeed','phantom','cluster','defenders'];
DK.pathLine=function(id){const i=DK.path.indexOf(id);return i<0?'':'Tool '+(i+1)+' of 8 in "Why everything is breaking".';};
BioLab.dk=DK;
})();
