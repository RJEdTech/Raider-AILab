/* Raider AILab: topic sections. No single RJ course owns AI, so tools are grouped by idea. */
BioLab.COURSES = [];
BioLab.TOPIC_ORDER = {1:['nextword'],2:['scorebot','agreeable','gamegoal','companion','constitution'],3:['frontier','learnwith','detector'],4:['promptcost']};
BioLab.setSections({units:{},extra:{1:'How a language model works',2:'Goals shape behavior',3:'Working with AI',4:'What AI costs',11:'Go further'},order:[1,2,3,4,11],further:11,unitPrefix:''});
(function(){const P={};Object.keys(BioLab.TOPIC_ORDER).forEach(k=>BioLab.TOPIC_ORDER[k].forEach(id=>P[id]=+k));
 BioLab.defs.forEach(d=>{if(P[d.id]!==undefined)d.apUnit=P[d.id];});
 const keep=new Set(BioLab.defs.map(d=>d.id));BioLab.defs.forEach(d=>{['prereq','next'].forEach(k=>{if(d[k])d[k]=d[k].filter(i=>keep.has(i));});});})();
