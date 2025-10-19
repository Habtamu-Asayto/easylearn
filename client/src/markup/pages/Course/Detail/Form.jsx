import Footer from "../../../components/Footer/Footer";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import categoryService from "../../../../services/coursecategory.service";
import courseService from "../../../../services/course.service";
import { toast } from "react-toastify";
import { motion, AnimatePresence, time } from "framer-motion";
import ToggleButton from "../../../components/Toggle/ToggleButton";
import { format, formatDistanceToNow } from "date-fns";
import ExpandableLessons from "../Lesson/LessonCard";
import Instructor from "../About/Instructor";

function Form({ editCourse, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  // Subtract Current time with updated time
  const overviewUpdated = editCourse?.overview?.updated_at
    ? formatDistanceToNow(new Date(editCourse.overview.updated_at), {
        addSuffix: true,
      })
    : "N/A";

  const courseUpdated = editCourse?.updated_at
    ? formatDistanceToNow(new Date(editCourse.updated_at), { addSuffix: true })
    : "N/A";
  // Fetch All categories
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(true);

  // const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    editCourse ? String(editCourse.category_id) : ""
  );

  const [title, setTitle] = useState(editCourse?.title || "");
  const [description, setDescription] = useState(editCourse?.description || "");
  const [categoryId, setCategoryId] = useState(editCourse?.category_id || "");

  // const [skill, setSkill] = useState(editCourse?.required_skill || "");
  // const [duration, setDuration] = useState(editCourse?.duration || "");
  // const [certificate, setCertificate] = useState(false);
  // const [detail, setDetail] = useState(editCourse?.overview_detail || "");

  const [duration, setDuration] = useState(
    editCourse?.overview?.duration || ""
  );
  const [skill, setSkill] = useState(
    editCourse?.overview?.required_skill || ""
  );
  const [detail, setDetail] = useState(
    editCourse?.overview?.overview_detail || ""
  );
  const [certificate, setCertificate] = useState(
    editCourse?.overview?.certificate || false
  );

  // Errors
  const [skillError, setSkillError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [detailError, setDetailError] = useState("");
  // Error
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState([]);
  const [categoryError, setCategoryError] = useState([]);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  // Errors of Lesson
  const [lessonTitleError, setLessonTitleError] = useState([]);
  const [contentError, setContentError] = useState([]);
  const [videoURLError, setVideoURLError] = useState([]);

  const { user } = useAuth();

  let token = null;
  if (user) {
    token = user.user_token;
  }
  // console.log(token);
  const [hasOverview, setHasOverview] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("");
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

    if (!editCourse?.overview?.overview_id) {
      setButtonLabel("Add Overview");
    } else {
      setButtonLabel("Update Overview");
    }

    // When page refresh the form removed
    lessons.forEach((_, i) => handleRemoveLesson(i));
  }, []);

  const handleSubmitOverview = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!skill) {
      setSkillError("Skill is required");
      valid = false;
    } else setSkillError("");

    if (!duration) {
      setDurationError("Duration is required");
      valid = false;
    } else setDurationError("");

    if (!detail) {
      setDetailError("Overview detail is required");
      valid = false;
    } else setDetailError("");

    if (!valid) return;

    let response;
    const formData = {
      detail,
      skill,
      duration,
      course_id: editCourse?.course_id ?? null,
      certificate: certificate ?? false,
    };

    try {
      if (!!editCourse?.overview?.overview_id) {
        console.log("Updating overview...");
        response = await courseService.updateOverview(formData, token);
        toast.success("Overview updated successfully!");
      } else {
        console.log("Creating overview...");
        response = await courseService.createOverview(formData, token);
        toast.success("Overview created successfully!");
      }
      setTimeout(() => {
        // const newCourseId = response.data?.course_id; // adjust based on your backend response
        window.location.href = `/courses`;
      }, 1500);
    } catch (err) {
      console.error("Overview submit error:", err);
      toast.error("Something went wrong while saving the overview");
    }
  };

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
          // window.location.href = `/course-detail/:${course_id}`;
          window.location.href = `/courses`;
        }, 1500);
      }
    } catch (err) {
      // console.error(err);
      toast.error("Something went wrong");
    }
  };

  //   Tab started
  const tabs = ["Course detail", "Overview", "Lessons", "Instructor"];
  const [activeTab, setActiveTab] = useState("Course detail");

  // Hooks for Add and remove form
  const [lessons, setLessons] = useState([
    {
      course_id: editCourse.course_id,
      lesson_title: "",
      content: "",
      video_url: "",
    },
  ]);

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      {
        course_id: editCourse.course_id,
        lesson_title: "",
        content: "",
        video_url: "",
      },
    ]);
    setIsOpen(true);
  };

  // Remove a form row
  const handleRemoveLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
    if (lessons.length === 1) {
      setIsOpen(false);
    }
  };

  // Update form values
  const handleChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const handleSubmitLesson = async (e) => {
    e.preventDefault();
    let valid = true;
    // Reset errors
    const titleErrors = [];
    const contentErrors = [];
    lessons.forEach((lesson, index) => {
      if (!lesson.lesson_title.trim()) {
        titleErrors[index] = `Lesson ${index + 1}: Title is required`;
        valid = false;
      }
      if (!lesson.content.trim()) {
        contentErrors[index] = `Lesson ${index + 1}: Content is required`;
        valid = false;
      }

      //  if (lesson.video_url && !/^https?:\/\/\S+$/.test(lesson.video_url)) {
      //    videoErrors[index] = `Lesson ${index + 1}: Video URL must be valid`;
      //    valid = false;
      //  }
    });

    setLessonTitleError(titleErrors);
    setContentError(contentErrors);

    if (!valid) return; // Stop submission if any lesson is invalid
    try {
      // const payload = { lessons };
      const res = await courseService.createLesson(lessons, token);

      if (res.status) {
        toast.success("Lessons added successfully!");
        // Reset all lessons after success
        setLessons([]);
        setTimeout(() => (window.location.href = `/courses`), 1200);
      } else {
        toast.error(res.error || "Failed to add lessons");
      }
    } catch (err) {
      console.error("Error creating lessons:", err);
      toast.error("Server error while adding lessons");
    }
  };
  const instructorData = {
    name: "Habtamu Asayto",
    title: "Senior React Instructor",
    bio: "Has 10+ years of experience teaching web development and loves making complex topics simple.",
    profilePicture: "../../../../assets/images/photo.jpg", 
    linkedin: "https://linkedin.com/in/habtamu-takele",
    email: "habtamuasayto360@gmail.com",
  };
  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor area (center) */}
            <div className="lg:col-span-9">
              <div className="bg-gray-50 overflow-hidden fade-in">
                <div className="flex items-center border-b border-gray-200 px-4 sm:px-6 py-3 gap-3 bg-white">
                  {serverError && (
                    <div
                      className="text-red-600 text-sm mb-2 mt-2"
                      role="alert"
                    >
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
                </div>
                {/* Editor body */}
                <div className="p-4 sm:p-6">
                  <form className="space-y-4" onSubmit={handleSubmitOverview}>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Required Skill
                      </label>
                      <input
                        type="text"
                        placeholder="Required skills"
                        name="required_skill"
                        id="required_skill"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        className="mt-2 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      {skillError && (
                        <div className="text-red-600 text-sm mt-1" role="alert">
                          {skillError}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="Insert Duration"
                        name="duration"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="mt-2 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      {durationError && (
                        <div className="text-red-600 text-sm mt-1" role="alert">
                          {durationError}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Overview Detail
                      </label>
                      {/* toolbar (visual only) */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="ml-2 text-xs text-gray-400">
                          Simple editor (placeholder)
                        </div>
                      </div>
                      <textarea
                        rows={8}
                        name="overview_detail"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        className="w-full bg-white rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="Write overview detail..."
                      />
                      {detailError && (
                        <div className="text-red-600 text-sm mt-1" role="alert">
                          {detailError}
                        </div>
                      )}
                    </div>

                    <div>
                      <ToggleButton
                        initialState={!!editCourse?.overview?.certificate}
                        value={certificate}
                        onChange={setCertificate}
                        label="Have it certificate ?"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Last saved:
                        <span className="text-gray-700 font-medium">
                          {overviewUpdated}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                          {buttonLabel}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <aside id="aside" className="lg:col-span-3">
              <div className="lg:sticky lg:top-6">
                <div className="bg-white rounded shadow-sm border border-gray-100 p-4 fade-in">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium">Course overview</h3>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <Link
                      to="/category"
                      className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex">
                        <p className="font-bold">Skill level : </p>
                        <h1 className="ml-1">
                          {editCourse.overview?.required_skill || "No"}
                        </h1>
                      </div>
                    </Link>
                    <Link className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
                      <div className="flex">
                        <p className="font-bold">Duration : </p>
                        <h1 className="ml-1">
                          {editCourse.overview?.duration}
                        </h1>
                      </div>
                    </Link>
                    <Link className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
                      <div className="flex">
                        <p className="font-bold">Certificate :</p>
                        <h1 className="ml-1">
                          {editCourse.overview?.certificate ? "Yes" : "No"}
                        </h1>
                      </div>
                    </Link>
                    <Link className="block w-full py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
                      <div className="flex">
                        <p className="font-bold">Quize :</p>
                        <h1 className=""></h1>
                      </div>
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
        );
      case "Course detail":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor area (center) */}
            <div className="lg:col-span-9">
              <div className="bg-gray-50 overflow-hidden fade-in">
                {/* Tabs */}

                <div className="flex items-center border-b border-gray-200 px-4 sm:px-6 py-3 gap-3 bg-white">
                  {serverError && (
                    <div
                      className="text-red-600 text-sm mb-2 mt-2"
                      role="alert"
                    >
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
                        className="mt-2 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                        className="mt-2 bg-white block w-full rounded-lg border border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                        className="w-full bg-white rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
                          {courseUpdated}
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
            </div>
          </div>
        );
      case "Lessons":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor area (center) */}
            <div className="lg:col-span-9">
              <div className="bg-gray-50 overflow-hidden fade-in">
                <ExpandableLessons
                  courseId={editCourse?.course_id}
                  token={token}
                />
                <div className="flex items-center border-b border-gray-200 px-4 sm:px-6 py-3 gap-3 bg-white">
                  {serverError && (
                    <div
                      className="text-red-600 text-sm mb-2 mt-2"
                      role="alert"
                    >
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
                </div>
                {/* Editor body */}
                <div className="p-4 sm:p-6">
                  <form onSubmit={handleSubmitLesson} className="space-y-4">
                    <AnimatePresence>
                      {lessons.map((lesson, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className=" sm:flex-row items-center gap-4 w-full p-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Lesson Title
                            </label>
                            <input
                              type="lesson_title"
                              placeholder="Lesson Title"
                              value={lesson.lesson_title}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "lesson_title",
                                  e.target.value
                                )
                              }
                              className="mt-2 mb-1 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />

                            {lessonTitleError[index] && (
                              <div
                                className="text-red-600 text-sm"
                                role="alert"
                              >
                                {lessonTitleError[index]}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-600 mt-3">
                              Lesson Content
                            </label>
                            <textarea
                              rows={7}
                              type="content"
                              placeholder="Content"
                              value={lesson.content}
                              onChange={(e) =>
                                handleChange(index, "content", e.target.value)
                              }
                              className="mt-2 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                            {contentError[index] && (
                              <div
                                className="text-red-600 text-sm mt-1"
                                role="alert"
                              >
                                {contentError[index]}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-600 mt-4">
                              Video URL
                            </label>
                            <input
                              type="video_url"
                              placeholder="Video URL"
                              value={lesson.video_url}
                              onChange={(e) =>
                                handleChange(index, "video_url", e.target.value)
                              }
                              className="mt-2 mb-4 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                          <hr className="border-gray-300 mt-3 mb-3" />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-6">
                      <button
                        type="button"
                        onClick={handleAddLesson}
                        className="flex px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        + Add Lesson
                      </button>
                      {isOpen && (
                        <button
                          type="submit"
                          className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Submit Lesson
                        </button>
                      )}
                    </div>
                    {/* <Quiz />   */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      case "Instructor":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor area (center) */}
            <div className="lg:col-span-9 p-5">
              <Instructor instructor={instructorData} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
        <h2 className="text-xl font-semibold text-dark">Course Detail</h2>
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
      {/* Main Content */}
      <main className="p-6">
        {/* Tab Area */}
        <div className="w-full mx-auto mt-8 p-4 bg-white rounded-xl shadow ">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer flex-1 py-2 text-center font-medium transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-500 "
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Form;
