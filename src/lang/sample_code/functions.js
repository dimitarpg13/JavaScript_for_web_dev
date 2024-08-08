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

// arguments in arrow functions
//
// When a function is defined using the arrow notation, the arguments passed to the function
// cannot be accessed using the `arguments` keyword; they can only be accessed using their named
// token in the function definition.

function foo() {
    console.log('arguments[0]: ', arguments[0]);
}
foo(5); // 5


// let bar = () => {
//   console.log(arguments[0]);   
// };
// bar(5); ReferenceError: arguments is not defined

function foo2() {
    let bar = () => {
       console.log('arguments[0]: ', arguments[0]);  // 5
    };
    bar();
}

foo2(5);

// nested function definitions

function createComparisonFunction(propertyName) {
   return function(object1, object2) {
      let value1 = object1[propertyName];
      let value2 = object2[propertyName];
       
      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
   };
}

let data = [
    {name: "Zachary", age: 28},
    {name: "Nicholas", age: 29}
];

data.sort(createComparisonFunction("name"));
console.log('data[0].name: ', data[0].name); // Nicholas

data.sort(createComparisonFunction("age"));
console.log('data[0].name: ', data[0].name); // Zachary

