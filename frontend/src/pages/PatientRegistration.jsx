import React, { useState } from 'react';
import { registerPatient } from '../api/patientApi';
import QRCodeGenerator from '../components/QRCodeGenerator';

const PatientRegistration = () => {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setMessage({ type: 'error', text: 'Please enter patient name.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setPatientId(null);

    try {
      const newPatient = await registerPatient(patientName);
      setPatientId(newPatient.id);
      setMessage({ type: 'success', text: 'Patient registered successfully! Scan the QR code.' });
      setPatientName(''); // Clear the input field
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to register patient. Please try again.' });
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>🏥 Patient Registration</h1>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name:</label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
            placeholder="Enter patient's full name"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Patient & Generate QR'}
        </button>
      </form>

      {patientId && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h2>Generated QR Code for {patientName}</h2>
          <p>Please scan this QR code when the patient sees the doctor.</p>
          <QRCodeGenerator value={patientId} />
          <p>Patient ID: <strong>{patientId}</strong></p>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;