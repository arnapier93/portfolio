#!/bin/bash
set -e

echo "=== CLEANING BUILD FOLDER ==="
rm -rf build
mkdir build

echo "=== BUILDING PROJECT ==="
npm run build

# Create temporary gh-pages worktree
git worktree prune
rm -rf .gh-pages-temp
git worktree add -f .gh-pages-temp gh-pages

# Delete everything except .git, .gitignore, and CNAME
find .gh-pages-temp -mindepth 1 -not -name ".git" -not -name ".gitignore" -not -name "CNAME" -exec rm -rf {} +

# Copy build contents
cp -r build/* .gh-pages-temp/

cd .gh-pages-temp
git add -A
git commit -m "Deploy $(date)" || echo "No changes to commit."
git push
cd ..

rm -rf build
rm -rf .gh-pages-temp

echo "=== DONE ==="
