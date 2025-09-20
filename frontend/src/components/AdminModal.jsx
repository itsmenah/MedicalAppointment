import { useState, useEffect } from "react";
import { registerUser, createDoctor, getPatients, getDoctors, bookAppointment, updateUser, deleteUser, getPatientById, getDoctorById, createPatient } from "../services/api";

function AdminModal({ type, item, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: item?.name || item?.user?.name || "",
    email: item?.email || item?.user?.email || "",
    password: "",
    role: item?.role || (type === "doctor" || type === "editDoctor" ? "DOCTOR" : "PATIENT"),
    specialization: item?.specialization || "",
    availableFrom: item?.availableFrom || "09:00",
    availableTo: item?.availableTo || "17:00",
    age: "",
    gender: "",
    phone: "",
    address: "",
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    selectedDoctor: null
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (type === "booking") {
      loadBookingData();
    } else if (item && (type === "editUser" || type === "editDoctor")) {
      loadUserDetails();
    }
  }, [type, item]);

  const loadUserDetails = async () => {
    try {
      if (item.role === "PATIENT") {
        const patientRes = await getPatientById(item.userId);
        const patient = patientRes.data;
        setFormData(prev => ({
          ...prev,
          age: patient.age || "",
          gender: patient.gender || "",
          phone: patient.phone || "",
          address: patient.address || ""
        }));
        setUserDetails(patient);
      } else if (item.role === "DOCTOR") {
        const doctorRes = await getDoctorById(item.userId);
        setUserDetails(doctorRes.data);
      }
    } catch (err) {
      console.log("No additional details found");
    }
  };

  const loadBookingData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        getPatients(),
        getDoctors()
      ]);
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      console.error("Failed to load booking data:", err);
      setPatients([]);
      setDoctors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "booking") {
        const appointmentDateTime = `${formData.appointmentDate}T${formData.selectedDoctor?.availableFrom || '09:00'}:00`;
        await bookAppointment({
          patientId: formData.patientId,
          doctorId: formData.doctorId,
          appointmentDateTime: appointmentDateTime
        });
      } else if (type === "editUser" || type === "editDoctor") {
        await updateUser(item.userId, {
          name: formData.name,
          email: formData.email,
          ...(formData.password && { password: formData.password })
        });
        
        if (item.role === "PATIENT" && (formData.age || formData.gender || formData.phone || formData.address)) {
          try {
            if (userDetails) {
              // Update existing patient
              // Update patient details would need updatePatient API
              console.log("Patient update not implemented", {
                age: parseInt(formData.age) || userDetails.age,
                gender: formData.gender || userDetails.gender,
                phone: formData.phone || userDetails.phone,
                address: formData.address || userDetails.address
              });
            } else {
              // Create new patient profile
              await createPatient({
                age: parseInt(formData.age),
                gender: formData.gender,
                phone: formData.phone,
                address: formData.address,
                user: item
              });
            }
          } catch (err) {
            console.error("Failed to update patient details", err);
          }
        }
      } else if (type === "doctor" || type === "editDoctor") {
        if (type === "editDoctor") {
          // Update existing doctor
          await updateUser(item.user.userId, {
            name: formData.name,
            email: formData.email,
            ...(formData.password && { password: formData.password })
          });
          // Note: Doctor specialization/timing update would need updateDoctor API
        } else {
          // Create new doctor
          const userRes = await registerUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "DOCTOR"
          });
          await createDoctor({
            user: userRes.data,
            specialization: formData.specialization,
            availableFrom: formData.availableFrom,
            availableTo: formData.availableTo
          });
        }
      } else {
        await registerUser(formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(item.userId);
        onSuccess();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  const getTitle = () => {
    if (type === "booking") return "Book Appointment";
    if (type === "editUser") return "Edit User";
    if (type === "editDoctor") return "Edit Doctor";
    return type === "doctor" ? "Add Doctor" : "Add User";
  };

  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{getTitle()}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {type === "booking" ? (
            <>
              <div className="form-group">
                <label>Select Patient</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.patientId} value={patient.user?.userId}>
                      {patient.user?.name} - {patient.user?.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => {
                    const selectedDoc = doctors.find(d => d.doctorId === parseInt(e.target.value));
                    setFormData({...formData, doctorId: e.target.value, selectedDoctor: selectedDoc});
                  }}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      Dr. {doctor.user?.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              
              {formData.selectedDoctor && (
                <div className="form-group">
                  <label>Doctor Availability</label>
                  <div style={{ padding: '0.75rem', background: '#f0f9ff', borderRadius: '8px', fontSize: '0.9rem' }}>
                    Available: {formData.selectedDoctor.availableFrom} - {formData.selectedDoctor.availableTo}
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Appointment Date</label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder={item ? "New Password (leave blank to keep current)" : "Password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!item}
              />
              
              {item?.role === "PATIENT" && (
                <>
                  <div className="form-row">
                    <input
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <textarea
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </>
              )}
              {(type === "doctor" || type === "editDoctor") && (
                <>
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    required
                  />
                  <div className="time-inputs">
                    <input
                      type="time"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                    />
                    <input
                      type="time"
                      value={formData.availableTo}
                      onChange={(e) => setFormData({...formData, availableTo: e.target.value})}
                    />
                  </div>
                </>
              )}
            </>
          )}
          
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              {type === "booking" ? "Book" : item ? "Update" : "Create"}
            </button>
            {item && type !== "booking" && (
              <button type="button" onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminModal;