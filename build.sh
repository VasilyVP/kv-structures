echo "Building package for redis...";
cd ./packages/redis
npm run build

echo "Building the whole package...";
cd ../../
npx pkgroll --target=es2022 --target=node20.11.0 --clean-dist

echo "Building done";
