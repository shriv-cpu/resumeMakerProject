import React, { useState } from 'react'
import { certificationInfoStyles as styles, commonStyles } from '../../assets/dummystyle'
import { Trash2, Plus } from 'lucide-react'

const CertificationInfoForm = ({ data, updateData }) => {
  const [certifications, setCertifications] = useState(data?.certifications || [{
    title: '',
    issuer: '',
    year: ''
  }])

  const handleChange = (index, field, value) => {
    const updated = [...certifications]
    updated[index][field] = value
    setCertifications(updated)
    updateData('certifications', updated)
  }

  const addCertification = () => {
    setCertifications([...certifications, {
      title: '',
      issuer: '',
      year: ''
    }])
  }

  const removeCertification = (index) => {
    const updated = certifications.filter((_, i) => i !== index)
    setCertifications(updated)
    updateData('certifications', updated)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Certifications</h2>
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={index} className={styles.item}>
            {certifications.length > 1 && (
              <button
                onClick={() => removeCertification(index)}
                className={commonStyles.trashButton}
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Certification Title</label>
                <input
                  type="text"
                  value={cert.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="w-full p-4 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Issuing Organization</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                    className="w-full p-4 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Year</label>
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => handleChange(index, 'year', e.target.value)}
                    placeholder="2024"
                    className="w-full p-4 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCertification}
          className={`${commonStyles.addButtonBase} ${styles.addButton}`}
        >
          <Plus size={20} /> Add Certification
        </button>
      </div>
    </div>
  )
}

export default CertificationInfoForm
