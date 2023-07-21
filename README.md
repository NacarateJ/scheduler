# Interview Scheduler

With this application, a student can create, edit and delete interview appointments.

The visual design, static html and CSS for this project was provided by [LHL](https://www.lighthouselabs.ca/).

## Project Phases:

* ***Build components in isolation:*** Build the components at the outermost nodes of the component tree (e.g. buttons, individual list items). and work the way up the tree to the components that need to use the ones built first.
* ***Retrieve data from an API and render the data using components.***
* ***Manage the visual state*** of the application including create, edit and delete capabilities.
* ***Implement advanced React patterns*** to manage the state and add live updates.

## Tools used during the development:

[Storybook](https://storybook.js.org/docs/react/get-started/install) was used to build components in isolation to speed up development and testing of individual components.

[webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) was used to quickly and easily see the effect of changes made to the project. It provides a live environment that updates the the browser when a file is saved.

[Jest](https://jestjs.io/) was used to implement a few features using test driven development. The Jest environment allows us to test components without a browser. 

[Cypress](https://www.cypress.io/app/) was used to perform tests using simulated user interaction.


## Setup & Familiarity

The Interview Scheduler project has been tested with Node `v12.22.x` (Vagrant & WSL) and `v15.14.0` (M1) and may not work with a newer version. Please ensure that you are using this version of node. You can use Node Version Manager (`nvm`)to switch to `v12.22.x` (Vagrant & WSL) or `v15.14.0` (M1) of Node.

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## The API Server

The API Server for this project was provided by [LHL](https://www.lighthouselabs.ca/) and can be found [here](https://github.com/lighthouse-labs/scheduler-api).

### Setup

Fork and clone the [scheduler-api](https://github.com/lighthouse-labs/scheduler-api) into a new directory (***NOT*** within the `scheduler` directory).

Follow the `README.md` instructions. This will involve a few steps, including:

* installing dependencies
* creating the database
* creating a `.env.development` file in the root directory
* seeding the database
* running the server

### Running Both Servers

The scheduler client (`scheduler`) runs on port 8000, and the scheduler server (`scheduler-api`) runs on port 8001.

