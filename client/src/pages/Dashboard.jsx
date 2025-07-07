import { useState } from 'react';

export default function Dashboard() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('applied');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ company, role, status, deadline });
    // 📥 Later: Send to backend here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">🏁 Job Application Tracker</h1>
        
        {/* ➕ Job Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            className="p-3 border rounded"
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            className="p-3 border rounded"
            type="text"
            placeholder="Role Title"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <select
            className="p-3 border rounded col-span-full md:col-span-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            className="p-3 border rounded"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition"
          >
            ➕ Add Job
          </button>
        </form>

        {/* 📋 Job List (Placeholder) */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📄 My Jobs</h2>
          <p className="text-gray-500">No jobs added yet.</p>
        </div>
      </div>
    </div>
  );
}