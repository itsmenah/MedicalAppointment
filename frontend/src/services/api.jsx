import axios from "axios";

const API = axios.create({
  baseURL: "https://medicalappointment-l2hk.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth endpoints
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const registerUser = (userData) => API.post("/auth/register", userData);

// Doctor endpoints
export const getDoctors = () => API.get("/doctors");
export const getDoctorById = (id) => API.get(`/doctors/${id}`);
export const getDoctorByUserId = (userId) => API.get(`/doctors/user/${userId}`);
export const createDoctor = (doctorData) => API.post("/doctors", doctorData);

// Patient endpoints
export const getPatients = () => API.get("/patients");
export const getPatientById = (id) => API.get(`/patients/${id}`);
export const getPatientByUserId = (userId) => API.get(`/patients/user/${userId}`);
export const createPatient = (patientData) => API.post("/patients", patientData);

// Appointment endpoints
export const bookAppointment = (appointmentData) => 
  API.post("/appointments/book", appointmentData);

export const getAppointmentsByPatient = (patientId) => 
  API.get(`/appointments/patient/${patientId}`);

export const getAppointmentsByDoctor = (doctorId) => 
  API.get(`/appointments/doctor/${doctorId}`);

export const getAppointmentById = (appointmentId) => 
  API.get(`/appointments/${appointmentId}`);

export const updateAppointmentStatus = (appointmentId, status) => 
  API.put(`/appointments/${appointmentId}/status?status=${status}`);

export const updateAppointment = (appointmentId, appointmentData) => 
  API.put(`/appointments/${appointmentId}`, appointmentData);

export const cancelAppointment = (appointmentId) => 
  API.delete(`/appointments/${appointmentId}`);

export const getAllAppointments = () => API.get("/appointments");

// User endpoints
export const getAllUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const findUserByEmail = (email) => API.get(`/users/find?email=${email}`);

export default API;