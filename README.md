# Earning System

EarningSystem is a Node.js-based backend application that provides features like user authentication, real-time updates and profit sharing based on multi-level referral hierarchy. 

It leverages MongoDB for data storage and includes essential tools for validation and security.

## Installation

Use the package manager npm to install the dependencies.

```bash
npm install
```

## Usage
1. Start the development server:

```bash
npm run dev

```
2. Create a .env file in the project root and configure the following environment variables:
```bash
# Server Port

`PORT`=<your-port-number>

# returns 'connection url'
`DB_URL`=<your-mongodb-connection-string>

# returns 'jwt secret key'
`JWT_SECRET_KEY`=<your-jwt-secret>
```
3.Make API calls using a tool like Postman, Curl, or through your frontend application.
## Features
- Authentication:-  Secure password hashing with bcrypt and JWT-based authentication.
- Validation: Schema validation for requests using Joi.
- Real-Time Communication: Real-time updates via Socket.IO.
- Manage sensitive information with dotenv.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

ISC
