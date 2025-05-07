import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_backendURL;

  const sendAPIcall = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/signup`, {
        username,
        password
      });

      alert(response.data.msg || "Signup successful!");
      navigate('/login');
    } catch (e) {
      if (e.response && e.response.status === 409) {
        alert("Username already exists. Please choose another.");
      } else {
        console.error("❌ Error:", e);
        alert("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form 
        className="border w-1/3 p-8 flex flex-col items-center justify-center gap-4 bg-white rounded-xl shadow-md" 
        onSubmit={sendAPIcall}
      >
        <h2 className="text-xl font-semibold">SIGNUP FORM</h2>

        <div className="flex items-center w-full gap-2">
          <label className="w-1/3 text-right">Username:</label>
          <input 
            type="text" 
            className="border px-2 py-1 w-2/3 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center w-full gap-2">
          <label className="w-1/3 text-right">Password:</label>
          <input 
            type="password" 
            className="border px-2 py-1 w-2/3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`bg-green-500 text-white px-4 py-2 rounded transition duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
          }`}
        >
          {loading ? 'Submitting...' : 'SUBMIT'}
        </button>
      </form>
    </div>
  );
}
