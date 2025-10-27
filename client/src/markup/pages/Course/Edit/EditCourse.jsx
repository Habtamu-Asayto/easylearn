import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../Add/Form"; // your form component
import courseService from "../../../../services/course.service";
import { useAuth } from "../../../../Contexts/AuthContext";
import Sidebar from "../../../components/Sidebar/Sidebar";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  let token = user?.user_token;

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseService.getAllCourses(token);
        const data = await res.json();
        const course = data.data.find((c) => c.course_id === parseInt(id));
        if (!course) {
          alert("Course not found");
          navigate("/courses");
        } else {
          setCourseData(course);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          {courseData && (
            <Form
              editCourse={courseData}
              onSuccess={() => navigate("/courses")}
            />
          )}
        </div>
      );
    }
  }
}

export default EditCourse;
