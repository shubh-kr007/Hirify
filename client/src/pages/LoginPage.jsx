import { Link } from 'react-router-dom';
import { useState } from 'react';
import API from '../utils/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password }); // will replace this later
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md p-10 rounded-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login to Job Tracker</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-md"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 border rounded-md"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don’t have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
}
// const handleLogin = async (e) => {
//   e.preventDefault();
//   setError('');

//   try {
//     const res = await API.post('/auth/login', { email, password }); // ✅ res is declared here

//     // ✅ Store JWT + email
//     localStorage.setItem('token', res.data.token);
//     localStorage.setItem('userEmail', res.data.user.email);

//     navigate('/dashboard');
//   } catch (err) {
//     setError(err.response?.data?.msg || 'Login failed');
//   }
// };