import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import bg from "../../../assets/images/login-bg.jpg";
import { useAuth } from "../../../Contexts/AuthContext";
import { toast } from "react-toastify";
import newsService from "../../../services/news.services";
function AnnouncementList() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("All");

  //   Error
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [audienceError, setAudienceError] = useState("");

  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [news, setNews] = useState([]);

  function showNewsModal() {
    setIsOpen(true);
  }
  const { user } = useAuth();
  let token = null;
  if (user) {
    token = user.user_token;
  }
  // console.log("Token : ", token);

  const user_id = user?.user_id;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsService.displayNews(token);

        if (!res.status) {
          // assuming backend sends { status: true/false }
          setApiError(true);
          setApiErrorMessage(res.error || "Please try again later");
          return;
        }

        if (res.data && res.data.length > 0) {
          setNews(res.data);
        }
      } catch (err) {
        toast.error("Failed to load news");
        console.error(err);
      }
    };

    fetchNews();
  }, [token]);

  const handleAddNews = async (e) => {
    e.preventDefault();
    let value = true;
    if (!title) {
      setTitleError("Annoucement title is required");
      value = false;
    } else {
      setTitleError("");
    }
    if (!body) {
      setBodyError("Annoucement description is required");
      value = false;
    } else {
      setBodyError("");
    }
    if (!audience) {
      setAudienceError("Annoucement audience is required");
      value = false;
    } else {
      setAudienceError("");
    }
    if (!value) return;
    const formData = {
      title,
      body,
      audience,
    };
    try {
      let response;
      response = await newsService.createNews(formData, token);
      if (!response.status) {
        toast.error(response.error || "News not Inserted ");
      } else {
        toast.success("Announcement Inserted successfully");
        setTimeout(() => {
          window.location.href = "/news";
        }, 1200);
      }
    } catch (e) {
      toast.error(e || "Error occured");
    }
  };
  return (
    <main className="p-2">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Library</h1>
          <p className="text-gray-500 text-sm">
            Browse through thousands of lessons.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View toggle */}
          <div className="flex space-x-2">
            <button
              className="px-5 py-2 border cursor-pointer border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:shadow-md transition"
              onClick={showNewsModal}
            >
              Add Annoucement
            </button>
          </div>
        </div>
      </div>
      {/* Add News modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-[55rem] max-h-[100vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4  ">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  Add Announcement
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 transition-colors duration-200 p-1 hover:text-gray-500 cursor-pointer"
                  title="Close"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddNews}>
                <div>
                  <label> Title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2"
                  />
                  {titleError && (
                    <div className="text-red-600 text-sm" role="alert">
                      {titleError}
                    </div>
                  )}
                </div>
                <div>
                  <label> Message</label>
                  <textarea
                    rows={5}
                    type="text"
                    id="body"
                    placeholder="Announcement"
                    name="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full border mt-1 mb-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2"
                  />
                  {bodyError && (
                    <div className="text-red-600 text-sm" role="alert">
                      {bodyError}
                    </div>
                  )}
                  <br />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Audience
                  </label>
                  <select
                    id="audience"
                    name="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full border mt-1 border-gray-400 focus:border-blue-400 focus:outline-none rounded px-3 py-2"
                  >
                    <option value="">Select audience</option>
                    <option value="All">All</option>
                    <option value="Instructors">Instructors</option>
                    <option value="Students">Students</option>
                  </select>
                  {audienceError && (
                    <div className="text-red-600 text-sm" role="alert">
                      {audienceError}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-7">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : news.length > 0 ? (
        news.map((cat, index) => (
          <>
            <div key={cat.news_id} className="max-w-6xl mx-auto px-4 space-y-4">
              <div className="bg-white rounded shadow hover:shadow-lg transition">
                <div className="flex flex-col sm:flex-row">
                  {/* Icon */}
                  <div className="flex-1 items-center justify-center sm:w-40 h-32 sm:h-auto">
                    <img src={bg} />
                  </div>
                  {/* Content */}
                  <div className="flex-2">
                    <div className="p-5">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {cat.title}
                      </h2>
                      {/* Rating */}
                      <div className="flex items-center space-x-1 text-yellow-500">
                        {cat.body}
                      </div>
                      {/* Description */}
                      <p className="text-sm text-gray-600">{cat.body}</p>
                      {/* Instructor */}
                      <div className="mt-3 flex items-center space-x-2 border-t pt-3">
                        <img
                          src="https://i.pravatar.cc/30"
                          alt="Instructor"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {cat.body}
                          </p>
                          <p className="text-xs text-gray-500">Instructor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br /> 
          </>
        ))
      ) : (
        <h4 className="font-medium">Empty</h4>
      )}
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
  );
}

export default AnnouncementList;
