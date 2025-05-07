// pages/students/StudentList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Alert from '../../components/ui/Alert';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [standardFilter, setStandardFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, studentId: null });
  
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_backendURL;
  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `${backendURL}/student/all`;
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (standardFilter) params.append('standard', standardFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setStudents(response.data.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStudents();
  }, [standardFilter, backendURL]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };
  
  const handleDeleteClick = (studentId) => {
    setDeleteDialog({ isOpen: true, studentId });
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${backendURL}/student/${deleteDialog.studentId}`);
      setDeleteDialog({ isOpen: false, studentId: null });
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again later.');
      setDeleteDialog({ isOpen: false, studentId: null });
    }
  };
  
  const columns = [
    {
      header: 'Admission No.',
      accessor: 'admissionNumber',
    },
    {
      header: 'Name',
      accessor: 'fullName',
    },
    {
      header: 'Standard',
      accessor: 'standard',
      render: (student) => `${student.standard}${student.section ? '-' + student.section : ''}`,
    },
    {
      header: 'Contact',
      accessor: 'mobileNumber',
      render: (student) => student.mobileNumber ? `+91 ${student.mobileNumber}` : '-',
    },
    {
      header: 'Parent/Guardian',
      accessor: 'parentName',
      render: (student) => student.parentName || '-',
    }
  ];
  
  const standardOptions = [
    { value: '', label: 'All Standards' },
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
    { value: '12', label: 'Standard 12' },
  ];
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Students" 
        subtitle="Manage student records"
        actionLabel="Add Student"
        actionPath="/students/create"
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
              placeholder="Search by name or admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-1">
              Standard
            </label>
            <select
              id="standard"
              value={standardFilter}
              onChange={(e) => setStandardFilter(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              {standardOptions.map(option => (
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
        data={students}
        isLoading={loading}
        detailsPath="/students"
        editPath="/students/edit"
        onDelete={handleDeleteClick}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, studentId: null })}
        type="danger"
      />
    </div>
  );
};

export default StudentList;
