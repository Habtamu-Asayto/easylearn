// Import the necessary components
import React, { useState, useEffect } from "react";
// Import the auth hook
import { useAuth } from "../../../contexts/AuthContext.jsx";
// Import the date-fns library
import { format } from "date-fns"; // To properly format the date on the table
// Import the getAllUsers function
import studentService from "../../../services/user.service.js";
import AddStudent from "../Modal/AddStudent.jsx";

const StudentTable = () => {
  // Create all the states we need to store the data
  // Create the student state to store the student data
  const index = 0;
  const [students, setStudents] = useState([]);
  // A state to serve as a flag to show the error message
  const [apiError, setApiError] = useState(false);
  // A state to store the error message
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  // To get the logged in stu token
  const { user } = useAuth();
  let token = null; // To store the token
  if (user) {
    token = user.user_token; 
    
  }

  useEffect(() => {
    // Call the getAllStudents function
    const allStudents = studentService.getAllStudents(token);
    allStudents
      .then((res) => {
        console.log(res);
        
        if (!res.ok) {
        //   console.log("Here is: "+res.status);
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
          setStudents(data.data);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []); 
// For both add and edit student
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingStudent, setEditingStudent] = useState(null);

const handleAddClick = () => {
  setEditingStudent(null); // reset for new student
  setIsModalOpen(true);
};

const handleEditClick = (student) => {
  setEditingStudent(student);
  setIsModalOpen(true);
};



  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* // <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 overflow-hidden"> */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Student List
              </h2>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                + Add Student
              </button>

              <AddStudent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingStudent={editingStudent}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-left text-gray-700 border-collapse">
                <thead className="bg-gray-100 uppercase text-xs sm:text-sm tracking-wider text-gray-600">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 whitespace-nowrap">#</th>
                    <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      Phone
                    </th>
                    <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      Registered Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={index + 1}
                      className="border-b hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      <td className="px-3 sm:px-6 py-3">{index + 1}</td>
                      <td className="px-3 sm:px-6 py-3 font-medium whitespace-nowrap">
                        {student.user_full_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {student.user_email}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {student.user_phone}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-500 whitespace-nowrap">
                        {format(
                          new Date(student.created_at),
                          "MM-dd-yyyy | HH:mm"
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(student)}
                            className="px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentTable;
