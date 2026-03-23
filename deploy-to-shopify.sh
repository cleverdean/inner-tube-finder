#!/bin/bash
set -e

THEME_ASSETS="../your-shopify-theme/assets"

echo "Building..."
npm run build

echo "Copying assets to theme..."
cp dist/inner-tube-finder.js "$THEME_ASSETS/inner-tube-finder.js"
cp dist/inner-tube-finder.css "$THEME_ASSETS/inner-tube-finder.css"

echo "Done. Upload the liquid template manually if it's your first deploy."
