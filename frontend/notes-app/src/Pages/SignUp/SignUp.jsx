import React from 'react'
import Navbar from '../../components/Navbar/Navbar';
import { useState } from 'react';
import Passwordinput from '../../components/Input/Passwordinput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your Password");
      return;
    }
    setError('');

    // SignUp API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message);
        return
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
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
          <form onSubmit={handleSignUp}>
            <h4 className="text-3xl font-bold text-slate-800 mb-8 text-center italic">Create Account</h4>

            <div className="space-y-1">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1 mt-2">
              <label className="input-label">Email Address</label>
              <input
                type="text"
                placeholder="Enter your email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

             <div className="space-y-1 mt-2">
              <label className="input-label">Password</label>
              <Passwordinput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-medium pb-4 animate-pulse">{error}</p>}

            <button type="submit" className="btn-primary mt-4">
              Join Now
            </button>

            <p className="text-sm text-center text-slate-600 mt-6">
              Already have an account?{" "}
              <Link to="/Login" className="font-semibold text-indigo-600 hover:text-indigo-700 underline transition-colors">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>

  );
};


export default SignUp;
