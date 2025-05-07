// pages/teachers/CreateTeacher.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';

const CreateTeacher = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    qualification: '',
    subjects: [],
    designation: '',
    dateOfJoining: '',
    dateOfBirth: '',
    mobileNumber: '',
    address: '',
    aadharNumber: '',
    gender: '',
    experience: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_backendURL;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSubjectsChange = (e) => {
    // Get selected options from multiple select
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      subjects: selectedOptions
    });
    
    if (errors.subjects) {
      setErrors({
        ...errors,
        subjects: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Indian mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await axios.post(`${backendURL}/teacher/create`, formData);
      
      setSuccess('Teacher registered successfully!');
      setFormData({
        fullName: '',
        email: '',
        employeeId: '',
        qualification: '',
        subjects: [],
        designation: '',
        dateOfJoining: '',
        dateOfBirth: '',
        mobileNumber: '',
        address: '',
        aadharNumber: '',
        gender: '',
        experience: ''
      });
      
      // Redirect after a brief delay
      setTimeout(() => {
        if (response.data.data && response.data.data.id) {
          navigate(`/teachers/${response.data.data.id}`);
        } else {
          navigate('/teachers');
        }
      }, 1500);
    } catch (err) {
      console.error('Error creating teacher:', err);
      if (err.response && err.response.status === 409) {
        setError('Employee ID or email already exists. Please use a different one.');
      } else {
        setError('Failed to register teacher. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const designationOptions = [
    { value: '', label: 'Select Designation' },
    { value: 'Principal', label: 'Principal' },
    { value: 'Vice Principal', label: 'Vice Principal' },
    { value: 'Senior Teacher', label: 'Senior Teacher' },
    { value: 'Teacher', label: 'Teacher' },
    { value: 'Junior Teacher', label: 'Junior Teacher' },
    { value: 'Assistant Teacher', label: 'Assistant Teacher' },
    { value: 'Guest Faculty', label: 'Guest Faculty' }
  ];
  
  const subjectOptions = [
    { value: 'Hindi', label: 'Hindi' },
    { value: 'English', label: 'English' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Science', label: 'Science' },
    { value: 'Social Science', label: 'Social Science' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Physical Education', label: 'Physical Education' },
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Sanskrit', label: 'Sanskrit' }
  ];
  
  const qualificationOptions = [
    { value: '', label: 'Select Qualification' },
    { value: 'B.Ed', label: 'B.Ed' },
    { value: 'M.Ed', label: 'M.Ed' },
    { value: 'B.A', label: 'B.A' },
    { value: 'M.A', label: 'M.A' },
    { value: 'B.Sc', label: 'B.Sc' },
    { value: 'M.Sc', label: 'M.Sc' },
    { value: 'B.Tech', label: 'B.Tech' },
    { value: 'M.Tech', label: 'M.Tech' },
    { value: 'Ph.D', label: 'Ph.D' }
  ];
  
  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];
  
  const experienceOptions = [
    { value: '', label: 'Select Experience' },
    { value: '0-2 years', label: '0-2 years' },
    { value: '3-5 years', label: '3-5 years' },
    { value: '5-10 years', label: '5-10 years' },
    { value: '10-15 years', label: '10-15 years' },
    { value: '15+ years', label: '15+ years' }
  ];
  
  return (
    <div className="min-h-screen bg-[#f5f7ff] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <PageHeader 
          title="Register New Teacher" 
          subtitle="Enter teacher information to add to the system"
        />
        
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative bg-gradient-to-r from-green-700 to-green-900 py-6 px-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 border-4 border-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Teacher Registration</h2>
              <p className="text-green-100 text-sm mt-1">Vidya Bhavan School - Excellence in Education Since 1985</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter teacher's full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Employee ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all ${errors.employeeId ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., TCHR2024001"
                />
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                    +91
                  </span>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-r-md focus:ring focus:ring-green-200 transition-all ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                </div>
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Qualification</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                >
                  {qualificationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subjects <span className="text-red-500">*</span></label>
                <select
                  name="subjects"
                  multiple
                  value={formData.subjects}
                  onChange={handleSubjectsChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all ${errors.subjects ? 'border-red-500' : 'border-gray-300'}`}
                  size="3"
                >
                  {subjectOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple subjects</p>
                {errors.subjects && <p className="text-red-500 text-xs mt-1">{errors.subjects}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                >
                  {designationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                >
                  {experienceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                  placeholder="12-digit Aadhar number"
                  maxLength="12"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-700">Residential Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-green-200 transition-all"
                placeholder="Enter complete residential address with PIN code"
              ></textarea>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  className="order-2 sm:order-1 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  onClick={() => navigate('/teachers')}
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  className="order-3 sm:order-2 px-6 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-100 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  onClick={() => setFormData({
                    fullName: '',
                    email: '',
                    employeeId: '',
                    qualification: '',
                    subjects: [],
                    designation: '',
                    dateOfJoining: '',
                    dateOfBirth: '',
                    mobileNumber: '',
                    address: '',
                    aadharNumber: '',
                    gender: '',
                    experience: ''
                  })}
                >
                  Reset Form
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`order-1 sm:order-3 px-8 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all ${
                    loading 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:bg-green-700 hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Register Teacher"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Fields marked with <span className="text-red-500">*</span> are mandatory
          </p>
          <p className="text-xs text-gray-600 mt-1">
            © {new Date().getFullYear()} Vidya Bhavan School. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacher;