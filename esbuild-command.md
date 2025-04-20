esbuild command

## start
`esbuild src/index.js --bundle --platform=node --outdir=dist/ --loader:.node=copy`

## WRONG (not esm)
`esbuild src/index.js --bundle --platform=node --format=esm --outdir=dist/ --loader:.node=copy --external:stream --external:fs --external:path`

## WRONG (not esm, + all packages built-in to node (fs) automatically marked as external)
`esbuild src/index.js --bundle --platform=node --format=esm --outdir=dist/ --external:"stream" --external:"fs" --external:"path" --loader:.node=copy`


## yes! (but packages (ws/koffi) are external, so this is cheating)

removed (import.meta only works with esm):
```
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
```
remove `--external:`'s:
`esbuild src/index.js --bundle --platform=node --outfile=dist/index.cjs --loader:.node=copy --target=node18.20.8 --packages=external`

## yes!!!

just removed `--packages=external`:
`esbuild src/index.js --bundle --platform=node --outfile=dist/index.cjs --loader:.node=copy --target=node18.20.8`

adding `--minify` takes index.cjs from `2.9mb` down to `2.4mb`.

"E:\Dev\Github\elecord-desktop\node_modules\@electron\windows-sign\vendor\signtool.exe"