import { useState } from "react";
import { createPatient } from "../services/api";

function PatientProfile({ user, onComplete, onSkip }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPatient({
        ...formData,
        age: parseInt(formData.age),
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role
        }
      });
      onComplete();
    } catch (err) {
      console.error("Failed to create profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <div className="profile-header">
          <h1>Complete Your Profile</h1>
          <button onClick={onSkip} className="close-btn">×</button>
        </div>
        <p>Please provide additional information to enhance your experience</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
              min="1"
              max="120"
            />
          </div>
          
          <div className="form-group">
            <label>Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
              rows="3"
            />
          </div>
          
          <div className="profile-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Complete Profile"}
            </button>
            <button type="button" onClick={onSkip} className="btn-secondary">
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientProfile;