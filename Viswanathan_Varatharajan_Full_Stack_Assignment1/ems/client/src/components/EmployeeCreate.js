import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import './EmployeeCreate.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeCreate = ({ onEmployeeCreated }) => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    dateOfJoining: '',
    title: '',
    department: '',
    employeeType: '',
    currentStatus:'Working', 
  });

  const navigate = useNavigate();

  const calculateAge = (dob) => {
    const today = dayjs();
    const birthDate = dayjs(dob);
    return today.diff(birthDate, 'year');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
      dateOfJoining: name === 'dateOfJoining' ? new Date(value).toISOString() : employee.dateOfJoining,
    });
  };

  const handleDateOfBirthChange = (date) => {
    const age = calculateAge(date);
  
  
    let status = 'Working';
    
    
    if (age >= 65) {
      status = 'Retired';
    }
  
    setEmployee((prevState) => ({
      ...prevState,
      dateOfBirth: date,
      age,
      currentStatus: status,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CreateEmployee($input: EmployeeInput!) {
              createEmployee(input: $input) {
                id
                firstName
                lastName
                age
                dateOfBirth
                dateOfJoining
                title
                department
                employeeType
                currentStatus
              }
            }
          `,
          variables: { input: employee },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      if (result.data && result.data.createEmployee) {
        onEmployeeCreated(result.data.createEmployee);
        navigate('/');
      } else {
        console.error('Unexpected result format:', result);
      }
    } catch (error) {
      console.error('Error creating employee:', error.message || 'Unknown error');
    }
  };

  return (
    <div className="container mt-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-primary">Home</Link>
        <h1>Employee Management System</h1>
      </header>

      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <DatePicker
            selected={employee.dateOfBirth}
            onChange={handleDateOfBirthChange}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Select Date of Birth"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            readOnly
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Joining</label>
          <input
            type="date"
            name="dateOfJoining"
            value={employee.dateOfJoining.split('T')[0]}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <select
            name="title"
            value={employee.title}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select Title</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Tester">Tester</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            name="department"
            value={employee.department}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="IT">IT</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Employee Type</label>
          <select
            name="employeeType"
            value={employee.employeeType}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select Employee Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Current Status</label>
          <input
            type="text"
            name="currentStatus"
            value={employee.currentStatus}
            readOnly
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-success">Create Employee</button>
      </form>
    </div>
  );
};

export default EmployeeCreate;
