// EmployeeRow.js

import React from 'react';

const EmployeeRow = ({ employee, onDelete, onEdit, onViewDetails }) => (
  <tr>
    <td>{employee.firstName}</td>
    <td>{employee.lastName}</td>
    <td>{employee.age}</td>
    <td>{new Date(Number(employee.dateOfJoining)).toLocaleDateString()}</td>
    <td>{employee.title}</td>
    <td>{employee.department}</td>
    <td>{employee.employeeType.replace('_', ' ')}</td>
    <td>{employee.currentStatus ? 'Working' : 'Retired'}</td>
    <td>
      <div className="actions-container">
        <button onClick={() => onViewDetails(employee.id)}>View Details</button>
        <button onClick={() => onEdit(employee.id)}>Edit</button>
        <button onClick={() => onDelete(employee.id)}>Delete</button>
      </div>
    </td>
  </tr>
);

export default EmployeeRow;
