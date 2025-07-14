# Project Root

* **Name:** Jackson Alberto Florez Perez
* **Clan:** Gosling
* **Email:** [jacksonflorezp@gmail.com](mailto:jacksonflorezp@gmail.com)
* **ID Number:** 1036693290

## Description

This project is a **Single Page Application (SPA)** built with **JavaScript, HTML, and CSS**, using `Vite` as the development environment. It simulates an event management system that allows users to:

* Log in as **administrator** or **visitor**
* View a list of events
* Admin users can **create, edit, and delete** events
* Visitors can **reserve** available events

The application communicates with a simulated backend via **json-server**, and maintains the session using **localStorage**.

---

## Features

### SPA Structure

* Navigation between views without reloading the page
* Dynamic rendering of views depending on the user role

### CRUD Operations

* Admin can create, edit and delete events
* CRUD operations are synced with `json-server`

### Authentication

* User chooses between admin or visitor (role-based logic)
* Role is stored in localStorage
* Content is conditionally rendered depending on user role

### Session Persistence

* Role remains stored in localStorage between reloads
* UI updates dynamically according to the stored role

### Role-Based Access

* Visitors see "Reserve" buttons only
* Admins see "Edit" and "Delete" buttons

---

## How to Run the Project

### Requirements

* Node.js
* npm
* json-server (globally or as a dev dependency)

### Installation

```bash
npm install
```

### Run Backend (json-server)

```bash
npx json-server --watch db.json --port 3001
```

### Run Frontend

```bash
npm run dev
```

> The frontend(Vite) will be available at `http://localhost:5173`
> The backend(json) runs on `http://localhost:3001`

---

## User Roles

### Administrator

* Can **create, edit and delete** events
* Must be manually set in the database (`db.json`)

### Visitor

* Can **view and reserve** available events
* Can only reserve if there is capacity available *(partially implemented)*

---

## Project Structure

```
project-root/
├── assets/
│   ├── img/
│   ├── js/ - main.js
│   ├── css/ - style.css
│   └── db/ - db.json
├── views/
│   ├── dashboard.html
│   ├── login.html
│   ├── addEvent.html
│   ├── enrollments.html
│   └── register.html.html
├── db.json
├── README.md
└── package.json
```
