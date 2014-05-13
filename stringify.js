/**
 * Convert anythign to formatted string
 * @param {*} obj
 * @param {Number} [indent=2]
 * @returns {String}
 */

// Base
function stringify(obj, indent) {
    indent = indent || 2;
    var buf = [],
        spaces = Array(indent + 1).join(' ');
    if(typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        buf.push(spaces, String(obj));
    } else if(Array.isArray(obj)) {
        buf.push(spaces, '[');
        obj.forEach(function(obj) {
            buf.push('\n', stringify(obj, indent + 2));
        })
        buf.push('\n', spaces, ']');
    } else {
        buf.push(spaces, '{');
        for(var k in obj) {
            if(!obj.hasOwnProperty(k)) continue;
            buf.push('\n', spaces, k, '\n');
            buf.push(stringify(obj[k], indent + 2));
        }
        buf.push('\n', spaces, '}');
    }
    return buf.join('');
}

// Test
function mystringify(obj, indent) {
    indent = indent || '  ';
    var i,
        buf = [],
        spaces = indent; // avoid indent string computation - speedup over 10x
    if(typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return spaces + String(obj);
    } else if(Array.isArray(obj)) {
        // ditch forEach and loop over array - medium speedup
        // don't see why forEach would be slower though
        for (i = 0; i < obj.length; i++) {
            buf[i] = mystringify(obj[i], indent + '  ');
        }
        return spaces + '[\n' + buf.join('\n') + '\n' + spaces + ']';
    } else {
        buf.push(spaces, '{');
        for(var k in obj) {
            if(!obj.hasOwnProperty(k)) continue;
            buf.push('\n', spaces, k, '\n');
            buf.push(mystringify(obj[k], indent + '  '));
        }
        buf.push('\n', spaces, '}');
    }
}

// ******************* utils ***************************** //

// printer
var out;
if (typeof console !== 'undefined') {
    out = console.log;
} else if (typeof print !== 'undefined') {
    out = print;
}

// dependencies
if (typeof load !== 'undefined') {
    load("node_modules/lodash/lodash.js");
    load("node_modules/benchmark/benchmark.js");
} else if (typeof require !== 'undefined') {
    var __ = require("lodash");
    var Benchmark = require("benchmark");
}

// Returns a random integer between min and max
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ******************* tests ***************************** //

var suite,
    suites = [],
    MIN_ARRAY_LENGTH = 100,
    MAX_ARRAY_LENGTH = 1000,
    MIN_DEPTH = 20,
    MAX_DEPTH = 50,
    NOF_INPUTS = 100,
    fakeInput;

// **Test**
// big flat arrays of int

function makeFakeFlatArray() {
    var a = [];
    var l = randomBetween(MIN_ARRAY_LENGTH, MAX_ARRAY_LENGTH);
    var start = randomBetween(MIN_ARRAY_LENGTH, MAX_ARRAY_LENGTH);

    for (var i = 0; i < l; i++) {
        a.push(start + i);
    }
    return a;
}

for (var i = 0, fakeInput = []; i < NOF_INPUTS; i++) {
    fakeInput.push(makeFakeFlatArray());
}

suite = new Benchmark.Suite('Flat array of int');
suite
    .add('Base', function () { stringify(fakeInput); })
    .add('Test', function () { mystringify(fakeInput); })
    .add('JSON', function () { JSON.stringify(fakeInput); })
    .on('cycle', function (event) { out('-> ' + String(event.target)); })
    .on('start', function(event) { out(String(event.currentTarget.name));});
suites.push(suite);

// **Run each suite**
suites.forEach(function (suite) { suite.run({ 'async': true }); });
