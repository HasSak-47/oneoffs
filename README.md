# One-Offs

A collection of small, independent projects and utilities built to demonstrate various web development skills and explore different concepts.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Projects](#projects)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About

This repository serves as a showcase for a variety of web development projects, each built to highlight specific skills, technologies, or ideas. From practical tools to experimental applications, "One-Offs" is a living portfolio of mini-creations.

## Features

- **Modular Design**: Each project is an independent module, allowing for easy integration and removal.
- **Responsive Layouts**: Most projects are designed to be responsive and work across different screen sizes.
- **Modern React**: Built with React, leveraging hooks and functional components.
- **Utility-First CSS**: Styling is primarily handled with Tailwind CSS.
- **TypeScript**: Enhanced type safety and developer experience.

## Projects

Here's a list of the projects included in this collection:

### 1. Notes

A simple, in-browser note-taking application. Features include:

- File and folder organization.
- Persistent storage using browser cookies.
- Basic text editing.

### 2. Pallet Generator

A color palette generator utilizing the Oklch color space for perceptual uniformity. Key features:

- Interactive sliders to define start and end colors.
- Generates a gradient of colors in Oklch.
- Copy generated hex codes to clipboard.

### 3. Blog

A minimalist blog platform. Features include:

- Dynamic routing for blog posts.
- Markdown rendering for post content.
- Simple navigation to browse posts.

### 4. Crypto

A basic cryptographic tool demonstrating classic ciphers. Includes:

- Caesar Cipher encryption and decryption.
- Vigenere Cipher encryption and decryption.
- Input validation to ensure alphabetic characters for keys and data.

## Installation

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/one-offs.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd one-offs
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

## Usage

To run the project in development mode:

```bash
npm run dev
# or
yarn dev
```

This will start the development server, and you can view the application in your browser, usually at `http://localhost:5173/oneoffs`.

To build the project for production:

```bash
npm run build
# or
yarn build
```

This will create a `dist` folder with the optimized production build.

## Contributing

This project is primarily a personal showcase. However, if you find issues or have suggestions, feel free to open an issue or pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.
