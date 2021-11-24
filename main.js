let today = new Date();
console.log(today.toJSON());

today.setDate(today.getDate()-30);

console.log(today.toJSON());