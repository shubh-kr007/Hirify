import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResumeAI from './pages/ResumeAI';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignIn redirectUrl="/dashboard" />} />
      <Route path="/sign-up/*" element={<SignUp redirectUrl="/dashboard" />} />

      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Layout />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resume-ai" element={<ResumeAI />} />
        {/* Add more routes here */}
      </Route>
    </Routes>
  );
}