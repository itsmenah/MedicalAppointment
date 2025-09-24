import { useState, useEffect, useCallback } from "react";
import { getAppointmentsByPatient, getDoctors, bookAppointment, updateAppointmentStatus } from "../services/api";
import BookingModal from "./BookingModal";

function PatientDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [appointmentsRes, doctorsRes] = await Promise.all([
        getAppointmentsByPatient(user.userId),
        getDoctors()
      ]);
      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookAppointment = async (appointmentData) => {
    try {
      await bookAppointment({
        patientId: user.userId,
        ...appointmentData
      });
      setShowBooking(false);
      loadData(); // Refresh appointments
    } catch (err) {
      throw new Error(err.response?.data?.message || "Booking failed");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await updateAppointmentStatus(appointmentId, 'CANCELLED');
        loadData(); // Refresh appointments
      } catch (err) {
        setError('Failed to cancel appointment');
      }
    }
  };

  const currentAppointments = appointments.filter(apt => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const aptDate = new Date(apt.appointmentDate);
    aptDate.setHours(0, 0, 0, 0); // Reset time to start of day
    return aptDate >= today && apt.status === "BOOKED";
  });

  const pastAppointments = appointments.filter(apt => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const aptDate = new Date(apt.appointmentDate);
    aptDate.setHours(0, 0, 0, 0); // Reset time to start of day
    return aptDate < today || apt.status === "CANCELLED" || apt.status === "DONE";
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="patient-grid">
        <div className="section">
          <div className="section-header">
            <h2>Current Appointments</h2>
            <button 
              onClick={() => setShowBooking(true)} 
              className="btn-primary"
            >
              Book New
            </button>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div className="appointment-list">
            {currentAppointments.length === 0 ? (
              <div className="empty-state">
                <p>No current appointments</p>
              </div>
            ) : (
              currentAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.appointmentId} 
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                  showActions={true}
                />
              ))
            )}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Past & Cancelled Appointments</h2>
            <span className="appointment-count">{pastAppointments.length}</span>
          </div>
          <div className="appointment-list">
            {pastAppointments.length === 0 ? (
              <div className="empty-state">
                <p>No past appointments</p>
              </div>
            ) : (
              pastAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.appointmentId} 
                  appointment={appointment}
                  showActions={false}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          doctors={doctors}
          onBook={handleBookAppointment}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}

function AppointmentCard({ appointment, onCancel, showActions }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="appointment-item">
      <div className="appointment-header">
        <h3>Dr. {appointment.doctor?.name || "Unknown"}</h3>
        <span className={`status status-${appointment.status.toLowerCase()}`}>
          {appointment.status}
        </span>
      </div>
      <div className="appointment-details">
        <p>📅 {formatDate(appointment.appointmentDate)}</p>
        <p>🕐 {formatTime(appointment.appointmentDate)}</p>
        <p>🎫 Token: #{appointment.tokenNumber}</p>
        {appointment.doctor?.specialization && (
          <p>🩺 {appointment.doctor.specialization}</p>
        )}
      </div>
      {showActions && appointment.status === 'BOOKED' && (
        <div className="appointment-actions">
          <button 
            onClick={() => onCancel(appointment.appointmentId)}
            className="btn btn-danger btn-small"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;