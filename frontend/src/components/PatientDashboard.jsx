import { useState, useEffect, useCallback } from "react";
import { getAppointmentsByPatient, getDoctors, bookAppointment } from "../services/api";
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

  const currentAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) >= new Date() || apt.status === "BOOKED"
  );

  const pastAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) < new Date() && apt.status !== "BOOKED"
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-2">
        <div className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Current Appointments</h2>
            <button 
              onClick={() => setShowBooking(true)} 
              className="btn btn-small"
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
                <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
              ))
            )}
          </div>
        </div>

        <div className="section">
          <h2>Past Appointments</h2>
          <div className="appointment-list">
            {pastAppointments.length === 0 ? (
              <div className="empty-state">
                <p>No past appointments</p>
              </div>
            ) : (
              pastAppointments.map(appointment => (
                <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
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

function AppointmentCard({ appointment }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="appointment-item">
      <h3>Dr. {appointment.doctor?.name || "Unknown"}</h3>
      <p>📅 {formatDate(appointment.appointmentDate)}</p>
      <p>🎫 Token: #{appointment.tokenNumber}</p>
      <span className={`status status-${appointment.status.toLowerCase()}`}>
        {appointment.status}
      </span>
    </div>
  );
}

export default PatientDashboard;