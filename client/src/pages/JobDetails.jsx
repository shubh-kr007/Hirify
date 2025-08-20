import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useApi } from '../utils/api'
import { ClipLoader } from 'react-spinners'
import toast, { Toaster } from 'react-hot-toast'

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const api = useApi()

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {
    try {
      const data = await api.getJob(id)
      setJob(data)
    } catch (error) {
      toast.error('Failed to load job details')
      navigate('/jobs')
    } finally {
      setLoading(false)
    }
  }

  const analyzeMatch = async () => {
    try {
      setAnalyzing(true)
      const data = await api.analyzeMatch(job._id)
      setAnalysis(data)
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const extractKeywords = async () => {
    if (!job.jobDescription) {
      toast.error('No job description available')
      return
    }

    try {
      setAnalyzing(true)
      const data = await api.extractKeywords(job.jobDescription)
      
      // Update job with keywords
      await api.updateJob(job._id, { ...job, keywords: data.keywords })
      
      setJob({ ...job, keywords: data.keywords })
      toast.success('Keywords extracted successfully')
    } catch (error) {
      toast.error('Failed to extract keywords')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#0ea5e9" size={80} />
      </div>
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      interview: 'bg-yellow-100 text-yellow-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/jobs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Jobs
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{job.role}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.companyName}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            {job.location && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{job.location}</dd>
              </div>
            )}
            
            {job.salary && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Salary</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{job.salary}</dd>
              </div>
            )}
            
            {job.deadline && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(job.deadline).toLocaleDateString()}
                </dd>
              </div>
            )}
            
            {job.applicationUrl && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Application URL</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    {job.applicationUrl}
                  </a>
                </dd>
              </div>
            )}
            
            {job.notes && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                  {job.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Job Description */}
      {job.jobDescription && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Job Description</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{job.jobDescription}</p>
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Keywords</h3>
            {job.jobDescription && (
              <button
                onClick={extractKeywords}
                disabled={analyzing}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <SparklesIcon className="h-4 w-4 mr-1" />
                Extract Keywords
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {job.keywords && job.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {job.jobDescription 
                ? "No keywords extracted yet. Click 'Extract Keywords' to analyze the job description."
                : "Add a job description to extract keywords."}
            </p>
          )}
        </div>
      </div>

      {/* Resume Match Analysis */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Resume Match Analysis</h3>
            {job.jobDescription && (
              <button
                onClick={analyzeMatch}
                disabled={analyzing}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <SparklesIcon className="h-4 w-4 mr-1" />
                Analyze Match
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200">
          {analyzing ? (
            <div className="flex justify-center py-8">
              <ClipLoader color="#0ea5e9" size={60} />
            </div>
          ) : analysis ? (
            <div className="px-4 py-5 sm:px-6 space-y-6">
              {/* Match Score */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Match Score</h4>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-8">
                    <div
                      className={`h-8 rounded-full flex items-center justify-center text-white font-medium ${
                        analysis.score >= 70 ? 'bg-green-500' : 
                        analysis.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analysis.score}%` }}
                    >
                      {analysis.score}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-sm text-gray-600">{analysis.summary}</p>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement Suggestions */}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Improvement Suggestions</h4>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-primary-500">•</span>
                        <span className="ml-2 text-sm text-gray-600">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-500">
                {job.jobDescription 
                  ? "Click 'Analyze Match' to see how well your resume matches this job."
                  : "Add a job description to analyze resume match."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}