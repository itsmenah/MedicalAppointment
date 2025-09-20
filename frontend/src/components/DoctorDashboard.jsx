import { useState, useEffect, useCallback } from "react";
import { getAppointmentsByDoctor, updateAppointmentStatus } from "../services/api";

function DoctorDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAppointmentsByDoctor(user.userId);
      setAppointments(response.data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      loadAppointments(); // Refresh appointments
    } catch (err) {
      setError("Failed to update appointment status");
    }
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(apt.appointmentDate);
    aptDate.setHours(0, 0, 0, 0);
    return today.getTime() === aptDate.getTime();
  });

  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(apt.appointmentDate);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate > today;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="doctor-grid">
      <div className="section">
        <div className="section-header">
          <h2>Today's Appointments</h2>
          <span className="appointment-count">{todayAppointments.length}</span>
        </div>
        {error && <div className="error">{error}</div>}
        
        <div className="appointment-list">
          {todayAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No appointments today</p>
            </div>
          ) : (
            todayAppointments.map(appointment => (
              <DoctorAppointmentCard 
                key={appointment.appointmentId} 
                appointment={appointment}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Upcoming Appointments</h2>
          <span className="appointment-count">{upcomingAppointments.length}</span>
        </div>
        <div className="appointment-list">
          {upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming appointments</p>
            </div>
          ) : (
            upcomingAppointments.map(appointment => (
              <DoctorAppointmentCard 
                key={appointment.appointmentId} 
                appointment={appointment}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorAppointmentCard({ appointment, onStatusUpdate }) {
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
        <h3>{appointment.patient?.name || "Unknown Patient"}</h3>
        <span className={`status status-${appointment.status.toLowerCase()}`}>
          {appointment.status}
        </span>
      </div>
      
      <div className="appointment-details">
        <p>📅 {formatDate(appointment.appointmentDate)}</p>
        <p>🕐 {formatTime(appointment.appointmentDate)}</p>
        <p>🎫 Token: #{appointment.tokenNumber}</p>
        <p>📧 {appointment.patient?.email}</p>
      </div>
      
      {appointment.status === "BOOKED" && (
        <div className="appointment-actions">
          <button 
            onClick={() => onStatusUpdate(appointment.appointmentId, "DONE")}
            className="btn btn-primary btn-small"
          >
            ✓ Mark Done
          </button>
          <button 
            onClick={() => onStatusUpdate(appointment.appointmentId, "CANCELLED")}
            className="btn btn-danger btn-small"
          >
            ✗ Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;