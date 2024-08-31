import React from "react"
import QuizIntro from "./QuizIntro";

const QuizHome = ({
  startQuiz,
  category,
  setCategory,
  categories,
}) => {
  return (
    <div className="quiz_home">
      
      <QuizIntro />


      <div className="quiz_setup">

        <form onSubmit={startQuiz}>
          <div>
            <label>
              Select Category:
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>
            
          </div>
          <button type="submit">Start Quiz</button>
        </form>


      </div>


    </div>
  )
};

export default QuizHome;
