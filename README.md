# SymptoCure 🩺💻

## Project Overview

SymptoCure is a comprehensive healthcare platform that combines machine learning-powered disease detection with remote doctor consultation, providing users with an end-to-end health management solution.

### 🌟 Key Features

- **Intelligent Symptom Analysis**
  - ML-powered disease prediction
  - Comprehensive symptom input system
  - Accurate medical diagnostics

- **Doctor Consultation**
  - Specialist doctor matching
  - Easy appointment booking
  - Seamless communication platform

- **User Management**
  - Secure authentication (JWT)
  - Separate patient and doctor dashboards
  - Profile management

### 🛠 Technologies Used

#### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios

#### Backend
- Node.js
- Express.js
- MongoDB
- FastAPI (Python)

#### Machine Learning
- Python
- Scikit-learn
- Kaggle Datasets
- Machine Learning Prediction Models

#### Additional Technologies
- JWT Authentication
- Socket.IO (Real-time communication)

### 🚀 Getting Started

#### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- pip

#### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/harshp4114/SymptoCure.git
cd symptocure
```

2. Install Backend Dependencies
```bash
# Main Backend
cd backend
npm install

# ML Backend
cd ml-backend
pip install -r requirements.txt
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Run the Application
```bash
# Start Backend
cd backend
npm start

# Start ML Backend
cd ml-backend
uvicorn main:app --reload

# Start Frontend
cd frontend
npm start
```

### 🤖 Machine Learning Model

The disease prediction model is trained on curated medical datasets from Kaggle, utilizing various machine learning algorithms to provide accurate predictions based on user-input symptoms.


### 🔐 Authentication Flow

1. User Registration (Patient/Doctor)
2. JWT Token Generation
3. Secure Route Protection

### 🙏 Acknowledgements
- Kaggle Datasets
- Open-source libraries
