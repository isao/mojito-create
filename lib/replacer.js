/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint strict:false eqnull:true */

var through = require('through');

// do key/value replacement in a through-stream
function replacer(kvs, rgx, eol) {
    var sofar = '';
    rgx = rgx || /\{\{(\S+)\}\}/g;
    eol = eol || '\n';

    function replaceCb(match, key) { // http://cl.ly/OPzu
        return kvs.hasOwnProperty(key) ? kvs[key] : match;
    }

    function write(buffer) {
        var pieces = (sofar + buffer).split(eol);
        sofar = pieces.pop(); // save last bit until we get a whole line
        this.queue(pieces.join(eol).replace(rgx, replaceCb));
    }

    function end() {
        if (sofar != null) {
            this.queue(sofar);
        }
        this.sofar(null);
    }

    return through(write, end);
}

module.exports = replacer;