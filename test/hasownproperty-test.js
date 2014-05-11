// JavaScript does not protect the property name hasOwnProperty.
// If there's possibility that object has a property with this name
// it's necessary to use external hasOwnProperty, for example like so:
// Object.prototype.hasOwnProperty.call(foo, 'bar');
//
// http://bonsaiden.github.io/JavaScript-Garden/#object.hasownproperty

var foo = {
    hasOwnProperty: function() {
        return false;
    },
    bar: 'Here be dragons'
};

foo.hasOwnProperty('bar'); // always returns false

// Use another Object's hasOwnProperty and call it with 'this' set to foo
({}).hasOwnProperty.call(foo, 'bar'); // true

// It's also possible to use hasOwnProperty from the Object
// prototype for this purpose
Object.prototype.hasOwnProperty.call(foo, 'bar'); // true
