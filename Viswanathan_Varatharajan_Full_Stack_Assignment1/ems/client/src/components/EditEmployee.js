import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { graphQLCommand } from "../utils";
import "./EditEmployee.css";
import "bootstrap/dist/css/bootstrap.min.css";

// GraphQL queries and mutations
const GET_EMPLOYEES = `
  query GetEmployees {
    employees {
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
`;

const UPDATE_EMPLOYEE = `
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
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
`;

// Date formatting function
const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  return date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
};

const EditEmployee = ({ onEmployeeUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dateOfBirth: "",
    dateOfJoining: "",
    title: "",
    department: "",
    employeeType: "",
    currentStatus: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const result = await graphQLCommand(GET_EMPLOYEES);
        const employeeData = result.employees.find((emp) => emp.id === id);
        setEmployee(employeeData);
        if (employeeData) {
          setFormData({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            age: employeeData.age,
            dateOfBirth: formatDate(employeeData.dateOfBirth),
            dateOfJoining: formatDate(employeeData.dateOfJoining),
            title: employeeData.title,
            department: employeeData.department,
            employeeType: employeeData.employeeType,
            currentStatus: employeeData.currentStatus ? "Working" : "Retired",
          });
        } else {
          setError("Employee not found");
        }
      } catch (error) {
        setError(
          "Failed to fetch employee details: " +
            (error.message || "Unknown error")
        );
      }
    };

    fetchEmployee();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "age" ? Number(value) : value,
      dateOfJoining:
        name === "dateOfJoining"
          ? new Date(value).toISOString()
          : prevData.dateOfJoining,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const { id, ...input } = formData;
      await graphQLCommand(UPDATE_EMPLOYEE, {
        id: employee.id,
        input: {
          ...input,
          currentStatus:
            input.currentStatus === "Working" ? "Working" : "Retired",
        },
      });

      if (onEmployeeUpdated) {
        onEmployeeUpdated(formData);
      }
      navigate("/?type=all");
    } catch (error) {
      setError(
        "Error updating employee: " + (error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="mt-5">
      <h1 className="text-center mb-4">Edit Employee</h1>

      {error && <p className="text-danger text-center">{error}</p>}

      {employee ? (
        <form onSubmit={handleUpdate} className="form-container_new">
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              readOnly
              className="form-control read-only"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              readOnly
              className="form-control read-only"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Age"
              readOnly
              className="form-control read-only"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder="Date of Birth"
              readOnly
              className="form-control read-only"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date of Joining</label>
            <input
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleInputChange}
              placeholder="Date of Joining"
              readOnly
              className="form-control read-only"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleInputChange}
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
              value={formData.department}
              onChange={handleInputChange}
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
              value={formData.employeeType}
              onChange={handleInputChange}
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
            <select
              name="currentStatus"
              value={formData.currentStatus}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  currentStatus: e.target.value,
                }))
              }
              className="form-select read-only"
              disabled
            >
              <option value="Working">Working</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Update Employee
            </button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditEmployee;
