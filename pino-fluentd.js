#! /usr/bin/env node
'use strict'

const fs = require('fs')
const minimist = require('minimist')
const pump = require('pump')
const path = require('path')


function start (opts) {
  if (opts.help) {
    console.log(fs.readFileSync(path.join(__dirname, './usage.txt'), 'utf8'))
    return
  }

  if (opts.version) {
    console.log('pino-fluentd', require('./package.json').version)
    return
  }
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
      'flush-interval': 'fi'
    },
    default: {
      host: 'localhost',
      port: 24224
    }
  }))
}