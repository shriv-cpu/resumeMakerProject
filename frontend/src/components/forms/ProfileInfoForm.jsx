import React, { useState } from 'react'
import { profileInfoStyles as styles } from '../../assets/dummystyle'
import { Camera } from 'lucide-react'

const ProfileInfoForm = ({ data, updateData }) => {
  const [profileData, setProfileData] = useState(data?.profileInfo || {
    fullName: '',
    designation: '',
    summary: '',
    profilePreviewUrl: ''
  })

  const handleChange = (field, value) => {
    const updated = { ...profileData, [field]: value }
    setProfileData(updated)
    updateData('profileInfo', updated)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange('profilePreviewUrl', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Profile Information</h2>
      
      <div className="flex justify-center mb-8">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profile-upload"
          />
          <label htmlFor="profile-upload" className="cursor-pointer">
            {profileData.profilePreviewUrl ? (
              <img
                src={profileData.profilePreviewUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Camera className="text-gray-400" size={32} />
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="w-full p-4 bg-white border border-rose-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Designation</label>
          <input
            type="text"
            value={profileData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            placeholder="Full Stack Developer"
            className="w-full p-4 bg-white border border-rose-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Professional Summary</label>
          <textarea
            value={profileData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Write a brief summary about yourself..."
            rows={6}
            className={styles.textarea}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoForm
