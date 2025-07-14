# PowerPulse Deployment Guide

## GitHub Pages Deployment

Your React application is now configured for deployment on GitHub Pages. Here are the deployment options:

### Option 1: Automatic Deployment (Recommended)

The GitHub Actions workflow is already set up. Every time you push to the `main` or `master` branch, your app will automatically build and deploy.

**Steps:**
1. Push your code to GitHub
2. Go to your repository settings
3. Navigate to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch and "/ (root)" folder
6. Click "Save"

Your app will be available at: `https://useryinku.github.io/PowerPulse`

### Option 2: Manual Deployment

If you prefer manual deployment or want to deploy immediately:

1. Install gh-pages package:
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. Deploy manually:
   ```bash
   cd client
   npm run deploy
   ```

## Important Files for Deployment

- **`client/public/index.html`** - Your main HTML template file
- **`.github/workflows/deploy.yml`** - GitHub Actions workflow for automatic deployment
- **`client/package.json`** - Contains homepage URL and deployment scripts

## Build Process

The deployment process:
1. Installs dependencies (`npm ci`)
2. Builds the React app (`npm run build`)
3. Creates optimized production files in `client/build/`
4. Deploys the `build` folder contents to GitHub Pages

## Troubleshooting

- Ensure your repository is public or you have GitHub Pro for private repo Pages
- Check that GitHub Pages is enabled in repository settings
- Verify the homepage URL in `package.json` matches your GitHub Pages URL
- Check GitHub Actions tab for build/deployment logs

## Local Testing

To test the production build locally:
```bash
cd client
npm run build
npx serve -s build
```

This serves the built app locally to verify it works before deployment.
