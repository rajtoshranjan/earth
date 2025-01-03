# Earth

This project is an Earth exploration application inspired by Google Earth, built using Maplibre, React, and Tailwind CSS. While it draws inspiration from Google Earth's design and functionality, it includes unique custom-made features and improvements. This application offers a visually engaging way for users to explore and interact with Earth's geography and landmarks.

![Earth](docs/earth.jpeg)

Note: Although inspired by Google Earth, this project includes significant differences in both design and functionality, providing a distinct user experience.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Interactive 3D Map: Explore a 3D representation of Earth's surface.
- Zoom and Pan: Zoom in and out and pan across the map.
- Search: Search a place by name.
- Measurement: Measurement of vector geometry (length, area, etc.)
- Layers: Add custom raster and vector layers
- Vector Digitization, Editing and Export
- State Persistence: This application stores data such as layers, component states, etc in local storage.


## Technologies Used

- [Vite](https://vitejs.dev/): A fast build tool for modern web development.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.
- [Maplibre GL JS](https://maplibre.org/): An open-source TypeScript library for publishing maps.

## Getting Started

To get started with the Earth, follow these steps:

### Installation

1. Clone the repository: `git clone https://github.com/rajtoshranjan/earth.git`
2. Navigate to the project directory: `cd earth`
3. Install dependencies: `npm i` or `npm ci`

### Usage

1. Create a `.env.development` file in the `env-files` directory, using the `env-files/.env.sample` file as a reference for all required environment variables.
2. Start the development server: `npm run dev`
3. Open your web browser and go to `http://localhost:5173`
