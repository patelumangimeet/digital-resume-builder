const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    firstName: { 
      type: String, 
      required: true, 
      trim: true
    },
    lastName: { 
      type: String, 
      required: true, 
      trim: true
    },
    email: { 
      type: String, 
      required: true, 
      trim: true
    },
    phone: { 
      type: String, 
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    adress: { 
      type: String, 
      trim: true
    },
    city: { 
      type: String, 
      trim: true
    },
    state: { 
      type: String, 
      trim: true
    },
    zipCode: { 
      type: String, 
      trim: true
    },
    country: { 
      type: String, 
      trim: true
    },
    linkedin: { 
      type: String, 
      trim: true
    },
    website: { 
      type: String, 
      trim: true
    },
    summary: { 
      type: String, 
      trim: true
    }
  },
  education: [{
    institution: { 
      type: String, 
      required: true, 
      trim: true
    },
    degree: { 
      type: String, 
      required: true, 
      trim: true
    },
    fieldOfStudy: { 
      type: String, 
      trim: true
    },
    year: { 
      type: String, 
      trim: true
    },
    startDate: { 
      type: String, 
      trim: true
    },
    endDate: { 
      type: String, 
      trim: true
    },
    current: { 
      type: Boolean, 
      default: false 
    },
    gpa: { 
      type: String, 
      trim: true
    },
    description: { 
      type: String, 
      trim: true
    },
    achievements: [{
      type: String,
      trim: true
    }]
  }],
  experience: [{
    company: { 
      type: String, 
      required: true, 
      trim: true
    },
    title: { 
      type: String, 
      required: true, 
      trim: true
    },
    location: { 
      type: String, 
      trim: true
    },
    startDate: { 
      type: String, 
      trim: true
    },
    endDate: { 
      type: String, 
      trim: true
    },
    current: { 
      type: Boolean, 
      default: false 
    },
    description: { 
      type: String, 
      trim: true
    },
    achievements: [{
      type: String,
      trim: true
    }],
    technologies: [{
      type: String,
      trim: true
    }]
  }],
  skills: [{
    name: { 
      type: String, 
      required: true, 
      trim: true
    },
    level: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    },
    category: { 
      type: String, 
      default: 'Technical Skils'
    }
  }],
  projects: [{
    title: { 
      type: String, 
      required: true, 
      trim: true
    },
    description: { 
      type: String, 
      trim: true
    },
    technologies: { 
      type: String, 
      trim: true
    },
    link: { 
      type: String, 
      trim: true
    },
    github: { 
      type: String, 
      trim: true
    },
    startDate: { 
      type: String, 
      trim: true
    },
    endDate: { 
      type: String, 
      trim: true
    },
    current: { 
      type: Boolean, 
      default: false 
    }
  }],
  certifications: [{
    name: { 
      type: String, 
      required: true, 
      trim: true
    },
    issuer: { 
      type: String, 
      trim: true
    },
    year: { 
      type: String, 
      trim: true
    },
    date: { 
      type: String, 
      trim: true
    },
    link: { 
      type: String, 
      trim: true
    },
    description: { 
      type: String, 
      trim: true
    }
  }],
  languages: [{
    name: { 
      type: String, 
      required: true, 
      trim: true
    },
    proficiency: { 
      type: String, 
      enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
      default: 'Basic'
    }
  }],
  volunteer: [{
    organisation: { 
      type: String, 
      required: true, 
      trim: true
    },
    role: { 
      type: String, 
      required: true, 
      trim: true
    },
    startDate: { 
      type: String, 
      trim: true
    },
    endDate: { 
      type: String, 
      trim: true
    },
    current: { 
      type: Boolean, 
      default: false 
    },
    description: { 
      type: String, 
      trim: true
    }
  }],
  awards: [{
    name: { 
      type: String, 
      required: true, 
      trim: true
    },
    year: { 
      type: String, 
      trim: true
    },
    issuer: { 
      type: String, 
      trim: true
    },
    description: { 
      type: String, 
      trim: true
    }
  }],
  template: {
    type: String,
    default: 'modern'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
