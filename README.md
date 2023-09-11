# POKEDEX

## Pokedex is a simple web application built using Flask and React.js. 

### Main features:

- Filter pokemons by all properties.
- Sort pokemons by all properties.
- Search pokemons by name.
- Unlimited scrolling - The application loads more pokemons when the user scrolls to the bottom of the page.
- Catch pokemons - By double click or touch on the pokemon image (Flask session is used to save the caught pokemons).
- Dark mode - The application supports dark mode.
- Responsive design - The application supports mobile devices.

## Getting Started

Clone this repository to your local machine:

```bash
git clone git@github.com:maorkavod/pokedex.git -b main
cd pokedex
```

### project structure

```bash

├── backend/
│   └── server.py
│   └── requirements.txt
│   └── (Flask project files)
├── frontend/
│   └── package.json
│   └── (React project files)
```

### The project is divided into two main folders: backend and frontend. The backend folder contains the Flask server and the frontend folder contains the React application. For the development environment (only), the Flask server is configured to serve the React application with a proxy. package.json file contains a proxy configuration that redirects the requests to the Flask server.

## Docker instructions (recommended):

Make sure you have docker installed and running on your machine.

```bash
docker build -t pokedex . # This will take a minute or two, The docker is building the images and installing the dependencies.
docker run -p 8080:8080 -p 3000:3000 pokedex
```

### At this point, the application is running on your machine. You can access it at http://localhost:3000. The backend and frontend are running in the same container.

## Local instructions:

### Backend:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

### Frontend:

```bash
cd frontend
npm install
npm start
```

### At this point, the application is running on your machine. You can access it at http://localhost:3000. The backend and frontend are running in different processes.


## Preview

![pokedex](https://maor-static-exp-100-days.s3.eu-central-1.amazonaws.com/pokedex-preview.gif)
