import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPatient } from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createPatient({
        age: parseInt(formData.age) || 0,
        gender: formData.gender || "",
        phone: formData.phone || "",
        address: formData.address || "",
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "PATIENT"
        }
      });
      navigate("/", { state: { message: "Registration successful! Please login." } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="text-center">
        <h1>🏥 MedCare</h1>
        <p>Create Your Account</p>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              min="1"
              max="120"
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows="3"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/" className="link">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}

export default Register;