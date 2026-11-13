BioLab.addPractical({
scorebot:{
 hook:'Your study group wants a homework-help bot. Before it is trained, you get to write its report card: points for a right answer, a wrong answer and “I don’t know.” A wrong answer your group trusts costs about as much as two right answers help, because you study the wrong fact and then have to unlearn it, and so does anyone who studies from your notes. What grading rule gets you the most useful bot?',
 answer:'Make a wrong answer cost what it really costs you. With right +1, wrong −2 and “I don’t know” 0, the bot answers only when it is more than 67% sure: about 41.7 right, 8.3 wrong and 50 “I don’t know” on average, for net help of +25.1. With no penalty it guesses on all 100: 63 right but 37 wrong, for net help of −11.',
 uses:[
  '<b>Do:</b> when a chatbot states a fact with confidence, check it if it matters, and ask “How sure are you?” <b>Why:</b> OpenAI’s 2025 research on hallucinations argues that common training and testing reward a lucky guess over “I don’t know,” which is one reason chatbots state false facts with confidence.',
  '<b>Do:</b> when you see an AI leaderboard, look for the wrong-answer rate, not just accuracy. <b>Why:</b> in OpenAI’s example, a model that almost always answered got 24% right and 75% wrong, while one that often abstained got 22% right and 26% wrong. Ranked by accuracy alone, the guesser wins.',
  '<b>Do:</b> on the SAT, answer every multiple-choice question, guessing if you must. <b>Why:</b> the SAT once took off a quarter point for each wrong answer, so blind guessing gained nothing on average. The redesigned SAT dropped that penalty in 2016, so a blank can only cost you.'
 ],
 takeaway:'Expected value decides what a point-chasing bot does: answering is worth p × R + (1 − p) × W. With no penalty that is never below 0, so it answers all 100 and gets 37 wrong. With a penalty equal to the real cost (−2), it answers only above 2 ÷ 3 sure: 8.3 wrong and net help +25.1.'
}
});
