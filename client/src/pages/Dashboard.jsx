import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../utils/api'
import { 
  BriefcaseIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Rings } from 'react-loader-spinner'
import { useUser } from '@clerk/clerk-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const api = useApi()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, jobsData] = await Promise.all([
        api.getJobStats(),
        api.getJobs({ sortBy: 'createdAt', order: 'desc' })
      ])
      setStats(statsData)
      setRecentJobs(jobsData.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'interview':
        return <BriefcaseIcon className="h-5 w-5 text-yellow-500" />
      case 'offer':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20'
      case 'interview':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
      case 'offer':
        return 'bg-green-50 text-green-700 ring-green-600/20'
      case 'rejected':
        return 'bg-red-50 text-red-700 ring-red-600/20'
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Rings color="#0ea5e9" height={80} width={80} />
      </div>
    )
  }

  const totalApplications = Object.values(stats || {}).reduce((sum, count) => sum + count, 0)
  const interviewRate = totalApplications > 0 ? Math.round(((stats?.interview || 0) / totalApplications) * 100) : 0
  const offerRate = totalApplications > 0 ? Math.round(((stats?.offer || 0) / totalApplications) * 100) : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-hard p-8 text-white relative overflow-hidden">
        {/* FIXED: Use backticks for className */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`}></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'there'}! 👋
              </h1>
              <p className="text-primary-100 text-lg">
                Ready to supercharge your job search today?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <ChartBarIcon className="h-12 w-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-soft rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BriefcaseIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                  <dd className="text-3xl font-bold text-gray-900">{totalApplications}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-soft rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Applied</dt>
                  <dd className="text-3xl font-bold text-gray-900">{stats?.applied || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-soft rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BriefcaseIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Interviews</dt>
                  <dd className="text-3xl font-bold text-gray-900">{stats?.interview || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-soft rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Offers</dt>
                  <dd className="text-3xl font-bold text-gray-900">{stats?.offer || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white shadow-soft rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <SparklesIcon className="h-5 w-5 text-primary-600 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/jobs"
            className="group relative bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 rounded-xl p-6 transition-all duration-300 border border-primary-200 hover:border-primary-300 hover:shadow-medium"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-primary-900">Add New Job</p>
                <p className="text-sm text-primary-700">Track a new application</p>
              </div>
            </div>
          </Link>

          <Link
            to="/resume"
            className="group relative bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl p-6 transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-medium"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-green-900">Upload Resume</p>
                <p className="text-sm text-green-700">Get AI suggestions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/resume"
            className="group relative bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 transition-all duration-300 border border-purple-200 hover:border-purple-300 hover:shadow-medium"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-purple-900">AI Analysis</p>
                <p className="text-sm text-purple-700">Improve your resume</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white shadow-soft rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CalendarDaysIcon className="h-5 w-5 text-primary-600 mr-2" />
                Recent Applications
              </h3>
              <Link
                to="/jobs"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors flex items-center group"
              >
                View all 
                <ArrowTrendingUpIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentJobs.length === 0 ? (
              <div className="text-center py-12">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first job application.</p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Your First Application
                </Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors group">
                  <Link to={`/jobs/${job._id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(job.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                                                        {job.role}
                          </div>
                          <div className="text-sm text-gray-500">{job.companyName}</div>
                          {job.location && (
                            <div className="text-xs text-gray-400 mt-1 flex items-center">
                              <span className="mr-1">📍</span>
                              {job.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        {job.deadline && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <CalendarDaysIcon className="h-3 w-3 mr-1" />
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        )}
                        <EyeIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="space-y-6">
        {totalApplications > 0 && (
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 shadow-hard rounded-xl text-white p-6 relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Success Rate</h3>
                  <ChartBarIcon className="h-6 w-6 text-primary-200" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary-100">Interview Rate</span>
                      <span className="font-semibold">{interviewRate}%</span>
                    </div>
                    <div className="w-full bg-primary-800 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-1000 ease-out" 
                        style={{ width: `${interviewRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary-100">Offer Rate</span>
                      <span className="font-semibold">{offerRate}%</span>
                    </div>
                    <div className="w-full bg-primary-800 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-1000 ease-out" 
                        style={{ width: `${offerRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-yellow-800">
                  Upload your resume and use our AI to get personalized suggestions that can increase your interview rate by up to 40%!
                </p>
                <Link 
                  to="/resume" 
                  className="inline-flex items-center mt-3 text-xs font-medium text-yellow-700 hover:text-yellow-600 transition-colors"
                >
                  Try AI Resume Assistant →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
                