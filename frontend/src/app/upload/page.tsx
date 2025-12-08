'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api'; // Our configured Axios instance
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !targetRole) {
      setError('Please fill in all fields and upload a file.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('target_role', targetRole);
    formData.append('experience_level', experienceLevel);
    formData.append('file', file);

    try {
      // The interceptor in lib/api.ts automatically adds the Auth Token
      await api.post('/profile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to Dashboard (or later, the Results page)
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 text-indigo-600 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
            <Upload size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Upload Your Resume</h2>
          <p className="mt-2 text-gray-600">Let AI analyze your career path</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Job Role</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior React Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Fresher">Fresher (0-1 Years)</option>
              <option value="Junior">Junior (1-3 Years)</option>
              <option value="Mid-Level">Mid-Level (3-5 Years)</option>
              <option value="Senior">Senior (5+ Years)</option>
            </select>
          </div>

          {/* File Upload Area */}
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
            <div className="space-y-1 text-center">
              {file ? (
                <div className="flex flex-col items-center text-green-600">
                  <CheckCircle size={40} />
                  <p className="text-sm font-medium mt-2">{file.name}</p>
                  <button 
                    type="button" 
                    onClick={() => setFile(null)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a PDF</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-md text-sm">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Analyze My Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}