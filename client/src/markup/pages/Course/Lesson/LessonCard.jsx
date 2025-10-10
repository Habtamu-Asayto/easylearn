import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ExpandableLessonCard
// Props:
// - lesson: { lesson_id, course_id, title, content, video_url, attachments, lesson_order }
// - onEdit(lesson)
// - onDelete(lesson)
// - onToggleComplete(lesson_id, completed)
// - initiallyExpanded: boolean

export default function ExpandableLessonCard({
  lesson = {},
  onEdit = () => {},
  onDelete = () => {},
  onToggleComplete = () => {},
  initiallyExpanded = false,
}) {
  const [open, setOpen] = useState(initiallyExpanded);
  const [completed, setCompleted] = useState(false);
  const contentRef = useRef(null);

  const toggle = () => setOpen((v) => !v);

  const handleToggleComplete = () => {
    const next = !completed;
    setCompleted(next);
    // callback for parent to sync state
    onToggleComplete(lesson.lesson_id, next);
  };

  return (
    <article
      className={`w-full max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-lg`}
      aria-expanded={open}
    >
      <header
        className="flex items-center justify-between p-4 md:p-5 cursor-pointer"
        onClick={toggle}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg text-white font-semibold text-sm ${
                completed ? "bg-green-500" : "bg-indigo-600"
              }`}
            >
              {lesson.lesson_order ?? "#"}
            </div>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold text-gray-800 ${
                completed ? "line-through text-gray-400" : ""
              }`}
            >
              {lesson.lesson_title || lesson.title || "Untitled Lesson"}
            </h3>
            <div className="mt-1 text-xs text-gray-500 flex gap-3 items-center">
              <span>Course {lesson.course_id ?? "—"}</span>
              <span>•</span>
              <span>
                {lesson.content
                  ? `${String(lesson.content).slice(0, 80)}${
                      lesson.content.length > 80 ? "..." : ""
                    }`
                  : "No description"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}
            className={`px-3 py-1 text-sm rounded-full border ${
              completed
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-white border-gray-200 text-gray-700"
            }`}
            aria-pressed={completed}
            title={completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {completed ? "Completed" : "Mark"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lesson);
            }}
            className="p-2 rounded-lg hover:bg-gray-50"
            aria-label="Edit lesson"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5h6M5 7h.01M5 11h.01M5 15h.01M7 7h10M7 11h10M7 15h6"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lesson);
            }}
            className="p-2 rounded-lg hover:bg-gray-50 text-red-500"
            aria-label="Delete lesson"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 8a1 1 0 011 1v6a1 1 0 102 0V9a1 1 0 112 0v6a1 1 0 102 0V9a1 1 0 011-1h1V6H5v2h1zM4 4h12v2H4V4z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className="p-2 rounded-lg hover:bg-gray-50"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transform transition-transform ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-t border-gray-100 p-4 md:p-6 bg-gray-50"
          >
            <div ref={contentRef} className="prose max-w-none text-gray-700">
              {lesson.content ? (
                <p>{lesson.content}</p>
              ) : (
                <p className="text-gray-400 italic">
                  No lesson content available.
                </p>
              )}

              {lesson.video_url && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Video</h4>
                  <div className="aspect-video bg-black/5 rounded overflow-hidden">
                    {/* Safe embed - if it's a youtube link show iframe, otherwise show link */}
                    {lesson.video_url.includes("youtube") ? (
                      <iframe
                        src={lesson.video_url}
                        title={lesson.lesson_title}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      />
                    ) : (
                      <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-4 rounded bg-white border border-gray-200"
                      >
                        Open video
                      </a>
                    )}
                  </div>
                </div>
              )}

              {lesson.attachments && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Attachments</h4>
                  <ul className="space-y-2">
                    {String(lesson.attachments)
                      .split(",")
                      .map((att, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          <a
                            href={att.trim()}
                            className="text-indigo-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {att.trim()}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Lesson ID: {lesson.lesson_id ?? "—"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(lesson)}
                    className="px-3 py-2 bg-white border rounded text-sm hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(lesson)}
                    className="px-3 py-2 bg-red-50 text-red-600 border rounded text-sm hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </article>
  );
}



/*
Usage example (render inside your page):

import ExpandableLessonCard from "./ExpandableLessonCard";

export default function LessonsList({ lessons }) {
  return (
    
  );
}
*/
