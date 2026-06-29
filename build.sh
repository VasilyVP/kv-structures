echo "Building package for redis...";
cd ./packages/redis
npm run build

echo "Building the whole package...";
cd ../../
npx pkgroll --target=es2024 --target=node22 --clean-dist --minify

echo "Building done";
