# 🏥 MedCare - Smart Medical Appointment System

A modern, responsive medical appointment management system built with Spring Boot and React.

## ✨ Features

- **Patient Dashboard**: Book appointments, view current and past appointments
- **Doctor Dashboard**: Manage appointments, update appointment status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, minimalistic design with glassmorphism effects
- **Real-time Updates**: Instant appointment status updates

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.6+

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080/api/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔐 Sample Login Credentials

### Doctor Account
- Email: `doctor@medcare.com`
- Password: `password123`

### Patient Account
- Email: `patient@medcare.com`
- Password: `password123`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Appointments
- `POST /api/appointments/book` - Book new appointment
- `GET /api/appointments/patient/{id}` - Get patient appointments
- `GET /api/appointments/doctor/{id}` - Get doctor appointments
- `PUT /api/appointments/{id}/status` - Update appointment status
- `DELETE /api/appointments/{id}` - Cancel appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create doctor profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.4.1** - Application framework
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database
- **Spring Security** - Security framework
- **Maven** - Dependency management

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Modern styling with glassmorphism

## 📁 Project Structure

```
MedicalAppointment/
├── backend/
│   ├── src/main/java/com/example/MedicalAppointment/
│   │   ├── controller/     # REST controllers
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── service/        # Business logic
│   │   └── config/         # Configuration classes
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main application
│   └── public/
└── README.md
```

## 🎨 Design Features

- **Glassmorphism UI**: Modern glass-like effects with backdrop blur
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Smooth Animations**: Subtle hover effects and transitions
- **Color-coded Status**: Visual appointment status indicators
- **Mobile-first**: Optimized for mobile devices

## 🔧 Development

### Adding New Features

1. **Backend**: Add new controllers in `controller/` package
2. **Frontend**: Create new components in `components/` directory
3. **API**: Update `services/api.jsx` for new endpoints

### Database

The application uses H2 in-memory database. Data is stored in `backend/data/` directory and persists between restarts.

Access H2 Console: `http://localhost:8080/api//h2-console`
- JDBC URL: `jdbc:h2:file:./data/medappdb`
- Username: `sa`
- Password: (empty)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ using Spring Boot and React