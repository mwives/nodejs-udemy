const user = {
    name: 'ivonei',
    age: 19,
    gender: 'male'
};

// console.log(user.name);
// console.log(user.age);

/*
const {name:userName, age:userAge, hobby = 'study'} = user;

console.log(userName);
console.log(userAge);
console.log(hobby);
*/

const makeContact = (contactMethod, { name, gender }) => {
    console.log(contactMethod, name, gender);
}

makeContact('email', user);