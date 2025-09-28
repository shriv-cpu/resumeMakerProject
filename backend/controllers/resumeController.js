import Resume from "../models/resumeModel.js"
import fs from'fs'
import path from'path';
export const createResume = async (req, res) => {
    try {
        const { title } = req.body; 

        //default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        });

        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({ message: "failed to create resume", error: error.message });
    }
};

//get func
export const getResumeUser = async (req, res) => {
    try {
        const resumes = await Resume.findOne({ userId: req.user._id }).sort({
            updatedAt: -1
        });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: "failed to fetch resume", error: error.message });
    }
}

export const getResumeById =async (req,res) => {
    try {
        const resume =await Resume.findOne({_id: req.params.id, userId: req.user._id})
        if(!resume){
            return res.status(401).json({message:"resume not found"})

        }
        res.json(resume)


    } catch (error) {
        
    }
}

//update resume fx
export const updateResume=async(req,res)=>{
    try {
        const resume =await Resume.findOne({_id: req.params.id, userId: req.user._id})
        if(!resume){
             return res.status(401).json({message:"resume not found or authorised"})
        }

        //merge update resume
        Object.assign(resume,req.body)
        //save update resumeeee
        const saveResume =await resume.save();
        res.json(saveResume)

    } catch (error) {
        res.status(500).json({ message: "failed to update resume", error: error.message });
    }
}


//delete resumeee
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!resume) {
            return res.status(401).json({ message: "resume not found or not authorized" })
        }

        // uploads folder path
        const uploadFolder = path.join(process.cwd(), "uploads")

        // delete thumbnail if exists
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadFolder, path.basename(resume.thumbnailLink))
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail) // 
            }
        }

        // delete profile preview if exists
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
                uploadFolder,
                path.basename(resume.profileInfo.profilePreviewUrl) // 
            )
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile) // 
            }
        }

        // delete resume from MongoDB
        const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!deleted) {
            return res.status(404).json({ message: "resume not found or not authorized" })
        }

        res.json({ message: "resume deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "failed to delete resume", error: error.message })
    }
}