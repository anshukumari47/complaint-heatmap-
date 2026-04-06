// controllers/complaintController.js - Complaint CRUD logic
const Complaint = require('../models/Complaint');

// Helper: round to 3 decimal places for location comparison (~111m)
const roundCoord = (n) => Math.round(parseFloat(n) * 1000) / 1000;

// POST /api/complaints - Submit a new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, lat, lng, address } = req.body;

    if (!title || !description || !category || lat == null || lng == null) {
      return res.status(400).json({ message: 'All fields including location are required.' });
    }

    const roundedLat = roundCoord(lat);
    const roundedLng = roundCoord(lng);

    // Check for duplicate: same user + same category + same approximate location
    const duplicate = await Complaint.findOne({
      submittedBy: req.user._id,
      category,
      'location.lat': { $gte: roundedLat - 0.001, $lte: roundedLat + 0.001 },
      'location.lng': { $gte: roundedLng - 0.001, $lte: roundedLng + 0.001 }
    });

    if (duplicate) {
      return res.status(409).json({
        message: 'You have already submitted a complaint for this category at this location.'
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location: { lat: parseFloat(lat), lng: parseFloat(lng), address: address || '' },
      submittedBy: req.user._id
    });

    await complaint.populate('submittedBy', 'firstName lastName email');

    res.status(201).json({ message: 'Complaint submitted successfully.', complaint });
  } catch (err) {
    console.error('Create complaint error:', err.message);
    res.status(500).json({ message: 'Server error while submitting complaint.' });
  }
};

// GET /api/complaints - Get all complaints (with optional filters)
const getComplaints = async (req, res) => {
  try {
    const { category, status, mine } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (mine === 'true') filter.submittedBy = req.user._id;

    const complaints = await Complaint.find(filter)
      .populate('submittedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ complaints, total: complaints.length });
  } catch (err) {
    console.error('Get complaints error:', err.message);
    res.status(500).json({ message: 'Server error while fetching complaints.' });
  }
};

// PATCH /api/complaints/:id/status - Admin updates complaint status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('submittedBy', 'firstName lastName email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.json({ message: 'Status updated successfully.', complaint });
  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
};

module.exports = { createComplaint, getComplaints, updateStatus };
