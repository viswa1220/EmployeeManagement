const Employee = require('../models/Employee');

const resolvers = {
  Query: {
    employees: async () => {
      try {
        return await Employee.find();
      } catch (error) {
        throw new Error('Failed to fetch employees: ' + error.message);
      }
    },
    fullTimeEmployees: async () => {
      try {
        return await Employee.find({ employeeType: 'FULL_TIME' });
      } catch (error) {
        throw new Error('Failed to fetch full-time employees: ' + error.message);
      }
    },
    partTimeEmployees: async () => {
      try {
        return await Employee.find({ employeeType: 'PART_TIME' });
      } catch (error) {
        throw new Error('Failed to fetch part-time employees: ' + error.message);
      }
    },
    contractEmployees: async () => {
      try {
        return await Employee.find({ employeeType: 'CONTRACT' });
      } catch (error) {
        throw new Error('Failed to fetch contract employees: ' + error.message);
      }
    },
    seasonalEmployees: async () => {
      try {
        return await Employee.find({ employeeType: 'SEASONAL' });
      } catch (error) {
        throw new Error('Failed to fetch seasonal employees: ' + error.message);
      }
    }
  },
  Mutation: {
    createEmployee: async (_, { input }) => {
      try {
        // Validate input
        if (!input.firstName || !input.lastName || !input.age || !input.dateOfJoining || !input.title || !input.department || !input.employeeType) {
          throw new Error('Missing required fields');
        }

        // Create and save employee
        const employee = new Employee({
          ...input,
          dateOfJoining: new Date(input.dateOfJoining), // Ensure date is a Date object
          currentStatus: true,
        });
        await employee.save();
        return employee;
      } catch (error) {
        throw new Error('Failed to create employee: ' + error.message);
      }
    },
    deleteEmployee: async (_, { id }) => {
      try {
        const result = await Employee.findByIdAndDelete(id);
        if (!result) {
          throw new Error('Employee not found');
        }
        return result;
      } catch (error) {
        throw new Error('Failed to delete employee: ' + error.message);
      }
    },
    updateEmployee: async (_, { id, input }) => {
      try {
        if (input.dateOfJoining && typeof input.dateOfJoining === 'string') {
          input.dateOfJoining = new Date(input.dateOfJoining);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });

        if (!updatedEmployee) {
          throw new Error('Employee not found');
        }

        return updatedEmployee;
      } catch (error) {
        console.error('Failed to update employee:', error);
        throw new Error('Failed to update employee: ' + error.message);
      }
    }
  }
};

module.exports = resolvers;
