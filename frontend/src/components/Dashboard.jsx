import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";

function Dashboard({ user, onLogout }) {
  return (
    <div className="card dashboard-card">
      <div className="header">
        <div>
          <h1>Welcome, {user.name || user.email}</h1>
          <p>{user.role} Dashboard</p>
        </div>
        <button onClick={onLogout} className="btn btn-danger btn-small">
          Logout
        </button>
      </div>

      {user.role === "PATIENT" ? (
        <PatientDashboard user={user} />
      ) : (
        <DoctorDashboard user={user} />
      )}
    </div>
  );
}

export default Dashboard;