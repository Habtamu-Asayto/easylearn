import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import courseService from "../../../../services/course.service"; // adjust path
import { Edit, FileText, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { useAuth } from "../../../../contexts/AuthContext";

function ExpandableLessons({ courseId, token }) {
  // Quize
  // ==============================================================
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [question, setQuestion] = useState("");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [answerText, setAnswerText] = useState("");

  // Error
  const [questionError, setQuestionError] = useState("");
  const [optionError, setOptionError] = useState({
    emptyText: false,
    noCorrect: false,
  });
  const [quizLessonId, setQuizLessonId] = useState(null);

  const emptyText = options.some((opt) => opt.text.trim() === "");
  const noCorrect = !options.some((opt) => opt.isCorrect);
  // setErrors({ emptyText, noCorrect });
  const [answerError, setAnswerError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    let valid = true; // Flag
    // Full name is required
    if (!question) {
      setQuestionError("Question is required");
      valid = false;
    } else {
      setQuestionError("");
    }
    if (questionType === "true_false") {
      if (!answerText) {
        setAnswerError("Answer is required");
        valid = false;
      } else {
        setAnswerError("");
        setAnswerText("")
      }
    } 
    else{
      setAnswerError("");
      setAnswerText("");
    }
    if (questionType === "multiple_choice") {
      const hasEmptyText = options.some((opt) => opt.text.trim() === "");
      const hasCorrectOption = options.some((opt) => opt.isCorrect);

      setOptionError({
        emptyText: hasEmptyText,
        noCorrect: !hasCorrectOption,
      });

      if (hasEmptyText || !hasCorrectOption) valid = false;
    } else {
      // Reset errors if not multiple choice
      setOptionError({ emptyText: false, noCorrect: false });
    }

    // If the form is not valid, do not submit
    if (!valid) {
      return;
    }
    // console.log("Reach", options);

    // const formData = { title, description, category_id: categoryId };
    
    const formData = {
      question,
      question_type: questionType,
      options: options, // array [{text, isCorrect}]
      answer_text: answerText,
      lesson_id: quizLessonId,
      points: Number(points),
    };
    try {
      let response;
      response = await courseService.createQuiz(formData, token);
      if (!response.status) {
        // Backend sent an error (status: false)
        toast.error(response.error || "Something went wrong");
      } else {
        // Backend sent success
        toast.success("Quize Inserted successfully");
        // setTimeout(() => {
        //   window.location.href = "/courses";
        // }, 1500);
      }
    } catch (err) {
      // console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () =>
    setOptions([...options, { text: "", isCorrect: false }]);

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Quiz end==============================================================
  const [isOpen, setIsOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [openLesson, setOpenLesson] = useState(null); // which lesson is open
  const [loading, setLoading] = useState(true);

  const [editingLesson, setEditingLesson] = useState(null);
  // Handle Edit Button click
  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
  };

  // Handle lesson update
  const handleUpdateLesson = async () => {
    try {
      const res = await courseService.updateLesson(
        editingLesson.lesson_id,
        editingLesson,
        token
      );

      if (res.success) {
        // Update lessons in state
        setLessons((prev) =>
          prev.map((l) =>
            l.lesson_id === editingLesson.lesson_id ? editingLesson : l
          )
        );
        toast.success("Lesson updated successfully");
        setEditingLesson(null);
      } else {
        toast.error(res.message || "Failed to update lesson");
      }
    } catch (err) {
      toast.error("Something went wrong while updating");
    }
  };

  
  useEffect(() => {
    if (isOpen) {
      setQuestion("");
      setPoints(1);
      setOptions([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      setAnswerText("");
      setQuestionType("multiple_choice");
    }

    const fetchLessons = async () => {
      try {
        const data = await courseService.getLessonsByCourse(courseId, token);
        const lessonsArray = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setLessons(lessonsArray);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchLessons();
    console.log("Fetched lessons:", lessons);
  }, [courseId, token, isOpen]);

  const toggleLesson = (id) => {
    setOpenLesson((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return <p className="text-gray-500 italic">Loading lessons...</p>;
  }

  if (!lessons || lessons.length === 0) {
    return (
      <p className="text-gray-500 italic">
        No lessons available for this course.
      </p>
    );
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  //   const [lesson, setLesson] = useState([])
  //   Delete lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure to delete this lesson ")) return;
    try {
      const res = await courseService.deleteLesson(lessonId, token);

      if (res.status) {
        // Remove deleted course from state
        setLessons((prev) => prev.filter((l) => l.lesson_id !== lessonId));
        toast.success("Lesson deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete lesson");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => (
        <div
          key={lesson.lesson_id}
          className="border rounded-lg border-gray-300 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <button
            onClick={() => toggleLesson(lesson.lesson_id)}
            className="w-full cursor-pointer  px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center font-semibold text-gray-800"
          > 
            <span>
              Lesson {index + 1}: {lesson.title}
            </span>
            <span
              className={`transform transition-transform duration-300 ${
                openLesson === lesson.lesson_id ? "rotate-180" : "rotate-0"
              }`}
            >
              <span className="text-xl">
                {openLesson === lesson.lesson_id ? "−" : "+"}
              </span>
            </span>
          </button>
          {/* Expandable Content */}
          <AnimatePresence>
            {openLesson === lesson.lesson_id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-white border-t border-gray-200"
              >
                <div className="p-4 space-y-2">
                  <p className="text-gray-700">{lesson.content}</p>
                </div>
                <div>
                  {getYouTubeEmbedUrl(lesson.video_url) && (
                    <div className="m-3 aspect-w-16 aspect-h-19">
                      <iframe
                        src={getYouTubeEmbedUrl(lesson.video_url)}
                        title={`Video for ${lesson.title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                      ></iframe>
                    </div>
                  )}
                  <div className="flex space-x-2 m-5">
                    {/* Edit button */}
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      className="text-blue-500 hover:text-blue-700 transition cursor-pointer"
                      title="Edit Lesson"
                    >
                      <Edit size={27} />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteLesson(lesson.lesson_id)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer"
                      title="Delete Lesson"
                    >
                      <Trash2 size={27} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuizLessonId(lesson.lesson_id);
                        setIsOpen(true);
                      }}
                      className="ml-auto flex px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <FileText className="mr-3 " /> Add Quiz
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}{" "}
      {/* Edit Lesson Modal */}
      <AnimatePresence>
        {editingLesson && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-190 h-133"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4  ">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  Edit Lesson
                </h2>
                <button
                  onClick={() => setEditingLesson(null)}
                  className="text-gray-600 transition-colors duration-200 p-1 hover:text-gray-500 cursor-pointer"
                  title="Close"
                >
                  ✕
                </button>
              </div>
              <div>
                <label> Lesson Title</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      title: e.target.value,
                    })
                  }
                  className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2 mb-3"
                />
              </div>
              <div>
                <label> Lesson Content</label>
                <textarea
                  rows={7}
                  value={editingLesson.content}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      content: e.target.value,
                    })
                  }
                  className="w-full border mt-1 rounded border-gray-400 focus:border-blue-400 focus:outline-none px-3 py-2 mb-3"
                />
              </div>
              <div>
                <label> Video URL</label>
                <input
                  type="text"
                  value={editingLesson.video_url || ""}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      video_url: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 mt-1 py-2 mb-3 border-gray-400 focus:border-blue-400 focus:outline-none"
                  placeholder="YouTube video link"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                  onClick={() => setEditingLesson(null)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateLesson}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Add Quiz Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-181 h-144 overflow-x-scroll"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4  ">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  Add Quiz {quizLessonId}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 transition-colors duration-200 p-1 hover:text-gray-500 cursor-pointer"
                  title="Close"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmitQuiz}>
                <div>
                  <label> Question</label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2"
                  />
                  {questionError && (
                    <div className="text-red-600 text-sm mb-3" role="alert">
                      {questionError}
                    </div>
                  )}
                </div>
                {/* Question Type */}
                <div>
                  <label>Question Type</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2 mb-3"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>
                {/* Multiple Choice Options */}
                {questionType === "multiple_choice" && (
                  <div className=" p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700">
                      Answer Options
                    </h3>
                    {options.map((opt, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={opt.text}
                          onChange={(e) =>
                            handleOptionChange(index, "text", e.target.value)
                          }
                          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              "isCorrect",
                              e.target.checked
                            )
                          }
                        />
                        <span className="text-sm text-gray-600">Correct</span>
                        {options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addOption}
                      className="text-blue-600 text-sm mt-2 hover:underline"
                    >
                      + Add Option
                    </button>
                    {/* Option validation errors */}
                    {optionError.emptyText && (
                      <p className="text-red-500 text-sm mt-1">
                        All option texts must be filled.
                      </p>
                    )}
                    {optionError.noCorrect && (
                      <p className="text-red-500 text-sm mt-1">
                        At least one option must be marked correct.
                      </p>
                    )}
                  </div>
                )}
                {(questionType === "short_answer" ||
                  questionType === "true_false") && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                      <label>Answer</label>
                      <input
                        type="text"
                        name="answer"
                        id="answer"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2 mb-1"
                      />
                      {answerError && (
                        <p className="text-red-500 text-sm">
                          {answerError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <label> Point</label>
                  <input
                    type="text"
                    name="point"
                    id="point"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2 mb-3"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExpandableLessons;
