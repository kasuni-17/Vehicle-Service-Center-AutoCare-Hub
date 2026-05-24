const mongoose = require('mongoose');
const Customer = require('./models/Customer');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/autocare-hub';

async function resetAdminPassword(email, newPassword) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');

    const customer = await Customer.findOne({ email });
    if (!customer) {
      console.log('User not found:', email);
      process.exit(1);
    }

    customer.password = newPassword;
    await customer.save();

    console.log('Password reset successfully for:', email);
    console.log('Name:', customer.name);
    console.log('Role:', customer.role);
    console.log('New password:', newPassword);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Get email and password from command line
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log('Usage: node reset-admin-password.js <email> <new-password>');
  console.log('Example: node reset-admin-password.js lakshi@gmail.com admin123');
  process.exit(1);
}

resetAdminPassword(email, newPassword);
