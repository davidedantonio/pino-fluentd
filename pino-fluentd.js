#! /usr/bin/env node
'use strict'

const fluentd = require('fluent-logger')
const fs = require('fs')
const minimist = require('minimist')
const Parse = require('fast-json-parse')
const path = require('path')
const pump = require('pump')
const split = require('split2')
const Writable = require('readable-stream').Writable

function pinoFluentd(opts) {
  const splitter = split(function(line) {
    const parsed = new Parse(line)

    const setDateTime = (value) => {
      if (typeof value === 'object' && value.hasOwnProperty('time')) {
        return (value.time.length) ? new Date(value.time).toISOString() : new Date().toISOString()
      }
      return new Date().toISOString()
    }

    if (parsed.err) {
      this.emit('unknown', line, parsed)
      return
    }

    let value = parsed.value
    if (typeof value === 'string') {
      value = {
        data: value,
        time: setDateTime(value)
      }
    } else {
      Reflect.defineProperty(value, 'time', {
        value: setDateTime(value)
      })
    }
    return value
  })

  const type = opts.type || 'log'
  const tag = opts.tag || 'pino'

  const client = fluentd.createFluentSender(tag, {
    host: opts.host ? opts.host : undefined,
    port: opts.port ? opts.port : undefined,
    timeout: opts.timeout ? opts.timeout : undefined,
    reconnectInterval: opts['reconnect-interval'] ? opts['reconnect-interval'] : undefined,
    flushInterval: opts['flush-interval'] ? opts['flush-interval'] : undefined
  })

  client.on('error', err => splitter.emit('error', err))
  client.on('connect', _ => console.log('connected'))

  const writable = new Writable({
    objectMode: true,
    write: (body, enc, cb) => {
      client.emit(type, body)
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
      version: 'v',
      help: 'h',
      host: 'H',
      port: 'p',
      tag: 't',
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