import { useState } from 'react';
import API from '../utils/axios';
import { FileInput, Label } from 'flowbite-react';

export default function ResumeAI() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      return setError('Please upload a resume and enter job description.');
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    setUploading(true);

    try {
      const res = await API.post('/ai/analyze-resume', formData);
      setAiResult(res.data.result);
    } catch (err) {
      setError('Upload failed or AI analysis error.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">🔍 Resume Analyzer</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {uploading && (
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full animate-pulse w-full" />
          </div>
        )}

        <div className="flex w-full items-center justify-center">
          <Label
            htmlFor="resume-upload"
            className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Click or drop your <strong>PDF resume</strong></p>
              {resumeFile && (
                <p className="text-green-500 mt-2 text-sm">{resumeFile.name}</p>
              )}
            </div>
            <FileInput
              id="resume-upload"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
          </Label>
        </div>

        <textarea
          rows="6"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-600"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          type="submit"
          disabled={uploading}
          className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Analyzing Resume...' : 'Analyze Resume'}
        </button>

        {error && <p className="text-red-600">{error}</p>}

        {aiResult && (
          <div className="mt-6 bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg">AI Analysis</h3>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-white">{aiResult}</pre>
          </div>
        )}
      </form>
    </div>
  );
}