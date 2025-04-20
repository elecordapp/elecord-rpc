#!/bin/bash

# echo "remove dist"
# rm -rf dist

# echo "bundle code"
# esbuild src/index.js --bundle --format=cjs --platform=node --outdir=dist --out-extension:.js=.cjs --loader:.node=copy --target=node20.18.1 || exit 1

# echo "create blob"
# node --experimental-sea-config sea-config.json || exit 1

# cd dist || exit 1

# echo "copy node.js"
# node -e "require('fs').copyFileSync(process.execPath, 'elecord-rpc.exe')" || exit 1

# echo "remove signature"
# signtool remove //s elecord-rpc.exe || exit 1

# echo "inject blob"
# npx postject elecord-rpc.exe NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 || exit 1



# echo "cleanup blob"
# rm -f sea-prep.blob
