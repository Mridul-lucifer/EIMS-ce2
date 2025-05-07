// pages/classes/ClassDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const backendURL = import.meta.env.VITE_backendURL;
  
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch class details
        const classResponse = await axios.get(`${backendURL}/class/${id}`);
        setClassData(classResponse.data.data);
        
        // Fetch subjects with teacher assignments
        const subjectsResponse = await axios.get(`${backendURL}/class/${id}/subjects`);
        setSubjects(subjectsResponse.data.data || []);
        
        // Fetch enrolled students
        const studentsResponse = await axios.get(`${backendURL}/class/${id}/students`);
        setStudents(studentsResponse.data.data || []);
        
      } catch (err) {
        console.error('Error fetching class details:', err);
        setError('Failed to load class details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClassDetails();
  }, [id, backendURL]);
  
  const handleDelete = async () => {
    try {
      await axios.delete(`${backendURL}/class/${id}`);
      navigate('/classes');
    } catch (err) {
      console.error('Error deleting class:', err);
      setError('Failed to delete class. Please try again later.');
      setDeleteDialog(false);
    }
  };
  
  const subjectNames = {
    hindi: 'Hindi',
    english: 'English',
    mathematics: 'Mathematics',
    science: 'Science',
    social_science: 'Social Science',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    computer_science: 'Computer Science',
    physical_education: 'Physical Education',
  };
  
  const getSubjectName = (subjectId) => {
    return subjectNames[subjectId] || subjectId;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
        <p className="ml-2 text-gray-500">Loading class details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <Alert type="error" message={error} />
      </div>
    );
  }
  
  if (!classData) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <Alert type="error" message="Class not found." />
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Class Details" 
        subtitle={`${classData.name} (${classData.academicYear})`}
      />
      
      <div className="flex justify-end mb-6 space-x-4">
        <Link
          to={`/classes/edit/${id}`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit Class
        </Link>
        <button
          onClick={() => setDeleteDialog(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Class
        </button>
      </div>
      
      {/* Class Details Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{classData.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Standard {classData.standard}-{classData.section} | {classData.academicYear}
              </p>
            </div>
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-bold text-xl">
                {classData.standard}-{classData.section}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Class name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{classData.name}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Standard & Section</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Standard {classData.standard}-{classData.section}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{classData.academicYear}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Number of Students</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{students.length}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Number of Subjects</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subjects.length}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Subjects & Teachers Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Subjects & Assigned Teachers</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {subjects.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {subjects.map((subject, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 font-medium">
                          {getSubjectName(subject.subjectId).substring(0, 2)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{getSubjectName(subject.subjectId)}</div>
                        <div className="text-sm text-gray-500">
                          <Link to={`/teachers/${subject.teacherId}`} className="text-blue-600 hover:text-blue-900">
                            {subject.teacherName}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>ID: {subject.employeeId}</div>
                      <div>{subject.teacherEmail}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 italic">
              No subjects assigned to this class.
            </div>
          )}
        </div>
      </div>
      
      {/* Students Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Enrolled Students</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission No.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.admissionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.mobileNumber ? `+91 ${student.mobileNumber}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/students/${student.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 italic">
              No students enrolled in this class.
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete Class"
        message={`Are you sure you want to delete ${classData.name}? This will remove all teacher assignments and student enrollments for this class. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        type="danger"
      />
    </div>
  );
};

export default ClassDetails;
