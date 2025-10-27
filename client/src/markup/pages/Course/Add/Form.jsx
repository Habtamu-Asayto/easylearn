import Footer from "../../../components/Footer/Footer";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../Contexts/AuthContext";
import categoryService from "../../../../services/coursecategory.service";
import courseService from "../../../../services/course.service";
import { toast } from "react-toastify";

function Form({ editCourse, onSuccess }) {
  // Fetch All categories
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(true);

  // const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    editCourse ? String(editCourse.category_id) : ""
  );

  const { tokens } = useAuth();
  const [title, setTitle] = useState(editCourse?.title || "");
  const [description, setDescription] = useState(editCourse?.description || "");
  const [categoryId, setCategoryId] = useState(editCourse?.category_id || "");

  // Error
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState([]);
  const [categoryError, setCategoryError] = useState([]);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const { user } = useAuth();
  let token = null;
  if (user) {
    token = user.user_token;
  }

  useEffect(() => {
    // Populate categories
    categoryService
      .getCategoryForCourse(token)
      .then((result) => {
        // console.log("Category JSON result:", result);
        setCategories(result.data || []); // <-- now result.data is the array
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Add Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true; // Flag
    // Full name is required
    if (!title) {
      setTitleError("Title is required");
      valid = false;
    } else {
      setTitleError("");
    }
    if (!description) {
      setDescriptionError("Description is required");
      valid = false;
    } else {
      setDescriptionError("");
    }
    if (!selectedCategory) {
      setCategoryError("Category is required");
      valid = false;
    } else {
      setCategoryError("");
    }

    // If the form is not valid, do not submit
    if (!valid) {
      return;
    }
    // const formData = { title, description, category_id: categoryId };
    const formData = {
      title,
      description,
      // category_id: selectedCategory?.category_id || null, // fallback if undefined
      category_id: selectedCategory,
    };
    try {
      let response;

      if (editCourse) {
        response = await courseService.updateCourse(
          editCourse.course_id,
          formData, 
          token
        );
      } else {
        response = await courseService.createCourse(formData, token);
      }

      if (!response.status) {
        // Backend sent an error (status: false)
        toast.error(response.error || "Something went wrong");
      } else {
        // Backend sent success
        toast.success("Course Inserted successfully");
        setTimeout(() => {
          window.location.href = "/courses";
        }, 1500);
      }
    } catch (err) {
      // console.error(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
        <h2 className="text-xl font-semibold text-dark">Edit Course</h2>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative">
            <i data-feather="bell" className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </div>
          <img
            src="http://learning.frontendmatter.com/html/images/people/110/guy-6.jpg"
            className="w-8 h-8 rounded-full hidden sm:block"
          />
        </div>
      </header>
      {/* Dashboard Content */}
      <main className="p-6">
        {/* Overview */}
        <div id="all-courses" className="flex justify-end p-4">
          <Link to="/courses">
            <button className="px-5 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:shadow-md transition">
              ALL COURSES
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor area (center) */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden fade-in">
              {/* Tabs */}
              <div className="flex items-center border-b border-gray-200 px-4 sm:px-6 py-3 gap-3 bg-white">
                {serverError && (
                  <div className="text-red-600 text-sm mb-2 mt-2" role="alert">
                    {serverError}
                  </div>
                )}
                {success && (
                  <div class="bg-green-500 text-white  rounded-md shadow-lg">
                    {
                      <>
                        <h3 className="px-7 py-2">{success}</h3>
                      </>
                    }
                  </div>
                )}
                <div className="ml-auto text-xs text-gray-400">
                  You are editing:
                  <span className="font-medium text-gray-700">
                    Basics of HTML
                  </span>
                </div>
              </div>
              {/* Editor body */}
              <div className="p-4 sm:p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Title */}

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Basics of HTML"
                      name="course_title"
                      id="course_title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    {titleError && (
                      <div className="text-red-600 text-sm mt-1" role="alert">
                        {titleError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Category
                    </label>
                    <select
                      id="course_category"
                      name="course_category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      <option value="">Select Category</option>
                      {categories &&
                        categories.length > 0 &&
                        categories.map((cat) => (
                          <option
                            key={cat.category_id}
                            value={String(cat.category_id)}
                          >
                            {cat.category_name}
                          </option>
                        ))}
                    </select>

                    {categoryError && (
                      <div className="text-red-600 text-sm mb-2" role="alert">
                        {categoryError}
                      </div>
                    )}
                  </div>

                  {/* Description (rich-ish textarea) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Description
                    </label>
                    {/* toolbar (visual only) */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="ml-2 text-xs text-gray-400">
                        Simple editor (placeholder)
                      </div>
                    </div>
                    <textarea
                      rows={8}
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Write a nice course description..."
                    />
                    {descriptionError && (
                      <div className="text-red-600 text-sm mt-1" role="alert">
                        {descriptionError}
                      </div>
                    )}
                  </div>
                  {/* Actions row (mobile sticky) */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Last saved:
                      <span className="text-gray-700 font-medium">
                        2 minutes ago
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                      >
                        {editCourse ? "Update Course" : "Add Course"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* Extra section: lessons preview (animated cards) */}
            <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Example card */}
              <article className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Intro to HTML</h4>
                    <p className="text-sm text-gray-500">5 lessons</p>
                  </div>
                </div>
              </article>
              {/* Add new lesson small card */}
              <article className="bg-gray-100 rounded-2xl border-dashed border-2 border-gray-200 p-6 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </article>
            </section>
          </div>
          {/* Aside (right) - becomes top drawer on mobile */}
          <aside id="aside" className="lg:col-span-3">
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-4 fade-in">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium">My Course</h3>
                  <div className="text-xs text-gray-400">▾</div>
                </div>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <Link
                    to="/category"
                    className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    Category
                  </Link>
                  <Link className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
                    Course
                  </Link>
                  <Link className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
                    Lesson
                  </Link>
                  <Link className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
                    Quize
                  </Link>
                  <Link className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
                    Back
                  </Link>
                </div>

                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium">Featured</h4>
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 flex gap-3 items-center">
                    <div className="w-12 h-12 bg-white rounded shadow flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">
                        Github Webhooks for Beginners
                      </div>
                      <div className="text-xs text-yellow-500">★★★★★</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Form;
