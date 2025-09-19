# 🎫 Ticketing System

[![Deployment Status](https://img.shields.io/badge/deployment-active-brightgreen)](https://ticketing-system-silk.vercel.app)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031)](https://angular.io/)
[![Mock API](https://img.shields.io/badge/API-Mocked-blue)]()
[![NTT DATA Tech Trek](https://img.shields.io/badge/NTT%20DATA-Tech%20Trek-orange)]()

## 🔍 Overview

Ticketing System is an Angular application developed as part of the NTT DATA Tech Trek program. It simulates an IT support ticket management system.  

The application implements three main roles:
- **Admin** – manages users, sees all tickets, and assigns them to technicians
- **Technician** – views assigned tickets and can update their status
- **Client** – submits new tickets and tracks their history

---

## ✨ Features

* **Authentication** – login with mock users for different roles (Admin, Technician, Client)
* **Admin Dashboard** – view unassigned tickets, see available technicians, assign tickets
* **Technician Dashboard** – view assigned tickets, update status (Start/Complete), add notes and attachments
* **Client Dashboard** – create new tickets, view "My Tickets", see real-time status updates
* **Mock API** – backend simulated with json files
* **Role-Based Access** –  each user only sees the features allowed for their role
* **Responsive Design** – clean UI built with Angular Material

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v20 or higher)
* Angular CLI (v17 or higher)
* npm (v10 or higher)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
