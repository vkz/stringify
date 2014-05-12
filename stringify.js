/**
 * Convert anythign to formatted string
 * @param {*} obj
 * @param {Number} [indent=2]
 * @returns {String}
 */

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

function mystringify(obj, indent) {
    indent = indent || 2;
    var buf = [],
        spaces = Array(indent + 1).join(' ');
    if(typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        buf.push(spaces, String(obj));
    } else if(Array.isArray(obj)) {
        buf.push(spaces, '[');
        obj.forEach(function strArrayElement(obj) {
            buf.push('\n', mystringify(obj, indent + 2));
        })
        buf.push('\n', spaces, ']');
    } else {
        buf.push(spaces, '{');
        for(var k in obj) {
            if(!obj.hasOwnProperty(k)) continue;
            buf.push('\n', spaces, k, '\n');
            buf.push(mystringify(obj[k], indent + 2));
        }
        buf.push('\n', spaces, '}');
    }
    return buf.join('');
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

// **Test**
// big flat arrays of int

var MIN_ARRAY_LENGTH = 100,
    MAX_ARRAY_LENGTH = 1000,
    NOF_INPUTS        = 100;

function makeFakeArray() {
    var a = [];
    var l = randomBetween(MIN_ARRAY_LENGTH, MAX_ARRAY_LENGTH);
    var start = randomBetween(MIN_ARRAY_LENGTH, MAX_ARRAY_LENGTH);

    for (var i = 0; i < l; i++) {
        a.push(start + i);
    }
    return a;
}

var fakeInput = [];
var total_fakeNumbers = 0;
for (var i = 0; i < NOF_INPUTS; i++) {
    fakeInput.push(makeFakeArray());
    total_fakeNumbers += (fakeInput[i]).length;
}

var suite = new Benchmark.Suite;
suite
    .add('Base: flat array of int', function () { stringify(fakeInput); })
    .add('Test: flat array of int', function () { mystringify(fakeInput); })
    .add('JSON: flat array of int', function () { JSON.stringify(fakeInput); })
    .on('cycle', function (event) { out(String(event.target)); });
suite.run({ 'async': true });
