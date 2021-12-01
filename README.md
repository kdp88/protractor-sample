# protractor-sample


## Installation-pre Reqs

install node: https://nodejs.org/en/download/

clone repo

Create a .env file in your app's root directory and
add the environment variables each on new line:

```shell
username=abc@abc.com
password=efg123
```

## Installation
inside root

```shell
npm install
```

## Usage - Run the spec from root

run the e2e spec:

```shell
npm run e2e
```
or

```shell
protractor protractor.conf.js
```
or

```shell
npm run e2e -- --config ./protractor.conf.js --suite YOUR_SUITE_NAME
```
