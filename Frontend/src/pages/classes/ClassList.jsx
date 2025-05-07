// pages/classes/ClassList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Alert from '../../components/ui/Alert';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [standardFilter, setStandardFilter] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, classId: null });
  
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_backendURL;
  
  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `${backendURL}/class/all`;
      
      const params = new URLSearchParams();
      if (standardFilter) params.append('standard', standardFilter);
      if (academicYearFilter) params.append('academicYear', academicYearFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      
      // Filter by search query client-side if provided
      let filteredClasses = response.data.data || [];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredClasses = filteredClasses.filter(cls => 
          cls.name.toLowerCase().includes(query) || 
          `${cls.standard}-${cls.section}`.toLowerCase().includes(query)
        );
      }
      
      setClasses(filteredClasses);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClasses();
  }, [standardFilter, academicYearFilter, backendURL]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchClasses();
  };
  
  const handleDeleteClick = (classId) => {
    setDeleteDialog({ isOpen: true, classId });
  };
  
  const handleDeleteConfirm = async () => {
    try {
        await axios.delete(`${backendURL}/class/${deleteDialog.classId}`);
        setDeleteDialog({ isOpen: false, classId: null });
        fetchClasses();
      } catch (err) {
        console.error('Error deleting class:', err);
        setError('Failed to delete class. Please try again later.');
        setDeleteDialog({ isOpen: false, classId: null });
      }
    };
    
    const columns = [
      {
        header: 'Class Name',
        accessor: 'name',
      },
      {
        header: 'Standard-Section',
        accessor: 'standard',
        render: (classData) => `${classData.standard}-${classData.section}`,
      },
      {
        header: 'Academic Year',
        accessor: 'academicYear',
      },
      {
        header: 'Students',
        accessor: 'studentCount',
        render: (classData) => classData.studentCount || 0,
      },
      {
        header: 'Subjects',
        accessor: 'subjectCount',
        render: (classData) => classData.subjectCount || 0,
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
    
    const academicYearOptions = [
      { value: '', label: 'All Academic Years' },
      { value: '2024-2025', label: '2024-2025' },
      { value: '2023-2024', label: '2023-2024' },
      { value: '2022-2023', label: '2022-2023' },
    ];
    
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Classes" 
          subtitle="Manage class assignments"
          actionLabel="Create Class"
          actionPath="/classes/create"
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
                placeholder="Search by class name or standard-section..."
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
            
            <div className="w-full sm:w-auto">
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <select
                id="academicYear"
                value={academicYearFilter}
                onChange={(e) => setAcademicYearFilter(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                {academicYearOptions.map(option => (
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
          data={classes}
          isLoading={loading}
          detailsPath="/classes"
          editPath="/classes/edit"
          onDelete={handleDeleteClick}
        />
        
        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Class"
          message="Are you sure you want to delete this class? This will remove all teacher assignments and student enrollments for this class. This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialog({ isOpen: false, classId: null })}
          type="danger"
        />
      </div>
    );
  };
  
  export default ClassList;
  