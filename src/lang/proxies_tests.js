// proxy behaves as an asbtraction for a target object
// it is analogorus to a C++ pointer in that it can be wielded as a stand-in 
// for the target object it points to but is totally separate from the target object. 
// The target object can either be manipulated directly or through the proxy , but 
// manipulating directly will circumvent the behavior that a proxy enables.

// Creating a Passthrough Proxy
//
// In its simplest form, a proxy can exist as nothing more than an abstracted target object.
// By default, all operations performed on a proxy object will be transparently propagated 
// through to the target object. Therefore, you are able to use a proxy object in all the same way 
// as target object.
//
// As shown below, all operations performed on the proxy will be effectively applied to the 
// target object instead. The only perceptible difference is the identity of the proxy object.

const target_simple = {
    id: 'target'
};

const handler_empty = {};

const proxy_simple = new Proxy(target_simple, handler_empty);

// The 'id' property will access the same value
console.log('target_simple.id: ', target_simple.id);  // target
console.log('proxy_simple.id: ', proxy_simple.id);   // target

// Assignment to a target property changes both since
// both are accessing the same value.
target_simple.id = 'foo';
console.log('target_simple.id: ', target_simple.id); // foo
console.log('proxy_simple.id: ', proxy_simple.id);  // foo

// assignment to a proxy property changes both since 
// this assignment is conferred to the target object.
proxy_simple.id = 'bar';
console.log('target_simple.id: ', target_simple.id);  // bar
console.log('proxy_simple.id: ', proxy_simple.id); // bar

// the hasOwnProperty() method is effectively applied
// to the target in both cases.
console.log("target_simple.hasOwnProperty('id'): ",target_simple.hasOwnProperty('id'));  // true
console.log("proxy_simple.hasOwnProperty('id'): ", proxy_simple.hasOwnProperty('id')); // true

// the instanceof operator is effectively applied to the target in both cases

// NOTE: throws an error: 
// if (target instanceof Proxy)
//            ^
// TypeError: Function has non-object prototype 'undefined' in instanceof check
// Details on this error: 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/invalid_right_hand_side_instanceof_operand
//
//console.log("target instanceof Proxy: ",target instanceof Proxy); // false
//console.log("proxy instanceof Proxy: ", proxy instanceof Proxy); // false

// differentiate proxy from target with strict object equality
console.log("target_simple === proxy_simple: ", target_simple === proxy_simple);

// defining traps

// the primary purpose of a proxy is to allow you to define traps which behave as 
// fundamental operation interceptors inside the handler object. Each handler object is made
// up of zero, one or many traps and each trap corresponds to a fundamental operation that
// can be directly or indirectly called on the proxy. When these fundamental operations are
// called on the proxy object, before being invoked on the target object, the proxy will invoke
// the trap function instead, allowing you to intercept and modify its behavior.

// example of a get() trap

const target_bar = {
    foo: 'bar'
};

const handler_get = {
   get() {
    return 'handler override';
   }
};

const proxy_with_handler = new Proxy(target_bar, handler_get);

console.log("target.foo: ", target_bar.foo);  // bar
console.log("proxy.foo: ", proxy_with_handler.foo); // handler override

console.log(target_bar['foo']);   // bar
console.log(proxy_with_handler['foo']);    // handler override

console.log(Object.create(target_bar)['foo']);   // bar
console.log(Object.create(proxy_with_handler)['foo']);    // handler override

const handler_with_lookup = {
    get(trapTarget, property, receiver) {
        console.log('trapTarget === target', trapTarget === target_bar);
        console.log('property: ', property);
        console.log('receiver === proxy: ', receiver === proxy_with_lookup);
    }
}

const proxy_with_lookup = new Proxy(target_bar, handler_with_lookup);

console.log('proxy_with_lookup.foo: ', proxy_with_lookup.foo);

// we can define a trap handler that wholly recreates the behavior of the method being trapped

const handler_recreate = {
    get(trapTarget, property, receiver) {
        return trapTarget[property];
    }
};

const proxy_recreates = new Proxy(target_bar, handler_recreate);

console.log("proxy_recreates.foo: ", proxy_recreates.foo);   // bar
console.log("target_bar.foo: ", target_bar.foo);

// The original behavior of the trapped method is wrapped inside an identically named method on the 
// global Refelct object.
// Every method that can be trapped inside a handler object has a corresponding Reflect API method. 
// This method has an identical name and function signature, and performs the exact behavior that 
// the trapped method is intercepting. Therefore, it is possible to define a passthrough proxy using
// only the Reflect API:

const handler_reflect= {
   get() {
     return Reflect.get(...arguments);
   }
}

const proxy_reflect = new Proxy(target_bar, handler_reflect);

console.log('proxy_reflect.foo: ', proxy_reflect.foo); // bar
console.log('target_bar.foo: ', target_bar.foo); // bar

// in more succinct format
const handler_succinct_reflect = {
    get: Reflect.get
};

const proxy_succinct_reflect = new Proxy(target_bar, handler_succinct_reflect);
console.log('proxy_succinct_reflect.foo: ', proxy_succinct_reflect.foo);
console.log('target_bar.foo: ', target_bar.foo);

const proxy_true_passthrough = new Proxy(target_bar, Reflect);
console.log('proxy_succinct_reflect.foo: ', proxy_succinct_reflect.foo);  // bar
console.log('target_bar.foo: ', target_bar.foo); // bar

const target_bar_qux = {
   foo: 'bar',
   baz: 'qux'
};

const handler_decorate = {
    get(trapTarget, property, reciever) {
        let decoration = '';
        if (property === 'foo') {
            decoration = '!!!';
        }

        return Reflect.get(...arguments) + decoration;
    }
}

const proxy_decorated = new Proxy(target_bar_qux, handler_decorate);
console.log('proxy_decorated.foo: ', proxy_decorated.foo);
console.log('target_bar_qux.foo: ', target_bar_qux.foo);
console.log('proxy_decorated.baz: ', proxy_decorated.baz);
console.log('target_bar_qux.baz: ', target_bar_qux.baz);

// revocable proxies
//
// 

