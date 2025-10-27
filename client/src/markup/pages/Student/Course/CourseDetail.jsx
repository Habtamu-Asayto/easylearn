import react, { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import Header from "../../../components/Header/Header.jsx";
import MyCoursesList from "./MyCoursesList.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import { Link } from "react-router";
import { BookOpen } from "react-feather";
function CourseDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState([]);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  const toggleChapter = (index) => {
    if (openIndex.includes(index)) {
      // If it's open → close it
      setOpenIndex(openIndex.filter((i) => i !== index));
    } else {
      // If it's closed → open it
      setOpenIndex([...openIndex, index]);
    }
  };

  // Sample chapters data
  const chapters = [
    {
      id: 1,
      color: "bg-indigo-500",
      title: "Chapter 1 — Introduction",
      description: "Learn the basics and set up your environment.",
      lessons: [
        { name: "Installation", time: "2:03" },
        { name: "The MVC architectural pattern", time: "25:01" },
        { name: "Database Models", time: "12:10" },
        { name: "Database Access", time: "1:25" },
        { name: "Eloquent Basics", time: "22:30" },
      ],
    },
    {
      id: 2,
      color: "bg-yellow-400",
      title: "Chapter 2 — Intermediate",
      description: "Explore controllers and routing.",
      lessons: [
        { name: "Routing Basics", time: "9:10" },
        { name: "Controllers", time: "18:42" },
        { name: "Middleware", time: "8:00" },
        { name: "Testing", time: "14:12" },
      ],
    },
  ];
  // const [lessons, setLessons] = useState([]);
  // useEffect(() => {
  //   const fetchLessons = async () => {
  //     try {
  //       const data = await courseService.getLessonsByCourse(courseId, token);
  //       const lessonsArray = Array.isArray(data?.data)
  //         ? data.data
  //         : Array.isArray(data)
  //         ? data
  //         : [];
  //       setLessons(lessonsArray);
  //     } catch (error) {
  //       console.error("Error fetching lessons:", error);
  //       setLessons([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (courseId) fetchLessons();
  //   console.log("Fetched lessons:", lessons);
  // }, [courseId, token, isOpen]);

  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="flex-1 overflow-y-auto">
            <Header />

            <main className="p-6">
              <div className="bg-gray-50 text-gray-800 font-sans">
                <div className="max-w-6xl mx-auto p-6">
                  {/* Header */}
                  <header className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold">
                        G
                      </div>
                      <h1 className="text-xl font-semibold">
                        Github Webhooks for Beginners
                      </h1>
                    </div>
                    <div className="text-sm text-gray-500">Course ▾</div>
                  </header>
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                          <span className="inline-block text-blue-600 bg-blue-100 rounded px-2 py-1 text-sm">
                            2
                          </span>
                          The MVC architectural pattern
                        </h2>
                        <p className="mt-4 text-gray-600">
                          This is an animated course curriculum page. Each
                          chapter expands with smooth animations to reveal its
                          lessons. Built with Tailwind, HTML, and vanilla
                          JavaScript.
                        </p>
                        {/* Curriculum */}

                        <section className="mt-6 space-y-4">
                          {chapters.map((chapter, index) => {
                            const isOpen = openIndex.includes(index);
                            return (
                              <article
                                key={chapter.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                              >
                                <button
                                  onClick={() => toggleChapter(index)}
                                  className="w-full text-left p-4 flex items-start gap-4"
                                >
                                  {/* Chapter Number */}
                                  <div className="flex-shrink-0 mt-1">
                                    <div
                                      className={`w-10 h-10 rounded-full ${chapter.color} flex items-center justify-center text-white font-semibold`}
                                    >
                                      {chapter.id}
                                    </div>
                                  </div>

                                  {/* Chapter Details */}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h3 className="text-lg font-semibold">
                                          {chapter.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                          {chapter.description}
                                        </p>
                                      </div>

                                      {/* Chevron Icon */}
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

                                    {/* Expandable Content */}
                                    <div
                                      className={`overflow-hidden transition-all duration-500 ease-in-out border-t border-gray-100 ${
                                        isOpen ? "max-h-96 mt-4" : "max-h-0"
                                      }`}
                                    >
                                      <ol className="p-4 list-decimal pl-6 space-y-3">
                                        {chapter.lessons.map((lesson, i) => (
                                          <a
                                            key={i}
                                            href="#"
                                            className="flex justify-between items-center hover:bg-gray-100 p-1 rounded"
                                          >
                                            <div>{lesson.name}</div>
                                            <div className="text-xs text-gray-400">
                                              {lesson.time}
                                            </div>
                                          </a>
                                        ))}
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
                    <aside className="col-span-4">
                      <div className="space-y-4">
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
                        <div className="bg-white  shadow-sm p-4 flex items-start gap-3">
                          <Link
                            // to={`/edit-course/${cat.course_id}`}
                            to="/"
                            className="items-center justify-center p-3 w-full rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                          >
                            <span className="gap-2 flex ml-23">
                              <BookOpen className="mt-1" size={17} />
                              Enroll
                            </span>
                          </Link>
                        </div>
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
  }
}

export default CourseDetail;
