import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeCreate from './components/EmployeeCreate';
import HeaderComponent from './components/HeaderEmployee';
import Footer from './components/FooterEmployee';
import EditEmployee from './components/EditEmployee';
import EmployeeDetail from './components/EmployeeDetail'; 
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
      <div className="container">
        <Routes>
          <Route path="/" element={<EmployeeList employees={employees} />} />
          <Route
            path="/create-employee"
            element={<EmployeeCreate onEmployeeCreated={handleEmployeeCreated} />}
          />
          <Route path="/edit-employee/:id" element={<EditEmployee />} />
          <Route path="/employee-detail/:id" element={<EmployeeDetail />} />
        </Routes>
      </div>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default App;
