// seed.js - Populate database with sample data
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

const SAMPLE_COMPLAINTS = [
  { title: 'Broken Water Pipeline', description: 'Water pipeline near sector 12 is leaking causing water shortage.', category: 'Water', lat: 28.6139, lng: 77.2090, status: 'Pending' },
  { title: 'Power Outage', description: 'Frequent power cuts in the locality for past 3 days.', category: 'Electricity', lat: 28.6229, lng: 77.2190, status: 'In Progress' },
  { title: 'Pothole on Main Road', description: 'Large pothole near the market causing accidents.', category: 'Roads', lat: 28.6050, lng: 77.2200, status: 'Pending' },
  { title: 'Garbage Not Collected', description: 'Garbage has not been collected from our street for 5 days.', category: 'Garbage', lat: 28.6300, lng: 77.2100, status: 'Resolved' },
  { title: 'Sewage Overflow', description: 'Sewage overflowing near the park, causing health hazard.', category: 'Sewage', lat: 28.6180, lng: 77.2250, status: 'Pending' },
  { title: 'Street Light Not Working', description: 'Multiple street lights are broken near housing complex.', category: 'Electricity', lat: 28.6100, lng: 77.2150, status: 'In Progress' },
  { title: 'Road Flooded', description: 'Road near underpass gets flooded during rain.', category: 'Roads', lat: 28.6350, lng: 77.2300, status: 'Pending' },
  { title: 'Dirty Water Supply', description: 'Water supplied from municipality is brown and dirty.', category: 'Water', lat: 28.6080, lng: 77.2050, status: 'In Progress' },
  { title: 'Illegal Dumping', description: 'People are illegally dumping construction waste on the road.', category: 'Garbage', lat: 28.6420, lng: 77.2180, status: 'Pending' },
  { title: 'Water Pipe Burst', description: 'Main water pipe burst, water gushing out for 2 days.', category: 'Water', lat: 28.6200, lng: 77.2300, status: 'Resolved' },
  { title: 'No Street Lighting', description: 'Entire block has no street lighting since last week.', category: 'Electricity', lat: 28.6280, lng: 77.2400, status: 'Pending' },
  { title: 'Damaged Road Divider', description: 'Road divider is broken and poses safety risk.', category: 'Roads', lat: 28.6160, lng: 77.2350, status: 'In Progress' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});

    // Create admin user
    const adminPass = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL,
      phone: '9999999999',
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });

    // Create sample users
    const users = await User.create([
      { firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@example.com', phone: '9876543210', password: 'password123' },
      { firstName: 'Priya', lastName: 'Patel', email: 'priya@example.com', phone: '9876543211', password: 'password123' },
      { firstName: 'Amit', lastName: 'Kumar', email: 'amit@example.com', phone: '9876543212', password: 'password123' }
    ]);

    // Assign complaints to users
    for (let i = 0; i < SAMPLE_COMPLAINTS.length; i++) {
      const c = SAMPLE_COMPLAINTS[i];
      const user = users[i % users.length];
      await Complaint.create({
        title: c.title,
        description: c.description,
        category: c.category,
        location: { lat: c.lat, lng: c.lng, address: 'New Delhi, India' },
        status: c.status,
        submittedBy: user._id
      });
    }

    console.log('Seed data inserted successfully!');
    console.log('Admin login: ' + process.env.ADMIN_EMAIL + ' / ' + process.env.ADMIN_PASSWORD);
    console.log('User login: rahul@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
