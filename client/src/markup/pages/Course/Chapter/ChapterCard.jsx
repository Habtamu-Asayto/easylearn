import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import courseService from "../../../../services/course.service"; // adjust path
import { Plus, Edit, FileText, Trash2, Edit2, Delete } from "react-feather";
import { toast } from "react-toastify"; 

function ExpandableChapter({ courseId, token }) {
  // Lesson Start
  // ==============================================================
  const [quizes, setQuizes] = useState({});
  const [duration, setDuration] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessons, setLessons] = useState([]);
  const [openLesson, setOpenLesson] = useState(null); // which lesson is open
  const [editingLesson, setEditingLesson] = useState(null);
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  // Add new lesson
  const openAddLessonModal = (chapterId) => {
    setEditingLesson({
      lesson_id: null, // null = new lesson
      title: "",
      content: "",
      video_url: "",
      chapter_id: chapterId,
    });
    setIsLessonOpen(true);
  };

  // Edit existing lesson
  const openEditLessonModal = (lesson) => {
    setEditingLesson({ ...lesson }); // clone to avoid mutating state
    setIsLessonOpen(true);
  };
  // Handle Edit Button click
  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
  };

  // Lesson End
  // ==============================================================

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
  const [quizChapterId, setQuizChapterId] = useState(null);

  const [lessonChapterId, setLessonChapterId] = useState(null);

  const emptyText = options.some((opt) => opt.text.trim() === "");
  const noCorrect = !options.some((opt) => opt.isCorrect);
  // setErrors({ emptyText, noCorrect });
  const [answerError, setAnswerError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmitLesson = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (editingLesson.lesson_id) {
        // Update existing lesson
        res = await courseService.updateLesson(
          editingLesson.lesson_id,
          editingLesson,
          token
        );
        if (res.success) {
          setLessons((prev) =>
            prev.map((l) =>
              l.lesson_id === editingLesson.lesson_id ? editingLesson : l
            )
          );
          toast.success("Lesson updated successfully");
          //   window.location.reload(`course-detail/${courseId}`);
        } else toast.error(res.message || "Failed to update lesson");
      } else {
        // Add new lesson
        const payload = {
          ...editingLesson,
          chapter_id: editingLesson.chapter_id,
          course_id: courseId,
        };
        res = await courseService.createLesson([payload], token);

        if (res.status) {
          setLessons((prev) => [...prev, res.data]);
          toast.success("Lesson added successfully");
          //   window.location.reload(`course-detail/${courseId}`);
        } else toast.error(res.message || "Failed to add lesson");
      }
      setIsLessonOpen(false);
      setEditingLesson(null);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

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
        setAnswerText("");
      }
    } else {
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
      chapter_id: quizChapterId,
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
  const [chapters, setChapters] = useState([]);
  const [openChapter, setOpenChapter] = useState(null); // which chapter is open
  const [loading, setLoading] = useState(true);

  const [editingChapter, setEditingChapter] = useState(null);
  // Handle Edit Button click
  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
  };

  // Handle chapter update
  const handleUpdateChapter = async () => {
    try {
      const res = await courseService.updateChapter(
        editingChapter.chapter_id,
        editingChapter,
        token
      );

      if (res.success) {
        // Update chapter in state
        setChapters((prev) =>
          prev.map((c) =>
            c.chapter_id === editingChapter.chapter_id ? editingChapter : c
          )
        );
        toast.success("Chapter updated successfully");
        setEditingChapter(null);
      } else {
        toast.error(res.message || "Failed to update Chapter");
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

    const fetchChaptersAndLessons = async () => {
      try {
        const chaptersData = await courseService.getChaptersByCourse(
          courseId,
          token
        );
        // console.log("Chapters from API:", chaptersData);
        const chaptersArray = Array.isArray(chaptersData?.data)
          ? chaptersData.data
          : Array.isArray(chaptersData)
          ? chaptersData
          : [];

        // Fetch lessons for each chapter and merge them
        const chaptersWithLessons = await Promise.all(
          chaptersArray.map(async (chapter) => {
            try {
              const lessonsData = await courseService.getLessonsByChapter(
                courseId,
                chapter.chapter_id,
                token
              );

              const lessonsArray = Array.isArray(lessonsData?.data)
                ? lessonsData.data
                : [];

              // Fetch quizzes
              let quizData = [];
              try {
                const qzData = await courseService.getQuizesByChapter(
                  chapter.chapter_id,
                  token
                );
                quizData = Array.isArray(qzData?.data) ? qzData.data : [];
              } catch (err) {
                console.error(
                  `Error fetching quizzes for chapter ${chapter.chapter_id}:`,
                  err
                );
              }

              // store in state
              setQuizes((prev) => ({
                ...prev,
                [chapter.chapter_id]: quizData,
              }));


              const lessonsForChapter = lessonsArray.filter(
                (lesson) => lesson.chapter_id === chapter.chapter_id
              );
              return { ...chapter, lessons: lessonsForChapter };
            } catch (err) {
              console.error(
                `Error fetching lessons for chapter ${chapter.chapter_id}:`,
                err
              );
              return { ...chapter, lessons: [] };
            }
          })
        );

        setChapters(chaptersWithLessons);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchChaptersAndLessons();
  }, [courseId, token, isOpen]);

  const toggleChapter = (id) => {
    setOpenChapter((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return <p className="text-gray-500 italic">Loading chapters...</p>;
  }

  if (!chapters || chapters.length === 0) {
    return (
      <p className="text-gray-500 italic">
        No Chapters available for this course.
      </p>
    );
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

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
  //   Delete Chapter
  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure to delete this chapter ")) return;
    try {
      const res = await courseService.deleteChapter(chapterId, token);

      if (res.status) {
        // Remove deleted course from state
        setChapters((prev) => prev.filter((c) => c.chapter_id !== chapterId));
        toast.success("Chapter deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete chapter");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="space-y-3">
      {chapters.map((chapter, index) => (
        <div
          key={chapter.chapter_id}
          className="border rounded-lg border-gray-300 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <button
            onClick={() => toggleChapter(chapter.chapter_id)}
            className="w-full cursor-pointer  px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center font-semibold text-gray-800"
          >
            <span>
              Chapter {index + 1}: {chapter.title}
            </span>
            <span
              className={`transform transition-transform duration-300 ${
                openChapter === chapter.chapter_id ? "rotate-180" : "rotate-0"
              }`}
            >
              <span className="text-xl">
                {openChapter === chapter.chapter_id ? "−" : "+"}
              </span>
            </span>
          </button>
          {/* Expandable Content */}
          <AnimatePresence>
            {openChapter === chapter.chapter_id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-white border-t border-gray-200"
              >
                <div className="p-4 space-y-2">
                  <p className="text-gray-700">{chapter.description}</p>
                </div>

                <div className="p-4 space-y-2 transition-all duration-500 ease-in-out border-t border-gray-100">
                  <ol className="p-4 list-decimal pl-6 space-y-3">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      chapter.lessons.map((lesson, i) => (
                        <li
                          key={lesson.lesson_id}
                          className="flex justify-between items-center hover:bg-gray-100 p-1 rounded cursor-pointer"
                        >
                          <div>{lesson.title} </div>
                          <div className="text-xs text-gray-400">
                            {lesson.duration}
                          </div>
                          <div className="flex space-x-3">
                            <Edit
                              onClick={() => openEditLessonModal(lesson)}
                              className="hover:text-amber-400 "
                              size={17}
                            />
                            <Delete
                              onClick={() =>
                                handleDeleteLesson(lesson.lesson_id)
                              }
                              className="hover:text-red-400"
                              size={17}
                            />
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No lessons yet</p>
                    )}
                  </ol>
                  <ol className="p-4 list-decimal pl-6 space-y-3 border-t border-gray-200 pt-4">
                    <li className="flex justify-between items-center hover:bg-gray-100 p-1 rounded cursor-pointer">
                      <div>Quiz</div>
                      <div>
                        {quizes[chapter.chapter_id]?.length > 0
                          ? `${quizes[chapter.chapter_id].length} Questions`
                          : "No Quiz Yet"}
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="flex space-x-2 m-5">
                  {/* Edit button */}
                  <button
                    onClick={() => handleEditChapter(chapter)}
                    className="text-blue-500 hover:text-blue-700 transition cursor-pointer"
                    title="Edit Chapter"
                  >
                    <Edit size={27} />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteChapter(chapter.chapter_id)}
                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
                    title="Delete Chapter"
                  >
                    <Trash2 size={27} />
                  </button>

                  <button
                    type="button"
                    onClick={() => openAddLessonModal(chapter.chapter_id)}
                    className="ml-auto flex px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Plus className="mr-3" /> Add Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizChapterId(chapter.chapter_id);
                      setIsOpen(true);
                    }}
                    className="ml-auto flex px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <FileText className="mr-3 " /> Add Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}{" "}
      {/* Edit Chapter Modal */}
      <AnimatePresence>
        {editingChapter && (
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
                  Edit Chapter
                </h2>
                <button
                  onClick={() => setEditingChapter(null)}
                  className="text-gray-600 transition-colors duration-200 p-1 hover:text-gray-500 cursor-pointer"
                  title="Close"
                >
                  ✕
                </button>
              </div>
              <div>
                <label>Chapter Title</label>
                <input
                  type="text"
                  value={editingChapter.title}
                  onChange={(e) =>
                    setEditingChapter({
                      ...editingChapter,
                      title: e.target.value,
                    })
                  }
                  className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2 mb-3"
                />
              </div>
              <div>
                <label> Chapter Description</label>
                <textarea
                  rows={7}
                  value={editingChapter.description}
                  onChange={(e) =>
                    setEditingChapter({
                      ...editingChapter,
                      description: e.target.value,
                    })
                  }
                  className="w-full border mt-1 rounded border-gray-400 focus:border-blue-400 focus:outline-none px-3 py-2 mb-3"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                  onClick={() => setEditingChapter(null)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateChapter}
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
              className="bg-white p-6 rounded-lg w-[45rem] max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4  ">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  Add Quiz {quizChapterId}
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
                        <p className="text-red-500 text-sm">{answerError}</p>
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
      {/* Add Lesson */}
      <AnimatePresence>
        {isLessonOpen && editingLesson && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-[45rem] max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingLesson.lesson_id ? "Edit Lesson" : "Add Lesson"}
                </h2>
                <button
                  onClick={() => setIsLessonOpen(false)}
                  className="text-gray-600 p-1 hover:text-gray-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitLesson}>
                <div className="flex">
                  <div className="w-[60%]">
                    <label>Lesson Title</label>
                    <input
                      type="text"
                      placeholder="Lesson title"
                      value={editingLesson.title || ""}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          title: e.target.value,
                        })
                      }
                      className="w-full border mt-1 border-gray-400 rounded px-3 py-2 mb-3"
                    />
                  </div>
                  <div className="ml-3">
                    <label>Duration</label>
                    <input
                      type="text"
                      placeholder="Duration"
                      value={editingLesson.duration || ""}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          duration: e.target.value,
                        })
                      }
                      className="w-full border mt-1 border-gray-400 rounded px-3 py-2 mb-3"
                    />
                  </div>
                </div>
                <div>
                  <label>Lesson Content</label>
                  <textarea
                    rows={7}
                    value={editingLesson.content}
                    placeholder="Lesson detail"
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        content: e.target.value,
                      })
                    }
                    className="w-full border mt-1 border-gray-400 rounded px-3 py-2 mb-3"
                  />
                </div>

                <div>
                  <label>Video URL</label>
                  <input
                    type="text"
                    value={editingLesson.video_url || ""}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        video_url: e.target.value,
                      })
                    }
                    className="w-full border mt-1 border-gray-400 rounded px-3 py-2 mb-3"
                    placeholder="YouTube video link"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsLessonOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {editingLesson.lesson_id ? "Update" : "Save"}
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

export default ExpandableChapter;
