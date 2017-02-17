
var state = {
  questions: [
    {
      image: "xyz.png",
      options: ["Venetian Schnauzer", "Miniature Mastiff", "Waxbeard", "Goldendoodle"],
      correct: 3
    }, {
      image: "xyz.png",
      options: ["dachshund", "pitbull", "Husky", "Labrador"],
      correct: 2
    }, {
      image: "xyz.png",
      options: ["French Bulldog", "German Shephard", "Indian Turnberry", "Calico"],
      correct: 1
    }, {
      image: "xyz.png",
      options: ["Beagle", "Chihuahua", "Brown Thrasher", "Snickerdoodle"],
      correct:2
    }, {
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

//this is where my issue is currently. i can't get state.lastAnswer to return true no matter what i select.
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
      '<li>' + '<input type="radio" class="choice" name="choice" value="' + index + ' ">' + '<span>' + choice + '</span>' + '</li>'
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


//parseInt makes selection start returning a number
$("button[id='submit-answer']").on('click', function(event){
  event.preventDefault();
  var selection = $('input[type="radio"][name="choice"]:checked').val();
  selection = parseInt(selection, 10);
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
