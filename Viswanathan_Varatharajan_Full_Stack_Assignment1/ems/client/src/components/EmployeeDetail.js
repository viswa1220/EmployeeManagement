import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { graphQLCommand } from '../utils'; 
import './EmployeeDetail.css';

const GET_EMPLOYEES = `
  query GetEmployees {
    employees {
      id
      firstName
      lastName
      dateOfBirth
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

const calculateRetirementTime = (dateOfBirth) => {
  const retirementAge = 65;
  const retirementDate = dayjs(dateOfBirth).add(retirementAge, 'year');
  const now = dayjs();

  if (retirementDate.isBefore(now)) {
    return { months: 0, days: 0, isRetired: true };
  }

  const monthsLeft = retirementDate.diff(now, 'month');
  const daysLeft = retirementDate.diff(now.add(monthsLeft, 'month'), 'day');

  return { months: monthsLeft, days: daysLeft, isRetired: false };
};

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

  // Convert Unix timestamp to dayjs object
  const dateOfBirth = dayjs(Number(employee.dateOfBirth));
  const dateOfJoining = dayjs(Number(employee.dateOfJoining));

  // Calculate retirement time
  const { months, days, isRetired } = calculateRetirementTime(dateOfBirth);

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
          <p><strong>Date of Birth:</strong> {dateOfBirth.isValid() ? dateOfBirth.format('MM/DD/YYYY') : 'N/A'}</p>
          <p><strong>Date of Joining:</strong> {dateOfJoining.isValid() ? dateOfJoining.format('MM/DD/YYYY') : 'N/A'}</p>
          <p><strong>Title:</strong> {employee.title}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Employee Type:</strong> {employee.employeeType}</p>
          <p><strong>Status:</strong> {employee.currentStatus === "true" ? 'Active' : 'Inactive'}</p>
          {isRetired ? (
            <p><strong>Retirement Status:</strong> Retired</p>
          ) : (
            <p>
              <strong>Retirement in:</strong> {months} months and {days} days
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
