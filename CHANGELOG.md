# Changelog

All notable changes to elecord-rpc will be documented in this file.

## 1.0.0 - 2025-05-01

### 🚀 Features

- *(bridge)* Handle websocket getAppVersion
- *(process)* Tidy up perf logging
- *(process)* Add memory logging
- *(win32.js)* Prevent infinite loops
- Add bun compile command
- Import separate logging function


### 🐛 Bug Fixes

- *(process)* Remove json import require
- Fix null imagename


### 🔧 Refactor

- *(win32.js)* Code style and variables


### 📖 Documentation

- *(readme)* List included pull requests
- *(readme)* Update local setup
- Remove arrpc changelog
- New readme for elecord-rpc
- Change project license
- Add readme example images
- Fix readme license link


### ⚙️ Miscellaneous

- *(gitignore)* Add exe files
- *(win32.js)* Add more comments
- Update package.json for elecord-rpc
- Create npm command for update_db.js
- Update logging for elecord-rpc
- Update detectable.json
- Update logging again
- Update detectable.json
- Switch to bun package lock
- Make non-prod packages dev dependencies
- Create nssm helper script
- Remove ws dependency
- Create git-cliff config


### 🏗️ Build

- *(inno)* Set additional nssm parameters
- *(inno)* Delete log file during uninstall
- *(inno)* Use package.json app version
- Add innosetup for win32 installer


### 🗃️ Pull Requests

- Merge pull request #1 from elecordapp/setup
- Merge branch 'OpenAsar:main' into win32_games_detector
- Merge pull request #3 from elecordapp/win32_games_detector
- Merge pull request #4 from elecordapp/json-loader-patch
- Merge pull request #5 from elecordapp/perf-process-scan-cache
- Merge pull request #10 from elecordapp/desktop
- Merge pull request #11 from elecordapp/license
- Merge pull request #12 from elecordapp/example-images
- Merge pull request #13 from elecordapp/win32-setup
- Merge pull request #14 from elecordapp/inno-fixes
- Merge pull request #15 from elecordapp/import-logging
- Merge pull request #16 from elecordapp/remove-log
- Merge pull request #17 from elecordapp/dynamic-inno-version
- Merge pull request #18 from elecordapp/websocket-package
- Merge pull request #19 from elecordapp/changelog


### Other (unconventional)

- Initial commit for windows game detector
- Update win32.js
- Use Node's CommonJS JSON loader
- Cache the DetectableDB scan results
- Store only detected in cache instead of boxing it
- Implement garbage collection for the cache


<!-- generated by git-cliff -->
