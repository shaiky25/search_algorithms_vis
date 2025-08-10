#!/bin/bash

# Deploy script for GitHub Pages
echo "🚀 Deploying to GitHub Pages..."

# Build the project
echo "📦 Building the project..."
npm run build

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "Your app should be available at: https://faiz.github.io/search_algorithms_vis"
echo ""
echo "Note: It may take a few minutes for changes to appear on GitHub Pages."
