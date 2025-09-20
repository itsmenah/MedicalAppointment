import { useState, useEffect } from "react";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import AdminDashboard from "./AdminDashboard";
import PatientProfile from "./PatientProfile";
import { getPatientByUserId } from "../services/api";

function Dashboard({ user, onLogout }) {
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.role === "PATIENT") {
      checkPatientProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkPatientProfile = async () => {
    try {
      const response = await getPatientByUserId(user.userId);
      if (response.data) {
        setLoading(false);
      } else {
        setNeedsProfile(true);
        setLoading(false);
      }
    } catch (err) {
      setNeedsProfile(true);
      setLoading(false);
    }
  };

  const handleProfileComplete = () => {
    setNeedsProfile(false);
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (needsProfile) {
    return <PatientProfile user={user} onComplete={handleProfileComplete} onSkip={handleProfileComplete} />;
  }

  return (
    <div className="dashboard">
      <div className="banner">
        🏥 MedCare - Smart Medical Appointment System
      </div>
      <div className="dashboard-header">
        <div>
          <h1>{user.name || user.email}</h1>
          <span className={`role-badge ${user.role ? user.role.toLowerCase() : 'unknown'}`}>{user.role || 'Unknown'}</span>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {user.role === "ADMIN" && <AdminDashboard user={user} />}
        {user.role === "PATIENT" && <PatientDashboard user={user} />}
        {user.role === "DOCTOR" && <DoctorDashboard user={user} />}
      </div>
    </div>
  );
}

export default Dashboard;