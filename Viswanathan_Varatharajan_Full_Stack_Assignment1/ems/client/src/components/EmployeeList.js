import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLCommand } from '../utils';
import EmployeeSearch from './EmployeeSearch'; // Import the search component
import EmployeeTable from './EmployeeTable'; // Import the EmployeeTable component
import './EmployeeList.css'; // Import the updated CSS file

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

// Utility function to format date
const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString(); // Format as 'MM/DD/YYYY'
};

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

    // Define queries based on employee type
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
      setFilteredEmployees(employeeData); // Initialize filteredEmployees
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

  return (
    <div className="container">
      <h1>Employee List</h1>

      <EmployeeSearch onSearch={handleSearch} /> {}

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
