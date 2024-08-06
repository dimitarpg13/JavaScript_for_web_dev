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

const target = {
    id: 'target'
};

const handler_empty = {};

const proxy = new Proxy(target, handler_empty);

// The 'id' property will access the same value
console.log('target.id: ', target.id);  // target
console.log('proxy.id: ', proxy.id);   // target

// Assignment to a target property changes both since
// both are accessing the same value.
target.id = 'foo';
console.log('target.id: ', target.id); // foo
console.log('proxy.id: ', proxy.id);  // foo

// assignment to a proxy property changes both since 
// this assignment is conferred to the target object.
proxy.id = 'bar';
console.log('target.id: ', target.id);  // bar
console.log('proxy.id: ', proxy.id); // bar

// the hasOwnProperty() method is effectively applied
// to the target in both cases.
console.log("target.hasOwnProperty('id'): ",target.hasOwnProperty('id'));  // true
console.log("proxy.hasOwnProperty('id'): ", proxy.hasOwnProperty('id')); // true

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
console.log("target === proxy: ", target === proxy);

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
        console.log('trapTarget === target', trapTarget === target);
        console.log('property: ', property);
        console.log('receiver === proxy: ', receiver === proxy);
    }
}

const proxy_with_lookup = new Proxy(target_bar, handler_with_lookup);

console.log('proxy_with_lookup.foo: ', proxy_with_lookup.foo);
