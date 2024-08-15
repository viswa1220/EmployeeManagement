import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { graphQLCommand } from '../utils'; 
import './EmployeeDetail.css';

const GET_EMPLOYEES = `
  query GetEmployees {
    employees {
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
`;

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await graphQLCommand(GET_EMPLOYEES);
        const employees = result.employees || [];
        const foundEmployee = employees.find(emp => emp.id === id);
        setEmployee(foundEmployee);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!employee) return <p>No employee data found.</p>;

  return (
    <div className="employee-detail-container">
      <Link to="/" className="back-link">Back to Home</Link>
      <div className="employee-card">
        <div className="card-header">
          <h3>Employee Details</h3>
        </div>
        <div className="card-body">
          <p><strong>First Name:</strong> {employee.firstName}</p>
          <p><strong>Last Name:</strong> {employee.lastName}</p>
          <p><strong>Age:</strong> {employee.age}</p>
          <p><strong>Date of Joining:</strong> {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Title:</strong> {employee.title}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Employee Type:</strong> {employee.employeeType}</p>
          <p><strong>Status:</strong> {employee.currentStatus ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
