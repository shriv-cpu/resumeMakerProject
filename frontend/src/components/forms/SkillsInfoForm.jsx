import React, { useState } from 'react'
import { skillsInfoStyles as styles, commonStyles } from '../../assets/dummystyle'
import { Trash2, Plus } from 'lucide-react'

const SkillsInfoForm = ({ data, updateData }) => {
  const [skills, setSkills] = useState(data?.skills || [{
    name: '',
    progress: 0
  }])

  const handleChange = (index, field, value) => {
    const updated = [...skills]
    updated[index][field] = value
    setSkills(updated)
    updateData('skills', updated)
  }

  const addSkill = () => {
    setSkills([...skills, { name: '', progress: 0 }])
  }

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index)
    setSkills(updated)
    updateData('skills', updated)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Skills</h2>
      <div className="space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className={styles.item}>
            {skills.length > 1 && (
              <button
                onClick={() => removeSkill(index)}
                className={commonStyles.trashButton}
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="JavaScript, React, Node.js..."
                  className="w-full p-4 bg-white border border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Proficiency Level: {skill.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.progress}
                  onChange={(e) => handleChange(index, 'progress', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addSkill}
          className={`${commonStyles.addButtonBase} ${styles.addButton}`}
        >
          <Plus size={20} /> Add Skill
        </button>
      </div>
    </div>
  )
}

export default SkillsInfoForm
