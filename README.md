# Interview Scheduler

Interview Scheduler is a single-page application (SPA) that allows users to book technical interviews between students and mentors.

## Features

### Booking Interviews
* Interviews can be booked between Monday and Friday.
* Users can switch between weekdays to view available appointment slots.
* Users can book interviews by entering a student name and selecting an interviewer from the list of available interviewers.
* Appointments can only be made in empty slots.

### Managing Appointments
* Users can cancel existing interviews.
* Users can edit the details of an existing interview.

### State Management with useReducer
* Utilizes the useReducer hook to manage application state in a more advanced and structured manner.
* State transitions and actions are managed centrally, allowing for better control over complex application logic.

### Availability Tracking
* The list of days displays the number of available appointment slots for each day.
* The available slots are updated when interviews are booked or canceled.

### Confirmations and Error Handling
* Users receive a confirmation before canceling an interview.
* An error message is displayed if an interview cannot be saved or deleted.

### Error Handling and Recovery
* If an error occurs, users can close the error modal to return to the Form or Show view, skipping Status and Confirm.

### Asynchronous Operations
* Users are shown a status indicator while the application performs asynchronous operations.

### WebSocket Integration
* Utilizes the WebSocket API to establish a persistent connection with the scheduler API server.
* When appointments are created or deleted, messages are sent to all connected clients with updated data.

### Data Persistence
* The application makes API requests to load and persist data.
* User data is retained even after a browser refresh.

The visual design, static html and CSS for this project was provided by [LHL](https://www.lighthouselabs.ca/).

## Project Phases:

* ***Build components in isolation:*** Build the components at the outermost nodes of the component tree (e.g. buttons, individual list items) and work the way up the tree to the components that need to use the ones built first.

* ***Retrieveand and render data:*** Utilize components to retrieve data from an API and render it efficiently within the application.

* ***Visual state management:*** Implement features to manage the visual state of the application, including creating, editing, and deleting appointments.

* ***Advanced React patterns*** Employ advanced React patterns for state management and real-time updates.

## Technologies

* [Storybook:](https://storybook.js.org/docs/react/get-started/install) An open-source tool that accelerates development by developing and testing UI components in isolation.

* [webpack-dev-server:](https://www.npmjs.com/package/webpack-dev-server) A module bundler for JavaScript applications that facilitate rapid development iterations by providing live updates in the browser.

* [Jest:](https://jestjs.io/) A JavaScript testing framework for building test suites by implementing features using test-driven development. It performs component testing without a browser.

* [Cypress:](https://www.cypress.io/app/) A testing framework for end-to-end testing of web applications.It conducts tests using simulated user interactions.

* [React:](https://react.dev/) A JavaScript library for building user interfaces.

* [Node.js:](https://nodejs.org/en) A JavaScript runtime that allows us to execute JavaScript on the server side.

* [npm:](https://www.npmjs.com/) A package manager for JavaScript.

## Setup & Usage

Ensure you have Node v12.22.x (Vagrant & WSL) or v15.14.0 (M1) installed. The Interview Scheduler project may not work with a newer version.

Use Node Version Manager (nvm) to manage versions.

* Clone the repository and navigate to the project directory.
* Install dependencies: `npm install`.
* To run `Webpack Development Server`: `npm start`
* To run `Jest` tests: `npm npm test`
* To run `Storybook` visual testbed:: `npm run storybook`
* To run `Cypress` tests you will need to use three separate terminal windows:

  **Terminal 1** - scheduler-api directory
  ```sh
  npm run test:server
  ```
  
  **Terminal 2** - webpack development server
  ```sh
  npm start
  ```
  
  **Terminal 2** - webpack development server
  ```sh
  npm run cypress
  ```

### Handling errors

The API server is configured with a `TEST_ERROR` environment variable so we can test the error handling functionality of the application when a `HTTP` response is not completed successfully.

The `put` and `delete` routes check to see if the variable is enabled and if it is they return an error.

* Run the `scheduler-api` server using `npm run error` script.

## The API Server

The API Server for this project was provided by [LHL](https://www.lighthouselabs.ca/) and can be found [here](https://github.com/lighthouse-labs/scheduler-api).

### To set up the API server:

Fork and clone the [scheduler-api](https://github.com/lighthouse-labs/scheduler-api) into a new directory (***NOT*** within the `scheduler` directory).

Follow the `README.md` instructions. This will involve a few steps, including:

* installing dependencies
* creating the database
* creating a `.env.development` file in the root directory
* seeding the database
* running the server

## Running Both Servers

The scheduler client (`scheduler`) runs on port 8000, and the scheduler server (`scheduler-api`) runs on port 8001. Both can be started by running `npm start` in the terminal. 

## Final Product

<div align="center">



<div/>

## Jest Test Coverage Report

<div align="center">



<div/>

## Cypress Tests

<div align="center">



<div/>

## Storybook Components Tests

<div align="center">



<div/>

