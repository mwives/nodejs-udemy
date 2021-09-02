const doWorkCallback = (callback) => {

    setTimeout(() => {
        // callback('Error!', undefined);
        callback(undefined, 'Response!');
    }, 500);
};

doWorkCallback((error, response) => {

    if (error) {
        return console.log(error);
    }

    console.log(response);
});