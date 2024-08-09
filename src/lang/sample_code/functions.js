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

// function arguments

function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
}

let trueFactorial = factorial;

factorial = function() {
    return 0;
}

console.log('trueFactorial(5): ', trueFactorial(5)); // 120
console.log('factorial(5): ', factorial(5));

// The value of `arguments.callee` is not accessible to a script running in strict mode and will cause an
// error when attempts are made to read it. Instead, one can use _named function expressions_ to achieve
// the same result. For example:

const factorial_expr = (function f(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * f(num - 1);
    }
});

console.log('named function expression for factorial(5): ', factorial_expr(5) );

//  The object `this`
//
// Inside a standard function, `this` is a reference to the context object that the function is operating on 

// tail call optimization requirements
//
// > the code is executing in strict mode
//
// > the return value of the outer function is the invoked tail call function
//
// > there is no further execution required after the tail call function returns
//
// > the tail call function is not a closure that refers to variables in the outer function's scope
//
// here are counter-examples which violate one or more of the conditions above:

{
    "use strict";


    // no optimization: tail call is not returned
    function outerFunction() {
        function innerFunction() {
            console.log('Hello from inner function!');
        }
        innerFunction();
    }

    // no optimization: tail call is not directly returned
    function outerFunctionSecond() {
        function innerFunction() {
            console.log('Hello for second time from inner function!');
        }
        let innerFunctionResult = innerFunction();
        return innerFunctionResult;
    }

    // no optimization: tail call must be cast as a string after return
    function outerFunctionThird() {
        function innerFunction() {
            return { 
                outputStr: 'Hello for third time from inner function!',
            
                toString() {
                    return this.outputStr
                }
            };
        }
        return innerFunction().toString();
    }

    outerFunction();
    outerFunctionSecond();
    console.log('outerFunctionThird() = ',outerFunctionThird());
}

// here are examples which will be optimized as they do not violate the tail call optimization conditions 


