// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Require route modules
const userRoutes = require('./microservices/userRoutes');
const postRoutes = require('./microservices/postRoutes');
const commentRoutes = require('./microservices/commentRoutes'); // Include comment routes
const User = require('./models/userModel'); // Import User model for gRPC

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use route modules
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes); // Mount comment routes

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
}).on('error', err => {
  console.error(`Failed to start Express server: ${err}`);
});

// gRPC server setup
const PROTO_PATH = './proto/user.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const getUser = async (call, callback) => {
  try {
    const user = await User.findById(call.request.id);
    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'User not found',
      });
    }
    callback(null, { user });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};

const createUser = async (call, callback) => {
  try {
    const { name, email } = call.request;
    const newUser = await User.create({ name, email });
    callback(null, { user: newUser });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};

const updateUser = async (call, callback) => {
  try {
    const { id, name, email } = call.request;
    const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!updatedUser) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'User not found',
      });
    }
    callback(null, { user: updatedUser });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};

const deleteUser = async (call, callback) => {
  try {
    const user = await User.findByIdAndDelete(call.request.id);
    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'User not found',
      });
    }
    callback(null, { user });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};

const getUsers = async (_, callback) => {
  try {
    const users = await User.find();
    callback(null, { users });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};

const startGrpcServer = () => {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUsers,
  });
  server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(`Failed to start gRPC server: ${err}`);
      return;
    }
    console.log(`gRPC server running at http://127.0.0.1:${port}`);
    server.start();
  });
};

startGrpcServer();
