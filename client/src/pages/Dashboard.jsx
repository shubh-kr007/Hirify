import { useState, useEffect } from 'react';
import API from '../utils/axios';
import {
  useUser,
  useAuth,
  UserButton
} from '@clerk/clerk-react';
import { TailSpin } from 'react-loader-spinner';

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('applied');
  const [deadline, setDeadline] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJobId, setEditingJobId] = useState(null);

  const fetchJobs = async () => {
    try {
      const token = await getToken();
      const res = await API.get('/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error('❌ Error fetching jobs:', err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      if (editingJobId) {
        await API.put(
          `/jobs/${editingJobId}`,
          { company, role, status, deadline },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await API.post(
          '/jobs',
          { company, role, status, deadline },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Reset form fields
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

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = await getToken();
      await API.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error('❌ Error deleting job:', err.message);
    }
  };

  const startEdit = (job) => {
    setEditingJobId(job._id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setDeadline(job.deadline?.split('T')[0] || '');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md p-6 space-y-6">

        {/* Topbar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">🏁 Job Application Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, {user?.fullName || user?.primaryEmailAddress?.emailAddress} 👋
            </p>
          </div>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>

        {/* Job Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company Name"
            className="p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Role Title"
            className="p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <select
            className="p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition duration-200"
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
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel Edit
          </button>
        )}

        {/* Job List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">📄 My Jobs</h2>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <TailSpin
                height="40"
                width="40"
                color="#3b82f6" // Tailwind's "blue-600"
                ariaLabel="loading"
              />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No jobs added yet.</p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li key={job._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded border border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">
                        {job.company}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{job.role}</p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        job.status === 'applied'
                          ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : job.status === 'interview'
                          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : job.status === 'offer'
                          ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  {job.deadline && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  )}

                  <div className="mt-2 flex gap-4">
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEdit(job)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}