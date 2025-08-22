import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaPlus, FaTrash, FaArrowLeft, FaEye } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

const EditResume = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [resume, setResume] = useState(null);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      summary: '',
      adress: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    volunteer: [],
    awards: []
  });

  useEffect(() => {
    if (user && id) {
      fetchResume();
    }
  }, [user, id]);

  const fetchResume = async () => {
    try {
      const response = await axiosInstance.get(`/api/resumes/${id}`);
      
      // Handle the API response structure: {success: true, data: {...}}
      if (response.data.success && response.data.data) {
        setResume(response.data.data);
        setFormData(response.data.data);
      } else if (response.data._id) {
        // Fallback for direct resume object response
        setResume(response.data);
        setFormData(response.data);
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error fetching resume');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await axiosInstance.put(`/api/resumes/${id}`, formData);

      if (response.data.success) {
        navigate(`/resumes/${id}`);
      } else {
        setError(response.data.message || 'Failed to update resume');
      }
    } catch (err) {
      console.error('Error updating resume:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error updating resume');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error && !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/resumes')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Resumes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/resumes/${id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Resume
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Resume</h1>
              <p className="text-gray-600">Update your professional resume</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/resumes/${id}`)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <FaEye className="mr-2" />
                Preview
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={formData.personalInfo.title}
                  onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                <textarea
                  value={formData.personalInfo.summary}
                  onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                  rows="3"
                  placeholder="Brief overview of your professional background and goals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Education</h2>
              <button
                type="button"
                onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', gpa: '' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Education
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('education', index)}
                  className="mt-2 text-red-600 hover:text-red-800 flex items-center text-sm"
                >
                  <FaTrash className="mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
              <button
                type="button"
                onClick={() => addArrayItem('experience', { title: '', company: '', startDate: '', endDate: '', description: '' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Experience
              </button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                      placeholder="e.g., Jan 2020"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                      placeholder="e.g., Present"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                      rows="3"
                      placeholder="Describe your responsibilities and achievements"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('experience', index)}
                  className="mt-2 text-red-600 hover:text-red-800 flex items-center text-sm"
                >
                  <FaTrash className="mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
              <button
                type="button"
                onClick={() => addArrayItem('skills', { name: '', level: 'Beginner' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Skill
              </button>
            </div>
            {formData.skills.map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleArrayChange('skills', index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      value={skill.level}
                      onChange={(e) => handleArrayChange('skills', index, 'level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('skills', index)}
                  className="mt-2 text-red-600 hover:text-red-800 flex items-center text-sm"
                >
                  <FaTrash className="mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/resumes/${id}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResume;
