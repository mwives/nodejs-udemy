const fs = require('fs');

/*
const book = {
    title: 'Sapiens',
    author: 'Yuval Noah Harari'
}

const bookJSON = JSON.stringify(book);
fs.writeFileSync('1-json.json', bookJSON);
*/
/*
const dataBuffer = fs.readFileSync('./1-json.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);

console.log(data);
*/

const
    dataBuffer = fs.readFileSync('1-json.json'),
    dataJSON = dataBuffer.toString(),
    user = JSON.parse(dataJSON);

user.name = 'Ivonei';
user.age = 18;

const userJSON = JSON.stringify(data);
fs.writeFileSync('1-json.json', userJSON);