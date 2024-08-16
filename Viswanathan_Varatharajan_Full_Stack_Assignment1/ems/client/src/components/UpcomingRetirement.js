import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { graphQLCommand } from '../utils';
import './UpcomingRetirement.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    navigate(`/upcoming-retirement?employeeType=${newType}`);
  };

  return (
    <div className="mt-5">
      <h1 className="text-center mb-4">Upcoming Retirements</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="d-flex justify-content-center mb-4">
        <label htmlFor="employeeType" className="form-label me-2">Filter by Employee Type:</label>
        <select id="employeeType" className="form-select w-auto" value={selectedType} onChange={handleTypeChange}>
          <option value="ALL">All</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="SEASONAL">Seasonal</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </div>

      {filteredEmployees.length === 0 ? (
        <p className="text-center">No employees turning 65 within the next 6 months.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{employee.firstName} {employee.lastName}</h5>
                  <p className="card-text"><strong>Age:</strong> {employee.age}</p>
                  <p className="card-text"><strong>Date of Birth:</strong> {new Date(parseInt(employee.dateOfBirth, 10)).toLocaleDateString()}</p>
                  <p className="card-text"><strong>Date of Joining:</strong> {new Date(parseInt(employee.dateOfJoining, 10)).toLocaleDateString()}</p>
                  <p className="card-text"><strong>Title:</strong> {employee.title}</p>
                  <p className="card-text"><strong>Department:</strong> {employee.department}</p>
                  <p className="card-text"><strong>Employee Type:</strong> {employee.employeeType}</p>
                  <p className="card-text"><strong>Status:</strong> {employee.currentStatus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-primary">Back to List</Link>
      </div>
    </div>
  );
};

export default UpcomingRetirement;
