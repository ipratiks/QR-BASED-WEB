import React, { useState, useEffect } from 'react';
import QRCodeScanner from '../components/QRCodeScanner';
import QRCodeGenerator from '../components/QRCodeGenerator'; // Import QRCodeGenerator
import { recordAppointmentTime, getAllPatients } from '../api/patientApi';

const DoctorConsole = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients();
      // Sort patients: those who haven't seen the doctor first, then by registration time
      const sortedPatients = data.sort((a, b) => {
        if (!a.doctorAppointmentTime && b.doctorAppointmentTime) return -1; // a comes before b
        if (a.doctorAppointmentTime && !b.doctorAppointmentTime) return 1;  // b comes before a
        return new Date(a.registrationTime) - new Date(b.registrationTime); // Sort by registration time
      });
      setPatients(sortedPatients);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load patients.' });
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // Refresh patients every 30 seconds for real-time updates
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleScanSuccess = async (patientId) => {
    setMessage({ type: '', text: '' }); // Clear previous messages
    try {
      await recordAppointmentTime(patientId);
      setMessage({ type: 'success', text: `Appointment time recorded for patient ID: ${patientId}` });
      fetchPatients(); // Refresh the list
    } catch (error) {
      if (error.message && error.message.includes('QR code has already been scanned')) {
        setMessage({ type: 'error', text: `Error: ${error.message}` });
      } else {
        setMessage({ type: 'error', text: `Failed to record appointment time for ${patientId}.` });
      }
      console.error('Recording appointment time error:', error);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString(); // Format to a readable string
  };

  return (
    <div>
      <h1>👨‍⚕;️ Doctor's Console</h1>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <h2>Scan Patient QR Code</h2>
      <QRCodeScanner onScanSuccess={handleScanSuccess} />

      <h2>Patient Waiting List</h2>
      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p>No patients in the queue.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Registration Time</th>
              <th>Doctor Appointment Time</th>
              <th>Waiting Time (minutes)</th>
              <th>Status</th>
              <th>QR Code</th> {/* NEW TABLE HEADER */}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{formatDateTime(patient.registrationTime)}</td>
                <td>{patient.doctorAppointmentTime ? formatDateTime(patient.doctorAppointmentTime) : 'Waiting'}</td>
                <td>
                  {patient.doctorAppointmentTime
                    ? `${patient.waitingTime} min`
                    : 'N/A'}
                </td>
                <td style={{ color: patient.doctorAppointmentTime ? 'green' : 'orange' }}>
                  {patient.doctorAppointmentTime ? 'Seen' : 'Waiting'}
                </td>
                <td> {/* NEW TABLE DATA CELL */}
                  {/* Render QR code only if not yet seen by doctor */}
                  {!patient.doctorAppointmentTime && (
                    <QRCodeGenerator value={patient.id} size={60} /> 
                  )}
                  {patient.doctorAppointmentTime && (
                    <span style={{ fontSize: '0.8em', color: '#888' }}>Scanned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorConsole;
