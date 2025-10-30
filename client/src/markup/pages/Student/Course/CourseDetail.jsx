import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, Links } from "react-router-dom";
import { BookOpen } from "react-feather";

import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import courseService from "../../../../services/course.service.js";

function CourseDetail() {
  const { user, isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  const token = user?.user_token || null;
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [openIndex, setOpenIndex] = useState([]);

  const toggleChapter = (index) => {
    if (openIndex.includes(index)) {
      setOpenIndex(openIndex.filter((i) => i !== index));
    } else {
      setOpenIndex([...openIndex, index]);
    }
  };
  const [quizes, setQuizes] = useState({});
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
            <div className="max-w-6xl mx-auto p-6">
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
                                  <ol className="p-4 list-decimal pl-6 space-y-3">
                                    {chapter.lessons &&
                                    chapter.lessons.length > 0 ? (
                                      chapter.lessons.map((lesson, i) => (
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
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-400">
                                        No lessons yet
                                      </p>
                                    )}
                                  </ol>{" "}
                                  <ol className="p-4 list-decimal pl-6 space-y-3 border-t border-gray-200 pt-4">
                                    {quizes[chapter.chapter_id]?.length > 0 ? (
                                      <Link
                                        key={
                                          quizes[chapter.chapter_id]?.[0]
                                            ?.quiz_id
                                        }
                                        to={`/take-quize/${courseId}/${
                                          chapter.chapter_id
                                        }/${
                                          quizes[chapter.chapter_id]?.[0]
                                            ?.quiz_id
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

                {/* Sidebar */}
                <aside className="col-span-4 space-y-4">
                  <div className="bg-white rounded-lg shadow-sm p-4 border">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Resources
                    </h4>
                    <select className="w-full mt-3 p-2 border rounded text-sm">
                      <option>Curriculum</option>
                      <option>Course Forums</option>
                      <option>Take Quiz</option>
                      <option>Quiz Results</option>
                    </select>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4 border flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop&crop=faces"
                      alt="instructor"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">Adrian Demian</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Instructor
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Practical lessons with real-world coding tips.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow-sm p-4 flex items-start gap-3">
                    <Link
                      to="/"
                      className="items-center justify-center p-3 w-full rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                    >
                      <span className="gap-2 flex ml-23">
                        <BookOpen className="mt-1" size={17} />
                        Enroll
                      </span>
                    </Link>
                  </div>
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
