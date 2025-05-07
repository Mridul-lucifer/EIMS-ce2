// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/students/StudentList';
import StudentDetails from './pages/students/StudentDetails';
import CreateStudent from './pages/students/CreateStudent';
import EditStudent from './pages/students/EditStudent';
import TeacherList from './pages/teachers/TeacherList';
import TeacherDetails from './pages/teachers/TeacherDetails';
import CreateTeacher from './pages/teachers/CreateTeacher';
import EditTeacher from './pages/teachers/EditTeacher';
import ClassList from './pages/classes/ClassList';
import ClassDetails from './pages/classes/ClassDetails';
import CreateClass from './pages/classes/CreateClass';
import EditClass from './pages/classes/EditClass';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Fixed width sidebar */}
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 bg-gray-50 overflow-auto">
            <div className="container mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                
                {/* Student Routes */}
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/create" element={<CreateStudent />} />
                <Route path="/students/:id" element={<StudentDetails />} />
                <Route path="/students/edit/:id" element={<EditStudent />} />
                
                {/* Teacher Routes */}
                <Route path="/teachers" element={<TeacherList />} />
                <Route path="/teachers/create" element={<CreateTeacher />} />
                <Route path="/teachers/:id" element={<TeacherDetails />} />
                <Route path="/teachers/edit/:id" element={<EditTeacher />} />
                
                {/* Class Routes */}
                <Route path="/classes" element={<ClassList />} />
                <Route path="/classes/create" element={<CreateClass />} />
                <Route path="/classes/:id" element={<ClassDetails />} />
                <Route path="/classes/edit/:id" element={<EditClass />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;