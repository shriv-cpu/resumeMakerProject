import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Download, Eye, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { containerStyles, buttonStyles, statusStyles, modalStyles } from '../assets/dummystyle'
import ProfileInfoForm from './forms/ProfileInfoForm'
import ContactInfoForm from './forms/ContactInfoForm'
import WorkExperienceForm from './forms/WorkExperienceForm'
import EducationDetailsForm from './forms/EducationDetailsForm'
import SkillsInfoForm from './forms/SkillsInfoForm'
import ProjectDetailForm from './forms/ProjectDetailForm'
import CertificationInfoForm from './forms/CertificationInfoForm'
import AdditionalInfoForm from './forms/AdditionalInfoForm'
import ResumePreview from './ResumePreview'
import Model from './Model'

const CreateResumeForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const previewRef = useRef(null)
  
  const [currentSection, setCurrentSection] = useState(0)
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [title, setTitle] = useState('Untitled Resume')

  const sections = [
    { name: 'Profile Info', component: ProfileInfoForm },
    { name: 'Contact Info', component: ContactInfoForm },
    { name: 'Work Experience', component: WorkExperienceForm },
    { name: 'Education', component: EducationDetailsForm },
    { name: 'Skills', component: SkillsInfoForm },
    { name: 'Projects', component: ProjectDetailForm },
    { name: 'Certifications', component: CertificationInfoForm },
    { name: 'Additional Info', component: AdditionalInfoForm },
  ]

  useEffect(() => {
    fetchResumeData()
  }, [id])

  const fetchResumeData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(id))
      setResumeData(response.data)
      setTitle(response.data.title || 'Untitled Resume')
    } catch (error) {
      console.error('Error fetching resume:', error)
      toast.error('Failed to load resume')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(id), resumeData)
      toast.success('Resume saved successfully!')
    } catch (error) {
      console.error('Error saving resume:', error)
      toast.error('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = previewRef.current
      
      const opt = {
        margin: 0,
        filename: `${title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(element).save()
      toast.success('Resume downloaded successfully!')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to download resume')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axiosInstance.delete(API_PATHS.RESUME.DELETE(id))
        toast.success('Resume deleted successfully!')
        navigate('/dashboard')
      } catch (error) {
        console.error('Error deleting resume:', error)
        toast.error('Failed to delete resume')
      }
    }
  }

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  const CurrentSectionComponent = sections[currentSection].component

  return (
    <div className={containerStyles.main}>
      <div className={containerStyles.header}>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-600">Section: {sections[currentSection].name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/dashboard')} className={buttonStyles.back}>
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={handleSave} disabled={saving} className={buttonStyles.save}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setShowPreviewModal(true)} className={buttonStyles.download}>
            <Eye size={16} /> Preview
          </button>
          <button onClick={handleDownloadPDF} className={buttonStyles.download}>
            <Download size={16} /> Download
          </button>
          <button onClick={handleDelete} className={buttonStyles.delete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className={containerStyles.grid}>
        <div className={containerStyles.formContainer}>
          <CurrentSectionComponent
            data={resumeData}
            updateData={updateResumeData}
          />
          
          <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={currentSection === 0}
              className={buttonStyles.back}
            >
              <ArrowLeft size={16} /> Previous
            </button>
            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                className={buttonStyles.next}
              >
                Next <ArrowLeft size={16} className="rotate-180" />
              </button>
            ) : (
              <button onClick={handleDownloadPDF} className={buttonStyles.next}>
                <Download size={16} /> Download PDF
              </button>
            )}
          </div>
        </div>

        <div className={containerStyles.previewContainer}>
          <div className={containerStyles.previewInner}>
            <ResumePreview ref={previewRef} data={resumeData} />
          </div>
        </div>
      </div>

      <Model
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Resume Preview"
      >
        <div className={containerStyles.modalContent}>
          <div className={modalStyles.header}>
            <h3 className={modalStyles.title}>Resume Preview</h3>
            <button onClick={handleDownloadPDF} className={modalStyles.actionButton}>
              <Download size={16} /> Download PDF
            </button>
          </div>
          <div className={modalStyles.body}>
            <ResumePreview ref={previewRef} data={resumeData} />
          </div>
        </div>
      </Model>
    </div>
  )
}

export default CreateResumeForm
