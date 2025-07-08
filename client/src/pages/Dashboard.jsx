import { useState, useEffect } from 'react';
import API from '../utils/axios';


export default function Dashboard() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('applied');
  const [deadline, setDeadline] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJobId, setEditingJobId] = useState(null);
  

  // ✅ Fetch jobs
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/jobs', {
        headers: { Authorization: token },
      });
      setJobs(res.data);
    } catch (err) {
      console.error('❌ Error fetching jobs:', err.response?.data?.msg || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Add or update job
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (editingJobId) {
        await API.put(
          `/jobs/${editingJobId}`,
          { company, role, status, deadline },
          { headers: { Authorization: token } }
        );
      } else {
        await API.post(
          '/jobs',
          { company, role, status, deadline },
          { headers: { Authorization: token } }
        );
      }

      // Reset
      setCompany('');
      setRole('');
      setStatus('applied');
      setDeadline('');
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      console.error('❌ Add/Edit error:', err.message);
    }
  };

  // ✅ Delete job
  const handleDelete = async (jobId) => {
    const confirm = window.confirm('Are you sure you want to delete this job?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await API.delete(`/jobs/${jobId}`, {
        headers: { Authorization: token },
      });
      fetchJobs();
    } catch (err) {
      console.error('❌ Failed to delete job:', err.response?.data?.msg || err.message);
    }
  };

  // ✅ Start editing
  const startEdit = (job) => {
    setEditingJobId(job._id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setDeadline(job.deadline?.split('T')[0] || '');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">🏁 Job Application Tracker</h1>

        {/* ➕ Job Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Company Name"
            className="p-3 border rounded"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Role Title"
            className="p-3 border rounded"
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
            type="date"
            className="p-3 border rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition"
          >
            {editingJobId ? '✏️ Update Job' : '➕ Add Job'}
          </button>
        </form>

        {editingJobId && (
          <button
            onClick={() => {
              setEditingJobId(null);
              setCompany('');
              setRole('');
              setStatus('applied');
              setDeadline('');
            }}
            className="text-sm text-gray-500 hover:underline mt-2"
          >
            Cancel Edit
          </button>
        )}

        {/* 📋 Job List */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">📄 My Jobs</h2>
          {loading ? (
            <p className="text-gray-500">Loading your jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500">No jobs added yet.</p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li key={job._id} className="bg-gray-100 p-4 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-blue-700">{job.company}</h3>
                      <p className="text-sm text-gray-600">{job.role}</p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        job.status === 'applied'
                          ? 'bg-blue-200 text-blue-800'
                          : job.status === 'interview'
                          ? 'bg-yellow-200 text-yellow-800'
                          : job.status === 'offer'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  {job.deadline && (
                    <p className="mt-1 text-xs text-gray-500">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  )}

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-500 hover:underline font-medium text-sm ml-4"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => startEdit(job)}
                    className="text-blue-600 hover:underline font-medium text-sm ml-2"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}