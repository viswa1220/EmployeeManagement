const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true },
  dateOfJoining: { type: Date, required: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  employeeType: {
    type: String,
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'SEASONAL'],  
    required: true
  },
  currentStatus: { type: String, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
