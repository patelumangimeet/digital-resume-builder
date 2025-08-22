const Resume = require('../models/Resume');
const User = require('../models/User');

exports.createResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const resumeData = {
      ...req.body,
      userId: req.user.id
    };

    const existingResumes = await Resume.countDocuments({ userId: req.user.id });
    if (existingResumes === 0) {
      resumeData.isDefault = true;
    }

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create resume'
    });
  }
};

exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .select('-__v')
      .sort({ lastModified: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Get user resumes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes'
    });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    if (resume.userId.toString() !== req.user.id && !resume.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume'
    });
  }
};

exports.updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        lastModified: Date.now() 
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update resume'
    });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    if (resume.isDefault) {
      const otherResume = await Resume.findOne({ 
        userId: req.user.id, 
        _id: { $ne: req.params.id } 
      });
      
      if (otherResume) {
        otherResume.isDefault = true;
        await otherResume.save();
      }
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume'
    });
  }
};

exports.setDefaultResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    await Resume.updateMany(
      { userId: req.user.id },
      { isDefault: false }
    );

    resume.isDefault = true;
    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Resume set as default',
      data: resume
    });
  } catch (error) {
    console.error('Set default resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set default resume'
    });
  }
};

exports.getDefaultResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      userId: req.user.id, 
      isDefault: true 
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'No default resume found'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get default resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch default resume'
    });
  }
};

exports.getPublicResumes = async (req, res) => {
  try {
    const { page = 1, limit = 10, template, search } = req.query;
    
    let query = { isPublic: true };
    
    if (template) {
      query.template = template;
    }
    
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.summary': { $regex: search, $options: 'i' } }
      ];
    }

    const resumes = await Resume.find(query)
      .select('personalInfo.firstName personalInfo.lastName personalInfo.summary template lastModified')
      .sort({ lastModified: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Resume.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resumes.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: resumes
    });
  } catch (error) {
    console.error('Get public resumes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public resumes'
    });
  }
};

exports.duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findById(req.params.id);

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    if (originalResume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const duplicateData = {
      ...originalResume.toObject(),
      _id: undefined,
      userId: req.user.id,
      isDefault: false,
      isPublic: false,
      lastModified: Date.now()
    };

    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    const duplicateResume = new Resume(duplicateData);
    await duplicateResume.save();

    res.status(201).json({
      success: true,
      message: 'Resume duplicated successfully',
      data: duplicateResume
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to duplicate resume'
    });
  }
};
