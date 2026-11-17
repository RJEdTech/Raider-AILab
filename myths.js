/* Myth or fact (idea from Dr. Sandy Robertson's ENSO Explorer, Nov 17, 2026). See ENGINE.md.
   BioLab.addMyths({toolId:[{k,s,fact,why,lvl}]}): one graded try, then why. Mix in real facts. */
BioLab.addMyths({
nextword:[
 {k:'lookup',s:'A chatbot answers by looking up the answer in a database of facts.',fact:false,why:'A language model writes one piece of text at a time, picking a likely next word from patterns it learned. Unless it uses a search tool, nothing is being looked up.'},
 {k:'confident',s:'A chatbot can state something false in a confident, fluent sentence.',fact:true,why:'Sounding right and being right are different. The model is built to produce likely text, so check facts that matter against a real source.'},
 {k:'same',s:'Asking the same question twice always gets the exact same answer.',fact:false,why:'Most chatbots pick among likely next words with some randomness, so wording and even content can change between tries.'}
]
});
