
# Microservices-project

## Overview
This mini project centers around creating a user-post-comment system with microservices architecture. It utilizes gRPC, REST, and GraphQL for seamless communication between services, catering to diverse integration requirements. The project is currently in the process of integrating Kafka for robust message queuing within the system.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- GraphQL
- gRPC
- Kafka (Work in Progress)

## Installation
To run this project locally, follow these steps:

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

## Usage
### REST API
- Users CRUD: \`/users\`
- Posts CRUD: \`/posts\`
- Comments CRUD: \`/comments\`

### GraphQL API
- Endpoint: `/graphql`
  - Queries:
    - `getUsers`
    - `getUser`
    - `getPosts`
    - `getPost`
    - `getComments`
    - `getComment`
  - Mutations:
    - `createUser`
    - `updateUser`
    - `deleteUser`
    - `createPost`
    - `updatePost`
    - `deletePost`
    - `createComment`
    - `updateComment`
    - `deleteComment`


### gRPC
- Endpoint: \`0.0.0.0:50051\`
  - Services:
    - UserService: \`getUser\`, \`createUser\`, \`updateUser\`, \`deleteUser\`
    - PostService: \`getPost\`, \`createPost\`, \`updatePost\`, \`deletePost\`
    - CommentService: \`getComment\`, \`createComment\`, \`updateComment\`, \`deleteComment\`


    
## Running Tests

To run tests, run the following command

```bash
  node app.js
  node index.js
```



## Contributing
We welcome contributions to improve this project! To contribute, please follow these guidelines:
- Submit bug reports and feature requests via GitHub issues.
- Fork the repository, make your changes, and submit a pull request.

## Roadmap
Future plans and enhancements for this project include:
- Implementation of Kafka integration.


![Logo](https://i.postimg.cc/qRdyw8NH/blog-64583fdf7ff8358910349c40-img-05d6717-fa0d-32de-4b31-5e8078575a4.png)

