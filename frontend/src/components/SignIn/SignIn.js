import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Diary from './Diary.png';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/sign-in', { email, password });
      const token = response.data.token;
      console.log('Sign-in success, token:', token);
      localStorage.setItem('email',email);
      localStorage.setItem('token', token); // Store token in localStorage
      navigate('/diary'); // Redirect to the diary page
    } catch (error) {
      console.error('Error during sign-in:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '10vh', color: 'white' }}>
      <div style={{ width: '462px', height: '600px', margin: 'auto', padding: '20px', backgroundImage: `url(${Diary})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
        <h1 style={{ fontSize: '2rem', textAlign: 'center', marginTop: '40px' }}>Sign in</h1>
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{ padding: '10px', backgroundColor: 'skyblue', color: 'black', border: 'none', cursor: 'pointer' }}
          >
            Sign in
          </button>
          <p style={{ textAlign: 'center' }}>
            Don&apos;t have an account? <a href="/sign-up" style={{ color: 'skyblue' }}>Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
