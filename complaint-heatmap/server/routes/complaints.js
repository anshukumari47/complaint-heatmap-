const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateStatus } = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');
router.post('/complaints', protect, createComplaint);
router.get('/complaints', protect, getComplaints);
router.patch('/complaints/:id/status', protect, adminOnly, updateStatus);
module.exports = router;
