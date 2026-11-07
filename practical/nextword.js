BioLab.addPractical({
nextword:{
 hook:'Your phone suggests the next word as you type, and a chatbot writes whole answers one word at a time. How does a machine pick the next word? This tiny model has read one short recipe, and it just wrote “the”. Which word will it most likely write next?',
 answer:'It counts. In the recipe, “the” is followed by “eggs” 6 times out of 12, “pan” 3 times, and “butter”, “bowl” and “heat” once each. So the model gives “eggs” a 50% chance and “pan” 25%, then rolls weighted dice. Temperature sets how adventurous those dice are. A real chatbot makes the same kind of bet with a neural network trained on trillions of tokens.',
 uses:[
  'Your phone keyboard: the suggested words above the keys are next-word predictions, ranked by how likely each one is to follow what you have typed.',
  'Chatbot replies: they often appear a few words at a time because the model really does write one token at a time, each one predicted from your prompt plus everything it has written so far.',
  'Temperature is a real setting: tools for building apps on language models let developers set it, lower for steady, repeatable answers and higher for brainstorming. It is one reason the same question can get a different answer each time.'
 ],
 takeaway:'A language model predicts the next token from counts like count(the, eggs) ÷ count(the) = 6 ÷ 12 = 50%, learned from its training text, then repeats. Nothing in that division checks whether a sentence is true, so likely text and true text are different things.'
}
});
