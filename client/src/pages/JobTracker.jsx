import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useApi } from '../utils/api'
import { ClipLoader } from 'react-spinners'
import clsx from 'clsx'
import toast, { Toaster } from 'react-hot-toast'

const statusOptions = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { value: 'interview', label: 'Interview', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-100 text-gray-800' },
]

export default function JobTracker() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    status: 'applied',
    deadline: '',
    jobDescription: '',
    notes: '',
    applicationUrl: '',
    salary: '',
    location: ''
  })
  const api = useApi()

  useEffect(() => {
    loadJobs()
  }, [filterStatus])

  const loadJobs = async () => {
    try {
      const params = filterStatus !== 'all' ? { status: filterStatus } : {}
      const data = await api.getJobs(params)
      setJobs(data)
    } catch (error) {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingJob) {
        await api.updateJob(editingJob._id, formData)
        toast.success('Job updated successfully')
      } else {
        await api.createJob(formData)
        toast.success('Job added successfully')
      }
      setIsModalOpen(false)
      resetForm()
      loadJobs()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.deleteJob(id)
        toast.success('Job deleted successfully')
        loadJobs()
      } catch (error) {
        toast.error('Failed to delete job')
      }
    }
  }

  const openEditModal = (job) => {
    setEditingJob(job)
    setFormData({
      companyName: job.companyName,
      role: job.role,
      status: job.status,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      jobDescription: job.jobDescription || '',
      notes: job.notes || '',
      applicationUrl: job.applicationUrl || '',
      salary: job.salary || '',
      location: job.location || ''
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setEditingJob(null)
    setFormData({
      companyName: '',
      role: '',
      status: 'applied',
      deadline: '',
      jobDescription: '',
      notes: '',
      applicationUrl: '',
      salary: '',
      location: ''
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#0ea5e9" size={80} />
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Application
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by status
        </label>
        <select
          id="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="all">All Applications</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Jobs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 truncate">{job.role}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusOptions.find(s => s.value === job.status)?.color
                          }`}>
                            {statusOptions.find(s => s.value === job.status)?.label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {job.companyName}
                          </p>
                          {job.location && (
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              📍 {job.location}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          {job.deadline && (
                            <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(job)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                        {editingJob ? 'Edit Application' : 'Add New Application'}
                      </Dialog.Title>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role *</label>
                          <input
                            type="text"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="mt-1 input-field"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Deadline</label>
                          <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Salary</label>
                          <input
                            type="text"
                            value={formData.salary}
                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Application URL</label>
                          <input
                            type="url"
                            value={formData.applicationUrl}
                            onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Job Description</label>
                          <textarea
                            rows={3}
                            value={formData.jobDescription}
                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Notes</label>
                          <textarea
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="mt-1 input-field"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      >
                        {editingJob ? 'Update' : 'Add'}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

