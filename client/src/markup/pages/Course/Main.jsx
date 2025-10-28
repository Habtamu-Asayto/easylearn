import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import { Link, Links } from "react-router-dom";
import courseService from "../../../services/course.service";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import { BookOpen, UserPlus } from "react-feather";

function Main({ onShowAllMain }) {
  const { user, isLoggedIn, isAdmin, isInstructor, isStudent } = useAuth();
  let token = null;
  if (user) {
    token = user.user_token;
  }

  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [course, setCourse] = useState([]);
  useEffect(() => {
    // Call the getAllStudents function
    const allCourse = courseService.getAllCourses(token);
    allCourse
      .then((res) => {
        if (!res.ok) {
          console.log("Here is: " + res.status);
          setApiError(true);
          if (res.status === 401) {
            setApiErrorMessage("Please login again");
          } else if (res.status === 403) {
            setApiErrorMessage("You are not authorized to view this page");
          } else {
            setApiErrorMessage("Please try again later");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.data.length !== 0) {
          console.log(data.data);
          setCourse(data.data);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await courseService.deleteCourse(courseId, token);

      if (res.status) {
        // Remove deleted course from state
        setCourse(course.filter((c) => c.course_id !== courseId));
        toast.success("Course deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete course");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <Header />

      {/* Dashboard Content */}
      <main className="p-6">
        {/* Overview */}
        {isAdmin ||
          (isInstructor && (
            <div id="all-courses" className="flex justify-end p-4">
              <button
                className="px-5 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:shadow-md transition"
                onClick={onShowAllMain}
              >
                ALL COURSES
              </button>
            </div>
          ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          {apiError ? (
            <section className="contact-section">
              <div className="auto-container">
                <div className="contact-title">
                  <h2>{apiErrorMessage}</h2>
                </div>
              </div>
            </section>
          ) : course.length > 0 ? (
            course.map((cat, index) => (
              <div
                key={cat.course_id}
                className="card max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow"
              >
                {/* Card Header */}
                <div className="bg-gray-200 from-blue-400 to-indigo-500 flex items-center justify-center h-32">
                  <div className="bg-white p-4 rounded-full shadow-md">
                    {/* Replace with your icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m0-7l-9-5m9 5l9-5"
                      />
                    </svg>
                  </div>
                </div>
                {/* Card Body */}
                <div className="p-6 text-center">
                  {isAdmin ||
                    (isInstructor && (
                      <Link
                        to={`/course-detail/${cat.course_id}`}
                        className="text-xl font-bold text-gray-800"
                      >
                        {cat.title}
                      </Link>
                    ))}
                  {isStudent && (
                      <Link
                        to={`/stud-course-detail/${cat.course_id}`}
                        className="text-xl font-bold text-gray-800"
                      >
                        {cat.title}
                      </Link>
                    )}
                </div>
                {/* Card Footer */}
                {isStudent && (
                  <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
                    <Link
                      to={`/edit-course/${cat.course_id}`}
                      className="flex items-center gap-2 px-16 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                    >
                      <BookOpen size={18} />
                      Enroll
                    </Link>
                  </div>
                )}
                {isAdmin ||
                  (isInstructor && (
                    <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
                      <Link
                        to={`/edit-course/${cat.course_id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 17l-4-4m0 0l4-4m-4 4h14"
                          />
                        </svg>
                        Edit Course
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(cat.course_id)}
                        className="flex cursor-pointer items-center ml-5 gap-2 px-4 py-2 rounded-lg bg-red-400 text-white font-medium hover:bg-red-300 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <h4 className="font-medium">Empty</h4>
          )}

          {/*Add Course*/}
          {isAdmin || isInstructor ? (
            <Link
              to="/add-course"
              className="card max-w-sm w-full flex items-center justify-center rounded-2xl 
                 border-2 border-dashed border-gray-300 bg-gray-50 
                 hover:border-indigo-400 hover:bg-indigo-50 
                 transition-all duration-200 cursor-pointer"
            >
              <span className="text-5xl text-gray-400 font-light hover:text-indigo-400">
                +
              </span>
            </Link>
          ) : (
            <></>
          )}
        </div>

        {/* Pagination */}
        <div className="flex mt-8">
          <div className="inline-flex items-center space-x-1">
            {/* Prev */}
            <button
              className="px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              «
            </button>
            {/* Page numbers */}
            <button className="px-3 py-2 rounded bg-blue-500 text-white">
              1
            </button>
            <button className="px-3 py-2 rounded bg-white text-gray-700 border hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 rounded bg-white text-gray-700 border hover:bg-gray-50">
              3
            </button>
            {/* Next */}
            <button className="px-3 py-2 rounded bg-white text-gray-700 border hover:bg-gray-50">
              »
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Main;
