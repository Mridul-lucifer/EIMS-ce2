// pages/teachers/TeacherDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const backendURL = import.meta.env.VITE_backendURL;
  
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/teacher/${id}`);
        setTeacher(response.data.data);
      } catch (err) {
        console.error('Error fetching teacher details:', err);
        setError('Failed to load teacher details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacher();
  }, [id, backendURL]);
  
  const handleDelete = async () => {
    try {
      await axios.delete(`${backendURL}/teacher/${id}`);
      navigate('/teachers');
    } catch (err) {
      console.error('Error deleting teacher:', err);
      setError('Failed to delete teacher. Please try again later.');
      setDeleteDialog(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
        <p className="ml-2 text-gray-500">Loading teacher details...</p>
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
  
  if (!teacher) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <Alert type="error" message="Teacher not found." />
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Teacher Details" 
        subtitle={`Employee ID: ${teacher.employeeId}`}
      />
      
      <div className="flex justify-end mb-6 space-x-4">
        <Link
          to={`/teachers/edit/${id}`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit Teacher
        </Link>
        <button
          onClick={() => setDeleteDialog(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Teacher
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{teacher.fullName}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {teacher.designation || 'Teacher'}
              </p>
            </div>
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-800 font-bold text-xl">
                {teacher.fullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2)}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacher.fullName}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacher.employeeId}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacher.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Mobile number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.mobileNumber ? `+91 ${teacher.mobileNumber}` : '-'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Designation</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.designation || '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Subjects</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.subjects && teacher.subjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                ) : (
                  '-'
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Qualification</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.qualification || '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Experience</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.experience || '-'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date of joining</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toLocaleDateString('en-IN') : '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString('en-IN') : '-'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.gender || '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {teacher.address || '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Classes and Subjects Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Classes & Subjects Assigned</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="p-4 text-center text-gray-500 italic">
              No classes assigned yet.
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${teacher.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        type="danger"
      />
    </div>
  );
};

export default TeacherDetails;