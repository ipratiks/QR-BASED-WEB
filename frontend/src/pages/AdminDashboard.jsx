import React, { useState, useEffect } from 'react';
import { getAverageWaitingTime, getAllPatients } from '../api/patientApi';

const AdminDashboard = () => {
  const [averageTime, setAverageTime] = useState(0);
  const [patients, setPatients] = useState([]);
  const [loadingAverage, setLoadingAverage] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAverageWaitingTime = async () => {
    setLoadingAverage(true);
    try {
      const data = await getAverageWaitingTime();
      setAverageTime(data.averageWaitingTime);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load average waiting time.' });
      console.error('Error fetching average waiting time:', error);
    } finally {
      setLoadingAverage(false);
    }
  };

  const fetchAllPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load all patients data.' });
      console.error('Error fetching all patients:', error);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchAverageWaitingTime();
    fetchAllPatients();

    // Optionally refresh data periodically
    const avgInterval = setInterval(fetchAverageWaitingTime, 60000); // Every minute
    const patientsInterval = setInterval(fetchAllPatients, 30000); // Every 30 seconds

    return () => {
      clearInterval(avgInterval);
      clearInterval(patientsInterval);
    };
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div>
      <h1>📊 Admin Dashboard</h1>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2>Average Waiting Time (Today/All Time)</h2>
        {loadingAverage ? (
          <p>Calculating average waiting time...</p>
        ) : (
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#27ae60' }}>
            {averageTime} minutes
          </p>
        )}
      </div>

      <h2>All Patient Records</h2>
      {loadingPatients ? (
        <p>Loading patient records...</p>
      ) : patients.length === 0 ? (
        <p>No patient records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Registration Time</th>
              <th>Doctor Appointment Time</th>
              <th>Waiting Time (minutes)</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{formatDateTime(patient.registrationTime)}</td>
                <td>{patient.doctorAppointmentTime ? formatDateTime(patient.doctorAppointmentTime) : 'N/A (Waiting)'}</td>
                <td>{patient.waitingTime !== null ? `${patient.waitingTime} min` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;