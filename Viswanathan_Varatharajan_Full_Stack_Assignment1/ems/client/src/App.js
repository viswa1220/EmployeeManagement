import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import EmployeeList from "./components/EmployeeList";
import EmployeeCreate from "./components/EmployeeCreate";
import HeaderComponent from "./components/HeaderEmployee";
import Footer from "./components/FooterEmployee";
import EditEmployee from "./components/EditEmployee";
import EmployeeDetail from "./components/EmployeeDetail";
import UpcomingRetirement from "./components/UpcomingRetirement";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const location = useLocation();

  const handleEmployeeCreated = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  return (
    <>
      <HeaderComponent />

      {/* Main content area structured with Bootstrap grid system */}
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <Routes>
              {/* Redirect from root to /employees */}
              <Route
                path="/"
                element={<Navigate replace to="/employees/list" />}
              />

              {/* Nested Routes for Employee Management */}
              <Route path="/employees">
                <Route index element={<Navigate replace to="list" />} />
                <Route
                  path="list"
                  element={<EmployeeList employees={employees} />}
                />
                <Route
                  path="create"
                  element={
                    <EmployeeCreate onEmployeeCreated={handleEmployeeCreated} />
                  }
                />
                <Route path="edit/:id" element={<EditEmployee />} />
                <Route path="detail/:id" element={<EmployeeDetail />} />
              </Route>

              <Route
                path="/upcoming-retirement"
                element={<UpcomingRetirement />}
              />

              {/* Not matched routes */}
              <Route path="*" element={<Navigate to="/employees/list" />} />
            </Routes>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default App;
