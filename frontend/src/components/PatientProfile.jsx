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
        user: user
      });
      onComplete();
    } catch (err) {
      console.error("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Complete Your Profile</h2>
          <button onClick={onSkip} className="close-btn">×</button>
        </div>
        <p>Please provide additional information to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
            />
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
          
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