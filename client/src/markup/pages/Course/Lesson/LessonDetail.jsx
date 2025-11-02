import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import courseService from "../../../../services/course.service";
import { useAuth } from "../../../../contexts/AuthContext";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
function LessonDetail() {
  const { courseId, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  let token = user?.user_token;
  const [isOpen, setIsOpen] = useState(false);  
  const [lessonData, setLessonData] = useState([]);
  const [allLessonData, setAllLessonData] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  const [chapterData, setChapterData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

 useEffect(() => {
   const markLessonAsCompleted = async () => {
     if (!lessonData || !token) return;
     try {
       await courseService.completeLesson(
         courseId,
         lessonData.lesson_id,
         token
       );
       const progressData = await courseService.getCourseProgress(
         courseId,
         token
       );
       setCompletedLessons(progressData.completed);
       setTotalLessons(progressData.total);
     } catch (err) {
       console.error("Error updating progress:", err);
     }
   };

   markLessonAsCompleted();
 }, [lessonData, courseId, token]);
 
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await courseService.getCourseProgress(courseId, token);
        setCompletedLessons(data.completed);
        setTotalLessons(data.total);
      } catch (err) {
        console.error("Error fetching course progress:", err);
      }
    };

    if (courseId && token) fetchProgress();
  }, [courseId, token]);

  const percentage = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;


const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};
//   Fetch chapter data
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await courseService.getChaptersByCourse(courseId, token);

        const chapter = data.data.find(
          (c) => c.chapter_id === parseInt(chapterId)
        );

        if (!chapter) {
          navigate(`/stud-course-detail/${courseId}`);
        } else {
          setChapterData(chapter);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setLoading(false);
      }
    };

    fetchChapters();
  }, [chapterId, courseId, token, navigate]);

 

useEffect(() => {
  const fetchLessons = async () => {
    try {
      const response = await courseService.getLessonsByChapter(
        courseId,
        chapterId,
        token
      );

      if (!response?.data || response.data.length === 0) {
        console.warn("No lessons found for this chapter");
        setAllLessonData([]);
        setLessonData(null);
        return;
      }

      const lessons = response.data;
      const currentLesson = lessons.find(
        (l) => l.lesson_id === parseInt(lessonId)
      );

      setLessonData(currentLesson || lessons[0]); // fallback to first
      setAllLessonData(lessons);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      setLoadingLessons(false);
    }
  };

  if (courseId && chapterId && token) fetchLessons();
}, [courseId, chapterId, lessonId, token]);

  if (loading) return <p>Loading...</p>;
  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="flex-1 overflow-y-auto">
            <Header /> {/* Dashboard Content */}
            <div className="min-h-screen flex flex-col lg:flex-row">
              <main className="flex-1 p-6 lg:p-8">
                <div className="mx-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {chapterData.title}
                    </h1>
                    <button
                      id="theme-toggle"
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <i data-feather="moon" className="hidden dark:block" />
                      <i data-feather="sun" className="dark:hidden" />
                    </button>
                  </div>
                  {/* Breadcrumbs */}
                  <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                      <li className="inline-flex items-center">
                        <Link
                          to="/courses"
                          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                        >
                          <i data-feather="home" className="w-4 h-4 mr-2" />
                          Course
                        </Link>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <i
                            data-feather="chevron-right"
                            className="w-4 h-4 text-gray-400"
                          />
                          <Link
                            to={`/stud-course-detail/${courseId}`}
                            className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                          >
                            Chapter
                          </Link>
                        </div>
                      </li>
                      <li aria-current="page">
                        <div className="flex items-center">
                          <i
                            data-feather="chevron-right"
                            className="w-4 h-4 text-gray-400"
                          />
                          <span className="ml-1 text-sm font-medium text-primary-500 md:ml-2 dark:text-primary-400">
                            Lesson
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>
                  {/* Lesson Content */}
                  <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
                    {/* Video Player */}
                    <div className="relative pt-[56.25%] bg-gray-900">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={getYouTubeEmbedUrl(lessonData.video_url)}
                        title="YouTube video player"
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Lesson Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
                            Lesson 5 of 12
                          </span>
                          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                            {lessonData.title}
                          </h2>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                            <i data-feather="bookmark" />
                          </button>
                          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                            <i data-feather="share-2" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center mr-4">
                          <i data-feather="clock" className="w-4 h-4 mr-1" />
                          <span>{lessonData.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <i data-feather="calendar" className="w-4 h-4 mr-1" />
                          <span>Published on {lessonData.created_at}</span>
                        </div>
                      </div>
                      <div className="prose max-w-none dark:prose-invert">
                        <p className="text-gray-700 dark:text-gray-300">
                          {lessonData.content}
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                          <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                            <i
                              data-feather="chevron-left"
                              className="w-5 h-5 mr-2"
                            />
                            Previous Lesson
                          </button>
                          <button className="flex items-center px-4 py-2 bg-primary-500 rounded-lg text-white hover:bg-primary-600">
                            Next Lesson
                            <i
                              data-feather="chevron-right"
                              className="w-5 h-5 ml-2"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </main>
              <aside className="w-full lg:w-80 p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                <div className="sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {chapterData.title} - Lessons
                  </h3>
                  <div className="space-y-2">
                    {loadingLessons ? (
                      <p className="text-gray-500">Loading lessons...</p>
                    ) : allLessonData.length > 0 ? (
                      allLessonData.map((lesson, index) => (
                        <Link
                          key={lesson.lesson_id}
                          to={`/lesson-detail/${courseId}/${chapterId}/${lesson.lesson_id}`}
                          className={`block p-3 rounded-lg transition-colors duration-200 ${
                            parseInt(lesson.lesson_id) === parseInt(lessonId)
                              ? "bg-primary-50 dark:bg-gray-700 border border-primary-200"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {index + 1}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                {lesson.title}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No lessons found for this chapter.
                      </p>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Course Progress
                    </h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          percentage === 100 ? "bg-green-500" : "bg-green-400"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      You've completed {completedLessons} of {totalLessons}{" "}
                      lessons ({percentage}%)
                    </p>
                  </div>
                </div>
              </aside>
            </div>
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default LessonDetail;
