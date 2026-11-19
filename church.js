/* Raider AILab: "What the Church teaches" card (Nov 19, 2026), added to each tool page like the "Questions to ask any AI" card.
   Sources: Pope Leo XIV, Magnifica humanitas (2026), cited as MH with paragraph numbers; Antiqua et Nova (2025); Laudato si' (2015);
   Rerum novarum (1891); Laborem exercens (1981); Catechism of the Catholic Church (CCC). Every point is a paraphrase in our own words.
   Teach, don't preach: Church teaching is stated as the Church's teaching; prudential applications are left as "Your call" questions. */
(function(){
'use strict';
const MH='<a href="https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html" target="_blank" rel="noopener"><i>Magnifica humanitas</i></a>';
const P={
 aiNot:'AI imitates some functions of human intelligence. It has no body, no experiences and no relationships, and its “learning” is statistical adaptation to data, not the inner growth of a person. (MH 99)',
 person:'Human intelligence belongs to a whole person: a body, a heart, relationships and limits. A person is never just data. (MH 99, 118–126; <i>Antiqua et Nova</i>, 2025)',
 truth:'Truth is a common good that everyone shares. Tools that shape what people see and believe should serve the truth, not bend it. (MH 132–138)',
 resp:'AI is never morally neutral: every system carries choices about what it measures and how it sorts people. The people who design and use it are responsible for those choices, and someone must answer for decisions that affect people’s lives. (MH 102–105, 111)',
 transp:'When a system’s inner workings are hidden, it is harder to assign responsibility and correct errors. Systems that decide about people should be transparent and open to appeal. (MH 104–105, 111)',
 power:'The earth’s goods are meant for the whole human family. When control of data and computing power sits with a few, that power tends to become hidden and escape public oversight. (MH 65–66, 95)',
 effic:'Efficiency is not the same as the good. A culture that measures everything by what can be optimized can lose sight of the person. (MH 92, 172)',
 conscience:'No computer system, however advanced, can create a heart that gives itself or a conscience that tells good from evil. (MH 99, 233)',
 companion:'Simulated care can be helpful, but it can also mislead, and where real relationships are missing it can slowly weaken the desire to form them. (MH 100)',
 freedom:'Freedom has to be protected from the addictions of the “attention economy” and from the power to profile and steer people through their data. (MH 170–172)',
 presence:'Digital life favors speed and fragments our attention. The Church asks us to cherish times when physical presence matters most: shared meals, time with the lonely, serving the poor. (MH 239)',
 educ:'Education for the digital age should teach when and why to use AI, along with critical thinking, and adults are called to help young people choose what builds inner freedom. (MH 139–147, 238)',
 vigil:'AI can be a valuable tool that calls for vigilance: fast, easy answers can weaken our own judgment, and results that look objective still reflect the people who built the system. (MH 100)',
 energy:'AI systems need enormous amounts of energy and water, and the Church asks for more sustainable technology that protects our common home. (MH 101; <i>Laudato si’</i>, 2015)',
 goods:'The earth’s goods, including its soil, water and air, are given to the whole human family. Costs and benefits should be judged by the common good, especially the good of the poor. (MH 65–66)',
 work:'Work is not just a tool for earning money: it expresses and builds up human dignity. Automation must be judged by what it does to workers and their families. (MH 148–164)',
 workPerson:'Since Leo XIII’s <i>Rerum novarum</i> (1891), the Church has defended workers, and John Paul II called work “the essential key” to the social question (<i>Laborem exercens</i>, 1981). (MH 148–149)',
 bias:'AI results can look objective while reflecting the assumptions of the people who designed and trained them. A system that treats some lives as less worthy goes against human dignity. (MH 100, 104)',
 rash:'Assuming the worst about someone without enough evidence is the sin of rash judgment; charity looks for the most favorable honest reading. (CCC 2477–2478)',
 weapons:'Lethal or other irreversible decisions must never be handed to artificial systems. Moral judgment involves conscience and responsibility, so the chain of responsibility must always be clear. (MH 198–199)',
 everyone:'No one is without responsibility. Leaders, researchers, teachers and students all have their own place to act, and no one is too small to make a difference. (MH 13, 212)'
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
 box.innerHTML=`<h3>What the Church teaches</h3><p class="chur-sub">Regis Jesuit is a Catholic school. Here is what the Church teaches on this question, offered to every student to think through.</p><ul>${c.p.map(k=>'<li>'+P[k]+'</li>').join('')}</ul><p class="chur-call"><b>Your call:</b> ${c.q}</p><p class="chur-src">MH = Pope Leo XIV, ${MH}, “On Safeguarding the Human Person in the Time of Artificial Intelligence” (2026). Numbers are paragraphs, checked against the Vatican text on Nov 19, 2026.</p>`;
 return box;}
function add(sec){if(!sec||!sec.classList||sec.querySelector('.chur'))return;const id=(sec.id||'').replace(/^sim-/,'');const sid=sec.dataset.id||id;
 const b=card(sid);if(!b)return;const anchor=sec.querySelector('.aiq')||sec.querySelector('.about.terms')||sec.querySelector('details.about');if(!anchor)return;
 anchor.parentNode.insertBefore(b,anchor.nextSibling&&anchor.classList.contains('aiq')?anchor.nextSibling:anchor);}
function scan(){document.querySelectorAll('#sims > section, #sims > .sim').forEach(add);}
function init(){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const root=document.getElementById('sims');if(!root)return;scan();new MutationObserver(scan).observe(root,{childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
