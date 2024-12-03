import React from 'react';

const Question = ({
    selectedAnswer,
    handleAnswerSelect,
    isCorrect,
    handleNextQuestion,
    handleSkipQuestion,
    questions,
    currentQuestion,
    resetGame,
    finishQuiz,
}) => {

    const createMarkup = (html) => {
        return { __html: html };
    };

    return (
        <div className='question_wrapper'>
            <h3>{currentQuestion + 1}/{questions.length}</h3>
            <h2 dangerouslySetInnerHTML={createMarkup(questions[currentQuestion].question)} />
            <ul>
                {questions[currentQuestion].options.map((option, index) => (
                    <li key={index}>
                        <button
                            onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                            className={
                                selectedAnswer
                                    ? selectedAnswer === option
                                        ? isCorrect
                                            ? 'correct'
                                            : 'incorrect'
                                        : 'blockCursor'
                                    : ''
                            }
                            disabled={!!selectedAnswer} // Disable all buttons after an answer is selected
                            dangerouslySetInnerHTML={createMarkup(option)}
                        />
                    </li>
                ))}
            </ul>

            {

                (
                    selectedAnswer ? (
                        <div>
                            {isCorrect ? (
                                <p>Correct!</p>
                            ) : (
                                <p>Incorrect. The correct answer is {questions[currentQuestion].correct_answer}</p>
                            )}

                            {currentQuestion === questions.length - 1 ?
                                (
                                    <div className='btns'>
                                        <button onClick={finishQuiz}>Finish Quiz</button>
                                    </div>
                                ) : (

                                    <div className='btns'>
                                        <button onClick={handleNextQuestion}>Next Question</button>
                                        <button onClick={resetGame}>Quit game</button>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        currentQuestion === questions.length - 1 ?
                            (
                                <div className='btns'>
                                    <button onClick={finishQuiz}>Finish Quiz</button>
                                </div>
                            ) : (
                                <div className="btns">
                                    <button className='skipBtn' onClick={handleSkipQuestion}>Skip Question</button>
                                    <button className='resetBtn' onClick={resetGame}>Quit game</button>
                                </div>
                            )
                    )
                )
            }


        </div>
    );
};

export default Question;
