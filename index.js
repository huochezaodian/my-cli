#!/usr/bin/env node

console.log('my-cli running...');

var path = require('path');

console.log("argv:", process.argv);
var arguments = process.argv.splice(2);
console.log("arguments:", arguments);
