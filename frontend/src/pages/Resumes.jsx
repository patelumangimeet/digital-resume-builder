import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaEye, FaTrash, FaCopy, FaStar, FaCalendarAlt, FaUser } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

const Resumes = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      const response = await axiosInstance.get('/api/resumes');
      // Handle the API response structure: {success: true, count: 1, data: [...]}
      if (response.data.success && response.data.data) {
        setResumes(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Fallback for direct array response
        setResumes(response.data);
      } else {
        setResumes([]);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error fetching resumes');
      }
      setResumes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axiosInstance.delete(`/api/resumes/${id}`);
        setResumes(resumes.filter(resume => resume._id !== id));
      } catch (err) {
        console.error('Error deleting resume:', err);
        setError('Error deleting resume');
      }
    }
  };

  const duplicateResume = async (id) => {
    try {
      const response = await axiosInstance.post(`/api/resumes/${id}/duplicate`);
      // Handle the API response structure
      const newResume = response.data.success ? response.data.data : response.data;
      setResumes([...resumes, newResume]);
    } catch (err) {
      console.error('Error duplicating resume:', err);
      setError('Error duplicating resume');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Digital Resume Builder</h1>
          <p className="text-gray-600 mb-6">Create professional resumes in minutes</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Resumes</h1>
          <p className="text-gray-600">Manage and create your professional resumes</p>
        </div>

        {/* Create New Resume Button */}
        <div className="mb-6">
          <Link
            to="/resumes/create"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <FaPlus className="mr-2" />
            Create New Resume
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Resumes Grid */}
        {!Array.isArray(resumes) || resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {!Array.isArray(resumes) ? 'Error loading resumes' : 'No resumes yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {!Array.isArray(resumes) 
                ? 'There was an issue loading your resumes. Please try refreshing the page.' 
                : 'Create your first professional resume to get started'
              }
            </p>
            <Link
              to="/resumes/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
              >
                {/* Resume Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">
                      {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
                    </h3>
                    {resume.isDefault && (
                      <FaStar className="text-yellow-300" title="Default Resume" />
                    )}
                  </div>
                  <p className="text-blue-100 text-sm">
                    {resume.personalInfo?.title || 'Professional Title'}
                  </p>
                </div>

                {/* Resume Content */}
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUser className="mr-2 text-blue-500" />
                      <span>{resume.personalInfo?.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      <span>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <div className="font-semibold text-gray-800">
                        {resume.experience?.length || 0}
                      </div>
                      <div className="text-gray-600">Experience</div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <div className="font-semibold text-gray-800">
                        {resume.education?.length || 0}
                      </div>
                      <div className="text-gray-600">Education</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/resumes/${resume._id}`}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-center hover:bg-blue-200 transition-colors text-sm"
                    >
                      <FaEye className="inline mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/resumes/${resume._id}/edit`}
                      className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-center hover:bg-green-200 transition-colors text-sm"
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => duplicateResume(resume._id)}
                      className="bg-purple-100 text-purple-700 px-3 py-2 rounded hover:bg-purple-200 transition-colors text-sm"
                      title="Duplicate Resume"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={() => deleteResume(resume._id)}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition-colors text-sm"
                      title="Delete Resume"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resumes;
