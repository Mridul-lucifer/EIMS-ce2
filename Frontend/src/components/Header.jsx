import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 bg-gray-200 rounded shadow">
      <span className="text-lg font-bold">🌐 MyApp</span>

      <span>
        {!username ? (
          <Link
          to="/login"
          className="rounded-sm px-3 py-1 hover:bg-blue-500 hover:text-white border"
        >
          LOGIN
        </Link>
        ) : (
          <div className="">
            { username == "Admin" ? (
              <div className="flex flex-row items-end  relative gap-3">
              <div>
              <span><Link to="/createClass" className=" px-3 py-1 hover:bg-blue-500 hover:text-white "> Class </Link></span>
              <span><Link to="/createStudent" className=" px-3 py-1 hover:bg-blue-500 hover:text-white "> Student </Link></span>
              <span><Link to="/createTeacher" className=" px-3 py-1 hover:bg-blue-500 hover:text-white "> Teacher </Link></span>
              </div>
              <div className="flex flex-row items-end group relative">
                <span className="cursor-default font-medium">{username}</span>
                <button
                  onClick={handleLogout}
                  className="hidden group-hover:block absolute top-full mr-10 bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
              </div>
            ):(
              <div className="flex flex-col items-end group relative">
            <span className="cursor-default font-medium">{username}</span>
            <button
              onClick={handleLogout}
              className="hidden group-hover:block absolute top-full  bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
            >
              Logout
            </button>
          </div>
            )
          }
          </div>
        )}
      </span>
    </div>
  );
}
