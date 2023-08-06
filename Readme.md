## The NodeJS ToDo app

The node.js example app teaches the very basics of how to work with Contentful:

- Implementing JWT authentication in your APIs
- Enabling CRUD Operations
- Caching and Dockerizing your application

The app demonstrates how to implement a simple CRUD operations using JWT authentication.

## Requirements

* Node 8
* Git
* Postman

Without any changes, this app is connected to a Contentful space with read-only access. To experience the full end-to-end Contentful experience, you need to connect the app to a Contentful space with read _and_ write access. This enables you to see how content editing in the Contentful web app works and how content changes propagate to this app.

## Common setup

Clone the repo and install the dependencies.

```bash
git clone [https://github.com/shivam3746/rest-api-jwt.git]
cd rest-api-jwt
```

Run the below command in the root folder. Make sure package.json is present in this folder.

```bash
npm install
```

## Steps for initializing

To start the express server, run the following

```bash
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000).


