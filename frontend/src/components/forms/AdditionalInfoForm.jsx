import React, { useState } from 'react'
import { additionalInfoStyles as styles, commonStyles } from '../../assets/dummystyle'
import { Trash2, Plus } from 'lucide-react'

const AdditionalInfoForm = ({ data, updateData }) => {
  const [languages, setLanguages] = useState(data?.languages || [{ name: '', progress: 0 }])
  const [interests, setInterests] = useState(data?.interests || [''])

  const handleLanguageChange = (index, field, value) => {
    const updated = [...languages]
    updated[index][field] = value
    setLanguages(updated)
    updateData('languages', updated)
  }

  const addLanguage = () => {
    setLanguages([...languages, { name: '', progress: 0 }])
  }

  const removeLanguage = (index) => {
    const updated = languages.filter((_, i) => i !== index)
    setLanguages(updated)
    updateData('languages', updated)
  }

  const handleInterestChange = (index, value) => {
    const updated = [...interests]
    updated[index] = value
    setInterests(updated)
    updateData('interests', updated)
  }

  const addInterest = () => {
    setInterests([...interests, ''])
  }

  const removeInterest = (index) => {
    const updated = interests.filter((_, i) => i !== index)
    setInterests(updated)
    updateData('interests', updated)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Additional Information</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className={styles.sectionHeading}>
            <div className={styles.dotViolet}></div>
            Languages
          </h3>
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className={styles.languageItem}>
                {languages.length > 1 && (
                  <button
                    onClick={() => removeLanguage(index)}
                    className={commonStyles.trashButton}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                    placeholder="English, Spanish..."
                    className="w-full p-3 bg-white border border-violet-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-50 outline-none"
                  />
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Proficiency: {lang.progress}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lang.progress}
                      onChange={(e) => handleLanguageChange(index, 'progress', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addLanguage}
              className={`${commonStyles.addButtonBase} ${styles.addButtonLanguage}`}
            >
              <Plus size={20} /> Add Language
            </button>
          </div>
        </div>

        <div>
          <h3 className={styles.sectionHeading}>
            <div className={styles.dotOrange}></div>
            Interests
          </h3>
          <div className="space-y-4">
            {interests.map((interest, index) => (
              <div key={index} className={styles.interestItem}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) => handleInterestChange(index, e.target.value)}
                    placeholder="Photography, Hiking, Reading..."
                    className="flex-1 p-3 bg-white border border-orange-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-50 outline-none"
                  />
                  {interests.length > 1 && (
                    <button
                      onClick={() => removeInterest(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={addInterest}
              className={`${commonStyles.addButtonBase} ${styles.addButtonInterest}`}
            >
              <Plus size={20} /> Add Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfoForm
