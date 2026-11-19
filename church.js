/* Raider AILab: "What the Church teaches" card (Nov 19, 2026), added to each tool page like the "Questions to ask any AI" card.
   Sources: Pope Leo XIV, Magnifica humanitas (2026), cited as MH with paragraph numbers; Antiqua et Nova (2025); Laudato si' (2015);
   Rerum novarum (1891); Laborem exercens (1981); Catechism of the Catholic Church (CCC). Every point is a paraphrase in our own words.
   Teach, don't preach: Church teaching is stated as the Church's teaching; prudential applications are left as "Your call" questions. */
(function(){
'use strict';
const MH='<a href="https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html" target="_blank" rel="noopener"><i>Magnifica humanitas</i></a>';
const P={
 aiNot:'AI imitates some functions of intelligence by finding patterns in data. It does not live through experiences or grow inwardly the way a person does. (MH 97–99)',
 person:'Human intelligence belongs to a whole person: a body, a heart, relationships and limits. A person is never just data. (MH 118–126; <i>Antiqua et Nova</i>, 2025)',
 truth:'Truth is a common good that everyone shares. Tools that shape what people see and believe should serve the truth, not bend it. (MH 132–138)',
 resp:'People who design and use AI are responsible for the values built into it. Decisions that affect people need people who answer for them. (MH 102–111)',
 transp:'Systems that decide about people should be transparent and open to appeal, so mistakes can be found and fixed. (MH 102–111)',
 power:'Data and computing power are goods meant to serve everyone. When a few hold them, new imbalances of power follow. (MH 65–67, 92–96)',
 effic:'Efficiency is not the same as the good. A culture that measures everything by what can be optimized can lose sight of the person. (MH 92–96)',
 conscience:'No machine can replace a giving heart or form a conscience that tells good from evil. (MH 233)',
 companion:'Simulated empathy can mislead people and weaken their desire for real relationships, especially when those relationships are missing. (MH 100, 112–114)',
 freedom:'Freedom has to be protected from dependencies built into products and from turning people’s attention into a commodity. (MH 170–172)',
 presence:'Digital life speeds things up and scatters attention; the Church asks us to value being physically present to one another. (MH 239)',
 educ:'Education for the digital age should teach discernment, restraint and critical thinking, and adults are called to guide young people toward inner freedom. (MH 139–147, 238)',
 vigil:'AI is a valuable tool that requires vigilance: its benefits are real, and so are its risks. (MH 100–101)',
 energy:'AI uses large amounts of energy and water, and the Church asks for sustainable solutions. Care for our common home and care for the poor go together. (MH 101, 110; <i>Laudato si’</i>, 2015)',
 goods:'The goods of the earth are meant for everyone; costs and benefits should be judged by the common good, especially the good of the poor. (MH 65–67)',
 work:'Work is part of human dignity, not just a way to earn money. Automation must be judged by what it does to workers and their families. (MH 148–164)',
 workPerson:'Work is for the person, not the person for work. That has been Church teaching since Leo XIII’s <i>Rerum novarum</i> (1891) and John Paul II’s <i>Laborem exercens</i> (1981). (MH 29–37)',
 bias:'Systems can carry prejudice that falls hardest on the vulnerable, and the people who build them answer for it. (MH 102–104)',
 rash:'Assuming the worst about someone without enough evidence is the sin of rash judgment; charity looks for the most favorable honest reading. (CCC 2477–2478)',
 weapons:'Decisions to take a human life must never be handed to an artificial system; there must be meaningful human control and clear responsibility. (MH 197–200)',
 everyone:'Everyone can do their part, educators and researchers included, and researchers should weigh the wider consequences of their work. (MH 209, 212)'
};
const C={
 nextword:{p:['aiNot','person'],q:'What do you know from living, not from reading, that a model trained only on text could not know?'},
 attention:{p:['aiNot','truth'],q:'When an AI seems to understand you, what is it actually doing? What would it mean for a person to understand you?'},
 scorebot:{p:['resp','truth'],q:'What should a chatbot be scored on so that it serves the truth?'},
 agreeable:{p:['truth','conscience'],q:'When do you want a friend to agree with you, and when do you need them to tell you the truth?'},
 gamegoal:{p:['resp','effic'],q:'Name a goal in your own life where winning the score could miss the point.'},
 companion:{p:['companion','freedom','presence'],q:'What does a real friend give you that no app can?'},
 blackbox:{p:['transp','power'],q:'Who should be able to see inside a system that makes decisions about you?'},
 constitution:{p:['resp','conscience'],q:'If you wrote an AI’s rules, what would come first, and why?'},
 frontier:{p:['educ','person'],q:'Where is your own judgment most needed when you work with AI?'},
 coauthor:{p:['educ','resp'],q:'Your name is on the work. What does that make you responsible for?'},
 learnwith:{p:['educ','conscience'],q:'What do you want to be able to do yourself, even if AI could do it for you?'},
 detector:{p:['rash','transp'],q:'An AI detector flags your essay. What would a fair process look like?'},
 promptcost:{p:['energy','goods'],q:'When is an AI prompt worth the energy it uses?'},
 datacenter:{p:['energy','goods'],q:'Who should pay for a data center’s costs, and who should have a say in the decision?'},
 jobs:{p:['work','workPerson'],q:'What part of the work you hope to do should never be handed to a machine?'},
 mirror:{p:['bias','person','rash'],q:'Which habit in the mirror do you see in yourself? What would help you change it?'},
 compass:{p:['conscience','educ','presence'],q:'Who in your life helps you see true north?'},
 bugpatch:{p:['vigil','everyone'],q:'What is one door in your own digital life you could lock this week?'},
 doors:{p:['resp','vigil'],q:'Who was responsible for the supermarket fridges: the maker, the stores, or both?'},
 rollout:{p:['resp','vigil'],q:'How should a company weigh speed against safety when it sends out a fix?'},
 dwell:{p:['resp','transp'],q:'Should a company have to tell people when an intruder was inside? Why?'},
 machinespeed:{p:['weapons','resp'],q:'Should anyone release a tool that can be used to attack? What would you weigh?'},
 phantom:{p:['truth','rash'],q:'If the first Oldsmar story was wrong, who was hurt by it?'},
 cluster:{p:['truth','rash'],q:'What makes it hard to tell a real trend from a frightening week of news?'},
 defenders:{p:['everyone','work'],q:'Which of these jobs would let you serve others? What draws you to it?'}
};
const css=`.chur{margin-top:14px;background:var(--card);border:1px solid var(--line);border-left:5px solid #b08d2e;border-radius:12px;padding:12px 16px}
.chur h3{margin:0 0 6px;font-size:1.02rem}.chur p.chur-sub{margin:0 0 8px;color:var(--muted);font-size:.92rem}
.chur ul{margin:0 0 8px;padding-left:1.2em}.chur li{margin:0 0 6px;line-height:1.4}
.chur .chur-call{margin:8px 0 0;padding:8px 12px;background:var(--card2);border-radius:8px}.chur .chur-src{margin:8px 0 0;font-size:.9rem;color:var(--muted)}
.chur a{color:var(--rj-ink);font-weight:600}`;
function card(id){const c=C[id];if(!c)return null;const box=document.createElement('section');box.className='chur';box.setAttribute('aria-label','What the Church teaches');
 box.innerHTML=`<h3>What the Church teaches</h3><p class="chur-sub">Regis Jesuit is a Catholic school. Here is what the Church teaches on this question, offered to every student to think through.</p><ul>${c.p.map(k=>'<li>'+P[k]+'</li>').join('')}</ul><p class="chur-call"><b>Your call:</b> ${c.q}</p><p class="chur-src">MH = Pope Leo XIV, ${MH}, “On Safeguarding the Human Person in the Time of Artificial Intelligence” (2026). Numbers are paragraphs.</p>`;
 return box;}
function add(sec){if(!sec||!sec.classList||sec.querySelector('.chur'))return;const id=(sec.id||'').replace(/^sim-/,'');const sid=sec.dataset.id||id;
 const b=card(sid);if(!b)return;const anchor=sec.querySelector('.aiq')||sec.querySelector('.about.terms')||sec.querySelector('details.about');if(!anchor)return;
 anchor.parentNode.insertBefore(b,anchor.nextSibling&&anchor.classList.contains('aiq')?anchor.nextSibling:anchor);}
function scan(){document.querySelectorAll('#sims > section, #sims > .sim').forEach(add);}
function init(){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const root=document.getElementById('sims');if(!root)return;scan();new MutationObserver(scan).observe(root,{childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
