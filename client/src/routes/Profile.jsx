import React from "react";

const Profile = () => {
  return (
    <div className="bg-gray-100 absolute mt-24 w-full h-[86.7vh] flex justify-center items-center">
      {/* Outer Container */}
      <div className="bg-white w-3/4 h-full rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar/Profile Picture Section */}
        <div className="w-full md:w-1/4 h-full bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col items-center py-10 px-5">
          {/* Profile Picture */}
          <img
            src="./logo.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          {/* Name */}
          <h1 className="mt-4 text-xl font-bold">John Doe</h1>
          {/* Role */}
          <p className="text-sm text-gray-200">Software Developer</p>

          {/* Social Media Links */}
          <div className="mt-6 flex space-x-4">
            <a href="#" className="text-white hover:text-gray-200">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="w-full md:w-3/4 h-full bg-gray-50 p-8 flex flex-col">
          {/* Section Header */}
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            Profile Information
          </h2>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Full Name:</label>
              <p className="text-gray-600">John Doe</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Email:</label>
              <p className="text-gray-600">johndoe@example.com</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Phone:</label>
              <p className="text-gray-600">+123 456 7890</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-40">Address:</label>
              <p className="text-gray-600">123 Main Street, New York, NY</p>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
            <p className="text-gray-600 mt-2">
              I am a passionate software developer with expertise in creating
              efficient and scalable applications. I enjoy problem-solving and
              staying updated with the latest technologies.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
              Edit Profile
            </button>
            <button className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
