const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should create a new user', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createUser(userInput: {
              email: "test@test.com",
              password: "test123"
            }) {
              _id
              email
            }
          }
        `
      });

    expect(response.status).toBe(200);
    expect(response.body.data.createUser.email).toBe('test@test.com');
  });

  test('should login user', async () => {
    // First create a user
    await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createUser(userInput: {
              email: "test@test.com",
              password: "test123"
            }) {
              _id
              email
            }
          }
        `
      });

    // Then try to login
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            login(email: "test@test.com", password: "test123") {
              token
              userId
            }
          }
        `
      });

    expect(response.status).toBe(200);
    expect(response.body.data.login.token).toBeDefined();
  });
});