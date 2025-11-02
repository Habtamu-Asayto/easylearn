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
const deleteChapter = async (id, token) => {
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
  const response = await fetch(
    `${api_url}/api/lessons/${courseId}/${chapterId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    }
  );

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

const getQuizesByChapter2 = async (chapterId, token) => {
  try {
    const response = await fetch(`${api_url}/api/quize/${chapterId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      console.error("Quiz fetch failed:", result);
      return [];
    }

    return result.data || [];
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return [];
  }
};

const getQuizOptions = async (quizId, token) => {
  try {
    const response = await fetch(`${api_url}/api/options/${quizId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      console.error("Quiz option fetch failed:", result);
      return [];
    }

    return result.data || [];
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return [];
  }
};

const saveQuizAnswers = async ({
  quiz_id,
  user_id,
  selected_option_id,
  is_correct,
  token,
}) => {
  try {
    const response = await fetch(`${api_url}/api/quiz_answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        quiz_id,
        user_id,
        selected_option_id,
        is_correct,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.status) {
      console.error("Save quiz answer failed:", result);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Error saving quiz answer:", error);
    return null;
  }
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

const completeLesson = async (courseId, lessonId, token) => {
  const response = await fetch(`${api_url}/api/progress/lesson`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ courseId, lessonId }),
  });

  if (!response.ok) throw new Error("Failed to mark lesson complete");
  return response.json();
};

const getCourseProgress = async (courseId, token) => {
  const response = await fetch(`${api_url}/api/progress/${courseId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch progress");
  return response.json();
};

const enrollCourse = async (course_id, token) => {
  try {
    const response = await fetch(`${api_url}/api/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ course_id }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error enrolling course:", error);
    return { status: false, message: "Network error" };
  }
};

const checkEnrollment = async (course_id, token) => {
  try {
    const response = await fetch(
      `${api_url}/api/enrollment-status/${course_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );
    const result = await response.json();
    return result; // should return { enrolled: true/false }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return { enrolled: false };
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
  getQuizesByChapter2,
  createLesson,
  deleteLesson,
  updateLesson,
  getQuizesByChapter,
  getCourseProgress,
  completeLesson,
  getQuizOptions,
  saveQuizAnswers,
  enrollCourse,
  checkEnrollment,
};
export default courseService;
