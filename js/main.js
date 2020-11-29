const quizData = [
  {
    id: "q1",
    question: "What is a group of turkeys called?",
    possibleAnswers: [
      { id: "a", value: "A clutch" },
      { id: "b", value: "A rafter" },
      { id: "c", value: "A brood" },
      { id: "d", value: "A peep" },
    ],
    currentAnswerId: "",
    correctAnswerIds: ["b"],
  },
  {
    id: "q2",
    question: "What year was the first color photograph taken?",
    possibleAnswers: [
      { id: "e", value: "1861" },
      { id: "f", value: "1885" },
      { id: "g", value: "1894" },
      { id: "h", value: "1899" },
    ],
    currentAnswerId: "",
    correctAnswerIds: ["e"],
  },
  {
    id: "q3",
    question:
      "What was the original title of Jane Austen’s classic novel Pride & Prejudice?",
    possibleAnswers: [
      { id: "i", value: "Longbourn" },
      { id: "j", value: "Eligible" },
      { id: "k", value: "First Impressions" },
      { id: "l", value: "Vanity & Pride" },
    ],
    currentAnswerId: "",
    correctAnswerIds: ["k"],
  },
  {
    id: "q4",
    question: "What is the most expensive book ever sold?",
    possibleAnswers: [
      { id: "m", value: "Birds of America" },
      { id: "n", value: "Codex Leicester" },
      { id: "o", value: "First Folio" },
      { id: "p", value: "The Gospels of Henry the Lion" },
    ],
    currentAnswerId: "",
    correctAnswerIds: ["n"],
  },
  {
    id: "q5",
    question: "What was Google’s original name?",
    possibleAnswers: [
      { id: "q", value: "Googol" },
      { id: "r", value: "Oneshot" },
      { id: "s", value: "Typist" },
      { id: "t", value: "Backrub" },
    ],
    currentAnswerId: "",
    correctAnswerIds: ["t"],
  },
  {
    id: "q6",
    question: "What was the first car that was mass-produced?",
    possibleAnswers: [
      { id: "u", value: "Ford Quadricycle Runabout" },
      { id: "v", value: "Ford Model-A" },
      { id: "w", value: "Ford Model-T" },
      { id: "x", value: "Ford Model-B" },
    ],
    currentAnswerId: "",
    correctAnswerIds: ["w"],
  },
];

const incorrectChoiceMessages = [
  "Not quite! Try another guess.",
  "Danger, Will Robinson! Try another choice",
  "Doh! Not the correct choice.",
];

const correctChoiceMessages = ["Good job!", "Correct!", "Oh yeah!"];

let currentIndex = 0;
let gameOver = false;

const selectors = {
  title: ".quiz-question__title",
  possibleAnswers: ".quiz-answer",
  answerCheckbox: ".answer-checkbox",
  answerText: ".quiz-answer-text",
};

const nextSelector = ".quiz-container.next";
const previousSelector = ".quiz-container.previous";
const currentSelector = ".quiz-container.current";

document.addEventListener("DOMContentLoaded", (e) => {
  const nextArrow = document.getElementById("quiz-arrow--next");
  const previousArrow = document.getElementById("quiz-arrow--previous");
  const submitButton = document.getElementById("quiz-button");
  const alertText = document.getElementById("alert-text");
  const current = document.querySelector(currentSelector);
  populateQuiz(current, selectors, quizData[currentIndex]);

  const answers = document.getElementsByClassName("answer-checkbox");
  for (let answer of answers) {
    answer.addEventListener("click", (e) => {
      const checkbox = e.target;

      hideAlert();

      quizData[currentIndex].currentAnswerId = checkbox.dataset.answerId;

      if (isLastQuestion()) {
        if (submitButton) {
          submitButton.innerText = "See Results";
        }
      }
    });
  }

  const form = document.getElementById("quiz-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedAnswerId = document.querySelector(
        ".quiz-container.current .answer-checkbox:checked"
      );
      if (!selectedAnswerId && !gameOver) {
        showErrorAlert("Please select an answer first!");
        return;
      }

      addClass(quizzesContainer, "disabled");
      if (!isLastQuestion()) {
        currentIndex++;
        const next = document.querySelector(nextSelector);
        const data = quizData[currentIndex];
        populateQuiz(next, selectors, data);
        getNextQuiz(currentSelector, previousSelector, nextSelector);
        setTimeout(() => {
          removeClass(quizzesContainer, "disabled");
        }, 200);
      } else if (gameOver) {
        console.log("here");
        location.reload();
      } else {
        gameOver = true;
        const numberOfQuizzes = quizData.length;
        const numberCorrect = quizData.filter((quiz) =>
          quiz.correctAnswerIds.includes(quiz.currentAnswerId)
        ).length;
        const resultsData = {
          id: "q3",
          question: "Results",
          possibleAnswers: [
            {
              value: `You got ${numberCorrect} of ${numberOfQuizzes} correct!`,
            },
          ],
        };
        submitButton.innerText = "Play Again";
        const next = document.querySelector(nextSelector);
        uncheckAllAnswersForQuestion(next);
        populateQuiz(next, selectors, resultsData);
        getNextQuiz(currentSelector, previousSelector, nextSelector);
      }
    });
  }
});

function uncheckAllAnswersForQuestion(question) {
  if (question) {
    question
      .querySelectorAll(".answer-checkbox:checked")
      .forEach((checkbox) => (checkbox.checked = false));
  }
}

function isLastQuestion() {
  return currentIndex >= quizData.length - 1;
}

function showErrorAlert(message) {
  removeClass(alertText, "correct");
  addClass(alertText, "incorrect");
  addClass(alertText, "show");
  alertText.innerText = message;
}

function showSuccessAlert(message) {
  removeClass(alertText, "incorrect");
  addClass(alertText, "correct");
  addClass(alertText, "show");
  alertText.innerText = message;
}

function hideAlert() {
  removeClass(alertText, "show");
}

function selectRandomFrom(arr) {
  if (!arr || !arr.length) return;
  return arr[Math.floor(Math.random(arr.length))];
}

const quizzesContainer = document.getElementsByClassName(
  "quizzes-container"
)[0];

const quizzes = document.getElementsByClassName("quiz-container");

function populateQuiz(quiz, selectors, data) {
  // selectors
  //  title
  //  question
  //  possibleAnswers
  //  answerCheckbox
  //  answerText
  if (!quiz || !selectors || !data) {
    return;
  }
  const titleEl = quiz.querySelector(selectors.title);
  if (titleEl) {
    titleEl.innerText = data.question;
  }
  const possibleAnswersEls = quiz.querySelectorAll(selectors.possibleAnswers);

  if (possibleAnswersEls) {
    possibleAnswersEls.forEach((answerEl, i) => {
      const answerCheckbox = answerEl.querySelector(selectors.answerCheckbox);
      answerCheckbox.name = "answer" + currentIndex;

      const answerId = data.possibleAnswers[i]
        ? data.possibleAnswers[i].id
        : "";
      if (answerId) {
        answerCheckbox.dataset.answerId = answerId;
      }
    });
    possibleAnswersEls.forEach((answerEl, i) => {
      const answerCheckbox = answerEl.querySelector(selectors.answerCheckbox);
      const answerId = data.possibleAnswers[i]
        ? data.possibleAnswers[i].id
        : "";
      const currentAnswerId = quizData[currentIndex].currentAnswerId;
      if (answerId) {
        answerCheckbox.checked = answerId === currentAnswerId;
      }
      const answerText = answerEl.querySelector(selectors.answerText);
      if (answerText) {
        answerText.innerText = data.possibleAnswers[i]
          ? data.possibleAnswers[i].value
          : "";
      }
    });
  }
}

function populateResults(data) {}

function getPreviousIndex(index, length) {
  if (index === 0) {
    return length - 1;
  }
  return index - 1;
}

function getNextIndex(index, length) {
  if (index === length - 1) {
    return 0;
  }
  return index + 1;
}

function getCorrectAnswerIds(question) {
  return question.correctAnswerIds || [];
}

function getAnswerId(answer) {
  return answer.id;
}

function isAnswerIdCorrect(answerId, question) {
  return question.correctAnswerIds.contains(answerId);
}

function getPreviousQuiz(current, previous, next) {
  removeClass(current, "snap");
  addClass(current, "next");
  removeClass(current, "current");
  removeClass(current, "previous");

  removeClass(previous, "fade-out");
  removeClass(previous, "snap");
  addClass(previous, "current");
  removeClass(previous, "previous");
  removeClass(previous, "next");

  removeClass(next, "fade-out");
  addClass(next, "snap");
  addClass(next, "previous");
  removeClass(next, "next");
  removeClass(next, "current");
}

function getNextQuiz(currentSelector, previousSelector, nextSelector) {
  const current = document.querySelector(currentSelector);
  const previous = document.querySelector(previousSelector);
  const next = document.querySelector(nextSelector);
  removeClass(current, "snap");
  addClass(current, "previous");
  removeClass(current, "current");
  removeClass(current, "next");

  removeClass(previous, "fade-out");
  addClass(previous, "snap");
  addClass(previous, "next");
  removeClass(previous, "previous");
  removeClass(previous, "current");

  removeClass(next, "fade-out");
  removeClass(next, "snap");
  addClass(next, "current");
  removeClass(next, "next");
  removeClass(next, "previous");
}

function addClass(el, className) {
  if (
    !el ||
    !className ||
    typeof className !== "string" ||
    !el.classList ||
    !el.classList.contains ||
    el.classList.contains(className)
  ) {
    return;
  }
  el.classList.add(className);
}

function removeClass(el, className) {
  if (
    !el ||
    !className ||
    typeof className !== "string" ||
    !el.classList ||
    !el.classList.contains ||
    !el.classList.contains(className)
  ) {
    return;
  }
  el.classList.remove(className);
}
