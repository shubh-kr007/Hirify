// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { SignIn, SignUp, useAuth } from '@clerk/clerk-react'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import JobTracker from './pages/JobTracker'
// import ResumeAssistant from './pages/ResumeAssistant'
// import Profile from './pages/Profile'
// import JobDetails from './pages/JobDetails'
// import LandingPage from './pages/LandingPage'
// import { Rings } from 'react-loader-spinner'

// function ProtectedRoute({ children }) {
//   const { isSignedIn, isLoaded } = useAuth()
  
//   if (!isLoaded) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <Rings color="#3b82f6" height={80} width={80} />
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }
  
//   if (!isSignedIn) {
//     return <Navigate to="/" replace />
//   }
  
//   return children
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route 
//           path="/sign-in/*" 
//           element={
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//               <SignIn routing="path" path="/sign-in" />
//             </div>
//           } 
//         />
//         <Route 
//           path="/sign-up/*" 
//           element={
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//               <SignUp routing="path" path="/sign-up" />
//             </div>
//           } 
//         />
        
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Layout>
//               <Dashboard />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/jobs" element={
//           <ProtectedRoute>
//             <Layout>
//               <JobTracker />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/jobs/:id" element={
//           <ProtectedRoute>
//             <Layout>
//               <JobDetails />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/resume" element={
//           <ProtectedRoute>
//             <Layout>
//               <ResumeAssistant />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/profile" element={
//           <ProtectedRoute>
//             <Layout>
//               <Profile />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         {/* Redirect any unknown routes to dashboard if signed in, otherwise to landing */}
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import GlassLayout from './components/GlassLayout'
import JobTracker from './pages/JobTracker'
import Resume from './pages/Resume'
import ResumeAssistant from './pages/ResumeAssistant'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Router>
      <GlassLayout>
        <Routes>
          <Route path="/dashboard" element={<JobTracker />} />
          <Route path="/jobs" element={<JobTracker />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/resume-assistant" element={<ResumeAssistant />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </GlassLayout>
    </Router>
  )
}