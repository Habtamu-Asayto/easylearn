import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header.jsx";
import courseService from "../../../../services/course.service.js";
import { useParams } from "react-router";
import { useAuth } from "../../../../Contexts/AuthContext.jsx";
function QuizContent() {
  const [quizzes, setQuizzes] = useState([]);
  const [options, setOptions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const { courseId, chapterId, quizId } = useParams();
  const { user } = useAuth();
  const token = user?.user_token || null;

  console.log(courseId, quizId);

  useEffect(() => {
    if (quizzes.length > 0 && current >= quizzes.length) {
      setCurrent(0); // Reset to first quiz if current is out of bounds
    }
  }, [quizzes, current]);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await courseService.getQuizesByChapter2(chapterId, token);
        setQuizzes(data || []);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      }
    };
    loadQuizzes();
  }, [chapterId, token]);

  useEffect(() => {
    const loadOptions = async () => {
      if (!quizzes[current]) return;

      try {
        const quizId = quizzes[current].quiz_id; 
        const data = await courseService.getQuizOptions(quizId, token); 
        setOptions(data || []);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    loadOptions();
  }, [current, quizzes, token]);

const handleNext = async () => {
  const currentQuiz = quizzes[current];
  const selectedOption = options.find((opt) => opt.option_text === selected);

  // Calculate score based on quiz.points
  if (selectedOption?.is_correct) {
    setScore((prev) => prev + (currentQuiz.points || 1));
  }

  // Save user answer to backend
  try {
    await courseService.saveQuizAnswers({
      quiz_id: currentQuiz.quiz_id,
      user_id: user.user_id,
      selected_option_id: selectedOption?.option_id || null,
      is_correct: selectedOption?.is_correct || false,
      token,
    });
  } catch (err) {
    console.error("Failed to save answer:", err);
  }

  // Load next question or finish
  const nextIndex = current + 1;
  if (nextIndex < quizzes.length) {
    setCurrent(nextIndex);
    setSelected("");

    const nextQuizId = quizzes[nextIndex].quiz_id;
    try {
      const nextOptions = await courseService.getQuizOptions(nextQuizId, token);
      setOptions(nextOptions || []);
    } catch (err) {
      console.error("Failed to load next options:", err);
      setOptions([]);
    }
  } else {
    setShowScore(true);
  }
};


  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="p-6 bg-white rounded-lg shadow-md m-6">
          <p className="text-center text-gray-600">Loading quiz...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Header />
      <main className="p-6 bg-white rounded-lg shadow-md m-6">
        <h1 className="text-2xl font-semibold mb-4">Quiz Content</h1>

        {!showScore ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <span>
                  Question {current + 1} of {quizzes.length}
                </span>
                <span>00:30:00</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${((current + 1) / quizzes.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {quizzes[current]?.question || "Loading question..."}
            </h2>

            <div className="flex flex-col gap-4 mb-6">
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.option_id}
                    onClick={() => setSelected(option.option_text)}
                    className={`p-4 text-left border rounded-lg transition-all duration-300 hover:bg-blue-100 ${
                      selected === option.option_text
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {option.option_text}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No options available</p>
              )}
            </div>

            {/* Show Next button only when an option is selected */}
            {selected && (
              <div className="flex justify-end mt-2 sm:justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg
        hover:bg-green-600 hover:scale-105 transform transition-all duration-300
        animate-fadeIn
        w-full sm:w-auto
      "
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg mb-6">
              Your Score: <span className="font-bold">{score}</span> /{" "}
              {quizzes.length}
            </p>
            <button
              onClick={() => {
                setCurrent(0);
                setSelected("");
                setScore(0);
                setShowScore(false);
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default QuizContent;
