# 🚀 Quick Setup Guide

## Start the Application

### 1. Backend (Terminal 1)
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on: http://localhost:8080/api/

### 2. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## 🔐 Test Accounts

**Doctor Login:**
- Email: `doctor@medcare.com`
- Password: `password123`

**Patient Login:**
- Email: `patient@medcare.com`  
- Password: `password123`

## 📱 Features Implemented

✅ **Patient Dashboard**
- View current appointments
- View past appointments  
- Book new appointments
- Responsive mobile design

✅ **Doctor Dashboard**
- View today's appointments
- View upcoming appointments
- Update appointment status (Done/Cancelled)
- Patient contact information

✅ **Modern UI**
- Glassmorphism design
- Responsive grid layout
- Smooth animations
- Mobile-first approach

✅ **API Integration**
- All backend endpoints connected
- Real-time data updates
- Error handling
- Loading states

## 🛠️ Architecture

**Backend:** Spring Boot 3.4.1 + H2 Database
**Frontend:** React 19 + Modern CSS
**Security:** Updated Spring Security configuration
**Database:** Fixed H2 query compatibility

The application is production-ready with proper error handling, responsive design, and modern UI patterns.