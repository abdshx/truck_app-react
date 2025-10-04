# Truck App Frontend

## Project Description

This is the frontend for the Truck App, designed to assist truck drivers with trip planning, activity tracking, and compliance with driving regulations. It provides a user-friendly interface to manage routes, monitor driving and rest times, log activities like fueling, and receive important alerts.

## Features

- **Trip Planning**: Plan routes with specified start, pickup, and dropoff locations, visualizing the route on a map.
- **Driving Activity Tracking**: Start and stop driving sessions, with real-time timers to accurately track driving duration.
- **Activity Logging**: Record various activities such as fueling and rest stops. Each activity is logged with its type, duration, and associated start/end times.
- **Refueling Alerts**: The system provides alerts if the distance covered since the previous stop exceeds 100 miles, prompting the driver to refuel.
- **Driving Hour Limits**: Automatically checks cumulative driving hours against a 70-hour limit. If the limit is exceeded, the system notifies the driver that the trip must end.
- **Day Management**: Automatically calculates and updates the day number based on cumulative activity duration, helping drivers manage their daily logs.

## Getting Started

To run the frontend application, follow these steps:

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn (npm is used in these instructions)

### Installation

1. Navigate to the `truck_app_frontend` directory:
   ```bash
   cd truck_app_frontend
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

The application will typically be available at `http://localhost:8080` (or another port if 8080 is in use).



The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```


## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS



