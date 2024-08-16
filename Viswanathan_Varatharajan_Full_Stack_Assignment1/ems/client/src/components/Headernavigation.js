import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.css";

const HeaderNavigation = ({ currentType }) => {
  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Navbar.Brand as={Link} to="/">
        Employee Management
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            as={Link}
            to="?type=all"
            className={currentType === "all" ? "active" : ""}
          >
            All Employees
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="?type=fullTime"
            className={currentType === "fullTime" ? "active" : ""}
          >
            Full Time
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="?type=partTime"
            className={currentType === "partTime" ? "active" : ""}
          >
            Part Time
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="?type=contract"
            className={currentType === "contract" ? "active" : ""}
          >
            Contract
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="?type=seasonal"
            className={currentType === "seasonal" ? "active" : ""}
          >
            Seasonal
          </Nav.Link>
        </Nav>
        <Button
          as={Link}
          to="/employees/create"
          variant="primary"
          className="ms-auto"
        >
          Create Employee
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderNavigation;
