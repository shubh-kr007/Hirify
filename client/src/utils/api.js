const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiClient {
  constructor() {
    this.baseURL = API_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message || 'Something went wrong')
    }
    
    return response.json()
  }

  // Job methods
  async getJobs(token, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/jobs${queryString ? `?${queryString}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async getJob(token, id) {
    return this.request(`/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async createJob(token, data) {
    return this.request('/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })
  }

  async updateJob(token, id, data) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })
  }

  async deleteJob(token, id) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async getJobStats(token) {
    return this.request('/jobs/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  // Resume methods
  async uploadResume(token, file) {
    const formData = new FormData()
    formData.append('resume', file)
    
    const response = await fetch(`${this.baseURL}/resume/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload resume')
    }
    
    return response.json()
  }

  async getResume(token) {
    return this.request('/resume', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async deleteResume(token) {
    return this.request('/resume', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  // AI methods
  async extractKeywords(token, jobDescription) {
    return this.request('/ai/extract-keywords', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jobDescription })
    })
  }

  async analyzeMatch(token, jobId) {
    return this.request('/ai/analyze-match', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jobId })
    })
  }

  async getResumeSuggestions(token) {
    return this.request('/ai/resume-suggestions', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}

export const api = new ApiClient()

// Custom hook to use API with Clerk token
import { useAuth } from '@clerk/clerk-react'
import { useCallback } from 'react'

export function useApi() {
  const { getToken } = useAuth()
  
  const callApi = useCallback(async (method, ...args) => {
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('No authentication token available')
      }
      return api[method](token, ...args)
    } catch (error) {
      console.error('API call error:', error)
      throw error
    }
  }, [getToken])
  
  return {
    // Jobs
    getJobs: (params) => callApi('getJobs', params),
    getJob: (id) => callApi('getJob', id),
    createJob: (data) => callApi('createJob', data),
    updateJob: (id, data) => callApi('updateJob', id, data),
    deleteJob: (id) => callApi('deleteJob', id),
    getJobStats: () => callApi('getJobStats'),
    
    // Resume
    uploadResume: (file) => callApi('uploadResume', file),
    getResume: () => callApi('getResume'),
    deleteResume: () => callApi('deleteResume'),
    
    // AI
    extractKeywords: (jobDescription) => callApi('extractKeywords', jobDescription),
    analyzeMatch: (jobId) => callApi('analyzeMatch', jobId),
    getResumeSuggestions: () => callApi('getResumeSuggestions'),
  }
}