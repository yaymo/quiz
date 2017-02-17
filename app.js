
var state = {
  questions: [
    {
      /*text: "what type of puppy is this?",*/
      image: "xyz.png",
      options: ["Venetian Schnauzer", "Miniature Mastiff", "Waxbeard", "Goldendoodle"],
      correct: 3
    }, {
      /*text: "what type of puppy is this?",*/
      image: "xyz.png",
      options: ["dachshund", "pitbull", "Husky", "Labrador"],
      correct: 2
    }, {
      /*text: "what type of puppy is this?",*/
      image: "xyz.png",
      options: ["French Bulldog", "German Shephard", "Indian Turnberry", "Calico"],
      correct: 1
    }, {
      // text: "what type of puppy is this?",
      image: "xyz.png",
      options: ["Beagle", "Chihuahua", "Brown Thrasher", "Snickerdoodle"],
      correct:2
    }, {
      // text: "what type of puppy is this?",
      image: "xyz.png",
      options: ["Pommeranian", "Great Dane", "Grey hound", "Mouse"],
      correct: 3
    }],
  questionIndex: 0,
  currentScore: 0,
  step: 'welcome-page',
  lastAnswer: false,
  feedback: [
  {
    positive: "Congrats!",
    negative: "Too bad!"
  }]
};

//how to proceed with quiz
function nextStep(state, step){
  state.step = step;
};

//checking submission
//find current question, increase score and give feedback if selection = questions.correct
function checkQuestion(state, answer) {
  var currentQuestion = state.questions[state.questionIndex];
  state.lastAnswer = currentQuestion.options[currentQuestion.correct] === answer;
  if (state.lastAnswer){
    state.currentScore ++;
  }
  getFeedback(state);
  nextStep(state, 'feedback');

};

function getFeedback(state){
  if(state.lastAnswer){
    state.feedback.positive;
  }
  else{
    state.feedback.negative;
  }
};

//check to see if last question, if not go to next question
function nextQuestion (state){
  state.questionIndex ++;
  if (state.questionIndex === state.questions.length){
    nextStep(state, 'results');
  }
  else{
    nextStep(state, 'question');
  }
};

function getQuestion(state, elements){
  Object.keys(elements).forEach(function(step){
    elements[step].hide();
  });
  elements[state.step].show();

  if(state.step === 'step'){
    startPage(state, elements[state.step]);
  }
  else if(state.step === 'question'){
    renderQuestions(state, elements[state.step]);
  }
  else if(state.step === 'feedback'){
    renderFeedback(state, elements[state.step]);
  }
  else if(state.step === 'results'){
    renderResults(state, elements[state.step]);
  }
};


function renderQuestions(state, element){
  questionNum(state, $('.current-question'));
  renderScore(state, $('.current-score'));
  questionText(state, element.find('.question'));
  questionAnswers(state, element.find('.choice'));
  $('.choice').change(function(event){
    $('#submit-answer').prop('disabled', false);
});
};



function renderFeedback(state, element){
  renderFeedbackText(state, $('.feedback'));
  questionNum(state, $('.current-question'));
  renderScore(state, $('.current-score'));
  renderNextButton(state, $('.next'));
};


function renderResults(state, element){
  renderScore(state, $('.results'));
}

function renderScore(state, element){
  var score = state.currentScore;
  element.text(score);
};

function questionNum(state, element){
  var text = (state.questionIndex + 1);
  element.text(text);
};

function questionText(state, element){
  var currentQuestion = state.questions[state.questionIndex];
  element.text(currentQuestion.text);
};

function renderNextButton(state, element){
  var text = state.questionIndex < state.questions.length-1 ? "Next":"Results";
  element.text(text);
}

function questionAnswers(state, element){
  var currentQuestion = state.questions[state.questionIndex];
  $('.picture').html('<img src="' + currentQuestion.image + '">')
  var choices = currentQuestion.options.map(function(choice, index){
    return (
      '<li>' + '<input type="checkbox" class="choice" name="choice" value="' + index + ' ">' + '<span>' + choice + '</span>' + '</li>'
      );
  });
  $('.question-answers').html(choices);
  element.parent().html(choices);
};



function renderFeedbackText(state, element){
  var message = state.lastAnswer ? state.feedback.positive : state.feedback.negative;
  element.text(message)
};


var elementFinders = {
  'welcome-page':$('.welcome-page'),
  'question': $('.test-questions'),
  'feedback': $('.feedback-page'),
  'results': $('.results-page')
};

$("button[name='start'").on('click', function(event){
  event.preventDefault();
  nextStep(state, 'question');
  getQuestion(state, elementFinders);
  $('#submit-answer').prop('disabled', true)
});



$("button[id='submit-answer']").on('click', function(event){
  event.preventDefault();
  var selection = $('input[name="choice"]:checked').val();
  checkQuestion(state, selection);
  getQuestion(state, elementFinders);
});

$('.next').click(function(event){
  nextQuestion(state);
  getQuestion(state, elementFinders);
});

$(function(){
  getQuestion(state, elementFinders);
});
