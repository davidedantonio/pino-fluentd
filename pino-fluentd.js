#! /usr/bin/env node
'use strict'

const fs = require('fs')
const minimist = require('minimist')
const Parse = require('fast-json-parse')
const path = require('path')
const pump = require('pump')
const split = require('split2')
const Writable = require('readable-stream').Writable
const fluentd = require('fluent-logger')

// pino log levels
const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
}

function pinoFluentd (opts) {
  const splitter = split(function (line) {
    const parsed = new Parse(line)

    const setDateTime = (value) => {
      if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'time')) {
        return (value.time.length) ? new Date(value.time).toISOString() : new Date().toISOString()
      }
      return new Date().toISOString()
    }

    if (parsed.err) {
      this.emit('unknown', line, parsed.err)
      return
    }

    let value = parsed.value
    if (typeof value === 'string') {
      value = {
        data: value,
        time: setDateTime(value)
      }
    } else {
      value.time = setDateTime(value)
    }

    return value
  })

  const key = opts.key || 'log'
  const tag = opts.tag || 'pino'
  const traceLevel = opts['trace-level'] || 'error'

  const client = fluentd.createFluentSender(tag, {
    host: opts.host ? opts.host : undefined,
    port: opts.port ? opts.port : undefined,
    timeout: opts.timeout ? opts.timeout : undefined,
    reconnectInterval: opts['reconnect-interval'] ? opts['reconnect-interval'] : undefined,
    flushInterval: opts['flush-interval'] ? opts['flush-interval'] : undefined
  })

  client.on('error', err => splitter.emit('error', err))
  client.on('connect', () => splitter.emit('connected'))

  const writable = new Writable({
    objectMode: true,
    write: (body, enc, cb) => {
      if (body.level >= levels[traceLevel]) {
        client.emit(key, body, function (err, data) {
          if (!err) {
            splitter.emit('insert', data, body)
          } else {
            splitter.emit('insertError', err)
          }
        })
      }

      cb()
    }
  })

  pump(splitter, writable)

  return splitter
}

const start = opts => {
  if (opts.help) {
    console.log(fs.readFileSync(path.join(__dirname, './usage.txt'), 'utf8'))
    return
  }

  if (opts.version) {
    console.log('pino-fluentd', require('./package.json').version)
    return
  }

  pump(process.stdin, pinoFluentd(opts))
}

if (require.main === module) {
  start(minimist(process.argv.slice(2), {
    alias: {
      help: 'h',
      version: 'v',
      host: 'H',
      port: 'p',
      tag: 't',
      key: 'k',
      timeout: 'T',
      'reconnect-interval': 'ri',
      'flush-interval': 'fi',
      'trace-level': 'l'
    },
    default: {
      host: 'localhost',
      port: 24224
    }
  }))
}

module.exports = pinoFluentd
