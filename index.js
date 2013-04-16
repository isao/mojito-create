/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var path = require('path'),
    log = require('./lib/log'),
    util = require('./lib/utils'),
    create = require('./lib/create'),

    // todo: enable user configuration
    SRCPATHS = ['.', path.resolve(__dirname, 'archetypes')];


function error(msg, exit_code) {
    var err = new Error(msg);
    err.code = exit_code || 1;
    return err;
}

function errorWithUsage(msg, exit_code) {
    var err = error(msg, exit_code);
    err.usage = module.exports.usage;
    return err;
}

function pathify(subpath) {
    return util.findInPaths(SRCPATHS, subpath);
}

function subTypePath(type, args) {
    return path.join(type, args.length > 1 ? args.shift() : 'default')
}

function exec(source, opts, cb) {

}

function main(args, opts, meta, cb) {
    var type = (args.shift() || '').toLowerCase(),
        source,
        errmsg;

    if (!type) {
        cb(errorWithUsage('Missing parameters. Please specify a type & name.'));
        return source;
    }

    if (!args.length) {
        cb(errorWithUsage('Missing parameter(s).', 3));
        return source;
    }

    switch (type) {
    case 'app':
    case 'mojit':
        // 1. mojito create [options] <app|mojit> [full|simple|default] <name>
        source = pathify(subTypePath(type, args));
        errmsg = 'Invalid subtype.';
        break;

    case 'custom':
        // 2. mojito create [options] custom <path/to/archetype> <name>
        source = pathify(args.shift());
        errmsg = 'Custom archtype path is invalid.';
        break;

    default:
        // 3. mojito create [options] <path/to/archetype> <name>
        source = pathify(type);
        errmsg = type + ' is not a valid archetype or path.';
    }

    if (!source) {
        cb(errorWithUsage(errmsg, 5));
    } else {
        exec(source, opts, cb);
    }

    return source;
}


module.exports = main;

module.exports.usage = [
    'Usage: mojito create [options] <app|mojit> [full|simple|default] <name>',
    'Usage: mojito create [options] custom <path/to/archetype> <name>',
    'Usage: mojito create [options] <path/to/archetype> <name>',
    '',
    'Example: mojito create app Foo',
    '  (creates directory "Foo" containing a new Mojito application named "Foo")',
    '',
    'Example: mojito create mojit Bar',
    '  (creates directory "Bar" containing new Mojit named "Bar")',
    '',
    'OPTIONS: ',
    '  --port [number]  Specifies default port for your Mojito app to run on.',
    '  -p [number]      Short for --port',
    '  -keyval [string] key value pairs to pass to a custom archetype template',
    '                   a key/value is separated by colons, key/value pairs by',
    '                   commas: "key1:val1,key2:val2',
    '  -k [string]      Short for --keyval'].join('\n');

module.exports.options = [
    {shortName: 'k', hasValue: true,  longName: 'keyval'},
    {shortName: 'p', hasValue: true,  longName: 'port'}
];

