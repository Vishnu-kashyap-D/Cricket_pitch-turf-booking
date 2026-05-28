Cricket Pitch & Turf Booking
=================================

Project: Cricket Pitch & Turf Booking System

Maintainer: Vishnu-kashyap-D
Contact: vishnukashyapd18@gmail.com

Overview
--------
This repository contains a full-stack Cricket Pitch Booking application with a Node/Express backend and a plain HTML/CSS/JS frontend for managing branches, pitches, bookings and reviews.

System Architecture
-------------------
- Frontend: Static files served from `abc/public/` (HTML, CSS, JS). No frontend framework used for rapid prototyping.
- Backend: Node.js + Express server located in `abc/server.js` exposing REST endpoints under `/api/*` and serving static files.
- Database: MySQL schema defined in `abc/setup.sql` (tables for Branch, Pitch, Customer, Bookings).
- Authentication: JWT-based auth using tokens stored in `localStorage` by the frontend.

High-level flow
1. User visits the frontend and fetches available branches and pitches from `/api` routes.
2. User registers / logs in and receives a JWT token.
3. Bookings are made via POST to `/api/bookings` including `entry_time` and `exit_time`.

Tech Stack
----------
- Node.js (Express)
- MySQL
- Plain HTML, CSS, JavaScript
- Optional: FontAwesome, Google Fonts for UI

How to run (local)
-------------------
Prerequisites:
- Node.js (>= 14)
- MySQL server

1. Install dependencies (if project uses `package.json` in the `abc/` folder):

   cd abc
   npm install

2. Create the database and tables using `abc/setup.sql`:

   mysql -u root -p < setup.sql

3. Configure DB connection in `abc/server.js` or `abc/database.sql` / `config/db.js` according to your environment variables.

4. Start the server:

   node server.js

5. Open the app in a browser at http://localhost:5000 (or the port printed by the server).

Notes
-----
- Static assets (hero image) are stored under `abc/public/`.
- If you use Docker or a process manager like PM2, adapt steps accordingly.

Repository layout (brief)
- `abc/` - main working project (server, public files, DB scripts)
- `web111/`, `web2/`, `web2222/`, etc. - other variants or sample apps found in workspace

Contributing
------------
1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and commit them in small, logical commits
4. Open a Pull Request describing your change

License
-------
MIT