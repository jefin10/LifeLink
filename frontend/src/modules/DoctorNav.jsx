import React from 'react';
import logo from "../Images/logo.png";
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiService';

const DoctorNav = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.response ? error.response.data : error.message);
    }
  }

  return (
    <nav className="h-16 bg-white shadow-md ">
      <div className="flex items-center justify-between h-full px-12 mx-auto ">
        <div className="flex items-center space-x-4">
          <img 
            src={logo} 
            alt="LifeLink Logo" 
            className="object-contain w-12 h-12"
          />
          <span className="text-2xl font-bold text-gray-800">LifeLink</span>
        </div>

        <button 
          style={{paddingLeft:'10px',paddingRight:'10px' ,paddingTop:'8px',paddingBottom:'8px' ,marginRight:"10px"}}
          className="flex items-center px-6 py-3 text-white transition-colors duration-200 bg-red-600 rounded-lg shadow-sm hover:bg-red-700"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default DoctorNav;