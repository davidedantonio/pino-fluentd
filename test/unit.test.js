'use strict'

const pino = require('pino')
const proxyquire = require('proxyquire')
const test = require('tap').test
const fix = require('./fixtures')
const fluentd = require('fluent-logger')

const matchISOString = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
const options = {
  tag: 'debug',
  host: 'localhost',
  port: 24224
}

test('make sure date format is valid', (t) => {
  t.plan(2)
  t.type(fix.datetime.object, 'string')
  t.equal(fix.datetime.object, fix.datetime.string)
  t.end()
})

test('make sure log is a valid json', (t) => {
  const FluentSender = function (tagPrefix, config) {
    t.plan(6)
    t.equal(tagPrefix, `${options.tag}`)
    t.equal(config.host, `${options.host}`)

    let client = fluentd.createFluentSender(tagPrefix, {
      host: config.host ? config.host : undefined,
      port: config.port ? config.port : undefined,
      timeout: config.timeout ? config.timeout : undefined,
      reconnectInterval: config['reconnect-interval'] ? config['reconnect-interval'] : undefined,
      flushInterval: config['flush-interval'] ? config['flush-interval'] : undefined
    })

    client = Object.assign(client, {
      emit: (key, data, cb) => {
        t.type(key, 'string')
        t.ok(data, true)
        t.type(data.time, 'string')
        t.match(data.time, matchISOString)
        cb(null, {})
        t.end()
      }
    })

    return client
  }

  const fluent = proxyquire('../', {
    'fluent-logger': {
      createFluentSender: FluentSender
    }
  })

  const instance = fluent(options)
  const log = pino(instance)
  const prettyLog = `some logs goes here.
  another log...`
  log.error(['info'], prettyLog)
})
