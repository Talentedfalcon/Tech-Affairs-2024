import React, { useState, useEffect } from 'react';
import quizdata from './quizData.json';
import QuestionCard from './QuestionCard';
import { Link } from 'react-router-dom';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

const QuizPage = () => {
  const [questionArray, setQuestionArray] = useState([]);
  const [qno, setQno] = useState(0);
  const [selections, setSelections] = useState([]);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    const shuffledQuestions = shuffleArray([...quizdata.questions]);
    setQuestionArray(shuffledQuestions);
    setSelections(Array(shuffledQuestions.length).fill(''));
  }, []);

  const handleNext = () => {
    if (qno < questionArray.length - 1) {
      setQno((prevqno) => prevqno + 1);
    } else {
      console.log("End of quiz reached!");
    }
  };

  const handleSelectionChange = (index, selection) => {
    const newSelections = [...selections];
    newSelections[index] = selection;
    setSelections(newSelections);
  };

  const endQuiz = () => {
    const correctAnswers = calculateCorrectAnswers();
    console.log("Number of correct answers", correctAnswers)
    setCorrect(correctAnswers);

    localStorage.clear();
    localStorage.setItem('quizCorrectAnswers', correctAnswers.toString());

    console.log("End quiz button clicked. Selections:", selections);
    console.log(correctAnswers);
  };

  const calculateCorrectAnswers = () => {
    let correctCount = 0;
    questionArray.forEach((question, index) => {
      if (question.answer === selections[index]) {
        correctCount++;
      }
    });
    return correctCount;
  };

  if (questionArray.length === 0) {
    return <div>Loading...</div>; // Display a loading message while questions are being shuffled
  }

  return (
    <main className='flex flex-col gap-10 items-center justify-center p-4'>
      <div className='flex flex-col items-center gap-2 mt-10'>
        <div className='p-4 flex flex-col justify-center items-center'>
          <QuestionCard
            key={qno}
            data={questionArray[qno]}
            selection={selections[qno]}
            onSelectionChange={(selection) => handleSelectionChange(qno, selection)}
          />
        </div>
        {/* <div className='w-[200px] sm:min-w-[350px] lg:min-w-[500px]'>
          <img src={`https://picsum.photos/seed/img${qno}/500/400`} alt="Image" className='w-full h-auto rounded-lg' />
        </div> */}
      </div>
      <div className='flex justify-center items-center mt-4'>
        {qno === questionArray.length - 1 ? (
          <Link
            to={"/result"}
            className='button-color hover:bg-orange-400 text-white p-2 rounded-full'
          >
            <button onClick={endQuiz}>End Quiz</button>
          </Link>
        ) : (
          <button
            onClick={handleNext}
            className='w-12 h-12 flex items-center justify-center button-color p-3 rounded-full ml-4'
          >
            <svg
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
    </main>
  );
};

export default QuizPage;
