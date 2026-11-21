/* Test yourself questions for Next Word. Steps are 1-based story steps. */
TestYourself.mount({lab:'AILab',id:'nextword',title:'Raider AILab · Next Word: why the bot said 3:30',el:'#ty',scrollTo:'#cv',go:i=>window.NW.go(i),
 questions:[
 {q:'A phone’s autocomplete has seen “see you at” followed by “school” 8 times and by “home” 2 times. What will it most likely suggest after “see you at”?',choices:['school','home','whichever word you typed last','both, equally often'],answer:0,
  hint:'Count what came after the words. Which pile is bigger?',step:2,stepName:'count',
  why:'It suggests the word that came next most often: “school”, 8 times out of 10. It does not know where you are actually going.'},
 {q:'In a group chat, “pizza” follows “let’s get” 12 times out of 30. What share of the next-word wheel is “pizza”, as a percent?',answer:40,tol:.5,unit:'%',
  hint:v=>Math.abs(v-12)<.5?'12 is the count. The share is the count out of all 30.':'Share = count ÷ total = 12 ÷ 30. Then turn it into a percent.',step:3,stepName:'share',
  why:'12 ÷ 30 = 0.4, so “pizza” gets 40% of the wheel.'},
 {q:'A chatbot writes a wrong date in a history essay, and it sounds completely sure. How can that happen?',choices:['It picks likely-sounding words, and nothing checks facts','It copied the date from a website that was wrong','It is lying on purpose to make the essay sound better','It ran out of memory and filled in a random number'],answer:0,
  hint:'When the bot writes, what does it do for each word? Does any part of that check whether the sentence is true?',step:5,stepName:'write',
  why:'Each word is a bet on what usually comes next. A sentence can sound right without being true.'},
 {q:'You turn a chatbot’s temperature all the way down to cold. What changes?',choices:['It picks the most likely word almost every time','It gets more facts right','It becomes more creative','It reads the newest messages first'],answer:0,
  hint:'Cold makes the biggest slice of the wheel even bigger. What does that do to the spin?',step:6,stepName:'dial',
  why:'Cold almost always picks the top word. That makes it predictable, not more correct.'},
 {q:'In 10 spins of a wheel where 3:30 has 60%, the answer “6” came up more often than 3:30. What should you conclude?',choices:['Ten spins is too few: spin many more to see the shares','The wheel is broken: 3:30 should win every time','“6” is really the most likely answer after all','Chance always favors the smaller slices in short runs'],answer:0,
  hint:'What happened to the counts when you spun 100 more times?',step:4,stepName:'spin',
  why:'Small samples bounce around. Over many spins the counts settle near 60 / 30 / 10.'}]});
