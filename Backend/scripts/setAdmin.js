const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const userEmailToMakeAdmin = 'recreations014@gmail.com';
const defaultPassword = 'Admin123@asdfgh';

const createOrUpdateAdmin = async () => {
  try {
    // Try local first, then Atlas
    const localURI = process.env.MONGO_URI_LOCAL;
    const atlasURI = process.env.MONGO_URI_ATLAS;
    
    let dbUrl = localURI || atlasURI;
    
    if (!dbUrl) {
      console.error('❌ No database URI found in .env file');
      console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
      return;
    }

    console.log('🔄 Connecting to database...');
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Database connected successfully');

    console.log(`🔍 Searching for user with email: ${userEmailToMakeAdmin}`);
    let user = await User.findOne({ email: userEmailToMakeAdmin });

    if (user) {
      console.log(`👤 User found: ${user.name} (Current role: ${user.role})`);
      if (user.role === 'admin') {
        console.log('✅ User is already an admin. No changes needed.');
      } else {
        user.role = 'admin';
        await user.save();
        console.log(`✅ Successfully updated user role to 'admin' for ${user.email}`);
      }
    } else {
      console.log(`❌ User with email ${userEmailToMakeAdmin} not found.`);
      console.log('🔨 Creating new admin user...');
      
      user = new User({
        name: 'Admin User',
        email: userEmailToMakeAdmin,
        password: defaultPassword,
        role: 'admin',
        authProvider: 'local',
        isEmailVerified: true,
        isPhoneVerified: true
      });
      
      await user.save();
      console.log(`✅ Successfully created new admin user with email: ${userEmailToMakeAdmin}`);
      console.log(`🔑 Password: ${defaultPassword}`);
    }

    // Verify the user exists and has correct role
    const verifyUser = await User.findOne({ email: userEmailToMakeAdmin });
    console.log('\n📋 Final verification:');
    console.log(`   Email: ${verifyUser.email}`);
    console.log(`   Name: ${verifyUser.name}`);
    console.log(`   Role: ${verifyUser.role}`);
    console.log(`   ID: ${verifyUser._id}`);

  } catch (error) {
    console.error('❌ An error occurred:', error.message);
    if (error.code === 11000) {
      console.error('   This is likely a duplicate key error. The user might already exist.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
  }
};

createOrUpdateAdmin();
