# pino-fluentd

[![Build Status](https://travis-ci.com/davidedantonio/pino-fluentd.svg?branch=master)](https://travis-ci.com/davidedantonio/pino-fluentd) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) ![npm-version](https://img.shields.io/npm/v/pino-fluentd.svg)

Send [pino](https://github.com/pinojs/pino) logs to [Fluentd](https://www.fluentd.org/). This plugin is fully inspired to [pino-elasticsearch](https://github.com/pinojs/pino-elasticsearch)

Under the hood the official [fluent-logger-node](https://github.com/fluent/fluent-logger-node) module is used.

## What is Fluentd?

[Fluentd](https://www.fluentd.org/) is an open source data collector for unified logging layer. Fluentd allows you to unify data collection and consumption for a better use and understanding of data.

## Install

If you want to use `pino-fluentd` you must first install globally on your machine

```
npm install pino-fluentd -g
```

## Usage

```
  pino-fluentd

  To send pino logs to fluentd:

  cat log | pino-fluentd --tag debug --trace-level info

  Flags
  -h   | --help                  Display Help
  -v   | --version               Display Version
  -H   | --host                  the IP address of elasticsearch; default: 127.0.0.1
  -p   | --port                  the port of fluentd; default: 24224
  -t   | --tag                   the name of the tag to use; default: pino
  -k   | --key                   the name of the type to use; default: log
  -T   | --timeout               set the socket to timetout after timeout milliseconds of inactivity
  -ri  | --reconnect-interval    The reconnect interval in milliseconds
  -fi  | --flush-interval        The flush interval in milliseconds
  -l   | --trace-level           trace level for the fluentd client, default 'error' (trace, debug, info, warn, error, fatal)
```

You can then use [Elasticsearch](https://www.elastic.co/products/elasticsearch) and [Kibana](https://www.elastic.co/products/kibana) to browse and visualize your logs, or whatever you want. A full list of Data Output is [here](https://www.fluentd.org/dataoutputs).

## Setup and testing

Setting up `pino-fluentd` is easy and you can use the bundled `docker-compose-*.yml` file to bring up a Fluentd with or without Elasictsearch and Kibana containers.

You will need [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/), then in this project folder, launch `docker-compose up -f docker-compose-*.yml`.

You can test it by launching node example | pino-fluentd, in this project folder. You will need to have pino-fluentd installed globally.

## License

Licensed under [MIT](./LICENSE)