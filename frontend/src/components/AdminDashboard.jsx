import { useState, useEffect } from "react";
import { getAllUsers, getDoctors, getPatients, getAllAppointments } from "../services/api";
import AdminModal from "./AdminModal";

function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("patients");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        getAllUsers(),
        getPatients(),
        getDoctors(),
        getAllAppointments()
      ]);
      setUsers(usersRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      console.error("Failed to load data");
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSuccess = () => {
    loadData();
    setShowModal(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-tabs">
        <button 
          className={activeTab === "patients" ? "tab active" : "tab"}
          onClick={() => setActiveTab("patients")}
        >
          Patients ({patients.length})
        </button>
        <button 
          className={activeTab === "doctors" ? "tab active" : "tab"}
          onClick={() => setActiveTab("doctors")}
        >
          Doctors ({doctors.length})
        </button>
        <button 
          className={activeTab === "admins" ? "tab active" : "tab"}
          onClick={() => setActiveTab("admins")}
        >
          Admins ({users.filter(u => u.role === 'ADMIN').length})
        </button>
        <button 
          className={activeTab === "appointments" ? "tab active" : "tab"}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments ({appointments.length})
        </button>
      </div>

      <div className="search-section">
        <input
          type="email"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="search-input"
        />
        {activeTab === "appointments" && (
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="search-input"
            >
              <option value="">All Status</option>
              <option value="BOOKED">Booked</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DONE">Done</option>
            </select>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="search-input"
            >
              <option value="">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  Dr. {doctor.user?.name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="admin-actions">
        <button className="btn-primary" onClick={() => openModal("user")}>
          + Add User
        </button>
        <button className="btn-primary" onClick={() => openModal("doctor")}>
          + Add Doctor
        </button>
        <button className="btn-primary" onClick={() => openModal("booking")}>
          + Book Appointment
        </button>
      </div>

      {activeTab === "patients" && (
        <div className="data-table">
          <div className="table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
          </div>
          {patients.filter(patient => 
            patient.user?.email.toLowerCase().includes(searchEmail.toLowerCase())
          ).map(patient => (
            <div key={patient.patientId} className="table-row clickable" onClick={() => openModal("editUser", patient.user)}>
              <span>{patient.user?.name}</span>
              <span>{patient.user?.email}</span>
              <span>{patient.phone || 'N/A'}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "doctors" && (
        <div className="data-table">
          <div className="table-header">
            <span>Name</span>
            <span>Specialization</span>
            <span>Available</span>
          </div>
          {doctors.filter(doctor => 
            doctor.user?.email.toLowerCase().includes(searchEmail.toLowerCase())
          ).map(doctor => (
            <div key={doctor.doctorId} className="table-row clickable" onClick={() => openModal("editDoctor", doctor)}>
              <span>Dr. {doctor.user?.name}</span>
              <span>{doctor.specialization}</span>
              <span>{doctor.availableFrom} - {doctor.availableTo}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "admins" && (
        <div className="data-table">
          <div className="table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
          </div>
          {users.filter(user => 
            user.role === 'ADMIN' && user.email.toLowerCase().includes(searchEmail.toLowerCase())
          ).map(user => (
            <div key={user.userId} className="table-row clickable" onClick={() => openModal("editUser", user)}>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span className={`role-badge ${user.role?.toLowerCase() || 'unknown'}`}>
                {user.role || 'Unknown'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="data-table">
          <div className="table-header appointments">
            <span>Patient</span>
            <span>Doctor</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {appointments.filter(appointment => {
            const matchesEmail = appointment.patient?.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
                               appointment.doctor?.name.toLowerCase().includes(searchEmail.toLowerCase());
            const matchesStatus = !statusFilter || appointment.status === statusFilter;
            const matchesDoctor = !doctorFilter || appointment.doctor?.userId.toString() === doctorFilter;
            return matchesEmail && matchesStatus && matchesDoctor;
          }).map(appointment => (
            <div key={appointment.appointmentId} className="table-row appointments clickable" onClick={() => openModal("editAppointment", appointment)}>
              <span>{appointment.patient?.name}</span>
              <span>Dr. {appointment.doctor?.name}</span>
              <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
              <span className={`status status-${appointment.status.toLowerCase()}`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AdminModal 
          type={modalType}
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default AdminDashboard;