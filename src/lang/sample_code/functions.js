function foo() {}
let bar = function() {};
let baz = () => {};

console.log('foo.name: ', foo.name); // foo
console.log('bar.name: ', bar.name); // bar
console.log('baz.name: ', baz.name); //baz
console.log('(() => {}).name: ',(() => {}).name); // (empty string)
console.log('(new Function()).name: ', (new Function()).name); // anonymous

console.log('foo.bind(null).name: ', foo.bind(null).name); // bound foo

let dog = {
    years: 1,
    get age() {
        return this.years;
    },
    set age(newAge) {
        this.years = newAge;
    }
}

let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age');
console.log('propertyDescriptor.get.name: ', propertyDescriptor.get.name);  // get age
console.log('propertyDescriptor.set.name: ', propertyDescriptor.set.name);  // set age
