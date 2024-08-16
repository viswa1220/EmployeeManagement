import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "./EmployeeCreate.css";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeCreate = ({ onEmployeeCreated }) => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    dateOfJoining: "",
    title: "",
    department: "",
    employeeType: "",
    currentStatus: "",
  });

  const [errors, setErrors] = useState({}); // State to store error messages
  const navigate = useNavigate();

  const calculateAge = (dob) => {
    const today = dayjs();
    const birthDate = dayjs(dob);
    return today.diff(birthDate, "year");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!employee.firstName) newErrors.firstName = "First Name is required.";
    if (!employee.lastName) newErrors.lastName = "Last Name is required.";
    if (!employee.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!employee.dateOfJoining) newErrors.dateOfJoining = "Date of Joining is required.";
    if (!employee.title) newErrors.title = "Title is required.";
    if (!employee.department) newErrors.department = "Department is required.";
    if (!employee.employeeType) newErrors.employeeType = "Employee Type is required.";

    if (employee.age < 20 || employee.age > 70) {
      newErrors.age = "Age must be between 20 and 70.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
      dateOfJoining:
        name === "dateOfJoining"
          ? new Date(value).toISOString()
          : employee.dateOfJoining,
    });
  };

  const handleDateOfBirthChange = (date) => {
    if (date) {
      const age = calculateAge(date);
      if (age < 20 || age > 70) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          age: "Age must be between 20 and 70.",
        }));
        return;
      }
      const status = age >= 65 ? "Retired" : "Working";
      setEmployee((prevState) => ({
        ...prevState,
        dateOfBirth: date,
        age,
        currentStatus: status,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, age: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        navigate("/list");
      } else {
        console.error("Unexpected result format:", result);
      }
    } catch (error) {
      console.error(
        "Error creating employee:",
        error.message || "Unknown error"
      );
    }
  };

  return (
    <div className="container mt-4">
      <header className="d-flex justify-content-between align-items-center mb-4 headingColor">
        <div className="d-flex justify-content-between w-100">
          <h1 className="text-center flex-grow-1">Create Employee</h1>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Back to List
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="form-control"
          />
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="form-control"
          />
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <DatePicker
            selected={employee.dateOfBirth}
            onChange={handleDateOfBirthChange}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Select Date of Birth"
          />
          {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
          {errors.age && <div className="text-danger">{errors.age}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            readOnly
            className="form-control"
          />
          {errors.age && <div className="text-danger">{errors.age}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Date of Joining</label>
          <input
            type="date"
            name="dateOfJoining"
            value={employee.dateOfJoining.split("T")[0]}
            onChange={handleChange}
            className="form-control"
          />
          {errors.dateOfJoining && <div className="text-danger">{errors.dateOfJoining}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <select
            name="title"
            value={employee.title}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Title</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Tester">Tester</option>
          </select>
          {errors.title && <div className="text-danger">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            name="department"
            value={employee.department}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="IT">IT</option>
          </select>
          {errors.department && <div className="text-danger">{errors.department}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Employee Type</label>
          <select
            name="employeeType"
            value={employee.employeeType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Employee Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
          {errors.employeeType && <div className="text-danger">{errors.employeeType}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Current Status</label>
          <input
            type="text"
            name="currentStatus"
            value={employee.currentStatus}
            readOnly
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Create Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeCreate;
