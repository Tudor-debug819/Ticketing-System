# 🎫 Ticketing System

[![Deployment Status](https://img.shields.io/badge/deployment-pending-yellow)]()
[![Angular](https://img.shields.io/badge/Angular-17-DD0031)](https://angular.io/)
[![Mock API](https://img.shields.io/badge/API-Mocked-blue)]()
[![NTT DATA Tech Trek](https://img.shields.io/badge/NTT%20DATA-Tech%20Trek-orange)]()

## 🔍 Overview

Ticketing System este o aplicație Angular creată în cadrul programului **NTT DATA Tech Trek**, care simulează un sistem de management al tichetelelor de suport IT.  

Aplicația implementează trei roluri principale:
- **Admin** – gestionează utilizatorii, vede toate tichetele și le poate asigna tehnicienilor
- **Technician** – vizualizează tichetele asignate și poate schimba statusul lor
- **Client** – trimite tichete noi și urmărește istoricul propriu

---

## ✨ Features

* **Authentication** – login cu mock users pe roluri (Admin, Technician, Client)
* **Admin Dashboard** – vizualizare tichete neasignate, listă tehnicieni disponibili, asignare tichete
* **Technician Dashboard** – vizualizare tichete asignate, schimbare status (Start/Complete), adăugare note și atașamente
* **Client Dashboard** – creare tichet nou, vizualizare „My Tickets”, status actualizat în timp real
* **Mock API** – backend simulat cu `json-server`
* **Role-Based Access** – fiecare utilizator vede doar ce are voie conform rolului
* **Responsive Design** – UI simplu, construit cu Angular Material

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v20 sau mai nou)
* Angular CLI (v17 sau mai nou)
* npm (v10 sau mai nou)

### Instalare

1. Clonează repo:
```bash
git clone https://github.com/<username>/ticketing-system.git
cd ticketing-system


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
