# Meal Box Server

## Introduction

Welcome to the Meal Box Server project! This guide will help you get started with setting up and running the server for managing meal box orders.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/maybemahdi/Meal-Box-Server
   ```
2. Navigate to the project directory:
   ```bash
   cd Meal-Box-Server
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory.
2. Add the following environment variables:

   ```
   PORT=
   DB_URI=
   BCRYPT_SALT_ROUNDS=
   NODE_ENV=
   JWT_ACCESS_SECRET=
   JWT_ACCESS_EXPIRES_IN=
   EMAIL=
   APP_PASSWORD=
   RESET_PASS_UI_LINK=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   STRIPE_SECRET_KEY=
   ```

## Running the Server

1. Start the MongoDB server:
   ```bash
   npm run dev
   ```
2. The server should now be running at `http://localhost:5000`.

## Summary

This project is a backend server for managing meal box orders. It uses Node.js and MongoDB to handle CRUD operations for meal data. Follow the steps above to set up and run the server locally.

## Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
