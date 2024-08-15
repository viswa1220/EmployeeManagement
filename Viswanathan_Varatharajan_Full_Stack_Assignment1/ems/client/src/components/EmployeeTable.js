
import React from 'react';
import EmployeeRow from './EmployeeRow';
import './EmployeeTable.css'; 

const EmployeeTable = ({ employees, onDelete, onEdit, onViewDetails }) => (
  <div className="container">
    <div className="table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Date of Joining</th>
            <th>Title</th>
            <th>Department</th>
            <th>Employee Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        {employees.length > 0 ? (
          <tbody>
            {employees.map((employee) => (
              <EmployeeRow 
                key={employee.id} 
                employee={employee} 
                onDelete={onDelete} 
                onEdit={onEdit} 
                onViewDetails={onViewDetails} 
              />
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="9" className="no-data">No Data</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  </div>
);

export default EmployeeTable;
