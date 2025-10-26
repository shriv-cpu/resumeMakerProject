import React, { useState } from 'react'
import { workExperienceStyles as styles, commonStyles } from '../../assets/dummystyle'
import { Trash2, Plus } from 'lucide-react'

const WorkExperienceForm = ({ data, updateData }) => {
  const [experiences, setExperiences] = useState(data?.workExperience || [{
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: ''
  }])

  const handleChange = (index, field, value) => {
    const updated = [...experiences]
    updated[index][field] = value
    setExperiences(updated)
    updateData('workExperience', updated)
  }

  const addExperience = () => {
    setExperiences([...experiences, {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    }])
  }

  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index)
    setExperiences(updated)
    updateData('workExperience', updated)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Work Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className={styles.item}>
            {experiences.length > 1 && (
              <button
                onClick={() => removeExperience(index)}
                className={commonStyles.trashButton}
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                    placeholder="Company Name"
                    className="w-full p-4 bg-white border border-green-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                    placeholder="Job Title"
                    className="w-full p-4 bg-white border border-green-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    className="w-full p-4 bg-white border border-green-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">End Date</label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="w-full p-4 bg-white border border-green-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className={`${commonStyles.addButtonBase} ${styles.addButton}`}
        >
          <Plus size={20} /> Add Work Experience
        </button>
      </div>
    </div>
  )
}

export default WorkExperienceForm
