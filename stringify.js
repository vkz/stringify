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
