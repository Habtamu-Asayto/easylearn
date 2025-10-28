// Import from the env
const api_url = "http://localhost:8080";

// A function to send post request to create a new User
const createCourse = async (formData, loggedInUserToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/add-course`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
}; // A function to send post request to create a new User

// A function to send post request to create a new User
const createOverview = async (formData, loggedInUserToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/add-overview`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

// A function to send post request to create a new User
const updateOverview = async (formData, loggedInUserToken) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/add-overview`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
}; // A function to send post request to create a new User

// A function to send post request to create a new User
const updateCourse = async (id, formData, loggedInUserToken) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(
    `${api_url}/api/add-course/${id}`,
    requestOptions
  );
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

const getAllCourses = async (token) => {
  // console.log(token);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/courses`, requestOptions);
  return response;
};

const deleteCourse = async (id, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/courses/${id}`, requestOptions);
  // Check if response is JSON first
  let data;
  try {
    data = await response.json();
  } catch (err) {
    // If backend didn't return JSON (e.g., 500 error), return a fallback
    console.error("Failed to parse JSON:", err);
    return { status: false, error: "Server returned invalid response" };
  }
  return data;
};

// const deleteLesson = async (id, token) => {
//   const requestOptions = {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-access-token": token,
//     },
//   };
//   const response = await fetch(`${api_url}/api/lesson/${id}`, requestOptions);
//   // Check if response is JSON first
//   let data;
//   try {
//     data = await response.json();
//   } catch (err) {
//     // If backend didn't return JSON (e.g., 500 error), return a fallback
//     console.error("Failed to parse JSON:", err);
//     return { status: false, error: "Server returned invalid response" };
//   }
//   return data;
// };
const deleteChapter= async (id, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/chapter/${id}`, requestOptions);
  // Check if response is JSON first
  let data;
  try {
    data = await response.json();
  } catch (err) {
    // If backend didn't return JSON (e.g., 500 error), return a fallback
    console.error("Failed to parse JSON:", err);
    return { status: false, error: "Server returned invalid response" };
  }
  return data;
};

// A function to send post request to create a new User
const createChapter = async (formData, loggedInUserToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/add-chapter`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

const getChaptersByCourse = async (courseId, token) => {
  const response = await fetch(`${api_url}/api/chapter/${courseId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch chapters");

  return response.json();
};

const updateChapter = async (chapterId, chapterData, token) => {
  const response = await fetch(`${api_url}/api/chapter/${chapterId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(chapterData),
  });

  return response.json();
};

// A function to send post request to create a new User
const createQuiz = async (formData, loggedInUserToken) => {
  console.log("Creating Quiz...", formData);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/add-quiz`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

// Lesson
const getLessonsByChapter = async (courseId, chapterId, token) => {
  const response = await fetch(`${api_url}/api/lessons/${courseId}/${chapterId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch lessons");

  return response.json();
};
const deleteLesson = async (id, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/lesson/${id}`, requestOptions);
  // Check if response is JSON first
  let data;
  try {
    data = await response.json();
  } catch (err) {
    // If backend didn't return JSON (e.g., 500 error), return a fallback
    console.error("Failed to parse JSON:", err);
    return { status: false, error: "Server returned invalid response" };
  }
  return data;
};
// A function to send post request to create a new User
const createLesson = async (formData, loggedInUserToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/add-lesson`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};
const updateLesson = async (lessonId, lessonData, token) => {
  const response = await fetch(`${api_url}/api/lesson/${lessonId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(lessonData),
  });

  return response.json();
};

const getQuizesByChapter = async (chapterId, token) => {
  try {
    const response = await fetch(`${api_url}/api/quize/${chapterId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Quiz fetch failed:", response.status, text);
      throw new Error("Failed to fetch quize");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return { status: false, data: [] };
  }
};

const courseService = {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  createOverview,
  updateOverview,
  getChaptersByCourse,
  createChapter,
  deleteChapter,
  updateChapter,
  createQuiz,
  getLessonsByChapter,
  createLesson,
  deleteLesson,
  updateLesson,
  getQuizesByChapter,
};
export default courseService;
