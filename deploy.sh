#!/bin/bash
set -e

echo "🔨 Frontend build..."
cd frontend
npm run build

echo "📦 Vercel output tayyorlanmoqda..."
rm -rf .vercel/output
mkdir -p .vercel/output/static
cp -r dist/* .vercel/output/static/
cat > .vercel/output/config.json << 'JSON'
{
  "version": 3,
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
JSON

echo "🚀 Frontend deploy (Vercel)..."
npx vercel deploy --prebuilt --prod --yes

cd ..
echo "✅ Deploy tugadi!"
echo "🌐 https://bookstore-frontend-ten-sage.vercel.app"
