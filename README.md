# Search Algorithms Visualization

An interactive web application that visualizes various search algorithms including hill climbing, simulated annealing, and constraint satisfaction problems.

## Features

- **Hill Climbing Algorithm**: Visualize the hill climbing search process
- **Simulated Annealing**: Interactive demonstration of simulated annealing optimization
- **Constraint Satisfaction Problems (CSP)**: Visualize CSP solving algorithms
- **Blocks World**: Interactive blocks world problem visualization
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/faiz/search_algorithms_vis.git
cd search_algorithms_vis
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Deployment to GitHub Pages

This project is configured for GitHub Pages deployment. To deploy:

1. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://shaiky25.github.io/search_algorithms_vis"
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select the `gh-pages` branch
   - Save the settings

The app will be available at your GitHub Pages URL.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run deploy` - Deploys the app to GitHub Pages

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- Create React App

## License

This project is open source and available under the [MIT License](LICENSE).
