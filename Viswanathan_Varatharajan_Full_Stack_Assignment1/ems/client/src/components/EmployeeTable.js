import React from "react";
import { Table, Button, Container } from "react-bootstrap";
import dayjs from "dayjs";
import "./EmployeeTable.css";

const EmployeeTable = ({ employees, onDelete, onEdit, onViewDetails }) => (
  <Container fluid className="vh-100 p-4">
    <div className="employee-table-container">
      <Table striped bordered hover className="employee-table">
        <thead className="table-header">
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
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => {
              const formattedDateOfJoining = dayjs(
                employee.dateOfJoining
              ).format("YYYY/MM/DD");

              return (
                <tr key={employee.id}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.age}</td>
                  <td>{formattedDateOfJoining}</td>
                  <td>{employee.title}</td>
                  <td>{employee.department}</td>
                  <td>{employee.employeeType}</td>
                  <td>{employee.currentStatus}</td>
                  <td className="table-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onViewDetails(employee.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => onEdit(employee.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        onDelete(employee.id, employee.currentStatus)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  </Container>
);

export default EmployeeTable;
