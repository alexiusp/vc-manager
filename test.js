var querystring = require('qs');
var test = querystring.stringify({ foo: 'bar', baz: {a:'qux', b:'quux'}, corge: '' });
console.log(test);
