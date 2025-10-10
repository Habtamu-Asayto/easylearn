import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import courseService from "../../../../services/course.service"; // adjust path

function ExpandableLessons({ courseId, token }) {
  const [lessons, setLessons] = useState([]);
  const [openLesson, setOpenLesson] = useState(null); // which lesson is open
  const [loading, setLoading] = useState(true);

//   console.log("Tok : ", token);
  
  // Fetch lessons from backend
  useEffect(() => {
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
  }, [courseId, token]);

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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default ExpandableLessons;
