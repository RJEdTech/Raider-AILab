BioLab.addPractical({
nextword:{
 hook:'Your phone suggests the next word as you type, and a chatbot writes whole answers one word at a time. How does a machine pick the next word? This tiny model has read one short recipe, and it just wrote “the”. Which word will it most likely write next?',
 answer:'It counts. In the recipe, “the” is followed by “eggs” 6 times out of 12, “pan” 3 times, and “butter”, “bowl” and “heat” once each. So the model gives “eggs” a 50% chance and “pan” 25%, then rolls weighted dice. Temperature sets how adventurous those dice are. A real chatbot makes the same kind of bet with a neural network trained on trillions of tokens.',
 uses:[
  '<b>Do:</b> watch the three suggested words above your phone keyboard as you type a message. <b>Why:</b> they are next-word predictions, ranked by how likely each one is to follow what you have typed: the same idea as this tool.',
  '<b>Do:</b> if a chatbot’s answer starts off wrong, stop it and rephrase instead of waiting for it to fix itself. <b>Why:</b> replies appear a few words at a time because the model writes one token at a time, each one predicted from your prompt plus everything it has written so far, so an early wrong turn shapes the rest.',
  '<b>Do:</b> ask the same question twice when you want options, and once with “be consistent” when you want a steady answer. <b>Why:</b> temperature is a real setting: tools for building apps on language models let developers set it, lower for steady, repeatable answers and higher for brainstorming. It is one reason the same question can get a different answer each time.'
 ],
 takeaway:'A language model predicts the next token from counts like count(the, eggs) ÷ count(the) = 6 ÷ 12 = 50%, learned from its training text, then repeats. Nothing in that division checks whether a sentence is true, so likely text and true text are different things.'
}
});
