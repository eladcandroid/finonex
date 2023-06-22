# Project Setup

This project requires a `.env` file to be set up in order to configure environment variables. To set up the `.env` file, follow the steps below:

## Step 1: Copy the .env.example file

Make a copy of the `.env.example` file and rename it to `.env`. This file will be used to store your environment-specific configuration.

```shell
cp .env.example .env
```

## Step 2: Run the Docker Compose file

The project can be run using Docker Compose, which simplifies the deployment process. Ensure that you have Docker and Docker Compose installed on your system.

To run the project using Docker Compose, execute the following command in the terminal:

```shell
docker-compose up -d
```

This command will start the required services defined in the docker-compose.yml file. It will create a PostgreSQL database service and an Adminer service for managing the database.
That's it! You have now set up the project, configured the environment variables, and started the Docker Compose services. You can access your application at the specified port and interact with the PostgreSQL database using the Adminer service running on port 8080.


## Step 3: Install dependencies
Make sure to have the necessary dependencies installed before starting the project.

Execute the following command:
```shell
npm install
```
# Step 3: Start the project
Once the Docker Compose services are running, you can start your project. It will load the environment variables from the .env file and connect to the PostgreSQL database.

To start the project, run the following commands:

```shell
npm run start-server
```
To start the server process.

And:

```shell
npm run start-client
```
To start the client process that connects to the server.

