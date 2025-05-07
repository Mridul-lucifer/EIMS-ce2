// pages/students/EditStudent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  
  const backendURL = import.meta.env.VITE_backendURL;
  
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/student/${id}`);
        const studentData = response.data.data;
        
        // Format date of birth if available
        if (studentData.dateOfBirth) {
          const date = new Date(studentData.dateOfBirth);
          studentData.dateOfBirth = date.toISOString().split('T')[0];
        }
        
        setFormData(studentData);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to load student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudent();
  }, [id, backendURL]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await axios.put(`${backendURL}/student/${id}`, formData);
      
      setSuccess('Student information updated successfully');
      
      // Redirect after a brief delay
      setTimeout(() => {
        navigate(`/students/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating student:', err);
      if (err.response && err.response.status === 409) {
        setError('Admission number or email already exists. Please use a different one.');
      } else {
        setError('Failed to update student information. Please try again later.');
      }
    } finally {
      setSubmitting(false);
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
        <p className="ml-2 text-gray-500">Loading student data...</p>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Edit Student" 
        subtitle={`Update information for ${formData.fullName}`}
      />
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} />}
      
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium text-gray-700">Admission Number <span className="text-red-500">*</span></label>
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
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-r-md focus:ring focus:ring-blue-200 transition-all ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
              </div>
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Standard <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium text-gray-700">Section</label>
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
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                placeholder="Enter parent/guardian name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
              >
                {bloodGroupOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
                placeholder="12-digit Aadhar number"
                maxLength="12"
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-gray-700">Residential Address</label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
              placeholder="Enter complete residential address with PIN code"
            ></textarea>
          </div>
          
          <div className="border-t border-gray-200 pt-5 mt-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/students/${id}`)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
              
