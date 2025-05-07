// pages/students/CreateStudent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    admissionNumber: '',
    standard: '',
    section: '',
    dateOfBirth: '',
    mobileNumber: '',
    address: '',
    parentName: '',
    bloodGroup: '',
    aadharNumber: ''
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
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.admissionNumber) newErrors.admissionNumber = 'Admission number is required';
    if (!formData.standard) newErrors.standard = 'Standard is required';
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
      
      const response = await axios.post(`${backendURL}/student/create`, formData);
      
      setSuccess('Student registered successfully!');
      setFormData({
        fullName: '',
        email: '',
        admissionNumber: '',
        standard: '',
        section: '',
        dateOfBirth: '',
        mobileNumber: '',
        address: '',
        parentName: '',
        bloodGroup: '',
        aadharNumber: ''
      });
      
      // Redirect after a brief delay
      setTimeout(() => {
        if (response.data.data && response.data.data.id) {
          navigate(`/students/${response.data.data.id}`);
        } else {
          navigate('/students');
        }
      }, 1500);
    } catch (err) {
      console.error('Error creating student:', err);
      if (err.response && err.response.status === 409) {
        setError('Admission number or email already exists. Please use a different one.');
      } else {
        setError('Failed to register student. Please try again later.');
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
  
  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];
  
  return (
    <div className="min-h-screen bg-[#f5f7ff] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <PageHeader 
          title="Register New Student" 
          subtitle="Enter student information to add to the system"
        />
        
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 py-6 px-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 border-4 border-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Student Registration</h2>
              <p className="text-blue-100 text-sm mt-1">Vidya Bhavan School - Excellence in Education Since 1985</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter student's full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Admission Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.admissionNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., ADM202425001"
                />
                {errors.admissionNumber && <p className="text-red-500 text-xs mt-1">{errors.admissionNumber}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                    +91
                  </span>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-r-md focus:ring focus:ring-blue-200 transition-all ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                </div>
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Standard <span className="text-red-500">*</span></label>
                <select
                  name="standard"
                  value={formData.standard}
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
                <label className="block text-sm font-semibold text-gray-700">Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                >
                  {sectionOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Parent/Guardian Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                  placeholder="Enter parent/guardian name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                >
                  {bloodGroupOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                  placeholder="12-digit Aadhar number"
                  maxLength="12"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-semibold text-gray-700">Residential Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                placeholder="Enter complete residential address with PIN code"
              ></textarea>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  className="order-2 sm:order-1 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  onClick={() => navigate('/students')}
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  className="order-3 sm:order-2 px-6 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  onClick={() => setFormData({
                    fullName: '',
                    email: '',
                    admissionNumber: '',
                    standard: '',
                    section: '',
                    dateOfBirth: '',
                    mobileNumber: '',
                    address: '',
                    parentName: '',
                    bloodGroup: '',
                    aadharNumber: ''
                  })}
                >
                  Reset Form
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`order-1 sm:order-3 px-8 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                    loading 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:bg-blue-800 hover:shadow-lg'
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
                    "Register Student"
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

export default CreateStudent;