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
{
    "use strict"

    // optimization used: initial return values do not have stack frame implications 
    function outerFunctionFourth(a, b) {
        function innerFunction(x) {
            console.log("from inside outerFunctionFourth.innerFunction: ", x);
            return x;
        }
        if (a < b) {
            return a;
        }
        return innerFunction(a + b);
    }

    // 

    let res = outerFunctionFourth(7, 5);
    console.log('res = outerFunctionFourth(7, 5): ', res);


    // optimization used: both inner functions are considered to be in a tail position
    function outerFunctionFifth(condition) {
        function innerFunctionA() {
            console.log('Inside innerFunctionA');
            return 'innerFunctionA';
        }
        function innerFunctionB() {
            console.log('Inside innerFunctionB');
            return 'innerFunctionB';
        }
        return condition ? innerFunctionA() : innerFunctionB();
    }

    console.log('outerFunctionFifth(): ', outerFunctionFifth(true));
}

{
  // coding for tail call optimization

  // the function below will not be tail call optimized
  function fib(n) {
    if (n < 2) {
        return n;
    }

    return fib(n - 1) + fib(n - 2);
  }

  // commented out because it takes too long
  // console.log('fib(50) = ', fib(50));

}

// closures
{
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
   // when a function is called, an execution context is created, and its scope chain is created. The activation
   // object for the function is initialized with values for `arguments` and any named arguments. The outer 
   // function's activation object is the second object in the scope chain. This process continues for all 
   // containing functions until the scope chain terminates with the global execution context.
   // As the function executes, variables are looked up in the scope chain for the reading and writing of 
   // values. Consider the following example:
   //
   function compare_simple(value1, value2) {
     if (value1 < value2) {
        return -1;
     } else if (value1 > value2) {
        return 1;
     } else {
        return 0;
     }
   }

   let result_cmp = compare_simple(5, 10);
   console.log('result = = compare(5, 10): ', result_cmp);
   
   // this code defines a function `compare()` that is called in the global execution context. When `compare()` is
   // called for the first time, a new activation object is created that contains `arguments`, `value1` and `value2`.
   // The global execution context's variable object is next in the `compare()` execution context's scope chain, 
   // which contains `this`, `result`, and `compare`. 
   // the Figure 1 shown below illustrates this arrangement:
   //
   // [Figure 1: scope chain for function `compare()`](https://github.com/dimitarpg13/JavaScript_for_web_dev/blob/main/images/scope_chain_for_function_compare.png)
   //
   // Whenever a variable is accessed inside a function, the scope chain is searched for a variable with the given name.
   // Once the function has completed, the local activation object is destroyed, leaving only the global scope in memory.
   // Closures, however, behave differently.
   // A function that is defined inside another function adds the containing function's activation object into its scope
   // chain. So, in `createComparsionFunction()`, the anonymous function's scope chain actually contains a reference
   // to the activation object for `createComparisonFunction()`. The Figure 2 below illustrates this relationship when the
   // following code is executed
   //
   // [Figure 2: createComparisonFunction and anonymous function execution contexts](https://github.com/dimitarpg13/JavaScript_for_web_dev/blob/main/images/createComparisonFunction_and_anonymous_execution_contexts.png)

   let compare_closure = createComparisonFunction('name');
   let result_comp_closure = compare_closure({ name: 'Nicholas'}, {name: 'Matt'});
   console.log('result_comp_closure = compare_closure({ name: \'Nicholas\'}, {name: \'Matt\'}): ', result_comp_closure);
}