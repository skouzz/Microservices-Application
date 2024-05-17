const User = require('../models/userModel');

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error('Failed to fetch users');
      }
    },
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        throw new Error("Error while fetching user: " + error.message);
      }
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      try {
        const newUser = await User.create({ name, email });
        return newUser;
      } catch (err) {
        throw new Error('Failed to create user');
      }
    },
    updateUser: async (_, { id, name, email }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
        if (!updatedUser) {
          throw new Error('User not found');
        }
        return updatedUser;
      } catch (err) {
        throw new Error('Failed to update user');
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          throw new Error('User not found');
        }
        return deletedUser;
      } catch (err) {
        throw new Error('Failed to delete user');
      }
    },
  },
};

module.exports = resolvers;
