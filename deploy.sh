#!/bin/bash
set -e

DOMAIN="andrew-napier.com"

echo "=== CLEANING BUILD FOLDER ==="
rm -rf build
mkdir build

echo "=== BUILDING PROJECT ==="
npm run build

echo "=== ENSURING CNAME EXISTS ==="
echo "$DOMAIN" > build/CNAME

echo "=== PUSHING TO gh-pages ==="



# Create a temporary clean clone of gh-pages INSIDE memory
git worktree prune
rm -rf .gh-pages-temp
git worktree add .gh-pages-temp gh-pages

# Delete everything in gh-pages except .git, CNAME, and .gitignore
find .gh-pages-temp -mindepth 1 -not -name ".git" -not -name "CNAME" -not -name ".gitignore" -exec rm -rf {} +


# Copy build into the gh-pages directory
cp -r build/* .gh-pages-temp/

cd .gh-pages-temp
git add -A
git commit -m "Deploy $(date)" || echo "No changes to commit."
git push

cd ..

echo "=== CLEANING BUILD FOLDER AGAIN ==="
rm -rf build
rm -rf .gh-pages-temp

echo "=== DONE ==="
