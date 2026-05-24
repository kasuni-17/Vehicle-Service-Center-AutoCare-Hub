require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autocare-hub')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Set user as admin
const setEmailAsAdmin = async (email) => {
  try {
    const customer = await Customer.findOne({ email });
    
    if (!customer) {
      console.log('Customer not found with email:', email);
      process.exit(1);
    }

    customer.role = 'admin';
    await customer.save();
    
    console.log(`User ${email} has been set as admin successfully!`);
    console.log('Name:', customer.name);
    console.log('Role:', customer.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node set-admin.js <email>');
  console.log('Example: node set-admin.js admin@example.com');
  process.exit(1);
}

setEmailAsAdmin(email);
