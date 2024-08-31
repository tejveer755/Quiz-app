import React, { useEffect, useState } from 'react';
import QuizHome from './components/QuizHome';
import './styles/style.scss';
import { fetchQuestions, getCategories } from './api/service';
import Question from './components/Question';
import ScoreCard from './components/ScoreCard';

function App() {
  // State variables for managing quiz data and user input
  const [category, setCategory] = useState(() => sessionStorage.getItem("category") || "");
  const [numQuestions, setNumQuestions] = useState(() => sessionStorage.getItem("numQuestions") || 10);
  const [questions, setQuestions] = useState(() => JSON.parse(sessionStorage.getItem("questions")) || []);
  const [categories, setCategories] = useState([]);
  
  // Manage quiz state: started, current question, selected answer, etc.
  const [isStarted, setIsStarted] = useState(() => {
    const storedIsStarted = sessionStorage.getItem("isStarted");
    return storedIsStarted !== null ? storedIsStarted === 'true' : false;
  });
  
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const storedIsStarted = sessionStorage.getItem("isStarted");
    const storedCurrentQuestion = sessionStorage.getItem("currentQuestion");
    return storedIsStarted === 'true' && storedCurrentQuestion ? parseInt(storedCurrentQuestion, 10) : 0;
  });

  const [selectedAnswer, setSelectedAnswer] = useState(() => {
    const storedAnswer = sessionStorage.getItem("selectedAnswer");
    return storedAnswer || null;
  });

  const [isCorrect, setIsCorrect] = useState(() => {
    const storedIsCorrect = sessionStorage.getItem("isCorrect");
    return storedIsCorrect === 'true' ? true : storedIsCorrect === 'false' ? false : null;
  });

  const [questionStatus, setQuestionStatus] = useState(() => JSON.parse(sessionStorage.getItem("questionStatus")) || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Persist state in sessionStorage whenever relevant state changes
  useEffect(() => {
    if (!isStarted) {
      // Reset question-related states when quiz is not started
      setCurrentQuestion(0);
      sessionStorage.setItem("currentQuestion", 0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      sessionStorage.removeItem("selectedAnswer");
      sessionStorage.removeItem("isCorrect");
    }

    // Save states to sessionStorage
    sessionStorage.setItem("isStarted", isStarted);
    sessionStorage.setItem("category", category);
    sessionStorage.setItem("numQuestions", numQuestions);
    sessionStorage.setItem("questions", JSON.stringify(questions));
    sessionStorage.setItem("currentQuestion", currentQuestion);
    sessionStorage.setItem("questionStatus", JSON.stringify(questionStatus));
    sessionStorage.setItem("selectedAnswer", selectedAnswer || "");
    sessionStorage.setItem("isCorrect", isCorrect === null ? "" : isCorrect);
  }, [isStarted, category, numQuestions, questions, currentQuestion, questionStatus, selectedAnswer, isCorrect]);

  // Manage state for selectedAnswer and isCorrect when the game starts or question changes
  useEffect(() => {
    if (isStarted) {
      setSelectedAnswer(sessionStorage.getItem("selectedAnswer") || null);
      setIsCorrect(sessionStorage.getItem("isCorrect") === 'true' ? true : sessionStorage.getItem("isCorrect") === 'false' ? false : null);
    } else {
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [currentQuestion, isStarted]);

  // Function to start the quiz
  const startQuiz = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchQuestions(numQuestions, category)
      .then(fetchedQuestions => {
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          setIsStarted(true);
          setCurrentQuestion(0); // Reset to first question
        } else {
          setQuestions([]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      });
  };

  // Reset the entire quiz
  const resetGame = () => {
    setIsStarted(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setCurrentQuestion(0);
    setQuestionStatus([]);
    setQuestions([]);
    setIsFinished(false);

    // Clear sessionStorage data
    sessionStorage.clear();
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (currentQuestion < questions.length) {
      const isAnswerCorrect = answer === questions[currentQuestion].correct_answer;
      setSelectedAnswer(answer);
      setIsCorrect(isAnswerCorrect);

      // Update the status of the current question
      const updatedStatus = [
        ...questionStatus,
        { questionNumber: currentQuestion + 1, isCorrect: isAnswerCorrect }
      ];
      setQuestionStatus(updatedStatus);
    }
  };

  // Handle next question logic
  const handleNextQuestion = () => {
    setIsCorrect(null);
    setSelectedAnswer(null);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsStarted(false);  // Quiz is finished
    }
  };

  // Handle skipping a question
  const handleSkipQuestion = () => {
    const updatedStatus = [
      ...questionStatus,
      { questionNumber: currentQuestion + 1, isCorrect: false } // Mark skipped as incorrect
    ];
    setQuestionStatus(updatedStatus);
    handleNextQuestion();
  };

  // Finish the quiz and show score
  const finishQuiz = () => {
    setIsFinished(true);
  };

  // Calculate correct and incorrect answers
  const correctAnswers = questionStatus.filter(status => status.isCorrect).length;
  const incorrectAnswers = questionStatus.filter(status=> status.isCorrect === false).length+1;

  return (
    <>
      {/* Show QuizHome component if the quiz hasn't started */}
      {!isStarted && currentQuestion === 0 ? (
        <QuizHome
          startQuiz={startQuiz}
          category={category}
          setCategory={setCategory}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          categories={categories}
        />
      ) : isLoading ? (
        // Display loading spinner when fetching questions
        <div className="loader"></div>
      ) : !isFinished ? (
        // Render Question component when quiz is active
        <>
          <Question
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            currentQuestion={currentQuestion}
            questions={questions}
            resetGame={resetGame}
            selectedAnswer={selectedAnswer}
            handleAnswerSelect={handleAnswerSelect}
            isCorrect={isCorrect}
            handleNextQuestion={handleNextQuestion}
            handleSkipQuestion={handleSkipQuestion}
            finishQuiz={finishQuiz}
          />
        </>
      ) : (
        // Show ScoreCard after quiz completion
        <ScoreCard
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          onStartNewGame={resetGame}
        />
      )}
    </>
  );
}

export default App;
