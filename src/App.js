import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import PetSelector from './components/PetSelector';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import Vitals from './components/Vitals';
import MedicalRecords from './components/MedicalRecords';
import Activity from './components/Activity';
import Diet from './components/Diet';
import Appointments from './components/Appointments';
import Settings from './components/Settings';
import PetProfile from './components/PetProfile';

function App() {
  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'pop',
      type: 'dog',
      avatar: 'p',
    },
    {
      id: 2,
      name: 'coco',
      type: 'cat',
      avatar: 'c',
    }
  ]);
  
  // Store appointments at the App level so they persist between navigation
  const [allAppointments, setAllAppointments] = useState([
    {
      id: 1,
      petId: 1,
      petName: 'pop',
      date: '2025-06-10',
      time: '14:30',
      appointmentType: 'checkup',
      veterinarian: 'Dr. Smith',
      location: 'Happy Paws Clinic',
      notes: 'Annual wellness exam'
    },
    {
      id: 2,
      petId: 1,
      petName: 'pop',
      date: '2025-07-15',
      time: '10:00',
      appointmentType: 'vaccination',
      veterinarian: 'Dr. Johnson',
      location: 'VetCare Center',
      notes: 'Rabies shot and annual vaccines'
    }
  ]);

  const [userId] = useState('171627955110990054');

  const addPet = (newPet) => {
    setPets([...pets, { ...newPet, id: pets.length + 1 }]);
  };

  const addAppointment = (newAppointment) => {
    setAllAppointments([...allAppointments, { ...newAppointment, id: allAppointments.length + 1 }]);
  };
  
  const deleteAppointment = (appointmentId) => {
    setAllAppointments(allAppointments.filter(appointment => appointment.id !== appointmentId));
  };

  // Layout wrapper for pet-specific routes
  const PetLayout = () => (
    <>
      <PetSelector pets={pets} />
      <Outlet />
    </>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* General routes */}
          <Route path="/" element={<Dashboard 
            pets={pets} 
            addPet={addPet} 
            userId={userId} 
            appointments={allAppointments}
          />} />
          <Route path="/settings" element={<Settings userId={userId} pets={pets} />} />
          <Route path="/appointments" element={<Navigate to={`/pet/${pets[0]?.id || 1}/appointments`} replace />} />
          
          {/* Pet-specific routes with PetSelector */}
          <Route element={<PetLayout />}>
            <Route path="/pet/:petId/vitals" element={<Vitals pets={pets} />} />
            <Route path="/pet/:petId/medical" element={<MedicalRecords pets={pets} />} />
            <Route path="/pet/:petId/activity" element={<Activity pets={pets} />} />
            <Route path="/pet/:petId/diet" element={<Diet pets={pets} />} />
            <Route path="/pet/:petId/appointments" element={
              <Appointments 
                pets={pets} 
                appointments={allAppointments} 
                addAppointment={addAppointment}
                deleteAppointment={deleteAppointment}
                key="appointments-route"
              />
            } />
            <Route path="/pet/:petId" element={<PetProfile pets={pets} />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
