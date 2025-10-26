import React, { useState } from 'react'
import { projectDetailStyles as styles, commonStyles } from '../../assets/dummystyle'
import { Trash2, Plus } from 'lucide-react'

const ProjectDetailForm = ({ data, updateData }) => {
  const [projects, setProjects] = useState(data?.projects || [{
    title: '',
    description: '',
    github: '',
    liveDemo: ''
  }])

  const handleChange = (index, field, value) => {
    const updated = [...projects]
    updated[index][field] = value
    setProjects(updated)
    updateData('projects', updated)
  }

  const addProject = () => {
    setProjects([...projects, {
      title: '',
      description: '',
      github: '',
      liveDemo: ''
    }])
  }

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index)
    setProjects(updated)
    updateData('projects', updated)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Projects</h2>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className={styles.item}>
            {projects.length > 1 && (
              <button
                onClick={() => removeProject(index)}
                className={commonStyles.trashButton}
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full p-4 bg-white border border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="Describe the project, technologies used, and your role..."
                  rows={4}
                  className={styles.textarea}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">GitHub Link</label>
                  <input
                    type="url"
                    value={project.github}
                    onChange={(e) => handleChange(index, 'github', e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full p-4 bg-white border border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Live Demo</label>
                  <input
                    type="url"
                    value={project.liveDemo}
                    onChange={(e) => handleChange(index, 'liveDemo', e.target.value)}
                    placeholder="https://myproject.com"
                    className="w-full p-4 bg-white border border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProject}
          className={`${commonStyles.addButtonBase} ${styles.addButton}`}
        >
          <Plus size={20} /> Add Project
        </button>
      </div>
    </div>
  )
}

export default ProjectDetailForm
