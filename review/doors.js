BioLab.addReview({
doors:{
 questions:[
  {id:'pin4',kind:'test',lvl:'bio',
   q:'A bike lock has 4 dials, each with the digits 0 to 9. How many combinations are there?',
   num:{ans:10000,tol:0,unit:'combinations'},
   steps:['Each dial has 10 choices.','10 × 10 × 10 × 10 = 10,000.','Trying one a second, that is under 3 hours.']},
  {id:'pin6t',kind:'test',lvl:'bio',
   q:'At 1,000 guesses a second, how many seconds to try every 6-digit PIN (1,000,000)?',
   num:{ans:1000,tol:0,unit:'seconds'},
   steps:['1,000,000 ÷ 1,000 = 1,000 seconds.','That is about 16.7 minutes.'],
   lab:{set:{pw:'pin6',rate:1000},look:'Read <b>Time to try them all</b>.'},verify:[['mins',16.667,0.01]]},
  {id:'home',kind:'real',lvl:'bio',
   q:'You get a new smart camera for your room. Which first step protects you most?',
   choices:['Leave the password it came with so you do not forget it','Change the default password to a long one and turn on updates','Put it on a high shelf'],correct:1,
   steps:['Default passwords are published online, so anyone can look them up.','A long password makes guessing take far longer.','Updates close holes the maker finds later.']},
  {id:'w8',kind:'test',lvl:'honors',
   q:'At 1,000 guesses a second, about how many years does it take to try all 26⁸ eight-letter lowercase passwords? (26⁸ ≈ 208.8 billion; a year has about 31.5 million seconds.)',
   num:{ans:6.6,tol:0.15,unit:'years'},
   steps:['208.8 billion ÷ 1,000 = 208.8 million seconds.','208.8 million ÷ 31.5 million ≈ 6.6 years.'],
   lab:{set:{pw:'word8',rate:1000},look:'Read <b>In plain words</b>.'}},
  {id:'len',kind:'test',lvl:'ap',
   q:'Lowercase passwords, 10,000 guesses a second. What is the shortest length L for which trying all 26ᴸ takes more than 100 years (3.15 × 10⁹ seconds)?',
   num:{ans:10,tol:0,unit:'characters'},
   steps:['Need 26ᴸ > 100 × 3.15 × 10⁷ × 10⁴ = 3.15 × 10¹³.','L > log(3.15 × 10¹³) ÷ log(26) = 13.5 ÷ 1.415 ≈ 9.54.','Check: 26⁹ ≈ 5.4 × 10¹² is too small and 26¹⁰ ≈ 1.4 × 10¹⁴ is enough, so L = 10.']}
 ]
}
});
