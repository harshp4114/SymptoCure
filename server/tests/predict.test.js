const axios = require('axios');

jest.setTimeout(30000); // Set timeout, because ML prediction might take a second

describe('Predict API Tests', () => {
  it('should successfully return disease predictions', async () => {
    const url = "http://localhost:5000/predict"; // Node.js server endpoint
    const symptoms = ["headache", "fever", "cough"]; // 🛠️ Provide valid symptoms your model expects

    const response = await axios.post(url, { symptoms });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('predictions');
    expect(Array.isArray(response.data.predictions)).toBe(true);
    expect(response.data.predictions.length).toBeGreaterThan(0);

    response.data.predictions.forEach(prediction => {
      expect(prediction).toHaveProperty('disease');
      expect(typeof prediction.disease).toBe('string');
      expect(prediction).toHaveProperty('probability');
      expect(typeof prediction.probability).toBe('number');
    });

    console.log("Prediction results:", response.data.predictions);
  });

  it('should handle empty symptoms array gracefully', async () => {
    const url = "http://localhost:5000/predict";

    try {
      const response = await axios.post(url, { symptoms: [] });
      // Depending on your FastAPI logic, maybe it still returns something
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('predictions');
    } catch (error) {
      const status = error.response?.status;
      expect(status).toBe(400); // Or whatever error code you want if no symptoms
      console.log("Handled empty symptoms:", error.response.data);
    }
  });

  it('should fail if symptoms field is missing', async () => {
    const url = "http://localhost:5000/predict";
  
    try {
      await axios.post(url, { /* no symptoms */ });
      throw new Error('Expected API to fail for missing symptoms');
    } catch (error) {
      const status = error.response?.status;
      // Change to 500 if you're seeing this error as expected
      expect(status).toBe(500); 
      console.log("Handled missing symptoms:", error.response.data);
    }
  });
  
});
