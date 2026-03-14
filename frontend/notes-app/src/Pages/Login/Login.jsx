import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import Passwordinput from '../../components/Input/Passwordinput';
import { useState } from 'react';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("")

    // Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      // Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        setEmail("");
        setPassword("");
        navigate('/dashboard')
      }
    } catch (error) {
      // Handle login error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center min-h-[80vh] px-4'>
        <div className='w-full max-w-md glass-card rounded-2xl px-8 py-12 transition-all duration-500 hover:shadow-indigo-500/10'>
          <form onSubmit={handleLogin}>
            <h4 className="text-3xl font-bold text-slate-800 mb-8 text-center italic">Welcome Back</h4>

            <div className="space-y-1">
              <label className="input-label">Email Address</label>
              <input
                type="text"
                placeholder="Enter your email"
                className="input-box"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1 mt-2">
              <label className="input-label">Password</label>
              <Passwordinput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-medium pb-4 animate-pulse">{error}</p>}

            <button type="submit" className="btn-primary mt-4">
              Sign In
            </button>

            <p className="text-sm text-center text-slate-600 mt-6">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 underline transition-colors">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>

  );
};

export default Login
