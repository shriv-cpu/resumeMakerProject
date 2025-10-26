import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dashboardStyles as styles } from '../assets/dummystyle'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { FilePlus as LucideFilePlus } from 'lucide-react'
import { ResumeSummaryCard } from '../components/Cards'
import moment from 'moment'
import toast from 'react-hot-toast'
import Model from '../components/Model'

const Dashboard = ({ factiveMenu, children }) => {

  const navigate = useNavigate();
  const [openCreateModel, setOpenCreateModel] = useState(false)
  const [allResumes, setResume] = useState([]);
  const [loading, setLoading] = useState(true)
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  // Calculate completion percentage for a resume
  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += (resume.interests?.length || 0);
    completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

    return Math.round((completedFields / totalFields) * 100);
  };


  const fetchAllResumes = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
      const resumesArray = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean)
      const resumesWithCompletion = resumesArray.map(resume => ({
        ...resume,
        completion: calculateCompletion(resume),
      }))
      setResume(resumesWithCompletion)
    } catch (error) {
      console.error(`error fetching resumes`, error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllResumes();
  }, []);
  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete))
      toast.success('resumeD eleted Successfully')
      fetchAllResumes()
    }
    catch (error) {
        console.error('Error deleting the resume', error)
        toast.error('failed to delete resume')
    }
    finally{
      setResumeToDelete(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteClick=(id)=>{
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  }

  
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>My Resume</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0 ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''}` : 'Start building your professional resume'}

            </p>
          </div>
          <div className=' flex gap-4'>
            <button className={styles.createButton}
              onClick={() => setOpenCreateModel(true)}>
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create Now
                <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={18} />
              </span>
            </button>
          </div>
        </div>
        {/*loading state*/}

        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {/* EMAPTY STATE */}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size={32} className=' text-violet-600' />
            </div>
            <h3 className={styles.emptyTitle}>No Resumes Yet</h3>
            <p className={styles.emptyText}>
              You haven't created any resumes yet. Start building your professional resume to land your dream job.
            </p>
            <button className={styles.createButton} onClick={() => setOpenCreateModel(true)}>
              <div className={styles.createButtonOverlay}>
              </div>
              <span className={styles.createButtonContent}>
                Create Your First Resume
                <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={28} />
              </span>
            </button>
          </div>
        )}


        {/* GRID VIEW */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            <div className={styles.newResumeCard} onClick={() => setOpenCreateModel(true)}>
              <div className={styles.newResumeIcon}>
                <LucideFilePlus size={32} className=' text-white' />
              </div>
              <h3 className={styles.newResumeTitle}>Create New Resume</h3>
              <p className={styles.newResumeText}>Start building your career</p>
            </div>
            {allResumes.map((resume) => (
              <ResumeSummaryCard key={resume._id} imgUrl={resume.thumbnailLink}
                title={resume.title} createdAt={resume.createdAt} updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() =>handleDeleteClick(resume._id)}
                completion={resume.completion  || 0}
                isPremium={resume.isPremium}
                isNew={moment().diff(moment(resume.createdAt),'days')< 7}
                />
    ))}
          </div>
        )}

      </div>


      {/* CREATE MODEL */}
      <Model
        isOpen={openCreateModel}
        onClose={() => setOpenCreateModel(false)}
        title="Create New Resume"
      >
        <div className="p-6">
          <CreateResumeModal onClose={() => setOpenCreateModel(false)} onSuccess={fetchAllResumes} />
        </div>
      </Model>

      {/* DELETE CONFIRMATION MODEL */}
      <Model
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Resume"
      >
        <div className="p-6 text-center">
          <div className={styles.deleteIconWrapper}>
            <LucideFilePlus size={32} className="text-red-600" />
          </div>
          <h3 className={styles.deleteTitle}>Delete Resume?</h3>
          <p className={styles.deleteText}>This action cannot be undone. Are you sure?</p>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteResume}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Model>
    </DashboardLayout>
  )
}

const CreateResumeModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a resume title')
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, { title })
      toast.success('Resume created successfully!')
      onSuccess()
      onClose()
      navigate(`/resume/${response.data._id}`)
    } catch (error) {
      console.error('Error creating resume:', error)
      toast.error('Failed to create resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCreate} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Resume Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Software Engineer Resume"
          className="w-full p-4 bg-white border border-violet-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-50 outline-none"
          autoFocus
        />
      </div>
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:scale-105 transition-all font-medium"
        >
          {loading ? 'Creating...' : 'Create Resume'}
        </button>
      </div>
    </form>
  )
}

export default Dashboard