// ECMA-262 defines an object as an unordered collection of properties.
// Thus, an object is an array of values in no particular order.
// ECMAScript objects can be viewed as hash tables. 

{
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
    
}



