// import { useState, useEffect } from 'react'
// import {
//   DocumentArrowUpIcon,
//   SparklesIcon,
//   TrashIcon,
//   DocumentTextIcon,
//   CheckCircleIcon,
//   CloudArrowUpIcon
// } from '@heroicons/react/24/outline'
// import { useApi } from '../utils/api'
// import { Rings } from 'react-loader-spinner'
// import toast, { Toaster } from 'react-hot-toast'

// export default function ResumeAssistant() {
//   const [resume, setResume] = useState(null)
//   const [suggestions, setSuggestions] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [loadingSuggestions, setLoadingSuggestions] = useState(false)
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [dragActive, setDragActive] = useState(false)
//   const api = useApi()

//   useEffect(() => {
//     loadResume()
//   }, [])

//   const loadResume = async () => {
//     try {
//       setLoading(true)
//       const data = await api.getResume()
//       setResume(data)
//     } catch (error) {
//       console.log('No resume found')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       validateAndSetFile(file)
//     }
//   }

//   const validateAndSetFile = (file) => {
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('File size must be less than 5MB')
//       return
//     }

//     const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
//     if (!allowedTypes.includes(file.type)) {
//       toast.error('Only PDF and DOCX files are allowed')
//       return
//     }

//     setSelectedFile(file)
//   }

//   const handleDrag = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true)
//     } else if (e.type === 'dragleave') {
//       setDragActive(false)
//     }
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       validateAndSetFile(e.dataTransfer.files[0])
//     }
//   }

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       toast.error('Please select a file')
//       return
//     }

//     try {
//       setLoading(true)
//       await api.uploadResume(selectedFile)
//       toast.success('Resume uploaded successfully! 🎉')
//       setSelectedFile(null)
//       loadResume()
//     } catch (error) {
//       toast.error(error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete your resume?')) {
//       try {
//         await api.deleteResume()
//         toast.success('Resume deleted successfully')
//         setResume(null)
//         setSuggestions([])
//       } catch (error) {
//         toast.error('Failed to delete resume')
//       }
//     }
//   }

//   const getSuggestions = async () => {
//     try {
//       setLoadingSuggestions(true)
//       const data = await api.getResumeSuggestions()
//       setSuggestions(data.suggestions)
//       toast.success('AI analysis complete! ✨')
//     } catch (error) {
//       toast.error('Failed to get suggestions: ' + error.message)
//     } finally {
//       setLoadingSuggestions(false)
//     }
//   }

//   if (loading && !resume) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Rings color="#0ea5e9" height={80} width={80} />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8 animate-fade-in">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="text-center">
//         <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
//           <SparklesIcon className="h-8 w-8 text-white" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Resume Assistant</h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Upload your resume and get AI-powered suggestions to improve your chances of landing your dream job.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Upload Section */}
//         <div className="bg-white shadow-soft rounded-2xl border border-gray-100 p-8">
//           <div className="flex items-center mb-6">
//             <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
//               <DocumentArrowUpIcon className="h-6 w-6 text-white" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
//           </div>

//           {resume ? (
//             <div className="space-y-6">
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start">
//                     <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
//                       <CheckCircleIcon className="h-6 w-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-green-900">{resume.fileName}</p>
//                       <p className="text-sm text-green-700">
//                         Uploaded on {new Date(resume.updatedAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleDelete}
//                     className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
//                     title="Delete resume"
//                   >
//                     <TrashIcon className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 pt-6">
//                 <p className="text-sm text-gray-600 mb-4 font-medium">Replace your resume:</p>
//                 <div
//                   className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
//                     ? 'border-primary-400 bg-primary-50 scale-105'
//                     : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
//                   onDragEnter={handleDrag}
//                   onDragLeave={handleDrag}
//                   onDragOver={handleDrag}
//                   onDrop={handleDrop}
//                 >
//                   <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">
//                       <label htmlFor="file-upload" className="font-medium text-primary-600 hover:text-primary-500 cursor-pointer">
//                         Click to upload
//                       </label>
//                       {' '}or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">PDF or DOCX up to 5MB</p>
//                   </div>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".pdf,.docx"
//                     onChange={handleFileSelect}
//                     className="sr-only" />
//                 </div>

//                 {selectedFile && (
//                   <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-slide-up">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
//                         <span className="text-sm font-medium text-blue-800">{selectedFile.name}</span>
//                       </div>
//                       <button
//                         onClick={handleUpload}
//                         disabled={loading}
//                         className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm py-2 px-4 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
//                       >
//                         {loading ? 'Uploading...' : 'Upload'}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div
//               className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${dragActive
//                 ? 'border-primary-400 bg-primary-50 scale-105'
//                 : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//             >
//               <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <DocumentArrowUpIcon className="h-8 w-8 text-primary-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your resume</h3>
//               <p className="text-sm text-gray-600 mb-8">
//                 Get AI-powered suggestions to improve your resume
//               </p>

//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="file-upload" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer inline-block">
//                     Choose File
//                   </label>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".pdf,.docx"
//                     onChange={handleFileSelect}
//                     className="sr-only" />
//                 </div>
//                 <p className="text-xs text-gray-500">or drag and drop your file here</p>
//                 <p className="text-xs text-gray-500">Supports PDF and DOCX files up to 5MB</p>
//               </div>

//               {selectedFile && (
//                 <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-slide-up">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
//                       <span className="text-sm font-medium text-blue-800">{selectedFile.name}</span>
//                     </div>
//                     <button
//                       onClick={handleUpload}
//                       disabled={loading}
//                       className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm py-2 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
//                     >
//                       {loading ? 'Uploading...' : 'Upload Resume'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* AI Suggestions Section */}
//         <div className="bg-white shadow-soft rounded-2xl border border-gray-100 p-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
//                 <SparklesIcon className="h-6 w-6 text-white" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
//             </div>
//             {resume && (
//               <button
//                 onClick={getSuggestions}
//                 disabled={loadingSuggestions}
//                 className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200 hover:shadow-xl"
//               >
//                 <SparklesIcon className="h-4 w-4 mr-2" />
//                 {loadingSuggestions ? 'Analyzing...' : 'Get AI Suggestions'}
//               </button>
//             )}
//           </div>

//           {/* Only one ternary chain here */}
//           {!resume ? (
//             <div className="text-center py-16">
//               <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <SparklesIcon className="h-8 w-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No Resume Uploaded</h3>
//               <p className="text-gray-500">Upload a resume to get AI-powered improvement suggestions.</p>
//             </div>
//           ) : loadingSuggestions ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <Rings color="#7c3aed" height={60} width={60} />
//               <p className="mt-4 text-sm text-gray-600 animate-pulse">Analyzing your resume with AI...</p>
//             </div>
//           ) : suggestions.length > 0 ? (
//             <div className="space-y-4">
//               {suggestions.map((suggestion, index) => (
//                 <div key={index} className="group border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 pl-6 py-4 rounded-r-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
//                   <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
//                     <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
//                       {index + 1}
//                     </span>
//                     {suggestion.title}
//                   </h4>
//                   <p className="text-sm text-purple-800 leading-relaxed">{suggestion.description}</p>
//                 </div>
//               ))}
//               <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
//                 <div className="flex items-start">
//                   <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
//                     <CheckCircleIcon className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold text-green-900 mb-1">💡 Pro Tip</h4>
//                     <p className="text-sm text-green-800">
//                       Apply these suggestions and re-upload your resume to see how your improvements score!
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-16">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <SparklesIcon className="h-8 w-8 text-purple-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for AI Analysis</h3>
//               <p className="text-gray-500 mb-4">
//                 Click "Get AI Suggestions" to receive personalized improvement recommendations.
//               </p>
//               <p className="text-sm text-gray-400">
//                 Our AI will analyze your resume structure, content, and keywords.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Resume Content Preview */}
//       {resume && (
//         <div className="bg-white shadow-soft rounded-2xl border border-gray-100 p-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
//                 <DocumentTextIcon className="h-6 w-6 text-white" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900">Resume Content Preview</h2>
//             </div>
//             <div className="flex items-center text-sm text-gray-500">
//               <DocumentTextIcon className="h-4 w-4 mr-1" />
//               <span>{resume.fileName}</span>
//             </div>
//           </div>
//           <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto border border-gray-200">
//             <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
//               {resume.content}
//             </pre>
//           </div>
//           <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
//             <span>Uploaded: {new Date(resume.updatedAt).toLocaleDateString()}</span>
//             <span>{Math.round(resume.content.length / 1000)}k characters</span>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
// src/pages/ResumeAssistant.jsx
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ResumeAssistant() {
  // Example suggestions
  const suggestions = [
    { title: "Use Action Verbs", description: "Start each bullet with a strong verb." },
    { title: "Quantify Achievements", description: "Add numbers to show impact." },
    { title: "Tailor to Job", description: "Include keywords from the job description." }
  ]
  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
          <SparklesIcon className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
      </div>
      <div className="space-y-4">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
            <CheckCircleIcon className="h-6 w-6 text-purple-400 mt-1" />
            <div>
              <div className="font-semibold text-purple-900">{s.title}</div>
              <div className="text-purple-800">{s.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}