import React, { useEffect, useState } from "react";
import { getDoctors } from "../services/api";

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors().then(res => setDoctors(res.data));
  }, []);

  return (
    <div>
      <h1>Available Doctors</h1>
      <ul>
        {doctors.map(doc => (
          <li key={doc.id}>{doc.name} - {doc.specialization}</li>
        ))}
      </ul>
    </div>
  );
}
