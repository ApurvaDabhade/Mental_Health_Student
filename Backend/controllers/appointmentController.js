import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Counsellor from '../models/Counsellor.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Student)
export const createAppointment = async (req, res) => {
    const { studentId, counsellorId, date, time, reason, type } = req.body;

    console.log('Create Appointment Request:', { studentId, counsellorId, date, time });

    if (!studentId || !counsellorId || !date || !time) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Calculate the actual date based on the "Day Name" (e.g., "Monday")
        // This is a simple implementation assuming "Next Occurrence" of that day.
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const targetDayIndex = days.indexOf(date);

        let scheduledDate = new Date();
        if (targetDayIndex !== -1) {
            const today = new Date();
            const currentDayIndex = today.getDay();
            let daysUntil = targetDayIndex - currentDayIndex;
            if (daysUntil <= 0) daysUntil += 7; // Next occurrence

            scheduledDate.setDate(today.getDate() + daysUntil);
            // set time
            const [hours, minutes] = time.split(':');
            scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            // Fallback if date is already a string format
            const parsed = new Date(`${date}T${time}:00`);
            if (!isNaN(parsed)) scheduledDate = parsed;
        }

        const appointment = new Appointment({
            student: studentId,
            counsellor: counsellorId, // Note: This should match the expected reference type in Schema (User vs Counsellor). 
            // Schema says 'counsellor' ref is 'User'. Frontend likely sends 'User ID' of counsellor.
            scheduledAt: scheduledDate,
            status: 'pending',
            notes: reason,
            // Storing raw strings for display if needed, but strict schema relies on scheduledAt
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);

    } catch (error) {
        console.error('Create Appointment Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get appointments for a user (student or counsellor)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res) => {
    const { userId, counsellorId } = req.query;

    try {
        let query = {};
        if (userId) {
            query.student = userId;
        } else if (counsellorId) {
            query.counsellor = counsellorId;
        } else {
            return res.status(400).json({ message: 'Missing userId or counsellorId param' });
        }

        const appointments = await Appointment.find(query)
            .populate('student', 'fullName email')
            .populate('counsellor', 'fullName email')
            .sort({ scheduledAt: 1 });

        res.json(appointments);

    } catch (error) {
        console.error('Get Appointments Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id
// @access  Private (Counsellor)
export const updateAppointmentStatus = async (req, res) => {
    const { status, notes } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (status) appointment.status = status;
        if (notes) appointment.notes = appointment.notes ? appointment.notes + ' | ' + notes : notes;

        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        console.error('Update Appointment Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// All functions are exported as named exports
