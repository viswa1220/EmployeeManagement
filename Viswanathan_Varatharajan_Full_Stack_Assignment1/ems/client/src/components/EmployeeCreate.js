import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './EmployeeCreate.css';

const EmployeeCreate = ({ onEmployeeCreated }) => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfJoining: '',
    title: '',
    department: '',
    employeeType: '',
    currentStatus: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: name === 'age' ? Number(value) : value,
      dateOfJoining: name === 'dateOfJoining' ? new Date(value).toISOString() : employee.dateOfJoining,
    });
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
      console.log('GraphQL result:', result);

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
      }

      if (result.data && result.data.createEmployee) {
        console.log('Employee created:', result.data.createEmployee);
        onEmployeeCreated(result.data.createEmployee);

        // Clear form fields
        setEmployee({
          firstName: '',
          lastName: '',
          age: '',
          dateOfJoining: '',
          title: '',
          department: '',
          employeeType: '',
          currentStatus: true,
        });

        // Redirect to EmployeeList
        navigate('/');
      } else {
        console.error('Unexpected result format:', result);
      }

    } catch (error) {
      console.error('Error creating employee:', error.message || 'Unknown error');
    }
  };

  useEffect(() => {
    document.body.classList.add('no-header-footer');
    return () => {
      document.body.classList.remove('no-header-footer');
    };
  }, []);

  return (
    <div className="employee-create-container">
      <header className="header">
        <Link to="/" className="home-link">Home</Link>
        <div className="header-title">
          <h1 className="employee-create-heading">Employee Management System</h1>
        </div>
      </header>
     
      <form onSubmit={handleSubmit} className="form-container-new">
        <h2 className="employee-create-heading">Create Employee</h2>
        <input
          type="text"
          name="firstName"
          value={employee.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="form-input"
        />
        <input
          type="text"
          name="lastName"
          value={employee.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="form-input"
        />
        <input
          type="number"
          name="age"
          value={employee.age}
          onChange={handleChange}
          placeholder="Age"
          required
          className="form-input"
        />
        <input
          type="date"
          name="dateOfJoining"
          value={employee.dateOfJoining.split('T')[0]}
          onChange={handleChange}
          placeholder="Date of Joining"
          required
          className="form-input"
        />
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
        <button type="submit" className="form-button">Create Employee</button>
      </form>
    </div>
  );
};

export default EmployeeCreate;
