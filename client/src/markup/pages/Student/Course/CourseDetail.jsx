import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, Links } from "react-router-dom";
import { BookOpen } from "react-feather";

import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import courseService from "../../../../services/course.service.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import userService from "../../../../services/user.service.js";
function CourseDetail() {
  const { user, isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  const token = user?.user_token || null;
  const { courseId } = useParams();
  const api_url = "http://localhost:8080";
  const navigate = useNavigate();

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const handleQuizResults = async () => {
    setIsQuizModalOpen(true);
    // try {
    //   const res = await courseService.getQuizResults(courseId, token);
    //   if (res.status) {
    //     setQuizResults(res.data); // store results in state
    //     setIsQuizModalOpen(true); // open modal
    //   } else {
    //     toast.error(res.message);
    //   }
    // } catch (err) {
    //   toast.error("Failed to fetch quiz results");
    // }
  };
  const handleResourceChange = (e) => {
    const value = e.target.value;

    switch (value) {
      case "Take Quiz":
        navigate(`/take-quiz/${courseId}`);
        break;
      case "Quiz Results":
        handleQuizResults();
        break;
      case "Curriculum":
        navigate(`/curriculum/${courseId}`);
        break;
      case "Course Forums":
        navigate(`/forums/${courseId}`);
        break;
      default:
        break;
    }

    // reset the select to default after selection
    e.target.value = "";
  };

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [openIndex, setOpenIndex] = useState([]);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [instructor, setInstructor] = useState([]);

  const toggleChapter = (index) => {
    if (openIndex.includes(index)) {
      setOpenIndex(openIndex.filter((i) => i !== index));
    } else {
      setOpenIndex([...openIndex, index]);
    }
  };
  const [quizes, setQuizes] = useState({});

  useEffect(() => {
    const fetchEnrollment = async () => {
      const res = await courseService.checkEnrollment(courseId, token);
      if (res.status && res.enrolled) {
        setIsEnrolled(true);
      }
    };
    fetchEnrollment();
  }, [courseId, token]);

  // Fetch course info
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseService.getAllCourses(token);
        const data = await res.json();
        const course = data.data.find(
          (c) => c.course_id === parseInt(courseId)
        );
        if (!course) {
          navigate("/courses");
        } else {
          setCourseData(course);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [courseId, token, navigate]);

  const handleEnroll = async () => {
    const result = await courseService.enrollCourse(courseId, token);

    if (result.status) {
      setIsEnrolled(true);
      toast.success("Enrolled successfully!");
    } else {
      toast.error(result.message);
    }
  };

  // Fetch chapters with lessons
  useEffect(() => {
    const fetchChaptersAndLessons = async () => {
      try {
        const chaptersData = await courseService.getChaptersByCourse(
          courseId,
          token
        );
        const chaptersArray = Array.isArray(chaptersData?.data)
          ? chaptersData.data
          : [];

        const chaptersWithLessons = await Promise.all(
          chaptersArray.map(async (chapter) => {
            try {
              const lessonsData = await courseService.getLessonsByChapter(
                courseId,
                chapter.chapter_id,
                token
              );

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

              const lessonsArray = Array.isArray(lessonsData?.data)
                ? lessonsData.data
                : [];

              return { ...chapter, lessons: lessonsArray };
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
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) fetchChaptersAndLessons();
  }, [courseId, token]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const data = await userService.getInstructorsByCourse(courseId, token);
        setInstructor(data);
      } catch (err) {
        setError("Failed to fetch instructors");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) {
      fetchInstructors();
    }
  }, [courseId, token]);

  if (loading) return <p className="text-gray-500 italic">Loading course...</p>;
  if (!courseData)
    return <p className="text-gray-500 italic">Course not found.</p>;

  if (!isLogged || !(isAdmin || isInstructor || isStudent)) return null;

  return (
    <div className="flex flex-col md:flex-row overflow-hidden h-screen">
      <Sidebar isOpen={false} setIsOpen={() => {}} />
      <div className="flex-1 overflow-y-auto">
        <Header />

        <main className="p-6">
          <div className="bg-gray-50 text-gray-800 font-sans">
            <div className=" ">
              {/* Course Header */}
              <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold">
                    {courseData.title?.[0] || "C"}
                  </div>
                  <h1 className="text-xl font-semibold">{courseData.title}</h1>
                </div>
                <div className="text-sm text-gray-500">Course ▾</div>
              </header>

              <div className="grid grid-cols-12 gap-6">
                {/* Chapters + Lessons */}
                <div className="col-span-8">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="mt-2 text-gray-600">
                      {courseData.description}
                    </p>

                    <section className="mt-6 space-y-4">
                      {chapters.map((chapter, index) => {
                        const isOpen = openIndex.includes(index);
                        return (
                          <article
                            key={chapter.chapter_id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm"
                          >
                            <button
                              onClick={() => toggleChapter(index)}
                              className="w-full text-left p-4 flex items-start gap-4 cursor-pointer"
                            >
                              {/* Chapter Number */}
                              <div className="flex-shrink-0 mt-1">
                                <div
                                  className={`w-10 h-10 rounded-full ${chapter.color} flex items-center justify-center text-white font-semibold`}
                                >
                                  {index + 1}
                                </div>
                              </div>

                              {/* Chapter Details */}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold">
                                    {chapter.title}
                                  </h3>
                                  <svg
                                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                                      isOpen ? "rotate-180" : ""
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6 8l4 4 4-4"
                                      stroke="currentColor"
                                      strokeWidth="1.75"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>

                                {/* Expandable Lessons */}
                                <div
                                  className={`overflow-hidden transition-all duration-500 ease-in-out border-t border-gray-100 ${
                                    isOpen ? "max-h-96 mt-4" : "max-h-0"
                                  }`}
                                >
                                  {/* Lessons */}
                                  <ol className="p-4 list-decimal pl-6 space-y-3">
                                    {chapter.lessons &&
                                    chapter.lessons.length > 0 ? (
                                      chapter.lessons.map((lesson) =>
                                        isEnrolled ? (
                                          <Link
                                            key={lesson.lesson_id}
                                            to={`/lesson-detail/${courseId}/${chapter.chapter_id}/${lesson.lesson_id}`}
                                            className="flex justify-between items-center hover:bg-gray-100 p-1 rounded"
                                          >
                                            <div>
                                              <p className="text-sm text-gray-500">
                                                {lesson.title}
                                              </p>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                              {lesson.duration}
                                            </div>
                                          </Link>
                                        ) : (
                                          <div
                                            key={lesson.lesson_id}
                                            className="flex justify-between items-center p-1 rounded cursor-not-allowed opacity-50"
                                          >
                                            <div>
                                              <p className="text-sm text-gray-500">
                                                {lesson.title}
                                              </p>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                              {lesson.duration}
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p className="text-sm text-gray-400">
                                        No lessons yet
                                      </p>
                                    )}
                                  </ol>

                                  {/* Quiz */}
                                  <ol className="p-4 list-decimal pl-6 space-y-3 border-t border-gray-200 pt-4">
                                    {quizes[chapter.chapter_id]?.length > 0 ? (
                                      isEnrolled ? (
                                        <Link
                                          key={
                                            quizes[chapter.chapter_id][0]
                                              .quiz_id
                                          }
                                          to={`/take-quize/${courseId}/${
                                            chapter.chapter_id
                                          }/${
                                            quizes[chapter.chapter_id][0]
                                              .quiz_id
                                          }`}
                                          className="flex justify-between items-center hover:bg-gray-100 p-1 rounded cursor-pointer"
                                        >
                                          <div>Quiz</div>
                                          <div>
                                            {quizes[chapter.chapter_id].length}{" "}
                                            Questions
                                          </div>
                                        </Link>
                                      ) : (
                                        <div className="flex justify-between items-center p-1 rounded cursor-not-allowed opacity-50">
                                          <div>Quiz</div>
                                          <div>
                                            {quizes[chapter.chapter_id].length}{" "}
                                            Questions
                                          </div>
                                        </div>
                                      )
                                    ) : (
                                      <p className="text-sm text-gray-400">
                                        No Quiz Yet
                                      </p>
                                    )}
                                  </ol>
                                </div>
                              </div>
                            </button>
                          </article>
                        );
                      })}
                    </section>
                  </div>
                </div>

                {isQuizModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
                    <motion.div
                      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <h3 className="text-xl font-bold mb-4">Quiz Results</h3>

                      {/* {quizResults ? (
                        <div className="space-y-2">
                          <p>
                            Total Score:{" "}
                            <span className="font-semibold">
                              {quizResults.score}
                            </span>
                          </p>
                          <p>
                            Correct Answers:{" "}
                            <span className="font-semibold">
                              {quizResults.correct}
                            </span>
                          </p>
                          <p>
                            Wrong Answers:{" "}
                            <span className="font-semibold">
                              {quizResults.wrong}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p>No results available.</p>
                      )} */}

                      <div className="space-y-2">
                        <p>
                          Total Score: <span className="font-semibold"></span>
                        </p>
                        <p>
                          Correct Answers:{" "}
                          <span className="font-semibold"></span>
                        </p>
                        <p>
                          Wrong Answers: <span className="font-semibold"></span>
                        </p>
                      </div>

                      <button
                        onClick={() => setIsQuizModalOpen(false)}
                        className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Close
                      </button>
                    </motion.div>
                  </div>
                )}

                {/* Sidebar */}
                <aside className="col-span-4 space-y-4">
                  <div className="bg-white rounded-lg shadow-sm p-4 border">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Resources
                    </h4>
                    <select
                      className="w-full mt-3 p-2 border rounded text-sm"
                      onChange={handleResourceChange}
                    >
                      {/* <option value="Curriculum">Curriculum</option>
                      <option value="Course Forums">Course Forums</option> */}
                      <option value="">Take Quiz</option>
                      <option value="Quiz Results">Quiz Results</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {instructor && (
                      <div className="bg-white rounded-lg shadow-sm p-4 border flex items-start gap-3">
                        <img
                          src={
                            instructor?.profile_img
                              ? `http://localhost:8080${instructor.profile_img}`
                              : "/Image/profile.jpg"
                          }
                          alt={instructor.user_full_name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold">
                            {instructor.user_full_name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Instructor
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Known for a hands-on approach, empowers students to
                            learn by doing and excel in real-world projects.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <motion.div
                    className="bg-white shadow-lg rounded-2xl p-4 flex items-center justify-center sm:justify-between gap-4 border border-gray-100
      transition-all duration-300 hover:shadow-xl max-w-md mx-auto w-full"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {!isEnrolled ? (
                      <motion.button
                        onClick={handleEnroll}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex cursor-pointer items-center justify-center gap-3 
                     py-2 rounded-xl 
                     bg-gradient-to-r from-blue-500 to-indigo-600 
                     text-white text-lg font-semibold shadow-md 
                     hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 
                     transition-all duration-300"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Enroll Now</span>
                      </motion.button>
                    ) : (
                      <motion.div
                        className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold shadow-inner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Already Enrolled
                      </motion.div>
                    )}
                  </motion.div>
                </aside>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default CourseDetail;
