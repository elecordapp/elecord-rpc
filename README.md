# elecord-rpc

<img src="https://github.com/elecordapp/elecord-rpc/raw/main/media/console-example.png">

#### RPC server for elecord-web

> [!NOTE]
> elecord-rpc is a modified fork of [arrpc](https://github.com/OpenAsar/arrpc), which we use as a rich presence server for [elecord-web](https://github.com/elecordapp/elecord-web).
> 
> (For more detailed documentation, see [arrpc](https://github.com/OpenAsar/arrpc))

<img src="https://github.com/elecordapp/elecord-rpc/raw/main/media/erpc-diagram.png">

<br>

> Includes multiple unmerged PR's from arRPC.

#### Performance improvements:
* 109 - Listing Win32 processes (280ms reduced to 15ms)
* 123 - Scanning for games (95ms reduced to 2ms)

#### Better Electron compatibility:
* 111 - Loading detectable.json using CommonJS

## Local setup

> [!IMPORTANT]
> You will need to install [Bun](https://bun.sh/) to run this project.

```bash
# install dependencies
bun install

# update detectable apps
bun run update

# start the server
bun src

# compile erpc executable
bun run compile

# compile win32 installer
bun run win32
```

<br>

## Copyright & License

The [elecord-rpc](https://github.com/elecordapp/elecord-rpc) app is © [hazzuk](https://github.com/hazzuk) and is licensed [AGPL-3.0-only](https://github.com/elecordapp/elecord-rpc/blob/main/LICENSE-AGPL-3.0).

The [elecord logo](https://github.com/elecordapp/elecord-rpc/blob/main/media/erpc_256.png) and its derivatives are © [hazzuk](https://github.com/hazzuk) used under the terms of the elecord [logo license](https://github.com/elecordapp/elecord-rpc/blob/main/LOGO_LICENSE.txt).

The original [arrpc](https://github.com/OpenAsar/arrpc) project source code is © [OpenAsar](https://github.com/OpenAsar) and other contributors.
Used under the terms of the original [MIT](https://github.com/elecordapp/elecord-rpc/blob/main/LICENSE-MIT) license.

Console controller icon by [Skoll](https://game-icons.net/) under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
