import axios from 'axios'

const API_BASE_URL = "/"; 

export const API_URL = "/"; // Replace with your actual API URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, 
  headers:{
    "Content-Type":"application/json",
  },
});


export const registerUser = async (role, gmail, password) => {
  if (role == "h"){
    return api.post("/api/hospitals/register", { role, gmail, password });
  }
    
  };

  export const loginUser = async (role, gmail, password) => {
    if (role == "h"){
      return api.post("/api/hospitals/login", {gmail, password });
    }
    if(role=="d"){
      return api.post("/api/doctors/login", {gmail, password })
    }  
    };