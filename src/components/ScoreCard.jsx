import React from "react";

const ScoreCard = ({ correctAnswers, incorrectAnswers, onStartNewGame }) => {
    return (
        <div className="score_card">
            <h1>🎉 Congratulations on Finishing the Quiz! 🎉</h1>
            <div className="score">
                <p>✔️ Correct Answers: {correctAnswers}</p>
                <p>❌ Incorrect Answers: {incorrectAnswers}</p>
            </div>
            {incorrectAnswers > correctAnswers && (
                <p>Looks like you had more wrong answers than correct ones. Don't worry—give it another shot!</p>
            )}
            <button onClick={onStartNewGame}>🔄 Start a New Quiz</button>
        </div>
    );
};

export default ScoreCard;

