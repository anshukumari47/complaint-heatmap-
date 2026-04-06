// models/Complaint.js - Complaint schema
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Water', 'Electricity', 'Roads', 'Garbage', 'Sewage', 'Other']
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    address: {
      type: String,
      default: ''
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate complaints: same user + same category + same approximate location
// We round to 3 decimal places (~111m precision) to detect "same location"
complaintSchema.index(
  {
    submittedBy: 1,
    category: 1,
    'location.lat': 1,
    'location.lng': 1
  },
  { unique: false } // We handle this in the controller with custom logic
);

module.exports = mongoose.model('Complaint', complaintSchema);
