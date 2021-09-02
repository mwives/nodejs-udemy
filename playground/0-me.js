const bestBand = (band) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (band.toLowerCase() === 'queen') {
                resolve({
                    success: true,
                    bandName: 'Queen',
                    msg: `You're goddamn right!`
                });
            } else {
                reject({
                    success: false,
                    msg: `Wrong! Queen is the best band!`
                });
            }
        }, 1000);
    });
};

const bestSong = (response) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (response.success) {
                resolve(`Bohemian Rhapsody by ${response.bandName}.`);
            } else {
                reject('Do you know Queen?');
            }
        }, 1000);
    });
};

// bestBand('Queen')
//     .then((response) => {
//         console.log(response.msg);
//         return bestSong(response);
//     }).then((response) => {
//         console.log(response);
//     }).catch((err) => console.log(err));

const doWork = async (band) => {
    const bestBandResponse = await bestBand(band);
    console.log(bestBandResponse.msg);

    const bestSongResponse = await bestSong(bestBandResponse);
    console.log(bestSongResponse);
};

doWork('Queen');