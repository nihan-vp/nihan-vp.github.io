# deploy.ps1

param (
    [string]$customDomain = "nihan-vp.me"
)

Write-Host "Starting deployment..."

# 1️⃣ Install dependencies (if missing)
Write-Host "Installing dependencies..."
npm install

# 2️⃣ Build the project
Write-Host "Building project..."
npm run build

# 3️⃣ Switch to gh-pages branch (or create it)
if (git show-ref --quiet refs/heads/gh-pages) {
    Write-Host "Switching to existing gh-pages branch..."
    git checkout gh-pages
} else {
    Write-Host "Creating new gh-pages branch..."
    git checkout --orphan gh-pages
}

# 4️⃣ Remove old files
Write-Host "Cleaning old files..."
git rm -rf * --quiet

# 5️⃣ Copy dist contents
Write-Host "Copying dist folder..."
Copy-Item -Path .\dist\* -Destination . -Recurse -Force

# 6️⃣ Add CNAME file
Write-Host "Adding CNAME file..."
Set-Content -Path "CNAME" -Value $customDomain

# 7️⃣ Commit and push
Write-Host "Committing and pushing..."
git add .
git commit -m "Deploy React Vite site"
git push origin gh-pages --force

# 8️⃣ Switch back to main
Write-Host "Switching back to main branch..."
git checkout main

Write-Host "Deployment complete! Visit https://$customDomain"
