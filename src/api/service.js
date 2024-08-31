import axios from 'axios';

// Fetch questions from the Open Trivia Database API
export const fetchQuestions = async ( category,) => {
  try {
    const url = `https://opentdb.com/api.php?amount=15&category=${category}&type=multiple`;
    const response = await axios.get(url);
    const formattedQuestions = formatQuestions(response.data.results);
    return formattedQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};

export const getCategories = async () => {
    try {
      const response = await fetch('https://opentdb.com/api_category.php');
      const data = await response.json();
      const categories = data.trivia_categories
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error; // Re-throw the error to be handled in the component
    }
  };


// Format questions by ensuring options are shuffled
const formatQuestions = (questions) => {
  return questions.map(question => ({
    ...question,
    options: shuffleOptions([
      ...question.incorrect_answers,
      question.correct_answer
    ])
  }));
};

// Shuffle array elements
const shuffleOptions = (options) => {
  return options.sort(() => Math.random() - 0.5);
};
