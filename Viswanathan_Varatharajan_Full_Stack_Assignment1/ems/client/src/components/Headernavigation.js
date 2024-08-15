import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
const HeaderNavigation = ({ currentType }) => {
  const location = useLocation();

  return (
    <nav>
      <ul className="nav-links">
        <li>
          <Link to={`/?type=all`} className={currentType === 'all' ? 'active' : ''}>
            All Employees
          </Link>
        </li>
        <li>
          <Link to={`/?type=fullTime`} className={currentType === 'fullTime' ? 'active' : ''}>
            Full Time
          </Link>
        </li>
        <li>
          <Link to={`/?type=partTime`} className={currentType === 'partTime' ? 'active' : ''}>
            Part Time
          </Link>
        </li>
        <li>
          <Link to={`/?type=contract`} className={currentType === 'contract' ? 'active' : ''}>
            Contract
          </Link>
        </li>
        <li>
          <Link to={`/?type=seasonal`} className={currentType === 'seasonal' ? 'active' : ''}>
            Seasonal
          </Link>
        </li>
      </ul>
      <Link to="/create-employee" className="create-button">
        Create Employee
      </Link>
    </nav>
    
  );
};

export default HeaderNavigation;
