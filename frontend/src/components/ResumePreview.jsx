import React, { forwardRef } from 'react'
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react'

const ResumePreview = forwardRef(({ data }, ref) => {
  if (!data) return <div className="p-8 text-center text-gray-500">No data available</div>

  const { profileInfo, contactInfo, workExperience, education, skills, projects, certifications, languages, interests } = data

  return (
    <div ref={ref} className="bg-white shadow-lg max-w-[800px] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-8">
        <div className="flex items-start gap-6">
          {profileInfo?.profilePreviewUrl && (
            <img
              src={profileInfo.profilePreviewUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profileInfo?.fullName || 'Your Name'}</h1>
            <p className="text-xl opacity-90">{profileInfo?.designation || 'Your Designation'}</p>
          </div>
        </div>
        {profileInfo?.summary && (
          <p className="mt-4 text-sm leading-relaxed opacity-95">{profileInfo.summary}</p>
        )}
      </div>

      <div className="p-8 space-y-6">
        {/* Contact Information */}
        {contactInfo && Object.values(contactInfo).some(v => v) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {contactInfo.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} className="text-violet-600" />
                  <span>{contactInfo.email}</span>
                </div>
              )}
              {contactInfo.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={16} className="text-violet-600" />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} className="text-violet-600" />
                  <span>{contactInfo.location}</span>
                </div>
              )}
              {contactInfo.linkedin && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Linkedin size={16} className="text-violet-600" />
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 truncate">
                    {contactInfo.linkedin}
                  </a>
                </div>
              )}
              {contactInfo.github && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Github size={16} className="text-violet-600" />
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 truncate">
                    {contactInfo.github}
                  </a>
                </div>
              )}
              {contactInfo.website && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe size={16} className="text-violet-600" />
                  <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 truncate">
                    {contactInfo.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.some(exp => exp.company || exp.role) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Work Experience</h2>
            <div className="space-y-4">
              {workExperience.filter(exp => exp.company || exp.role).map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-800">{exp.role || 'Position'}</h3>
                      <p className="text-violet-600 font-medium">{exp.company || 'Company'}</p>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-sm text-gray-500 italic">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.some(edu => edu.degree || edu.institution) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Education</h2>
            <div className="space-y-3">
              {education.filter(edu => edu.degree || edu.institution).map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-800">{edu.degree || 'Degree'}</h3>
                  <p className="text-violet-600">{edu.institution || 'Institution'}</p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="text-sm text-gray-500 italic">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.some(skill => skill.name) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Skills</h2>
            <div className="space-y-3">
              {skills.filter(skill => skill.name).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full transition-all"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.some(project => project.title) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Projects</h2>
            <div className="space-y-4">
              {projects.filter(project => project.title).map((project, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-800">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mt-1">{project.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline flex items-center gap-1">
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {project.liveDemo && (
                      <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline flex items-center gap-1">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.some(cert => cert.title) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Certifications</h2>
            <div className="space-y-2">
              {certifications.filter(cert => cert.title).map((cert, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{cert.title}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                  </div>
                  {cert.year && (
                    <span className="text-sm bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.some(lang => lang.name) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Languages</h2>
            <div className="space-y-2">
              {languages.filter(lang => lang.name).map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{lang.name}</span>
                  <span className="text-sm text-gray-600">{lang.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests && interests.some(i => i?.trim()) && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-violet-600 pb-2 mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.filter(i => i?.trim()).map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

ResumePreview.displayName = 'ResumePreview'

export default ResumePreview
