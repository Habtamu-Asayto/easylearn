import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import courseService from "../../../../services/course.service"; // adjust path
import { Edit, Trash2 } from "react-feather";
import { toast } from "react-toastify";
function ExpandableLessons({ courseId, token }) {
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

  //
  //   const handleEditLesson = (lesson) => {
  //     setEditingLesson(lesson);
  //   };

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
                  <div className="flex space-x-2 m-5 ">
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
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}{" "}
      {/* Edit Modal */}
      <AnimatePresence>
        {editingLesson && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-180 h-116"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-4">Edit Lesson</h2>

              <input
                type="text"
                value={editingLesson.title}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, title: e.target.value })
                }
                className="w-full border border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2 mb-3"
              />

              <textarea
                rows={7}
                value={editingLesson.content}
                onChange={(e) =>
                  setEditingLesson({
                    ...editingLesson,
                    content: e.target.value,
                  })
                }
                className="w-full border rounded border-gray-400 focus:border-blue-400 focus:outline-none px-3 py-2 mb-3"
              />

              <input
                type="text"
                value={editingLesson.video_url || ""}
                onChange={(e) =>
                  setEditingLesson({
                    ...editingLesson,
                    video_url: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 mb-3 border-gray-400 focus:border-blue-400 focus:outline-none"
                placeholder="YouTube video link"
              />

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
    </div>
  );
}

export default ExpandableLessons;
