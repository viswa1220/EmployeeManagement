import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeList from './components/EmployeeList';
import EmployeeCreate from './components/EmployeeCreate';
import HeaderComponent from './components/HeaderEmployee';
import Footer from './components/FooterEmployee';
import EditEmployee from './components/EditEmployee';
import EmployeeDetail from './components/EmployeeDetail'; 
import UpcomingRetirement from './components/UpcomingRetirement'
const App = () => {
  const [employees, setEmployees] = useState([]);
  const location = useLocation();
  
  
  const hideHeaderFooter = location.pathname === '/create-employee';

  const handleEmployeeCreated = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  return (
    <>
      {!hideHeaderFooter && <HeaderComponent />}
      <div className="">
        <Routes>
          <Route path="/" element={<EmployeeList employees={employees} />} />
          <Route
            path="/create-employee"
            element={<EmployeeCreate onEmployeeCreated={handleEmployeeCreated} />}
          />
          <Route path="/edit-employee/:id" element={<EditEmployee />} />
          <Route path="/employee-detail/:id" element={<EmployeeDetail />} />
          <Route path="/upcoming-retirement" element={<UpcomingRetirement />} />
        </Routes>
      </div>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default App;
