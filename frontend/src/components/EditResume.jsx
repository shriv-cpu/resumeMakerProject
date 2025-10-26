import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import DashboardLayout from "./DashboardLayout";
import html2pdf from 'html2pdf.js';

// Import form components
import ProfileInfoForm from "./forms/ProfileInfoForm";
import ContactInfoForm from "./forms/ContactInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationDetailsForm from "./forms/EducationDetailsForm";
import SkillsInfoForm from "./forms/SkillsInfoForm";
import ProjectDetailForm from "./forms/ProjectDetailForm";
import CertificationInfoForm from "./forms/CertificationInfoForm";
import AdditionalInfoForm from "./forms/AdditionalInfoForm";

const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((node) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });

      resizeObserver.observe(node);
    }
  }, []);

  return { ...size, ref };
};

const EditResume = () => {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const resumeDownloadRef = useRef(null)
  const thumbnailRef = useRef(null)

  const [openThemeSelector, setOpenThemeSelector] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState("profile-info")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "modern",
      colorPalette: []
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  })

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resumeData.profileInfo.fullName) completedFields++;
    if (resumeData.profileInfo.designation) completedFields++;
    if (resumeData.profileInfo.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resumeData.contactInfo.email) completedFields++;
    if (resumeData.contactInfo.phone) completedFields++;

    // Work Experience
    resumeData.workExperience.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resumeData.education.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resumeData.skills.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resumeData.projects.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resumeData.certifications.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resumeData.languages.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter(i => i.trim() !== "").length;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  };

  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]

      if (key === null) {
        updatedArray[index] = value
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        }
      }

      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }))
  }

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]
      updatedArray.splice(index, 1)
      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId))

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience: resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications: resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
        }))
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
      toast.error("Failed to load resume data")
    }
  }

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById()
    }
  }, [resumeId])

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);
  
  const validateAndNext = (e) => {
    e.preventDefault();
    const errors = [];

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full Name is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;

      case "contact-info":
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.");
        if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required");
        break;

      case "work-experience":
        resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
          if (!company || !company.trim()) errors.push(`Company is required in experience ${index + 1}`);
          if (!role || !role.trim()) errors.push(`Role is required in experience ${index + 1}`);
          if (!startDate || !endDate) errors.push(`Start and End dates are required in experience ${index + 1}`);
        });
        break;

      case "education-info":
        resumeData.education.forEach(({ degree, institution, startDate, endDate }, index) => {
          if (!degree.trim()) errors.push(`Degree is required in education ${index + 1}`);
          if (!institution.trim()) errors.push(`Institution is required in education ${index + 1}`);
          if (!startDate || !endDate) errors.push(`Start and End dates are required in education ${index + 1}`);
        });
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim()) errors.push(`Skill name is required in skill ${index + 1}`);
          if (progress < 1 || progress > 100)
            errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`);
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim()) errors.push(`Project Title is required in project ${index + 1}`);
          if (!description.trim()) errors.push(`Project description is required in project ${index + 1}`);
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim()) errors.push(`Certification Title is required in certification ${index + 1}`);
          if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`);
        });
        break;

      case "additionalInfo":
        if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
          errors.push("At least one language is required");
        }
        if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
          errors.push("At least one interest is required");
        }
        break;

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    setErrorMsg("");
    goToNextStep();
  };

  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "additionalInfo") {
      // Save the resume and go to preview
      updateResumeDetails();
      return;
    }

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      const percent = Math.round(((nextIndex + 1) / pages.length) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "profile-info") {
      navigate("/dashboard");
      return;
    }

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      const percent = Math.round((prevIndex / pages.length) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData.profileInfo}
            updateSection={(key, value) => updateSection("profileInfo", key, value)}
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData.contactInfo}
            updateSection={(key, value) => updateSection("contactInfo", key, value)}
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData.workExperience}
            updateArrayItem={(index, key, value) => updateArrayItem("workExperience", index, key, value)}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData.education}
            updateArrayItem={(index, key, value) => updateArrayItem("education", index, key, value)}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoForm
            skills={resumeData.skills}
            updateArrayItem={(index, key, value) => updateArrayItem("skills", index, key, value)}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectDetailForm
            projects={resumeData.projects}
            updateArrayItem={(index, key, value) => updateArrayItem("projects", index, key, value)}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData.certifications}
            updateArrayItem={(index, key, value) => updateArrayItem("certifications", index, key, value)}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(index, key, value) => updateArrayItem("languages", index, key, value)}
            addArrayItem={(newItem) => addArrayItem("languages", newItem)}
            removeArrayItem={(index) => removeArrayItem("languages", index)}
          />
        );

      default:
        return <div>Form not found</div>;
    }
  };

  const updateResumeDetails = async () => {
    try {
      setIsLoading(true);

      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
        ...resumeData,
        completion: completionPercentage,
      });
      
      toast.success("Resume saved successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating resume:", err);
      toast.error("Failed to update resume details");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResumeAsPDF = async () => {
    try {
      setIsDownloading(true);
      toast.loading("Generating PDF...", { id: "pdf-download" });

      // Create a temporary div to render the resume with proper styling
      const resumeContent = `
        <div id="resume-preview" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; color: #333;">
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #eee;">
            <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; color: #2d3748;">${resumeData.profileInfo.fullName || 'Your Name'}</h1>
            <p style="font-size: 18px; color: #4a5568; margin: 5px 0;">${resumeData.profileInfo.designation || 'Professional Title'}</p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; flex-wrap: wrap; font-size: 14px; color: #4a5568;">
              ${resumeData.contactInfo.email ? `<span>${resumeData.contactInfo.email}</span>` : ''}
              ${resumeData.contactInfo.phone ? `<span>${resumeData.contactInfo.phone}</span>` : ''}
              ${resumeData.contactInfo.location ? `<span>${resumeData.contactInfo.location}</span>` : ''}
              ${resumeData.contactInfo.linkedin ? `<span>LinkedIn: ${resumeData.contactInfo.linkedin}</span>` : ''}
              ${resumeData.contactInfo.github ? `<span>GitHub: ${resumeData.contactInfo.github}</span>` : ''}
            </div>
          </div>
          
          ${resumeData.profileInfo.summary ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; color: #2d3748;">Summary</h2>
            <p style="line-height: 1.6; color: #4a5568;">${resumeData.profileInfo.summary}</p>
          </div>
          ` : ''}
          
          ${resumeData.workExperience && resumeData.workExperience.length > 0 && resumeData.workExperience[0].company ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; color: #2d3748;">Work Experience</h2>
            ${resumeData.workExperience.map(exp => exp.company ? `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 5px;">
                  <h3 style="font-size: 18px; font-weight: bold; margin: 0; color: #2d3748;">${exp.role || 'Job Title'}</h3>
                  <p style="margin: 0; color: #4a5568; font-style: italic;">${exp.startDate || ''} - ${exp.endDate || ''}</p>
                </div>
                <p style="font-weight: 600; margin: 5px 0; color: #4a5568;">${exp.company || 'Company Name'}</p>
                <p style="line-height: 1.6; color: #4a5568;">${exp.description || ''}</p>
              </div>
            ` : '').join('')}
          </div>
          ` : ''}
          
          ${resumeData.education && resumeData.education.length > 0 && resumeData.education[0].degree ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; color: #2d3748;">Education</h2>
            ${resumeData.education.map(edu => edu.degree ? `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 5px;">
                  <h3 style="font-size: 18px; font-weight: bold; margin: 0; color: #2d3748;">${edu.degree || 'Degree'}</h3>
                  <p style="margin: 0; color: #4a5568; font-style: italic;">${edu.startDate || ''} - ${edu.endDate || ''}</p>
                </div>
                <p style="font-weight: 600; margin: 5px 0; color: #4a5568;">${edu.institution || 'Institution'}</p>
              </div>
            ` : '').join('')}
          </div>
          ` : ''}
          
          ${resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0].name ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; color: #2d3748;">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${resumeData.skills.map(skill => skill.name ? `
                <span style="background: #edf2f7; padding: 6px 12px; border-radius: 20px; font-size: 14px; color: #4a5568; font-weight: 500;">${skill.name}</span>
              ` : '').join('')}
            </div>
          </div>
          ` : ''}
          
          ${resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0].title ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; color: #2d3748;">Projects</h2>
            ${resumeData.projects.map(project => project.title ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 5px 0; color: #2d3748;">${project.title || 'Project Title'}</h3>
                <p style="line-height: 1.6; color: #4a5568; margin-bottom: 10px;">${project.description || ''}</p>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                  ${project.github ? `<span style="color: #4a5568;"><strong>GitHub:</strong> ${project.github}</span>` : ''}
                  ${project.liveDemo ? `<span style="color: #4a5568;"><strong>Live Demo:</strong> ${project.liveDemo}</span>` : ''}
                </div>
              </div>
            ` : '').join('')}
          </div>
          ` : ''}
        </div>
      `;

      // Create a hidden div to hold the content
      const printWindow = document.createElement('div');
      printWindow.innerHTML = resumeContent;
      printWindow.style.position = 'absolute';
      printWindow.style.left = '-9999px';
      printWindow.style.top = '-9999px';
      printWindow.style.width = '800px';
      printWindow.style.background = 'white';
      document.body.appendChild(printWindow);

      // Generate PDF
      const options = {
        margin: 10,
        filename: `${resumeData.title || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Import html2pdf dynamically
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(options).from(printWindow).save();
      
      // Clean up
      document.body.removeChild(printWindow);
      
      toast.success("PDF downloaded successfully!", { id: "pdf-download" });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF", { id: "pdf-download" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Resume Builder</h2>
            <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          
          <div className="text-sm text-gray-600">
            Step {(() => {
              const pages = ["profile-info", "contact-info", "work-experience", "education-info", "skills", "projects", "certifications", "additionalInfo"];
              return pages.indexOf(currentPage) + 1;
            })()} of 8
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={downloadResumeAsPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </>
              )}
            </button>
            
            <button
              onClick={goToNextStep}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
            >
              {currentPage === "additionalInfo" ? "Save & Finish" : "Next"}
              {currentPage !== "additionalInfo" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {renderForm()}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          
          <button
            onClick={goToNextStep}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
          >
            {currentPage === "additionalInfo" ? "Save & Finish" : "Next"}
            {currentPage !== "additionalInfo" && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditResume;