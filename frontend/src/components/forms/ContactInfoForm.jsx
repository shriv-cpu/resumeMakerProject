import React, { useState } from 'react'
import { contactInfoStyles as styles } from '../../assets/dummystyle'
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react'

const ContactInfoForm = ({ data, updateData }) => {
  const [contactData, setContactData] = useState(data?.contactInfo || {
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  })

  const handleChange = (field, value) => {
    const updated = { ...contactData, [field]: value }
    setContactData(updated)
    updateData('contactInfo', updated)
  }

  const fields = [
    { icon: Mail, label: 'Email', field: 'email', placeholder: 'john.doe@example.com', type: 'email' },
    { icon: Phone, label: 'Phone', field: 'phone', placeholder: '+1 (555) 123-4567', type: 'tel' },
    { icon: MapPin, label: 'Location', field: 'location', placeholder: 'New York, NY', type: 'text' },
    { icon: Linkedin, label: 'LinkedIn', field: 'linkedin', placeholder: 'linkedin.com/in/johndoe', type: 'url' },
    { icon: Github, label: 'GitHub', field: 'github', placeholder: 'github.com/johndoe', type: 'url' },
    { icon: Globe, label: 'Website', field: 'website', placeholder: 'www.johndoe.com', type: 'url' },
  ]

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Contact Information</h2>
      <div className="space-y-6">
        {fields.map(({ icon: Icon, label, field, placeholder, type }) => (
          <div key={field}>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Icon size={16} className="text-blue-600" />
              {label}
            </label>
            <input
              type={type}
              value={contactData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="w-full p-4 bg-white border border-blue-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactInfoForm
