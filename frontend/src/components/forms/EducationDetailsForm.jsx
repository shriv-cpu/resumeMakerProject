import React, { useState } from 'react'
import { educationDetailsStyles as styles, commonStyles } from '../../assets/dummystyle'
import { Trash2, Plus } from 'lucide-react'

const EducationDetailsForm = ({ data, updateData }) => {
  const [education, setEducation] = useState(data?.education || [{
    degree: '',
    institution: '',
    startDate: '',
    endDate: ''
  }])

  const handleChange = (index, field, value) => {
    const updated = [...education]
    updated[index][field] = value
    setEducation(updated)
    updateData('education', updated)
  }

  const addEducation = () => {
    setEducation([...education, {
      degree: '',
      institution: '',
      startDate: '',
      endDate: ''
    }])
  }

  const removeEducation = (index) => {
    const updated = education.filter((_, i) => i !== index)
    setEducation(updated)
    updateData('education', updated)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Education</h2>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className={styles.item}>
            {education.length > 1 && (
              <button
                onClick={() => removeEducation(index)}
                className={commonStyles.trashButton}
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  className="w-full p-4 bg-white border border-indigo-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  placeholder="University Name"
                  className="w-full p-4 bg-white border border-indigo-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Start Date</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    className="w-full p-4 bg-white border border-indigo-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">End Date</label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="w-full p-4 bg-white border border-indigo-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className={`${commonStyles.addButtonBase} ${styles.addButton}`}
        >
          <Plus size={20} /> Add Education
        </button>
      </div>
    </div>
  )
}

export default EducationDetailsForm
