/**
 * Convert anythign to formatted string
 * @param {*} obj
 * @param {Number} [indent=2]
 * @returns {String}
 */

function mystringify(obj, indent) {
    indent = indent || 2;
    var buf = [],
        spaces = Array(indent + 1).join(' ');
    if(typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        buf.push(spaces, String(obj));
    } else if(Array.isArray(obj)) {
        buf.push(spaces, '[');
        obj.forEach(function(obj) {
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

// Returns a random integer between min and max
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var MIN_ARRAY_LENGTH = 100,
    MAX_ARRAY_LENGTH = 1000,
    NOF_INPUTS        = 100,
    NOF_RUNS          = 10;

// [1, 2, 3, ..] int array, but .forEach() maybe too general
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

var start = Date.now();
for (var j = 0; j < NOF_RUNS; j++) {
    mystringify(fakeInput);
}
var end = Date.now();

var timeSpent = end - start;
var totalNumbers = total_fakeNumbers * NOF_RUNS;
var result = [timeSpent + ' ms', Math.floor(totalNumbers/timeSpent) + ' numbers/ms'];

if (typeof console !== 'undefined' && typeof document !== 'undefined') {
    console.log(result[0], ', ', result[1]);
    document.writeln(result[0], ', ', result[1]);
} else if (typeof console !== 'undefined' ) {
    console.log(result[0], ', ', result[1]);
}
