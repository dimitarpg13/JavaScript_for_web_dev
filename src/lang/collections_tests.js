
// manipulation  methods
let colors = ["red", "green", "blue"];
let colors_concatenated = colors.concat("yellow", ["black", "brown"]);

console.log("\n--- manipulation methods ---\n")
console.log('colors =', colors);  // ["red", "green", "blue"]
console.log('colors_concatenated =' , colors_concatenated); // ["red", "green", "blue", "yellow", "black", "brown"]

// overriding the force-flattening default behavior by specifying a special symbol on the argument array instance
// Symbol.isConcatSpreadable

let newColors = ["black", "brown"];
let moreNewColors = {
    [Symbol.isConcatSpreadable]: true,
    length: 2,
    0: "pink",
    1: "cyan"
};

newColors[Symbol.isConcatSpreadable] = false;

// Force the aray to not be flattened
let colors_concatenated2 = colors.concat("yellow", newColors);

let colors_concatenated3 = colors.concat(moreNewColors);

console.log('colors_concatenated2 =', colors_concatenated2); // ["red", "green", "blue", "yellow", ["black", "brown"]]

console.log('colors_concatenated3 =', colors_concatenated3); // ["red", "green", "blue", "yellow", "black", "brown"]

colors = ["red", "green", "blue", "yellow", "purplse"];
let colors2 = colors.slice(1);
let colors3 = colors.slice(1, 4);

console.log('colors2 =', colors2);
console.log('colors3 =', colors3);

// splice examples


// search and location methods
let person = { name: "Nicholas"};
let people = [{ name: "Nicholas"}];
let morePeople = [person];

console.log("\n---- search and location methods ----\n");
console.log('people.indexOf(person) =', people.indexOf(person));      // -1
console.log(morePeople.indexOf(person));  // 0
console.log(people.includes(person));     // false
console.log(morePeople.includes(person)); // true

// predicate search
const people_pred_search = [
    {
       name: "Matt",
       age: 27
    },
    {
       name: "Nicholas",
       age: 29
    }
];


console.log("\n--- predicate search ---\n");

console.log("people.find: ", people_pred_search.find((element, index, array) => element.age < 28));
// {name: "Matt", age: 27}

console.log("people.findIndex: ", people_pred_search.findIndex((element, index, array) => element.age < 28));
// 0

 const evens = [2, 4, 6];

 console.log('evens.find =');
 // last element of array will never be inspected after match is found
 evens.find((element, index, array) => {
    console.log(element);
    console.log(index);
    console.log(array);
    return element === 4;
 })

 // 2
 // 0
 // [2, 4, 6]
 // 4
 // 1
 // [2, 4, 5]

 // iterative methods

 let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

 let everyResult = numbers.every((item, index, array) => item > 2);
 console.log('everyResult =', everyResult); // false

 let someResult = numbers.some((item, index, array) => item > 2);
 console.log('someResult =', someResult); // true

 let filterResult = numbers.filter((item, index, array) => item > 2);
 console.log('filterResult =', filterResult); // [3, 4, 5, 4, 3]

 let mapResult = numbers.map((item, index, array) => item * 2);

 console.log('mapResult =', mapResult); // [2, 4, 6, 8, 10, 8, 6, 4, 2]

 numbers.forEach((item, index, array) => {
    // do something here
    console.log('inside forEach: item =', item, 'index =', index, 'array =', array);
 });