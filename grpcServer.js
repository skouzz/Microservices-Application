const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const User = require('./models/userModel');

const PROTO_PATH = './proto/user.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB for gRPC');
});

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

const main = () => {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUsers,
  });
  server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server running at http://127.0.0.1:50051');
    server.start();
  });
};

main();
