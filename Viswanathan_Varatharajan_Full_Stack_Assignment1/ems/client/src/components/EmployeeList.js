import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLCommand } from '../utils';
import EmployeeSearch from './EmployeeSearch';
import EmployeeTable from './EmployeeTable';
import './EmployeeList.css';
import HeaderNavigation from './HeaderNavigation';

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
  const searchTerm = queryParams.get('search') || '';

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
    } catch (error) {
      setError('Failed to fetch employees: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [currentType]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = employees.filter((employee) =>
      employee.firstName.toLowerCase().includes(lowercasedTerm) ||
      employee.lastName.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleSearch = (term) => {
    navigate(`?type=${currentType}&search=${term}`);
  };

  const handleDelete = async (id, status) => {
    if (status === 'Working') {
      alert("CAN'T DELETE EMPLOYEE – STATUS ACTIVE");
      return;
    }
  
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
    navigate(`/employees/edit/${id}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/employees/detail/${id}`);
  };

  const handleUpcomingRetirement = () => {
    navigate('/upcoming-retirement');
  };

  return (
    <div className="List">
      <HeaderNavigation currentType={currentType} />
      <h1 className="mb-4">Employee List</h1>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-grow-1 justify-content-center">
          <EmployeeSearch onSearch={handleSearch} className="search-bar" />
        </div>
        <button 
          className="btn btn-success ms-3 btn-sm" 
          onClick={handleUpcomingRetirement}
        >
          Upcoming Retirement
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {filteredEmployees.length === 0 ? (
        <p>No employees available.</p>
      ) : (
        <EmployeeTable 
          employees={filteredEmployees} 
          onDelete={handleDelete} 
          onEdit={handleEdit} 
          onViewDetails={handleViewDetails} 
        />
      )}
    </div>
  );
};

export default EmployeeList;
