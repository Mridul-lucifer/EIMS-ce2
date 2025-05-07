// components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Students', href: '/students', icon: UserGroupIcon },
    { name: 'Teachers', href: '/teachers', icon: AcademicCapIcon },
    { name: 'Classes', href: '/classes', icon: BookOpenIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  return (
    <div className="h-full fixed w-64 bg-gradient-to-b from-blue-800 to-blue-900 flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-center h-20 bg-blue-900">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
            <svg className="h-7 w-7 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="ml-3 text-white text-xl font-bold">Vidya Bhavan</h1>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'group flex items-center px-2 py-3 text-sm font-medium rounded-md bg-blue-700 text-white'
                  : 'group flex items-center px-2 py-3 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-700 hover:text-white'
              }
            >
              <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-sm">
            AD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs font-medium text-blue-200">admin@vidyabhavan.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;