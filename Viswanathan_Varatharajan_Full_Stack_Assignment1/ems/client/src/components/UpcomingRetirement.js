import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { graphQLCommand } from '../utils';
import './UpcomingRetirement.css';

// GraphQL query to list all employees
const LIST_EMPLOYEES = `
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

// Function to calculate age based on date of birth
const calculateAge = (dateOfBirth) => {
  return dayjs().diff(dayjs(parseInt(dateOfBirth, 10)), 'year');
};

// Function to check if the employee will turn 65 within the next six months
const willTurn65WithinSixMonths = (dateOfBirth) => {
  const birthDate = dayjs(parseInt(dateOfBirth, 10));
  const turning65Date = birthDate.add(65, 'year');
  const monthsToTurning65 = turning65Date.diff(dayjs(), 'month');
  return monthsToTurning65 <= 6 && monthsToTurning65 > 0;
};

const UpcomingRetirement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await graphQLCommand(LIST_EMPLOYEES);
      const employeeData = result.employees || [];

      // Filter employees who will turn 65 within the next 6 months and calculate age
      const employeesTurning65 = employeeData
        .filter((employee) => willTurn65WithinSixMonths(employee.dateOfBirth))
        .map((employee) => ({
          ...employee,
          age: calculateAge(employee.dateOfBirth),
        }));

      setEmployees(employeesTurning65);
    } catch (error) {
      setError('Failed to fetch employees: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('employeeType') || 'ALL';
    setSelectedType(type);

    if (type === 'ALL') {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(employees.filter(emp => emp.employeeType === type));
    }
  }, [employees, location.search]);

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);

    // Update the URL with the new query parameter
    navigate(`/upcoming-retirement?employeeType=${newType}`);
  };

  return (
    <div className="List">
      <h1>Upcoming Retirements</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="filter-container">
        <label htmlFor="employeeType">Filter by Employee Type:</label>
        <select id="employeeType" value={selectedType} onChange={handleTypeChange}>
          <option value="ALL">All</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="SEASONAL">Seasonal</option>
        </select>
      </div>

      {filteredEmployees.length === 0 ? (
        <p>No employees turning 65 within the next 6 months.</p>
      ) : (
        <div className="card-container">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{employee.firstName} {employee.lastName}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="detail-item">
                      <strong>Age:</strong> {employee.age}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-item">
                      <strong>Date of Birth:</strong> {new Date(parseInt(employee.dateOfBirth, 10)).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="detail-item">
                      <strong>Date of Joining:</strong> {new Date(parseInt(employee.dateOfJoining, 10)).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-item">
                      <strong>Title:</strong> {employee.title}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="detail-item">
                      <strong>Department:</strong> {employee.department}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-item">
                      <strong>Employee Type:</strong> {employee.employeeType}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="detail-item">
                      <strong>Status:</strong> {employee.currentStatus === 'true' ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingRetirement;
