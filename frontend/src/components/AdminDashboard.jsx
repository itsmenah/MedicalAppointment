import { useState, useEffect } from "react";
import { getAllUsers, getDoctors } from "../services/api";
import AdminModal from "./AdminModal";

function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, doctorsRes] = await Promise.all([
        getAllUsers(),
        getDoctors()
      ]);
      setUsers(usersRes.data);
      setDoctors(doctorsRes.data);
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
          className={activeTab === "users" ? "tab active" : "tab"}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button 
          className={activeTab === "doctors" ? "tab active" : "tab"}
          onClick={() => setActiveTab("doctors")}
        >
          Doctors ({doctors.length})
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

      {activeTab === "users" && (
        <div className="data-table">
          <div className="table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
          </div>
          {users.filter(user => 
            user.email.toLowerCase().includes(searchEmail.toLowerCase())
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

      {activeTab === "doctors" && (
        <div className="data-table">
          <div className="table-header">
            <span>Name</span>
            <span>Specialization</span>
            <span>Available</span>
          </div>
          {doctors.map(doctor => (
            <div key={doctor.doctorId} className="table-row clickable" onClick={() => openModal("editDoctor", doctor)}>
              <span>Dr. {doctor.user?.name}</span>
              <span>{doctor.specialization}</span>
              <span>{doctor.availableFrom} - {doctor.availableTo}</span>
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