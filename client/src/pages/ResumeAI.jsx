import { useState } from 'react';
import API from '../utils/axios';

export default function ResumeAI() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      setError('Upload resume and paste job description');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await API.post('/ai/analyze-resume', formData);
      setAiResult(res.data.result);
    } catch (err) {
      setError('AI analysis failed');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-blue-600">🔍 Resume + Job Match</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
        <textarea
          rows="6"
          className="w-full p-2 border rounded"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Analyze Resume
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {aiResult && (
        <div className="mt-6 border p-4 bg-gray-50 rounded">
          <h2 className="font-bold mb-2">🧠 AI Analysis</h2>
          <pre className="whitespace-pre-wrap text-sm">{aiResult}</pre>
        </div>
      )}
    </div>
  );
}