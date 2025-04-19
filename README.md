# elecord-rpc

#### RPC server for elecord-web

> [!NOTE]
> elecord-rpc is a modified fork of [arrpc](https://github.com/OpenAsar/arrpc), which we use as a rich presence server for [elecord-web](https://github.com/elecordapp/elecord-web).
> 
> (For more detailed documentation, see [arrpc](https://github.com/OpenAsar/arrpc))

Includes multiple unmerged PR's from arRPC.

#### Performance improvements:
* 109 - Listing Win32 processes (280ms reduced to 15ms)
* 123 - Scanning for games (95ms reduced to 2ms)

#### Better Electron compatibility:
* 111 - Loading detectable.json using CommonJS

## Local setup

```bash
# install dependencies
npm install

# update detectable apps
npm run update

# start the server
npx elecord-rpc
```
