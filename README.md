# pino-fluentd

Send [pino](https://github.com/pinojs/pino) logs to [Fluentd](https://www.fluentd.org/).

## Install

If you want to use `pino-fluentd` you must first install globally on your machine

```
npm install pino-fluentd -g
```

## Usage

```
  pino-fluentd

  To send pino logs to fluentd:

  cat log | pino-fluentd --tag debug --trace-level info

  Flags
  -h   | --help                  Display Help
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

You can then use [Elasticsearch](https://www.elastic.co/products/elasticsearch) and [Kibana](https://www.elastic.co/products/kibana) to browse and visualize your logs, or use a [MongoDB](https://www.mongodb.com), or whatever you want. A full list of Data Output is [here](https://www.fluentd.org/dataoutputs).

