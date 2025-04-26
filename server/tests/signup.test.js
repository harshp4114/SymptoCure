const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Address = require('../models/addressModel');

jest.setTimeout(30000); // 30 seconds

const testEmails = [];

beforeAll(async () => {
  const mongoUri = "mongodb://localhost:27017/";
  await mongoose.connect(mongoUri);
});

describe('Signup API Tests', () => {
  it('should successfully create a new user', async () => {
    const url = "http://localhost:5000/api/patient/"; // ✅ correct route?
    const testEmail = `john${Date.now()}@example.com`;

    const data = {
      firstName: "John",
      lastName: "Doe",
      email: testEmail,
      phone: "1234567890",
      password: "StrongPassword123",
      age: 25,
      gender: "male",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001"
    };

    const response = await axios.post(url, data);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('message', 'User created successfully');
    expect(response.data).toHaveProperty('token');

    console.log("Signup successful, token:", response.data.token);

    testEmails.push(testEmail);
  });

  it('should fail if required field is missing', async () => {
    const url = "http://localhost:5000/api/patient/"; // ✅ use same endpoint!
    const uniqueEmail = `johndoe${Date.now()}@example.com`;

    const data = {
      lastName: "Doe",
      email: uniqueEmail,
      phone: "1234567890",
      password: "StrongPassword123",
      age: 25,
      gender: "male",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001"
    };

    try {
      await axios.post(url, data);
      throw new Error('Expected API to fail for missing field');
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      expect(status).toBe(400);
      expect(errorData.success).toBe(false);
      expect(errorData.message).toContain('Missing required field');
    }
  });

  it('should fail if email already exists', async () => {
    const url = "http://localhost:5000/api/patient/"; // ✅ consistent endpoint
    const email = `jane${Date.now()}@example.com`;

    await axios.post(url, {
      firstName: "Jane",
      lastName: "Doe",
      email: email,
      phone: "1234567890",
      password: "StrongPassword123",
      age: 28,
      gender: "female",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      zipCode: "90001"
    });

    testEmails.push(email);

    try {
      await axios.post(url, {
        firstName: "Jane",
        lastName: "Doe",
        email: email,
        phone: "1234567890",
        password: "StrongPassword123",
        age: 28,
        gender: "female",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        zipCode: "90001"
      });
      throw new Error('Expected API to fail for duplicate email');
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      expect(status).toBe(400);
      expect(errorData.success).toBe(false);
      expect(errorData.message).toBe('User with this email already exists');
    }
  });
});

afterAll(async () => {
  console.log("Cleaning up test users and addresses...");

  try {
    if (testEmails.length > 0) {
      await User.deleteMany({ email: { $in: testEmails } });
    }
    await Address.deleteMany({});
  } catch (cleanupError) {
    console.error('Error during cleanup:', cleanupError.message);
  }

  await mongoose.connection.close();
  console.log("Cleanup complete.");
});
