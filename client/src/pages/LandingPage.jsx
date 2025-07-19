import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { 
  BriefcaseIcon, 
  DocumentTextIcon, 
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  const features = [
    {
      name: 'Smart Job Tracking',
      description: 'Keep all your job applications organized with intelligent status tracking, deadline reminders, and progress analytics.',
      icon: BriefcaseIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'AI-Powered Analysis',
      description: 'Get instant feedback on how well your resume matches job descriptions with personalized improvement suggestions.',
      icon: SparklesIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Resume Optimization',
      description: 'Upload your resume and receive expert-level suggestions powered by advanced AI to maximize your interview chances.',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600'
    },
  ]

  const benefits = [
    'Track unlimited job applications',
    'AI-powered resume analysis',
    'Automated deadline reminders',
    'Job-resume matching scores',
    'Keyword extraction tools',
    'Professional dashboard'
  ]

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
                <span className="text-white font-bold text-lg">AJ</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                AI Job Tracker
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/sign-up"
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50">
        {/* FIXED: Use backticks for className to allow double quotes in SVG */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230ea5e9" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl py-24 sm:py-32 lg:py-40">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
                  <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ job seekers</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-8">
                Land Your Dream Job with{' '}
                <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 bg-clip-text text-transparent">
                  AI Power
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                Streamline your job search with intelligent tracking, AI-powered resume analysis, and automated deadline reminders. Get hired faster with personalized insights.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {isSignedIn ? (
                  <Link
                    to="/dashboard"
                    className="group bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center"
                  >
                    Go to Dashboard
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/sign-up"
                      className="group bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center"
                    >
                      Start Free Today
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/sign-in" 
                      className="text-lg font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors flex items-center group"
                    >
                      Sign in 
                      <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
              
              {/* Benefits List */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              Powerful tools designed to accelerate your job search and maximize your success rate.
            </p>
          </div>
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="group bg-white rounded-2xl p-8 shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 mb-2">
                    {feature.name}
                  </dt>
                  <dd className="text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your job search?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of successful job seekers who've accelerated their careers with AI-powered insights.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!isSignedIn && (
                <Link
                  to="/sign-up"
                  className="bg-white text-primary-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  Get started for free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg mr-3">
                <span className="text-white font-bold text-sm">AJ</span>
              </div>
              <span className="text-lg font-bold text-white">
                AI Job Tracker
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm leading-5 text-gray-400">
            &copy; 2024 AI Job Tracker. Built with ❤️ for job seekers everywhere.
          </p>
        </div>
      </footer>
    </div>
  )
}