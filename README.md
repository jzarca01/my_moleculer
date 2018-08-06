[![Moleculer](https://img.shields.io/badge/Powered%20by-Moleculer-green.svg?colorB=0e83cd)](https://moleculer.services)

# moleculer-demo

## Build Setup

``` bash
# Install dependencies
npm install

# Start developing with REPL
npm run dev

# Start production
npm start

# Run unit tests
npm test

# Run continuous test mode
npm run ci

# Run ESLint
npm run lint
```

## Run in Docker

```bash
$ docker-compose up -d --build
```

## Raspberry Pi setup

```
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
git clone https://github.com/jzarca01/LILO ~/LILO && cd ~/LILO && npm install

sudo apt-get install git-core libnss-mdns libavahi-compat-libdnssd-dev
``` 

After "npm install" on the project

Modify the following file "node_modules/mdns/lib/browser.js"
```
nano node_modules/mdns/lib/browser.js
```
Find this line:
```javascript
Browser.defaultResolverSequence = [
  rst.DNSServiceResolve(), 'DNSServiceGetAddrInfo' in dns_sd ? rst.DNSServiceGetAddrInfo() : rst.getaddrinfo()
, rst.makeAddressesUnique()
];
```
And change to:
```javascript
Browser.defaultResolverSequence = [
  rst.DNSServiceResolve(), 'DNSServiceGetAddrInfo' in dns_sd ? rst.DNSServiceGetAddrInfo() : rst.getaddrinfo({families:[4]})
, rst.makeAddressesUnique()
];
```
