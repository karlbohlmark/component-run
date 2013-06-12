#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var Module = require('module')
var args = process.argv.slice(1)

var entry = args.pop()

if (!entry || entry === '.') {
  entry = 'index.js'
}

entry = path.resolve(entry)

var dir = path.dirname(entry)
var jsons = {}

function getJson (dir) {
  if (jsons[dir]) return jsons[dir]
  var p = path.resolve(dir, 'component.json')
  var json = JSON.parse(fs.readFileSync(p))
  jsons[dir] = json
  return json
}

function resolveDependency (request, parent) {
  var dir = path.dirname(parent.filename)

  var parentDir = path.join(dir, '..')
  var parentDirName = parentDir.split('/').pop()

  var componentsDir
  if (parentDirName != 'components') {
    componentsDir = path.join(dir, 'components')
  } else {
    componentsDir = parentDir
  }

  var componentDir = path.join(componentsDir, request.replace('/', '-'))

  var json = getJson(componentDir)
  var main = path.resolve(componentDir, json.main || 'index.js')

  return main
}

function resolveLocal (request, parent) {
  console.log('resolve local', request, parent)
}

function componentResolve (request, parent) {
  if (isRelative(request)) return false
  var dir = path.dirname(parent.filename);
  var json = getJson(path.dirname(parent.filename))

  var local = (json.local || []).indexOf(request)
  if (local!==-1) {
    return resolveLocal(request, parent)
  }

  var dependency = Object.keys(json.dependencies).filter(function (d) {
    return d.split('/')[1] == request
  }).pop()
  if (dependency) {
    return resolveDependency(dependency, parent)
  }

  return false;
}

function isRelative (p) {
  return p[0] == '.'
}

var _resolveFilename = Module._resolveFilename

Module._resolveFilename = function(request, parent) {
  return componentResolve(request, parent) || _resolveFilename(request, parent)
}

var module = new Module(entry, null);

module.load(entry);
