import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLCommand } from '../utils';
import EmployeeSearch from './EmployeeSearch';
import EmployeeTable from './EmployeeTable';
import './EmployeeList.css';
import HeaderNavigation from './Headernavigation';

// GraphQL queries and mutations
const LIST_EMPLOYEES = `
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

const DELETE_EMPLOYEE = `
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentType = queryParams.get('type') || 'all';

  const fetchEmployees = useCallback(async () => {
    let query;

    switch (currentType) {
      case 'fullTime':
        query = `
          query GetFullTimeEmployees {
            fullTimeEmployees {
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
        break;
      case 'partTime':
        query = `
          query GetPartTimeEmployees {
            partTimeEmployees {
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
        break;
      case 'contract':
        query = `
          query GetContractEmployees {
            contractEmployees {
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
        break;
      case 'seasonal':
        query = `
          query GetSeasonalEmployees {
            seasonalEmployees {
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
        break;
      default:
        query = LIST_EMPLOYEES;
    }

    setLoading(true);
    setError('');

    try {
      const result = await graphQLCommand(query);
      const employeeData = result[`${currentType}Employees`] || result.employees || [];
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
    } catch (error) {
      setError('Failed to fetch employees: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [currentType]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = (term) => {
    const lowercasedTerm = term.toLowerCase();
    const filtered = employees.filter((employee) =>
      employee.firstName.toLowerCase().includes(lowercasedTerm) ||
      employee.lastName.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this employee?');
    if (!isConfirmed) return;

    try {
      await graphQLCommand(DELETE_EMPLOYEE, { id });
      fetchEmployees();
    } catch (error) {
      setError('Error deleting employee: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/employee-detail/${id}`);
  };

  // Handle navigation to the Upcoming Retirement page
  const handleUpcomingRetirement = () => {
    navigate('/upcoming-retirement');
  };

  return (
    <div className="List">
      <HeaderNavigation></HeaderNavigation>
      <h1 className="mb-4">Employee List</h1>
      <div className="mb-3 d-flex justify-content-between">
        <EmployeeSearch onSearch={handleSearch} />
        <button className="btn" onClick={handleUpcomingRetirement}>
          Upcoming Retirement
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {filteredEmployees.length === 0 ? (
        <p>No employees available.</p>
      ) : (
        <EmployeeTable employees={filteredEmployees} onDelete={handleDelete} onEdit={handleEdit} onViewDetails={handleViewDetails} />
      )}
    </div>
  );
};

export default EmployeeList;
