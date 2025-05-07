// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  BookOpenIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0
  });
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_backendURL;
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch students count
        const studentsResponse = await axios.get(`${backendURL}/student/all`);
        const studentsCount = studentsResponse.data.count || studentsResponse.data.data.length;
        
        // Fetch teachers count
        const teachersResponse = await axios.get(`${backendURL}/teacher/all`);
        const teachersCount = teachersResponse.data.count || teachersResponse.data.data.length;
        
        // Fetch classes count
        const classesResponse = await axios.get(`${backendURL}/class/all`);
        const classesCount = classesResponse.data.count || classesResponse.data.data.length;
        
        setStats({
          students: studentsCount,
          teachers: teachersCount,
          classes: classesCount
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [backendURL]);
  
  const statCards = [
    {
      title: 'Students',
      value: stats.students,
      icon: UserGroupIcon,
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      link: '/students'
    },
    {
      title: 'Teachers',
      value: stats.teachers,
      icon: AcademicCapIcon,
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      link: '/teachers'
    },
    {
      title: 'Classes',
      value: stats.classes,
      icon: BookOpenIcon,
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      link: '/classes'
    },
    {
      title: 'Academic Calendar',
      value: 'View',
      icon: CalendarIcon,
      bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      link: '/calendar'
    }
  ];
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">School Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome to Vidya Bhavan School Management System Dashboard
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex space-x-3">
            <Link
              to="/students/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Student
            </Link>
            <Link
              to="/teachers/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Teacher
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`p-5 ${card.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white truncate">
                    {card.title}
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-white">
                    {loading ? '...' : card.value}
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <card.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-right">
                <span className="font-medium text-blue-700 hover:text-blue-900">
                  View all <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">New student registered</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      1 hour ago
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Rahul Sharma (Standard 10)
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">New class created</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      3 hours ago
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Class 9-B (Academic Year 2024-2025)
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">Teacher assigned to new subject</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Yesterday
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Priya Patel assigned to Mathematics (Class 11-A)
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
