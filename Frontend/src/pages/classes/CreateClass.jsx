// pages/classes/CreateClass.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';

const CreateClass = () => {
  // State for class information
  const [classData, setClassData] = useState({
    name: '',
    standard: '',
    section: '',
    academicYear: new Date().getFullYear().toString(),
    subjects: [],
    assignedTeachers: {}, // { subjectId: teacherId }
    enrolledStudents: []
  });
  
  // State for available data
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [isTeacherSearchOpen, setIsTeacherSearchOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_backendURL;
  
  // Initialize available subjects
  useEffect(() => {
    setAvailableSubjects([
      { id: 'hindi', name: 'Hindi' },
      { id: 'english', name: 'English' },
      { id: 'mathematics', name: 'Mathematics' },
      { id: 'science', name: 'Science' },
      { id: 'social_science', name: 'Social Science' },
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'biology', name: 'Biology' },
      { id: 'computer_science', name: 'Computer Science' },
      { id: 'physical_education', name: 'Physical Education' }
    ]);
  }, []);
  
  // Fetch teachers and students on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        // Fetch teachers
        const teachersResponse = await axios.get(`${backendURL}/teacher/all`);
        setAvailableTeachers(teachersResponse.data.data || []);
        
        // Fetch students
        const studentsResponse = await axios.get(`${backendURL}/student/all`);
        setAvailableStudents(studentsResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load teacher and student data. Please try again later.');
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [backendURL]);
  
  // Filter teachers based on search query
  useEffect(() => {
    if (teacherSearchQuery.trim() === '') {
      setFilteredTeachers(availableTeachers);
    } else {
      const query = teacherSearchQuery.toLowerCase();
      const filtered = availableTeachers.filter(teacher => 
        teacher.fullName.toLowerCase().includes(query) || 
        teacher.employeeId.toLowerCase().includes(query) ||
        (teacher.subjects && teacher.subjects.some(subject => 
          subject.toLowerCase().includes(query)))
      );
      setFilteredTeachers(filtered);
    }
  }, [teacherSearchQuery, availableTeachers]);
  
  // Filter students based on search query
  useEffect(() => {
    if (studentSearchQuery.trim() === '') {
      setFilteredStudents(availableStudents);
    } else {
      const query = studentSearchQuery.toLowerCase();
      const filtered = availableStudents.filter(student => 
        student.fullName.toLowerCase().includes(query) || 
        student.admissionNumber.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [studentSearchQuery, availableStudents]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubjectToggle = (subjectId) => {
    setClassData(prev => {
      if (prev.subjects.includes(subjectId)) {
        // Remove subject
        const updatedSubjects = prev.subjects.filter(id => id !== subjectId);
        const updatedTeachers = { ...prev.assignedTeachers };
        delete updatedTeachers[subjectId];
        
        return {
          ...prev,
          subjects: updatedSubjects,
          assignedTeachers: updatedTeachers
        };
      } else {
        // Add subject
        return {
          ...prev,
          subjects: [...prev.subjects, subjectId]
        };
      }
    });
  };
  
  const openTeacherSearch = (subjectId) => {
    setCurrentSubject(subjectId);
    setIsTeacherSearchOpen(true);
    setTeacherSearchQuery('');
  };
  
  const assignTeacher = (teacherId) => {
    setClassData(prev => ({
      ...prev,
      assignedTeachers: {
        ...prev.assignedTeachers,
        [currentSubject]: teacherId
      }
    }));
    setIsTeacherSearchOpen(false);
  };
  
  const removeTeacher = (subjectId) => {
    setClassData(prev => {
      const updatedTeachers = { ...prev.assignedTeachers };
      delete updatedTeachers[subjectId];
      
      return {
        ...prev,
        assignedTeachers: updatedTeachers
      };
    });
  };
  
  const toggleStudent = (studentId) => {
    setClassData(prev => {
      if (prev.enrolledStudents.includes(studentId)) {
        // Remove student
        return {
          ...prev,
          enrolledStudents: prev.enrolledStudents.filter(id => id !== studentId)
        };
      } else {
        // Add student
        return {
          ...prev,
          enrolledStudents: [...prev.enrolledStudents, studentId]
        };
      }
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!classData.name.trim()) {
      newErrors.name = 'Class name is required';
    }
    
    if (!classData.standard) {
      newErrors.standard = 'Standard is required';
    }
    
    if (!classData.section) {
      newErrors.section = 'Section is required';
    }
    
    if (classData.subjects.length === 0) {
      newErrors.subjects = 'At least one subject must be selected';
    }
    
    const hasUnassignedSubjects = classData.subjects.some(
      subjectId => !classData.assignedTeachers[subjectId]
    );
    
    if (hasUnassignedSubjects) {
      newErrors.teachers = 'All subjects must have assigned teachers';
    }
    
    if (classData.enrolledStudents.length === 0) {
      newErrors.students = 'At least one student must be enrolled';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Format data for backend
      const classPayload = {
        name: classData.name,
        standard: classData.standard,
        section: classData.section,
        academicYear: classData.academicYear,
        subjects: classData.subjects.map(subjectId => ({
          id: subjectId,
          teacherId: classData.assignedTeachers[subjectId]
        })),
        students: classData.enrolledStudents
      };
      
      const response = await axios.post(`${backendURL}/class/create`, classPayload);
      
      setSuccess('Class created successfully!');
      
      // Redirect after a brief delay
      setTimeout(() => {
        if (response.data.data && response.data.data.id) {
          navigate(`/classes/${response.data.data.id}`);
        } else {
          navigate('/classes');
        }
      }, 1500);
    } catch (err) {
      console.error('Error creating class:', err);
      if (err.response && err.response.status === 409) {
        setError('A class with the same standard, section, and academic year already exists.');
      } else {
        setError('Failed to create class. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const standardOptions = [
    { value: '', label: 'Select Standard' },
    { value: '1', label: 'Standard 1' },
    { value: '2', label: 'Standard 2' },
    { value: '3', label: 'Standard 3' },
    { value: '4', label: 'Standard 4' },
    { value: '5', label: 'Standard 5' },
    { value: '6', label: 'Standard 6' },
    { value: '7', label: 'Standard 7' },
    { value: '8', label: 'Standard 8' },
    { value: '9', label: 'Standard 9' },
    { value: '10', label: 'Standard 10' },
    { value: '11', label: 'Standard 11' },
    { value: '12', label: 'Standard 12' }
  ];
  
  const sectionOptions = [
    { value: '', label: 'Select Section' },
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' },
    { value: 'D', label: 'Section D' }
  ];
  
  // Function to get teacher name by ID
  const getTeacherName = (teacherId) => {
    const teacher = availableTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.fullName : 'Unknown Teacher';
  };
  
  // Function to get subject name by ID
  const getSubjectName = (subjectId) => {
    const subject = availableSubjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-500">Loading data...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#f5f7ff] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="Create New Class" 
          subtitle="Set up a new class with subjects, teachers, and students"
        />
        
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}
        
        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 py-6 px-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
            <h1 className="text-2xl font-bold text-white">Class Management</h1>
            <p className="text-blue-100 mt-1">Create and assign teachers to classes with subjects</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Class Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Class Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={classData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Class VIII-A"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Standard <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="standard"
                    value={classData.standard}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.standard ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    {standardOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.standard && <p className="text-red-500 text-xs mt-1">{errors.standard}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="section"
                    value={classData.section}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.section ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    {sectionOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={classData.academicYear}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                    placeholder="e.g., 2024-2025"
                  />
                </div>
              </div>
            </div>
            
            {/* Subjects & Teachers Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Subjects & Teachers Assignment
              </h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Select subjects for this class and assign teachers to each subject:
                </p>
                
                {errors.subjects && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{errors.subjects}</p>
                  </div>
                )}
                
                {errors.teachers && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{errors.teachers}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableSubjects.map(subject => (
                    <div
                      key={subject.id}
                      className={`relative flex flex-col p-4 border rounded-lg transition-all ${
                        classData.subjects.includes(subject.id)
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`subject-${subject.id}`}
                            checked={classData.subjects.includes(subject.id)}
                            onChange={() => handleSubjectToggle(subject.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`subject-${subject.id}`}
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            {subject.name}
                          </label>
                        </div>
                        
                        {classData.subjects.includes(subject.id) && (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              classData.assignedTeachers[subject.id]
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {classData.assignedTeachers[subject.id]
                              ? 'Assigned'
                              : 'Unassigned'}
                          </span>
                        )}
                      </div>
                      
                      {classData.subjects.includes(subject.id) && (
                        <div className="mt-2 flex items-center">
                          {classData.assignedTeachers[subject.id] ? (
                            <>
                              <div className="flex-grow">
                                <p className="text-sm text-gray-600">Teacher:</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {getTeacherName(classData.assignedTeachers[subject.id])}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeTeacher(subject.id)}
                                className="text-xs text-red-600 hover:text-red-800 ml-2"
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openTeacherSearch(subject.id)}
                              className="w-full py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                            >
                              + Assign Teacher
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Student Enrollment Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Student Enrollment
              </h2>
              
              <div className="mb-4">
                <div className="flex items-center bg-white border border-gray-300 rounded-md mb-4">
                  <div className="flex items-center pl-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search students by name or admission number..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full py-2 px-3 border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
                
                {errors.students && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{errors.students}</p>
                  </div>
                )}
                
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">
                        Available Students ({filteredStudents.length})
                      </h3>
                      <p className="text-xs text-gray-500">
                        Selected: {classData.enrolledStudents.length} students
                      </p>
                    </div>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Select
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Admission No.
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student Name
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Current Standard
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map(student => (
                            <tr 
                              key={student.id}
                              className={classData.enrolledStudents.includes(student.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                            >
                              <td className="px-4 py-3 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={classData.enrolledStudents.includes(student.id)}
                                  onChange={() => toggleStudent(student.id)}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.admissionNumber}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                {student.fullName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                Standard {student.standard}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-gray-500 text-sm">No students found matching your search criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/classes')}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md shadow-sm ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Class'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Teacher Search Modal */}
      {isTeacherSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Assign Teacher to {getSubjectName(currentSubject)}
                </h3>
                <button
                  onClick={() => setIsTeacherSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md">
                  <div className="flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search teachers by name, ID or subject..."
                    value={teacherSearchQuery}
                    onChange={(e) => setTeacherSearchQuery(e.target.value)}
                    className="w-full py-2 px-3 border-0 bg-transparent focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(80vh-10rem)]">
                {filteredTeachers.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredTeachers.map(teacher => {
                      // Check if teacher teaches the current subject
                      const teachesSubject = teacher.subjects && 
                        teacher.subjects.some(s => 
                          s.toLowerCase() === getSubjectName(currentSubject).toLowerCase()
                        );
                      
                      return (
                        <div 
                          key={teacher.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            teachesSubject ? 'border-l-4 border-green-400' : ''
                          }`}
                          onClick={() => assignTeacher(teacher.id)}
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{teacher.fullName}</p>
                              <p className="text-xs text-gray-500">ID: {teacher.employeeId}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {teacher.subjects?.join(', ') || 'No subjects listed'}
                              </p>
                              {teachesSubject && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                  Teaches {getSubjectName(currentSubject)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 text-sm">No teachers found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTeacherSearchOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Class Summary (Appears when form is partially filled) */}
      {(classData.subjects.length > 0 || classData.enrolledStudents.length > 0) && (
        <div className="fixed bottom-0 right-0 m-6">
          <button
            type="button"
            onClick={() => {
              const summary = document.getElementById('class-summary');
              if (summary) {
                summary.classList.toggle('translate-y-full');
                summary.classList.toggle('opacity-0');
              }
            }}
            className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          
          <div 
            id="class-summary"
            className="fixed bottom-0 right-0 mb-16 mr-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 transform translate-y-full opacity-0 transition-all duration-300"
          >
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <h3 className="font-medium text-blue-800">Class Summary</h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Class Details:</h4>
                  <p className="text-sm text-gray-600">
                    {classData.name || 'Unnamed'} | Standard {classData.standard || '--'}-{classData.section || '--'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Subjects & Teachers:</h4>
                  {classData.subjects.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {classData.subjects.map(subjectId => (
                        <li key={subjectId} className="flex justify-between items-center">
                          <span className="text-gray-600">{getSubjectName(subjectId)}</span>
                          {classData.assignedTeachers[subjectId] ? (
                            <span className="text-green-600">{getTeacherName(classData.assignedTeachers[subjectId]).split(' ')[0]}</span>
                          ) : (
                            <span className="text-red-500">Unassigned</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No subjects selected</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Students Enrolled:</h4>
                  <p className="text-sm text-gray-600">{classData.enrolledStudents.length} students selected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateClass;