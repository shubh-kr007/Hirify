// src/pages/Resume.jsx
import { useState } from 'react'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'

export default function Resume() {
  const [file, setFile] = useState(null)
  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#232c47]">Upload Resume</h2>
      <div className="flex flex-col items-center">
        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-300 rounded-xl bg-white/80 hover:bg-primary-50 transition">
          <DocumentArrowUpIcon className="h-10 w-10 text-primary-400 mb-2" />
          <span className="text-primary-700 font-medium">Click or drag file to upload</span>
          <input
            type="file"
            className="hidden"
            onChange={e => setFile(e.target.files[0])}
          />
        </label>
        {file && (
          <div className="mt-4 text-primary-700">{file.name}</div>
        )}
      </div>
    </div>
  )
}