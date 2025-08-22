import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaArrowLeft, FaPrint, FaDownload, FaStar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaCode, FaTrophy, FaGlobe } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

const ViewResume = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } else if (response.data._id) {
        // Fallback for direct resume object response
        setResume(response.data);
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

  const handlePrint = () => {
    window.print();
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

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Resume not found'}</p>
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
    <div className="min-h-screen bg-gray-50 p-6 print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="mb-6 print:hidden">
          <button
            onClick={() => navigate('/resumes')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Resumes
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Preview</h1>
              <p className="text-gray-600">Review and print your professional resume</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/resumes/${id}/edit`)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit Resume
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          {/* Resume Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 print:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 print:text-3xl">
                  {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
                </h1>
                <p className="text-xl text-blue-100 print:text-lg">
                  {resume.personalInfo?.title || 'Professional Title'}
                </p>
              </div>
              {resume.isDefault && (
                <FaStar className="text-yellow-300 text-2xl" title="Default Resume" />
              )}
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {resume.personalInfo?.email && (
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-blue-200" />
                  <span>{resume.personalInfo.email}</span>
                </div>
              )}
              {resume.personalInfo?.phone && (
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-blue-200" />
                  <span>{resume.personalInfo.phone}</span>
                </div>
              )}
              {resume.personalInfo?.adress && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-200" />
                  <span>
                    {resume.personalInfo.adress}, {resume.personalInfo?.city} {resume.personalInfo?.state} {resume.personalInfo?.zipCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Resume Body */}
          <div className="p-8 print:p-6">
            {/* Professional Summary */}
            {resume.personalInfo?.summary && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 print:text-xl">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed print:text-sm">
                  {resume.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl flex items-center">
                  <FaBriefcase className="mr-3 text-blue-600" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 print:text-base">
                          {exp.title}
                        </h3>
                        <span className="text-gray-600 text-sm print:text-xs">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-2 print:text-sm">{exp.company}</p>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed print:text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl flex items-center">
                  <FaGraduationCap className="mr-3 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 print:text-base">
                          {edu.degree}
                        </h3>
                        <p className="text-blue-600 font-medium print:text-sm">{edu.institution}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 print:text-sm">{edu.year}</p>
                        {edu.gpa && <p className="text-gray-600 print:text-sm">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl flex items-center">
                  <FaCode className="mr-3 text-blue-600" />
                  Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resume.skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 print:text-sm">{skill.name}</span>
                      <span className="text-gray-600 text-sm print:text-xs">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl">Projects</h2>
                <div className="space-y-4">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="border-l-4 border-green-600 pl-6">
                      <h3 className="text-lg font-semibold text-gray-800 print:text-base mb-1">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-gray-700 print:text-sm">{project.description}</p>
                      )}
                      {project.technologies && (
                        <p className="text-gray-600 text-sm print:text-xs mt-1">
                          <span className="font-medium">Technologies:</span> {project.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl flex items-center">
                  <FaTrophy className="mr-3 text-blue-600" />
                  Certifications
                </h2>
                <div className="space-y-3">
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 print:text-sm">{cert.name}</span>
                      <span className="text-gray-600 text-sm print:text-xs">{cert.issuer} - {cert.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {resume.languages && resume.languages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl flex items-center">
                  <FaGlobe className="mr-3 text-blue-600" />
                  Languages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resume.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 print:text-sm">{lang.name}</span>
                      <span className="text-gray-600 text-sm print:text-xs">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards & Achievements */}
            {resume.awards && resume.awards.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl">Awards & Achievements</h2>
                <div className="space-y-3">
                  {resume.awards.map((award, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 print:text-sm">{award.name}</span>
                      <span className="text-gray-600 text-sm print:text-xs">{award.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Work */}
            {resume.volunteer && resume.volunteer.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl">Volunteer Experience</h2>
                <div className="space-y-4">
                  {resume.volunteer.map((vol, index) => (
                    <div key={index} className="border-l-4 border-purple-600 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 print:text-base">
                          {vol.role}
                        </h3>
                        <span className="text-gray-600 text-sm print:text-xs">
                          {vol.startDate} - {vol.endDate || 'Present'}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-2 print:text-sm">{vol.organization}</p>
                      {vol.description && (
                        <p className="text-gray-700 print:text-sm">{vol.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewResume;
