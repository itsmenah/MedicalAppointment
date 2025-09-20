import { useState } from "react";

function BookingModal({ doctors, onBook, onClose }) {
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === "doctorId") {
      const doctor = doctors.find(d => d.doctorId === parseInt(value));
      setSelectedDoctor(doctor);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create datetime using selected date and doctor's available time
      const appointmentDateTime = `${formData.appointmentDate}T${selectedDoctor?.availableFrom || '09:00'}:00`;
      await onBook({
        doctorId: formData.doctorId,
        appointmentDateTime
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().slice(0, 10);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor...</option>
              {doctors.map(doctor => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  Dr. {doctor.user?.name || "Unknown"} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {selectedDoctor && (
            <div className="form-group">
              <label>Doctor Availability</label>
              <div style={{ padding: '0.75rem', background: '#f0f9ff', borderRadius: '8px', fontSize: '0.9rem' }}>
                Available: {selectedDoctor.availableFrom} - {selectedDoctor.availableTo}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={minDate}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;