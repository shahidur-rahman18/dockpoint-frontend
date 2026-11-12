# DocPoint

### A modern clinic management dashboard for better-connected care.

DocPoint brings essential clinic workflows into one role-based workspace for administrators and doctors—from managing doctors and patients to viewing appointments, schedules, and account settings.

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Django%20%2B%20DRF-092e20?logo=django&logoColor=white)

> **Development status:** DocPoint is actively being developed. Some dashboard areas still use sample data or placeholders. Authentication and API-backed workflows require the compatible Django backend.

## ✨ Features

| | Feature | What you can do |
|---|---|---|
| 🔐 | **Role-based workspaces** | Access protected dashboards tailored to administrator and doctor roles. |
| 🩺 | **Doctor management** | View and manage doctor profiles, availability, and onboarding from the admin workspace. |
| 🧑‍🤝‍🧑 | **Patient directory** | Browse patient records from the administrator dashboard. |
| 📅 | **Appointment management** | View appointments in a calendar and doctor-focused appointment workspace. |
| 🗓️ | **Doctor schedules** | Review schedule information and manage doctor schedule-related workflows. |
| ⚙️ | **Account settings** | Access role-specific profile and settings screens. |
| 🔗 | **Backend-connected architecture** | Use a shared API client, configurable API URL, and generated TypeScript API types. |
| 📱 | **Responsive interface** | Work with a modern dashboard UI built with React and Tailwind CSS. |

### 👥 User roles

- **Administrator** — manages doctors and accesses the patient directory and administrative dashboard.
- **Doctor** — accesses a dedicated dashboard, appointments, schedule, and account settings.

> Patient-facing dashboards and some other sections are still planned or shown as placeholders. Some dashboard metrics and views currently use local mock data.

## Tech stack

### Frontend

- React 19 and TypeScript
- Vite 8
- React Router
- TanStack Query and TanStack Table
- Axios
- Tailwind CSS 4
- FullCalendar
- Lucide React

### Backend

- Django
- Django REST Framework (DRF)
- OpenAPI schema for generating frontend API types

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- A compatible DocPoint Django REST Framework API for authentication and API-backed features

## Getting started

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/shahidur-rahman18/dockpoint-frontend.git
   cd dockpoint-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the API URL. Create a `.env.local` file in the project root:

   ```dotenv
   VITE_API_BASE_URL=/api
   ```

   In development, Vite proxies `/api` requests to `http://127.0.0.1:8000` by default. Start the backend on that address, or update the proxy target in `vite.config.ts` to match your local backend.

   To connect directly to a backend instead, set `VITE_API_BASE_URL` to its API root (for example, `https://api.example.com/api/`) and configure the backend's CORS and credential policies as required.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite (usually `http://localhost:5173`).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for verification. |
| `npm run api:types` | Generate TypeScript API types from the backend OpenAPI schema at `http://127.0.0.1:8000/api/schema/`. |

To regenerate API types, make sure the backend is serving its schema at `http://127.0.0.1:8000/api/schema/`, then run `npm run api:types`.

## Backend integration

The frontend expects the API to be available under `/api` by default. Authentication and several management workflows use the DocPoint backend, including account login and profile retrieval, doctor management, patient listing, and appointment-related endpoints.

The API client reads `VITE_API_BASE_URL` at build time. For deployment, configure this variable to the API root for that environment. If the frontend and API are hosted on different origins, the backend must allow the frontend origin and support the credential behavior required by the authentication flow.

## Project structure

```text
src/
├── api/          # Shared API client
├── auth/         # Authentication state and services
├── components/   # Dashboard, form, calendar, and shared UI components
├── data/         # Sample and mock data used by in-progress views
├── hooks/        # Reusable data and state hooks
├── pages/        # Admin and doctor dashboard pages
├── router/       # Application routes and access control
├── services/     # API service functions
└── types/        # Shared and generated API types
```

## Deployment

Build the application with `npm run build` and deploy the generated `dist/` directory to a static hosting provider. Configure `VITE_API_BASE_URL` for the target environment before building.

This project includes a `vercel.json` configuration for Vercel deployments. Ensure the deployment serves the SPA entry point for client-side routes and that the configured API is reachable from the deployed frontend.

## Contributing

1. Create a branch for your change.
2. Keep changes focused and follow the existing TypeScript and component patterns.
3. Run `npm run build` before opening a pull request.
4. In your pull request, describe the change and include relevant screenshots for UI updates.

## Project documentation

- [API integration and architecture plan](./API_INTEGRATION_PLAN.md)
- [Authentication and authorization plan](./AUTHENTICATION_AUTHORIZATION_PLAN.md)
- [Patient management and appointment plan](./PATIENT_MANAGEMENT_AND_APPOINTMENT_PLAN.md)

## License

No license file is currently included in this repository. Unless a license is added, standard copyright protections apply.
