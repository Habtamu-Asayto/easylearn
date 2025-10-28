import Footer from "../../../components/Footer/Footer";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../Contexts/AuthContext";
import categoryService from "../../../../services/coursecategory.service";
import courseService from "../../../../services/course.service";
import { toast } from "react-toastify";
import { motion, AnimatePresence, time } from "framer-motion";
import ToggleButton from "../../../components/Toggle/ToggleButton";
import { format, formatDistanceToNow } from "date-fns";
import ExpandableChapter from "../Chapter/ChapterCard";
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

  // Errors of Chapter
  const [chapterTitleError, setChapterTitleError] = useState([]);
  const [descriptionContentError, setDescriptionContentError] = useState([]);
  // const [videoURLError, setVideoURLError] = useState([]);

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
    chapters.forEach((_, i) => handleRemoveChapter(i));
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
  const tabs = ["Course detail", "Overview", "Chapters", "Instructor"];
  const [activeTab, setActiveTab] = useState("Course detail");

  // Hooks for Add and remove form
  const [chapters, setChapters] = useState([
    {
      course_id: editCourse.course_id,
      chapter_title: "",
      chapter_description: "",
    },
  ]);

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      {
        course_id: editCourse.course_id,
        chapter_title: "",
        chapter_description: "",
      },
    ]);
    setIsOpen(true);
  };

  // Remove a form row
  const handleRemoveChapter = (index) => {
    setChapters(chapters.filter((_, i) => i !== index));
    if (chapters.length === 1) {
      setIsOpen(false);
    }
  };

  // Update form values
  const handleChange = (index, field, value) => {
    const updated = [...chapters];
    updated[index][field] = value;
    setChapters(updated);
  };

  const handleSubmitChapter = async (e) => {
    e.preventDefault();
    let valid = true;
    // Reset errors
    const titleErrors = [];
    const contentErrors = [];
    chapters.forEach((chapter, index) => {
      if (!chapter.chapter_title.trim()) {
        titleErrors[index] = `Chapter ${index + 1}: Title is required`;
        valid = false;
      }
      if (!chapter.chapter_description.trim()) {
        contentErrors[index] = `Chapter ${index + 1}: description is required`;
        valid = false;
      }

      //  if (lesson.video_url && !/^https?:\/\/\S+$/.test(lesson.video_url)) {
      //    videoErrors[index] = `Lesson ${index + 1}: Video URL must be valid`;
      //    valid = false;
      //  }
    });

    setChapterTitleError(titleErrors);
    setDescriptionContentError(contentErrors);

    if (!valid) return; // Stop submission if any lesson is invalid
    try {
      // const payload = { lessons };
      const res = await courseService.createChapter(chapters, token);

      if (res.status) {
        toast.success("Chapters added successfully!");
        // Reset all lessons after success
        setChapters([]);
        setTimeout(() => (window.location.href = `/courses`), 1200);
      } else {
        toast.error(res.error || "Failed to add chapters");
      }
    } catch (err) {
      console.error("Error creating chapters:", err);
      toast.error("Server error while adding chapters");
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
      case "Chapters":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor area (center) */}
            <div className="lg:col-span-9">
              <div className="bg-gray-50 overflow-hidden fade-in">
                <ExpandableChapter
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
                  <form onSubmit={handleSubmitChapter} className="space-y-4">
                    <AnimatePresence>
                      {chapters.map((chapter, index) => (
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
                              Chapter Title
                            </label>
                            <input
                              type="text"
                              placeholder="Chapter Title"
                              value={chapter.chapter_title}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "chapter_title",
                                  e.target.value
                                )
                              }
                              className="mt-2 mb-1 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />

                            {chapterTitleError[index] && (
                              <div
                                className="text-red-600 text-sm"
                                role="alert"
                              >
                                {chapterTitleError[index]}
                              </div>
                            )}
                          </div>

                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-600 mt-3">
                              Chapter description
                            </label>
                            <textarea
                              rows={7}
                              type="chapter_description"
                              placeholder="Chapter Description"
                              value={chapter.chapter_description}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "chapter_description",
                                  e.target.value
                                )
                              }
                              className="mt-2 block w-full rounded-lg border bg-white border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                            {descriptionContentError[index] && (
                              <div
                                className="text-red-600 text-sm mt-1"
                                role="alert"
                              >
                                {descriptionContentError[index]}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveChapter(index)}
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
                        onClick={handleAddChapter}
                        className="flex px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        + Add Chapter
                      </button>
                      {isOpen && (
                        <button
                          type="submit"
                          className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Submit Chapter
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
