const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register a new patient (accessible without authentication for reception staff)
exports.registerPatientNoAuth = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Patient name is required.' });
  }

  try {
    const patient = await prisma.patient.create({
      data: {
        name,
        // registrationTime defaults to now() in schema.prisma
      },
    });
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ error: 'Failed to register patient.' });
  }
};

// Record doctor appointment time (requires DOCTOR or ADMIN role)
exports.recordAppointmentTime = async (req, res) => {
  const { patientId } = req.body;

  if (!patientId) {
    return res.status(400).json({ error: 'Patient ID is required.' });
  }

  try {
    // --- NEW LOGIC: Check if appointment time is already recorded ---
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { doctorAppointmentTime: true } // Only fetch this field
    });

    if (!existingPatient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    if (existingPatient.doctorAppointmentTime) {
      // If doctorAppointmentTime is already set, this QR code has been used.
      return res.status(400).json({ error: 'This QR code has already been scanned and the appointment time recorded.' });
    }
    // --- END NEW LOGIC ---

    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        doctorAppointmentTime: new Date(),
      },
    });

    res.status(200).json({ message: 'Appointment time recorded successfully.', patient });
  } catch (error) {
    console.error('Error recording appointment time:', error);
    res.status(500).json({ error: 'Failed to record appointment time.' });
  }
};

// Get all patients with calculated waiting times (requires DOCTOR or ADMIN role)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        registrationTime: 'desc',
      },
    });

    const patientsWithWaitingTime = patients.map(patient => {
      let waitingTime = null;
      if (patient.registrationTime && patient.doctorAppointmentTime) {
        const diffMs = patient.doctorAppointmentTime.getTime() - patient.registrationTime.getTime();
        waitingTime = Math.floor(diffMs / (1000 * 60)); // minutes
      }
      return { ...patient, waitingTime };
    });

    res.status(200).json(patientsWithWaitingTime);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients.' });
  }
};

// Get average waiting time for a day (requires ADMIN role)
exports.getAverageWaitingTime = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        doctorAppointmentTime: {
          not: null,
        },
      },
    });

    if (patients.length === 0) {
      return res.status(200).json({ averageWaitingTime: 0 });
    }

    let totalWaitingTime = 0;
    let completedAppointmentsCount = 0;

    patients.forEach(patient => {
      if (patient.registrationTime && patient.doctorAppointmentTime) {
        const diffMs = patient.doctorAppointmentTime.getTime() - patient.registrationTime.getTime();
        totalWaitingTime += diffMs;
        completedAppointmentsCount++;
      }
    });

    const averageWaitingTimeMs = completedAppointmentsCount > 0 ? totalWaitingTime / completedAppointmentsCount : 0;
    const averageWaitingTimeMinutes = Math.floor(averageWaitingTimeMs / (1000 * 60));

    res.status(200).json({ averageWaitingTime: averageWaitingTimeMinutes });
  } catch (error) {
    console.error('Error calculating average waiting time:', error);
    res.status(500).json({ error: 'Failed to calculate average waiting time.' });
  }
};

// Get current user's role (requires authentication, role is already in req.role)
exports.getCurrentUserRole = async (req, res) => {
  if (!req.user || !req.role) {
    return res.status(401).json({ error: 'User not authenticated or role not found.' });
  }
  res.status(200).json({ userId: req.user.id, email: req.user.email, role: req.role });
};
