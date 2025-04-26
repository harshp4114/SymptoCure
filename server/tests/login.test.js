const axios = require('axios');

describe('Login API Tests', () => {
  it('should return a token if login is successful', async () => {
    const url = "http://localhost:5000/api/patient/login"; // Change this to your actual API endpoint
    const data = {
      email: "harshpatadia4114@gmail.com", // use a real email in your database
      password: "12345678",   // real password
      role: "patient"             // matching role
    };

    try {
      const response = await axios.post(url, data);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('patient');
      console.log("Login successful:", response.data.token);
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      }
      throw error; // re-throw to fail the test
    }
  });
});
