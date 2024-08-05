
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



