function foo() {}
let bar = function() {};
let baz = () => {};

console.log('foo.name: ', foo.name); // foo
console.log('bar.name: ', bar.name); // bar
console.log('baz.name: ', baz.name); //baz
console.log('(() => {}).name: ',(() => {}).name); // (empty string)
console.log('(new Function()).name: ', (new Function()).name); // anonymous