// pages/teachers/EditTeacher.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  
  const backendURL = import.meta.env.VITE_backendURL;
  
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/teacher/${id}`);
        const teacherData = response.data.data;
        
        // Format dates if available
        if (teacherData.dateOfBirth) {
          const birthDate = new Date(teacherData.dateOfBirth);
          teacherData.dateOfBirth = birthDate.toISOString().split('T')[0];
        }
        
        if (teacherData.dateOfJoining) {
          const joiningDate = new Date(teacherData.dateOfJoining);
          teacherData.dateOfJoining = joiningDate.toISOString().split('T')[0];
        }
        
        setFormData(teacherData);
      } catch (err) {
        console.error('Error fetching teacher:', err);
        setError('Failed to load teacher data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacher();
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
  
  const handleSubjectsChange = (e) => {
    // Get selected options from multiple select
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      subjects: selectedOptions
    }));
    
    if (errors.subjects) {
      setErrors(prev => ({
        ...prev,
        subjects: ''
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
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await axios.put(`${backendURL}/teacher/${id}`, formData);
      
      setSuccess('Teacher information updated successfully');
      
      // Redirect after a brief delay
      setTimeout(() => {
        navigate(`/teachers/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating teacher:', err);
      if (err.response && err.response.status === 409) {
        setError('Employee ID or email already exists. Please use a different one.');
      } else {
        setError('Failed to update teacher information. Please try again later.');
      }
    } finally {
      setSubmitting(false);
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
        <p className="ml-2 text-gray-500">Loading teacher data...</p>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Edit Teacher" 
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
                className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.employeeId ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-r-md focus:ring focus:ring-blue-200 transition-all ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
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
                value={formData.qualification || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
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
                value={formData.subjects || []}
                onChange={handleSubjectsChange}
                className={`w-full px-4 py-2.5 bg-gray-50 border focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.subjects ? 'border-red-500' : 'border-gray-300'}`}
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
                value={formData.designation || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
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
                value={formData.experience || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
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
                value={formData.gender || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
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
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white rounded-md focus:ring focus:ring-blue-200 transition-all"
              />
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
                onClick={() => navigate(`/teachers/${id}`)}
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

export default EditTeacher;