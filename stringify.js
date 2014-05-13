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
        spaces = indent;
    if(typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return spaces + String(obj);
    } else if(Array.isArray(obj)) {
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

var suites = [],
    MIN_ARRAY_LENGTH = 100,
    MAX_ARRAY_LENGTH = 1000,
    MIN_DEPTH = 20,
    MAX_DEPTH = 50,
    NOF_INPUTS = 100;

// printer
var out;

if (typeof console !== 'undefined') {
    out = function() { console.log.apply(console, arguments);};
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

// random integer between min and max
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeSuite(name, fakeInput) {
    var suite = new Benchmark.Suite(name);
    suite
        .add('Base', function () { stringify(fakeInput); })
        .add('Test', function () { mystringify(fakeInput); })
        .add('JSON', function () { JSON.stringify(fakeInput); })
        .on('cycle', function (event) { out('-> ' + String(event.target)); })
        .on('start', function(event) { out(String(event.currentTarget.name));});
    return suite;
}

// Given generator-thunk that returns an array
// produce an array of generated arrays for suite consumption
function generateArrayInput(generator) {
    var i, fakeInput;
    for (i = 0, fakeInput = []; i < NOF_INPUTS; i++) {
        fakeInput.push(generator());
    }
    return fakeInput;
}

// Filter suits and benchmarks by name and run only those
// case insensitive, partial matches work
// passing empty strings will match and run all tests
function runTests(suiteName, benchmarkName) {
    var filteredSuites = [],
        filteredBenchmarks = [],
        reSuite = new RegExp (suiteName, 'i'),
        reBenchmark = new RegExp (benchmarkName, 'i');

    filteredSuites = suites.filter(function (suite) {
        return reSuite.test(suite.name);
    });

    filteredSuites = filteredSuites.map(function (suite) {
        var suiteName = suite.name;
        suite = suite.filter(function (b) {return reBenchmark.test(b.name);})
            .on('cycle', function (event) { out('-> ' + String(event.target)); })
            .on('start', function(event) { out('\n' + suiteName); });
        return suite;
    });
    filteredSuites.forEach(function (suite) { suite.run({ 'async': false }); });
}

// ******************* tests ***************************** //

// ** Suite **
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

suites.push(makeSuite('Flat array of int', generateArrayInput(makeFakeFlatArray)));

// ** Suite **
// deeply nested array of int

function nestArray(depth) {
    var length = randomBetween(1, 5),
        spot = randomBetween(0, length - 1),
        a = [];
    for (var i = 0; i < length; i++) { a[i] = spot + i; }
    return depth === 0 ? a : a[spot] = nestArray(depth - 1), a;
}

function makeFakeNestedArray() {
    var depth = randomBetween(MIN_DEPTH, MAX_DEPTH);
    return nestArray(depth);
}

suites.push(makeSuite('Nested array of int', generateArrayInput(makeFakeNestedArray)));

// ** Run suites **

runTests('','');
