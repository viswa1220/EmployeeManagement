
import React, { useState } from 'react';
import './EmployeeSearch.css'; 

const EmployeeSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleChange}
          className="search-input"
        />
        
      </form>
    </div>
  );
};

export default EmployeeSearch;
