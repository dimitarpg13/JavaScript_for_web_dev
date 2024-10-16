// ECMA-262 defines an object as an unordered collection of properties.
// Thus, an object is an array of values in no particular order.
// ECMAScript objects can be viewed as hash tables. 

{

    // Data Properties
    //
    // Data properties contain a single location for a data value. Values are from anad written to this location
    // Data properties have four attributes describing their behavior:
    //
    // > [[Configurable]] - indicates if the property may be redefined by removing the property via `delete`, changing
    // the property's attributes, or changing the property into an accessor property. By default, this is trie for all
    // properties defined directly on an object. Example: see person_two definition below.
    //
    // > [[Enumerable]] - indicates if the property will be returned in a `for-in` loop. By default, this is true for 
    // all properties defined directly on an object. Example: see person_two definition below.
    //
    // > [[Writable]] - indicates if the property's value can be changed. By default, this is true for all properties 
    // defined directly on an object. Example: see person_two definition below.
    //
    // > [[Value]] - contains the actual data value for the property. This is the location from which the property's 
    // value is read and the location to which new values are saved. The default value for this attribute is 
    // `undefined`.
    //
    //

    let person_one = new Object();

    person_one.name = "Nicholas";
    person_one.age = 29;
    person_one.job = "Software Engineer";
    person_one.sayName = function() {
        console.log('person_one.sayName(): ', this.name);
    }

    person_one.sayName();

    // the example above can be rewritten using object literal notation:
    
    let person_two = {
        name: "Nicholas",
        age: 29,
        job: "Software Engineer",
        sayName() {
            console.log('person_two.sayName(): ', this.name);
        }
    };

    person_two.sayName();

    // To change any of the default property attributes, one must use the `Object.defineProperty()` method. This method
    // accepts three arguments: the object on which the property should be added or modified, the name of the property, and 
    // a descriptor object. The properties on the descriptor object match the attribute names: `configurable`, `writable`, 
    // and `value`. 

    let person_three = {};
    Object.defineProperty(person_three, 'name', {
        writable: false,
        value: "Nicholas"
    });
    console.log('person_three.name before assignment: ', person_three.name); // "Nicholas"
    person_three.name = "Greg";
    console.log('person_three.name after assignment: ', person_three.name); // "Nicholas"

    // similar rules apply to creating a nonconfigurable property. For example:
    let person_four = {};
    Object.defineProperty(person_four, "name", {
        configurable: false,
        value: "Nicholas"
    });
    console.log('person_four.name: ', person_four.name); // "Nicholas"
    delete person_four.name;
    console.log('person_four.name: ', person_four.name); // "Nicholas"
    // Here setting `configurable` to `false` means that the property cannot be removed from the object.
    // Calling `delete` on the property has no effect in nonstrict mode and throws an error in strict mode.
    // Once a property has been defined as nonconfigurable, it cannot become configurable again. 


    // Throws an error `TypeError: Cannot redefine property: name`
    // Object.defineProperty(person_four, "name", {
    //    configurable: true,
    //    value: "Nicholas" });
    // }

}

{
    // Accessor Properties
    // 
    // Accessor properties do not contain a data value. Instead, they contain a combination of a getter function and a
    // a setter function (though both are not necessary).
    // When an accessor property is read from, the getter function is called, and it is function's responsibility to
    // return a valid value; when an accessor proerty is written to, a function is called with the new value,
    // and the function must decide how to react to the data. 
    // Accessor properties have four attributes:
    //
    // > [[Configurable]] - indicates if the property may be redefined by removing the property via `delete`, 
    // changing the property's attributes, or changing the property into a data property. By default, this is true
    // for all properties defined directly on an object.
    //
    // > [[Enumerable]] - indicates if the property will be returned in a `for-in` loop. By default, this is true for 
    // all properties defined directly on an object.
    //
    // > [[Get]] - the function to call when the property is read from. The default value is `undefined`.
    //
    // > [[Set]] - the function to call when the property is written to. The default value is `undefined`.
    //
    // It is not possible to define accessor property explicitly; you must use `Object.definedProperty()`. 
    // Here is a simple example:
    //

    // define  an object with pseudo-private member `year_` and public member `edition`
    let book = {
        year_: 2017,
        edition: 1
    };

    Object.defineProperty(book, "year", {
       get() {
          return this.year_;
       },
       set(newValue) {
         if (newValue > 2017) {
            this.year_ = newValue;
            this.edition += newValue - 2017;
         }
       } 
    })
    book.year = 2018;
    console.log('book.edition: ', book.edition); // 2
}

{
    // defining multiple properties
    //
    // if you need to define more than one property on an object, ECMAScript provides the `Object.defineProperties()`.
    // 
    let book = {};
    Object.defineProperties(book, {
        year_: {
            value: 2017
        },

        edition: {
            value: 1
        },

        year: {
            get() {
                return this.year_;
            },

            set (newValue) {
                if (newValue > 2017) {
                    this.year_ = newValue;
                    this.edition += newValue - 2017;
                }
            }
        }
    });

    book.year = 2018;
    console.log('book.edition: ', book.edition); // 2
}

{
    // reading property attributes
    //
    // it is possible to retrieve the property descriptor for a given property by using
    // `Object.getOwnPropertyDescriptor()`. The first argument is the object on which the property descriptor resides
    // and the second one is the name of the property whose descriptor should be retrieved. 
    // The return value is an object with properties for `configurable`, `enumerable`, `get`, and `set` for 
    // accessor properties or `configurable`, `enumerable`, `writable`, and `value` for data properties. 
    // For example:
    let book = {};
    Object.defineProperties(book, {
        year_: {
            value: 2017
        },

        edition: {
            value: 1
        },

        year: {
            get: function() {
                return this.year_;
            },

            set: function(newValue) {
                if (newValue > 2017) {
                    this.year_ = newValue;
                    this.edition += newValue - 2017;
                }
            }
        }
    });

    let descriptor = Object.getOwnPropertyDescriptor(book, "year_");
    console.log('descriptor.value: ', descriptor.value);        // 2017
    console.log('decriptor.configurable: ', descriptor.configurable); // false
    console.log('typeof descriptor.get: ', typeof descriptor.get);   // 'undefined'
    let descriptor2 = Object.getOwnPropertyDescriptor(book, "year");
    console.log('descriptor2.value: ', descriptor2.value);  // undefined
    console.log('descriptor2.enumerable: ', descriptor2.enumerable)  // false
    console.log('typeof descriptor2.get: ', descriptor2.get); // 'function'
    


}

{
    // new in ECMAScript 2017: `Object.getOwnPropertyDescriptors()` static method
    //
    // 
    let book = {};
    Object.defineProperties(book, {
        year_: {
            value: 2017
        },

        edition: {
            value: 1
        },

        year: {
            get: function() {
                return this.year_;
            },

            set: function(newValue) {
                if (newValue > 2017) {
                    this.year_ = newValue;
                    this.edition += newValue - 2017;
                }
            }
        }
    });

    console.log('Object.getOwnPropertyDescriptors(book): ', Object.getOwnPropertyDescriptors(book));
}

{
    
    // Merging objects - referred to as `mixin`
    // ECMAScript 6 introduces this behavior with the `Object.assign()`.
    // This method accepts one dest object and one or many sourc objects.
    // For each source object copies the enumerable (`Object.propertyIsEnumerable` returns `true`)
    // and own (`Object.hasOwnProperty` returns `true`) properties onto the destination object. 
    // Properties keyed with strings and symbols will be copied. For each suitable property, the method will 
    // use `[[Get]]` to retrieve a value from the source object and `[[Set]]` on the destination object to
    // assign the value

    let dest, src, result;
    
    dest = {};
    src = { id: 'src' };

    result = Object.assign(dest, src);

    // Object.assign mutates the destination object and also returns that object after exiting
    console.log('dest === result: ', dest === result); // true
    console.log('dest !== src: ', dest !== src); // true
    console.log('result: ', result); // { id: src }
    console.log('dest: ', dest);   // { id: src }



    // Note on Enumerability and ownership of properties:
    //
    // Every property in JS objects can be classified by three factors:
    //
    // > Enumerable or non-enumerable;
    // > String or symbol;
    // > Own property or inherited property from the prototype chain
    //
    // _Enumerable properties_ are those properties whose internal enumerable flag is set to true, 
    // which is the default for properties created via simple assignment or via a property initializer. 
    // Properties defined via `Object.defineProperty` and such are not enumerable by default. 
    // Most iteration means e.g. `for..in` loops and `Object.keys()` only visit enumerable keys.
    //
    // Ownership of properties is determined by whether the property belongs to the object directly and 
    // not to its prototype chain.
    //
    // 
}

{
    // Multiple source objects
    dest = {}

    result = Object.assign(dest, { a: 'foo'}, { b: 'bar'});

    console.log('multiple source result: ', result); // { a: foo, b: bar}
}


{
    // Getters and setters with `Object.assign`

    dest = {
        set a(val) {
            console.log('Invoked dest setter with param ${val}');
        }
    };
    src = {
        get a() {
            console.log('Invoked src getter');
            return 'foo';
        }
    };

    Object.assign(dest, src);
    // invoked src getter
    // invoked dest setter with param foo

    // Since the setter does not perform an assignment,
    // no value is actually transferred
    console.log('dest: ', dest); // { set a(val) {...}}
}

{
    // `Object.assign()` is effectively performing a shallow copy from each source object. 
    // if multiple objects have the same property defined, the last one to be copied will be the final value.
    // Furthermore, any value retrieved from accessor properties, such as a getter, on a source object will be
    // assigned as a static value on the destination object - there is no ability to transfer getters and setters
    // between objects

    let dest, src, result;

    dest = { id: 'dest'};

    result = Object.assign(dest, { id: 'src1', a: 'foo'}, { id: 'src2', b: 'bar'});

    // Object.assign will overwrite duplicate properties
    console.log('result: ', result);  // { id: src2, a: foo, b:bar }

    // this can be observed by using a setter on the destination object
    dest2 = {
        set id(x) {
            console.log(x);
        }
    };

    Object.assign(dest2, { id: 'first'}, { id: 'second'}, { id: 'third'});
    // first
    // second
    // third

    console.log('dest2.id: ', dest2.id);
    // undefined

    // object references

    dest3 = {};
    src3 = { a: {} };
    
    Object.assign(dest3, src3);

    // Shallow property copies means only object references copied.
    console.log('dest3: ', dest3);     // { a : {} }
    console.log('dest3.a === src3.a: ', dest3.a === src3.a);  // true
    
}

{
    // error thrown during `Object.assign()`
    // `Object.assign()` is not atomic operation wich guarantees _transactional consistency_.
    let dest, src, result;

    dest = {};
    src = {
        a: 'foo',
        get b() {
            // error when `Object.assign()` invokes this getter
            throw new Error();
        },
        c: 'bar'
    };

    try {
        Object.assign(dest, src);
    } catch (e) {}

    // `Object.assign()` has no way of rolling back already performed changes,
    // so set operations already performed on the destination object before the
    // error is thrown remain:
    console.log('dest: ', dest);  // { a: foo }
      
}

{
    // Object Identity and Equality
    //
    // In versions prior to ECMAScript 6, there were several tricky corner cases where the `===` operator was
    // insufficient

    // These are cases where `===` behaves as expected:
    console.log('true === 1: ', true === 1); // false
    console.log('{} === {}: ', {} === {});  // false
    console.log('"2" === 2: ', "2" === 2);  // false

    // These have different representations in the JS engine and yet are treated as equal
    console.log('+0 === -0: ', +0 === -0);  // true
    console.log('+0 === 0: ', +0 === 0); // true
    console.log('-0 === 0: ', -0 === 0); // true

    // to determine NaN equivalence, the profoundly annoying isNaN() is required
    console.log('NaN === NaN :', NaN === NaN);  // false
    console.log('isNaN(NaN): ', isNaN(NaN));   // true

    // to remedy these shortcomings ECMAScript 6 introduced `Object.is()`, which behaves mostly as `===`
    // does but also accounts for the corner cases listed previously. 
    console.log('Object.is(true, 1): ', Object.is(true, 1));   // false
    console.log('Object.is({}, {}): ', Object.is({}, {}));  // false
    console.log('Object.is("2", 2): ', Object.is("2", 2)); // false

    // correct 0, -0, +0 equivalence/nonequivalence
    console.log('Object.is(+0, -0): ', Object.is(+0, -0));  // false
    console.log('Object.is(+0, 0): ', Object.is(+0, 0));  // true
    console.log('Object.is(-0, 0): ', Object.is(-0, 0));  // false

    // correct NaN equivalence:
    console.log('Object.is(NaN, NaN): ', Object.is(NaN, NaN));  // true
}

{
    // enhanced object syntax with ECMAScript 6

    // Property Value Shorthand
    let name = 'Matt';

    let person = {
        name: name
    };

    console.log('`person` not created via enhanced syntax: ', person);  // { name: 'Matt'}

    let person2 = {
      name
    }

    console.log('`person2` created via enhanced syntax: ', person2);  // { name: 'Matt'}

    // minifiers will preserve property names between scopes to prevent breaking references

    function makePerson(name) {
        return {
            name
        };
    }

    let person3 = makePerson('Dimitar');

    console.log('person3.name: ', person3.name); // Dimitar
}

{
    // Computed property keys

    // Prior to the introduction of computed property keys, there was no way to dynamically 
    // assign property keys in an object literal without declaring the object and then individually
    // using the square bracket notation for property assignment. Example:
    const nameKey = 'name';
    const ageKey = 'age';
    const jobKey = 'job';

    let person = {};
    person[nameKey] = 'Matt';
    person[ageKey] = 27;
    person[jobKey] = 'Software engineer';

    console.log('person: ', person);

    // with computed properties:

    let person2 = {
        [nameKey]: 'Matt',
        [ageKey]: 27,
        [jobKey]: 'Software engineer'
    };

    console.log('person2: ', person2);  // { name: 'Matt', age: 27, job: 'Software engineer' }

    // Because the contents are evaluated as a JS expr it is possible to make the contents of the 
    // computed property complex expressions which are evaluated upon instantiation
    let uniqueToken = 0;

    function getUniqueKey(key) {
        return `${key}_${uniqueToken++}`;
    }

    let person3 = {
       [getUniqueKey(nameKey)]: 'Matt',
       [getUniqueKey(ageKey)]: 27,
       [getUniqueKey(jobKey)]: 'Software engineer'
    };

    console.log('person3: ', person3); // { name_0: 'Matt', age_1: 27, job_2: 'Software engineer'}
    
}

{
    // Concise Method Synthax
    //
    // when defining function properties of an object, the format almost always takes the form of a property
    // key referencing an anonymous function expression
    let person = {
        sayName: function(name) {
            console.log(`My name is ${name}`);
        }
    } ;

    person.sayName('Matt'); // my name is Matt

    // the new shorthand method syntax follows this pattern :

    let person2 = {
        sayName(name) {
            console.log(`My name is ${name}`);
        }
    };

    person2.sayName('Matt');

    // with setter and getter object expressions this becomes:

    // without shorthand notation the setter and getter object expressions are clunky:
    let person3 = {
        name_: '',
        get name() {
            return this.name_;
        },
        set name(name) {
            this.name_ = name;
        },
        sayName() {
            console.log(`My name is ${this.name_}`);
        }
    }

    person3.name = 'Matt O\'Dowd';
    person3.sayName(); // My name is Matt

    // shorthand method syntax 
    const methodKey = 'sayName';

    let person4 = {
        [methodKey] (name) {
            console.log(`My name is ${name}`);
        }
    }

    person4.sayName('Matt Thortington');
}

{
    // Object Destructuring
    // ECMAScript 6 introduced object destructuring which allows to perform operation(s) using nested data within
    // a single statement. Assignments are performed from object properties using syntax that matches the structure
    // of the object.
    
    // Without object destructuring
    let person = {
        name: 'Matt',
        age: 27
    };

    let personName = person.name, personAge = person.age;
    console.log('personName: ', personName, ', personAge: ', personAge); // personName: Matt , personAge: 27
    
    // Using object destructuring
    let person2 = {
        name: 'Matt O\'Dowd',
        age: 27
    };

    let { name: personName2, age: personAge2 } = person2;

    console.log('personName2: ', personName, ', personAge2: ', personAge); // personName: Matt , personAge: 27

    // Destructuring using single object literal-like syntax
    let person3 = {
        name: 'Matt O\'Dowd',
        age: 27
    }

    let { name, age, job } = person3;

    console.log('name: ', name); // name: Matt O'Dowd
    console.log('age: ', age); // age: 27 
    console.log('job: ', job='Software engineer')

    // destructuring uses the interal function `ToObject()` to coerce a source into an object. 
    // primitive types are treated as objects when used in a destructuring operation.
    // By definition, `null` and `undefined` cannot be destructured and will throw error.

    let { length } = 'foobar';
    console.log('length: ', length);  // length: 6

    let { constructor: c } = 4;
    console.log( 'c === Number: ', c === Number); // c === Number: true

    // let { _ } = null;  // TypeError

    // let { _ } = undefined; // TypeError

    let personName4, personAge4;

    let person4 = {
        name: 'Matt O\'Dowd',
        age: 27
    };

    ({name: personName4, age: personAge4} = person);

    console.log('personName4: ', personName4, ', personAge4: ', personAge4); // personName4: Matt O'Dowd , personAge4: 27  

}

{
    // Nested Destructuring

    let person = {
        name: 'Matt O\'Dowd',
        age: 27,
        job: {
            title: 'Software Engineer'
        }
    };
    let personCopy = {};

    ({
        name: personCopy.name,
        age: personCopy.age,
        job: personCopy.job
    } = person);

    // Because an object reference was assigned into personCopy, changing a property inside the person.job object 
    // will be propagated to personCopy:
    person.job.title = 'Hacker'

    console.log('person: ', person); // { name: 'Matt O\'Dowd', age: 27, job: { title: 'Hacker' }}

    console.log('personCopy: ', personCopy); // { name: 'Matt O\'Dowd', age: 27, job: { title: 'Hacker' }}

    // deconstruing assignments can be nested to match nested property references
    let { job: { title }} = person;

    console.log('title: ', title); // title: Software engineer

    // cannot use nested property references when an outer property is undefined.

    // `foo` is undefined on the source object
    try {

      ({
         foo: {
            bar: personCopy.bar
         }
      } = person); // TypeError: cannot destructure property `bar` of `undefined` or `null`
    } catch (e) {
        console.log('Exception was thrown and caught: ', e);
    }

    // `job` is undefined on the destination object
    // ({
    //    job: {
    //        title: personCopy.job.title
    //    }
    // }) // TypeError: cannot set property `title` of `undefined`
}

{
    // Partial Destructuring Completion
    // 
    // a destructured assignment involving multiple properties does not possess transactional consistency , 
    // rather it is a sequential operation with independent outcomes. 
    // For example if, within a single destructured expression with multiple assignments, the initial assignments 
    // succeed but a later one throws an error, the destructured assignment will exit with partial completition 
    // status and no completion guarantees whatsoever.
    
    let person = {
        name: 'Matt O\'Dowd',
        age: 27
    };

    let personName, personBar, personAge;

    try {
      // person.foo is undefined, so this will throw an error
      ({name: personName, foo: { bar: personBar }, age: personAge} = person);
    } catch (e) {}

    console.log('personName: ', personName, ', personBar: ', personBar, ', personAge: ', personAge);
    // personName: Matt O'Down, personBar: undefined, personAge: undefined

}


{
    // Parameter Context Matching

    let person = {
        name: 'Matt O\'Dowd',
        age: 27
    };

    function printPerson(foo, {name, age}, bar) {
        console.log('printPerson arguments: ', arguments);
        console.log('name: ', name, ', age: ', age);
    }

    function printPerson2(foo, {name: personName, age: personAge}, bar) {
        console.log('printPerson2 arguments: ', arguments);
        console.log('personName: ', personName, ', personAge: ', personAge);
    }

    printPerson('1st', person, '2nd');
    // {'0': '1st', '1': { name: 'Matt O\'Dowd', age: 27}, '2': '2nd'}
    // name: Matt O'Dowd , age: 27 

    printPerson2('1st', person, '2nd');
    // {'0': '1st', '1': { name: 'Matt O\'Dowd', age: 27}, '2': '2nd'}
    // name: Matt O'Dowd , age: 27 
}

{
    // Object Creation - The Factory Pattern
    function createPerson(name, age, job) {
        let o = new Object();
        o.name = name;
        o.age = age;
        o.job = job;
        o.sayName = function() {
            console.log('Inside Person::sayName(): ', this.name);
        }
        return o;
    }

    let person1 = createPerson("Nicholas", 29, "Software Engineer");
    let person2 = createPerson("Greg", 27, "Doctor");

    person1.sayName();
    person2.sayName();
}

{
    // Object Creation with the Function Constructor Pattern
    function Person(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
        this.sayName = function() {
            console.log('Inside Person::sayName(): ', this.name);
        };
    }

    let person1 = new Person("Nicholas", 29, "Software Engineer");
    let person2 = new Person("Greg", 27, "Doctor");

    person1.sayName(); // Inside Person::sayName(): Nicholas
    person2.sayName(); // Inside Person::sayName(): Greg

    console.log('person1.constructor == Person: ', person1.constructor == Person); // true
    console.log('person2.constructor == Person: ', person2.constructor == Person); // true

    console.log('person1 instanceof Object: ', person1 instanceof Object);  // true
    console.log('person1 instanceof Person: ', person1 instanceof Person); // true
    console.log('person2 instanceof Object: ', person2 instanceof Object); // true
    console.log('person2 instanceof Person: ', person2 instanceof Person); // true

}

{
    // Object Creation through function creation

    let Person = function(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
        this.sayName = function() {
            console.log('Inside Person::sayName(): ', this.name);
        }
    }

    let person1 = new Person("Nicholas", 29, "Software Engineer");
    let person2 = new Person("Greg", 27, "Doctor");

    person1.sayName();  // Inside Person::sayName():  Nicholas
    person2.sayName();  // Inside Person::sayName():  Greg

    // The `Person()` function may be called in any of the following ways

    // call as a function
    Person("Greg", 27, "Doctor"); // adds to global
    global.sayName(); // Inside Person::sayName():  Greg

    // use as a constructor
    let person = new Person("Nicholas", 29, "Software Engineer");
    person.sayName(); // Inside Person::sayName():  Nicholas

    // call in the scope of another object
    let o = new Object();
    Person.call(o, "Kristen", 25, "Nurse");
    o.sayName(); // Inside Person::sayName(): Kristen
}

{
    // Problems with Constructors
    // Methods are created once for each instance. For example , in the previous sample code both `person1` and
    // `person2` have a method called `sayName()`, but those methods are not the same instance of `Function`. 
    // Functions are ECMAScript objects , so every time a function is defined, an object behind it is being
    // instantiated.

    function Person(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
        this.sayName = new Function("console.log(this.name)"); // logical equivalent
    }

    let person1 = new Person("Nicholas", 29, "Software Engineer");
    let person2 = new Person("Greg", 27, "Doctor");


    console.log('person1.sayName == person2.sayName: ', person1.sayName == person2.sayName); // false

    // it is possible to work around this limitation by moving the function definition outside of the 
    // constructor

    function PersonOptimized(name, age, job) {
      this.name = name;
      this.age = age;
      this.job = job;
      this.sayName = sayName;   
    }

    function sayName() {
        console.log(this.name);
    }

    let person3 = new PersonOptimized("Nicholas", 29, "Software Engineer");
    let person4 = new PersonOptimized("Greg", 27, "Doctor");

    person3.sayName(); // Nicholas
    person4.sayName(); // Greg

    console.log('person3.sayName == person4.sayName: ', person3.sayName == person4.sayName); // true
}

{
    // The Prototype Pattern
    //
    // solves the probem with object creation when the object posseses multiple instance methods
    //
    // Each function is created with a `prototype` property, which is an object containing properties and
    // methods that should be available to instances of a particular reference type. 
    // This object serves as a _prototype_ for the object to be created once the ctor is called. 
    // The benefit of using the protype is that all of its properties and methods are shared among object instances.
    // Instead of assigning object information in the ctor, they can be assigned directly to the prototype

    function Person() {}

    Person.prototype.name = "Nicholas";
    Person.prototype.age = 29;
    Person.prototype.job = "Software Engineer";

    Person.prototype.sayName = function() {
        console.log('Inside Person.prototype.sayName(): ', this.name);
    }

    let person1 = new Person();
    person1.sayName();  // Nicholas

    let person2 = new Person();
    person2.sayName(); // Nicholas

    console.log('person1.sayName == person2.sayName: ', person1.sayName == person2.sayName); // true

    // using a function expression 
    let PersonFE = function() {};

    PersonFE.prototype.name = "Nicholas";
    PersonFE.prototype.age = 29;
    PersonFE.prototype.job = "Software Engineer";
    PersonFE.prototype.sayName = function() {
        console.log(this.name);
    }
    // Note that the property `job` and the method `sayName()` are added directly to the `prototype` property of
    // `Person`, leaving the constructor empty. However, we still can call the constructor to create a new object
    // and the constructed object will have the properties and methods present and instantiated correctly. 
    // Unlike the constructor pattern, the properties and methods are all shared among instances, so 
    // `person1` and `person2` are both accessing the same set of properties and the same `sayName()` function. 

    let person3 = new PersonFE();
    person3.sayName(); // Nicholas
    
    let person4 = new PersonFE();
    person4.sayName(); // Nicholas

    console.log('person3.sayName == person4.sayName: ', person3.sayName == person4.sayName); // true

}

{
    // How Prototypes Work?

    // whenever a function is created, its `prototype` property is also created according to a specific set of rules. 
    // By default, all prototypes get a property `constructor` that points back to the function on which it is a 
    // property. For example, in the previous example, `Person.prototype.constructor` points to `Person`. Depending
    // on the constructor other properties and methods may be added to the prototype.
    //
    // when defining a custom constructor, the property gets the `constructor` property only by default; all other
    // methods are ingerited from `Object`. Each time the constructor is called to create a new instance, that instance
    // has an internal pointer to the constructor's prototype. In ECMA-262, this is called `[[Prototype]]`. 
    // There is no standard way to access `[[Prototype]]` from script, but most browsers support a property on every 
    // object called `__proto__`. Important to understand is that a direct link exists between the instance and 
    // constructor's prototype but not between the instance and the constructor.

    // Refer to [Relationships Between Constructor Prototype and Object Instance](https://github.com/dimitarpg13/JavaScript_for_web_dev/blob/main/images/relationships_btw_ctor_prototype_and_object_instances.png)
    // for details on those relationships.

    /**
     * Constructor function can exist as function expression or function declaration, so both of these are suitable:
     *   function Person {}
     *   let Person = function() {}
     */
    function Person() {}

    /**
     * Upon declaration, the constructor function already has a prototype object associated with it
     */
    console.log('typeof Person.prototype: ', typeof Person.prototype);
    console.log('Person.prototype: ', Person.prototype);
    // {
    //   constructor: f Person(),
    //   __proto__: Object
    // }

    /**
     * As mentioned previously, the constructor function has a `prototype` reference to the prototype
     * object, and the prototype object has a `constructor` reference to the constructor function.
     * These references are cyclical
     */
    console.log('Person.prototype.constructor == Person: ', Person.prototype.constructor == Person); // true

    /**
     * Any normal prototype chain will terminate at the Object prototype.
     * The prototype of the Object prototype is null
     */
    console.log('Person.prototype.__proto__ === Object.prototype: ', Person.prototype.__proto__ === Object.prototype); // true
    console.log('Person.prototype.__proto__.constructor == Object: ', Person.prototype.__proto__.constructor == Object); // ture
    console.log('Person.prototype.__proto__.__proto__ === null: ', Person.prototype.__proto__.__proto__ === null); // true
    
    console.log('Person.prototype.__proto__: ', Person.prototype.__proto__); // [Object: null prototype] {}

    let person1 = new Person(),
        person2 = new Person();
    // the constructor, the prototype object, and an instance are three
    // completely distinct objects
    console.log('person1 !== Person: ', person1 !== Person); // true
    console.log('person1 !== Person.prototype: ', person1 !== Person.prototype); // true
    console.log('Person.prototype !== Person: ', Person.prototype !== Person); // true

    // An instance is linked to the prototype through `__proto__`, which is the literal
    // manifestation of the [[Prototype]] hidden property. 
    //
    // A constructor is linked to the prototype through the constructor proeprty.
    //
    // An instance has no direct link to the constructor, only through the prototype.
    console.log('person1.__proto__ === Person.prototype: ', person1.__proto__ === Person.prototype);  // true
    console.log('person1.__proto__.constructor === Person: ', person1.__proto__.constructor === Person); // true

    // two instances created from the same constructor function will share a prototype object
    console.log('person1.__proto__ === person2.__proto__: ', person1.__proto__ === person2.__proto__);

    // instance will check the instance's prototype chain against the prototype property of a constructor function
    console.log('person1 instanceof Person: ', person1 instanceof Person);  // true
    console.log('person1 instanceof Object: ', person1 instanceof Object);  // true
    

}
