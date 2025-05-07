// pages/teachers/TeacherList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Alert from '../../components/ui/Alert';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, teacherId: null });
  
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_backendURL;
  
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `${backendURL}/teacher/all`;
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (subjectFilter) params.append('subject', subjectFilter);
      if (designationFilter) params.append('designation', designationFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setTeachers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTeachers();
  }, [subjectFilter, designationFilter, backendURL]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTeachers();
  };
  
  const handleDeleteClick = (teacherId) => {
    setDeleteDialog({ isOpen: true, teacherId });
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${backendURL}/teacher/${deleteDialog.teacherId}`);
      setDeleteDialog({ isOpen: false, teacherId: null });
      fetchTeachers();
    } catch (err) {
      console.error('Error deleting teacher:', err);
      setError('Failed to delete teacher. Please try again later.');
      setDeleteDialog({ isOpen: false, teacherId: null });
    }
  };
  
  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
    },
    {
      header: 'Name',
      accessor: 'fullName',
    },
    {
      header: 'Designation',
      accessor: 'designation',
      render: (teacher) => teacher.designation || '-',
    },
    {
      header: 'Subjects',
      accessor: 'subjects',
      render: (teacher) => {
        if (!teacher.subjects || teacher.subjects.length === 0) return '-';
        return teacher.subjects.join(', ');
      },
    },
    {
      header: 'Contact',
      accessor: 'mobileNumber',
      render: (teacher) => teacher.mobileNumber ? `+91 ${teacher.mobileNumber}` : '-',
    }
  ];
  
  const subjectOptions = [
    { value: '', label: 'All Subjects' },
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
  ];
  
  const designationOptions = [
    { value: '', label: 'All Designations' },
    { value: 'Principal', label: 'Principal' },
    { value: 'Vice Principal', label: 'Vice Principal' },
    { value: 'Senior Teacher', label: 'Senior Teacher' },
    { value: 'Teacher', label: 'Teacher' },
    { value: 'Junior Teacher', label: 'Junior Teacher' },
    { value: 'Assistant Teacher', label: 'Assistant Teacher' },
    { value: 'Guest Faculty', label: 'Guest Faculty' },
  ];
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Teachers" 
        subtitle="Manage teacher records"
        actionLabel="Add Teacher"
        actionPath="/teachers/create"
      />
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              {subjectOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <select
              id="designation"
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              {designationOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Filter
            </button>
          </div>
        </form>
      </div>
      
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={teachers}
        isLoading={loading}
        detailsPath="/teachers"
        editPath="/teachers/edit"
        onDelete={handleDeleteClick}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, teacherId: null })}
        type="danger"
      />
    </div>
  );
};

export default TeacherList;
