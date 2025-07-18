// frontend/src/api/patientApi.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

// Helper function to get token
const getToken = () => localStorage.getItem('token');

export const registerPatient = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error registering patient:', error);
    throw error;
  }
};

export const recordAppointmentTime = async (patientId) => {
  const token = getToken();
  if (!token) throw new Error('Authentication token not found. Please log in.');

  try {
    const response = await fetch(`${API_BASE_URL}/patients/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include token
      },
      body: JSON.stringify({ patientId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error recording appointment time:', error);
    throw error;
  }
};

export const getAllPatients = async () => {
  const token = getToken();
  if (!token) throw new Error('Authentication token not found. Please log in.');

  try {
    const response = await fetch(`${API_BASE_URL}/patients/`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include token
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const getAverageWaitingTime = async () => {
  const token = getToken();
  if (!token) throw new Error('Authentication token not found. Please log in.');

  try {
    const response = await fetch(`${API_BASE_URL}/patients/average-waiting-time`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include token
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching average waiting time:', error);
    throw error;
  }
};

export const getCurrentUserRole = async () => {
  const token = getToken();
  if (!token) throw new Error('Authentication token not found. Please log in.');

  try {
    const response = await fetch(`${API_BASE_URL}/patients/current-user-role`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include token
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching current user role:', error);
    throw error;
  }
};