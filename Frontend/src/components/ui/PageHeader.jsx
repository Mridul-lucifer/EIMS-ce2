// components/ui/PageHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, actionLabel, actionPath }) => {
  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold leading-6 text-gray-900">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actionLabel && actionPath && (
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            to={actionPath}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
