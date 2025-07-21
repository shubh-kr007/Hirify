import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

export default function Profile() {
  const { user } = useUser()
  const [emailNotifications, setEmailNotifications] = useState(true)

  const handleNotificationToggle = async () => {
    try {
      // In a real app, you would save this preference to your backend
      setEmailNotifications(!emailNotifications)
      toast.success('Notification preferences updated')
    } catch (error) {
      toast.error('Failed to update preferences')
    }
  }

  return (
    <div>
      <Toaster position="top-right" />
      
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details from your Clerk account.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Profile Picture</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.imageUrl ? (
                  <img className="h-20 w-20 rounded-full" src={user.imageUrl} alt="" />
                ) : (
                  <UserCircleIcon className="h-20 w-20 text-gray-400" />
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.fullName || 'Not set'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.primaryEmailAddress?.emailAddress}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Account created</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage how you receive notifications.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive email reminders for upcoming job application deadlines.</p>
              </div>
              <button
                type="button"
                onClick={handleNotificationToggle}
                className={`${
                  emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Account Actions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account settings in Clerk.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div>
              <button
                onClick={() => user?.update()}
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Update Profile in Clerk →
              </button>
              <p className="mt-1 text-sm text-gray-500">
                Update your name, profile picture, and other details.
              </p>
            </div>
            <div>
              <button
                onClick={() => user?.updatePassword()}
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Change Password →
              </button>
              <p className="mt-1 text-sm text-gray-500">
                Update your account password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
