node sea guide
https://nodejs.org/docs/latest/api/single-executable-applications.html

# requires
- sea-config.json 


# build the single embedded script using the CommonJS module system
esbuild src/index.js --bundle --format=cjs --platform=node --outdir=dist --out-extension:.js=.cjs --loader:.node=copy --target=node20.18.1


esbuild src/index.js --bundle --platform=node --outfile=dist/index.cjs --loader:.node=copy --target=node20.18.1 --minify

# generate the blob to be injected
node --experimental-sea-config sea-config.json


# create node executable copy 

(linux)
cp $(command -v node) elecord-rpc

(windows)
node -e "require('fs').copyFileSync(process.execPath, 'elecord-rpc.exe')"


# remove signature (windows only)
signtool remove /s elecord-rpc.exe


# inject the blob into the copied binary

(linux)
npx postject elecord-rpc NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

(windows)
npx postject elecord-rpc.exe NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

    "assets": {
        "koffi-I3C27AOH.node": "dist/koffi-I3C27AOH.node",
        "koffi-CJH4TBLP.node": "dist/koffi-CJH4TBLP.node",
        "koffi-RAM2TGAJ.node": "dist/koffi-RAM2TGAJ.node",
        "koffi-UDQTDTSV.node": "dist/koffi-UDQTDTSV.node",
        "koffi-Q3EJJQSV.node": "dist/koffi-Q3EJJQSV.node",
        "koffi-VODFGWKL.node": "dist/koffi-VODFGWKL.node",
        "koffi-NVQNHRSX.node": "dist/koffi-NVQNHRSX.node",
        "koffi-MZRCD5X5.node": "dist/koffi-MZRCD5X5.node",
        "koffi-4A7I5EKM.node": "dist/koffi-4A7I5EKM.node",
        "koffi-5UZIJ4AV.node": "dist/koffi-5UZIJ4AV.node"
    }