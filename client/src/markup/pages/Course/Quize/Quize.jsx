import { useState } from "react";

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Rome", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Which language is used for React development?",
    options: ["Python", "JavaScript", "Java", "C#"],
    answer: "JavaScript",
  },
  {
    question: "Which company developed React?",
    options: ["Google", "Facebook", "Microsoft", "Apple"],
    answer: "Facebook",
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0); 
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleNext = () => {
    if (selected === quizData[current].answer) {
      setScore(score + 1);
    }
    setSelected("");
    if (current < quizData.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
        {!showScore ? (
          <>
            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-2">
                Question {current + 1} of {quizData.length}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((current + 1) / quizData.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {quizData[current].question}
            </h2>

            <div className="flex flex-col gap-4 mb-6">
              {quizData[current].options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`p-4 text-left border rounded-lg transition-all duration-300 hover:bg-blue-100 ${
                    selected === option
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selected}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                selected
                  ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {current === quizData.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Quiz Completed!
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Your Score: <span className="font-bold">{score}</span> /{" "}
              {quizData.length}
            </p>
            <button
              onClick={() => {
                setCurrent(0);
                setSelected("");
                setScore(0);
                setShowScore(false);
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
