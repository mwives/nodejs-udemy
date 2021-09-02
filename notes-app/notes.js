const
    chalk = require('chalk'),
    fs = require('fs');

const
    greenMsg = chalk.bold.green.inverse,
    redMsg = chalk.bold.red.inverse,
    blueMsg = chalk.bold.blue.inverse,
    cyanMsg = chalk.bold.cyan.inverse;

const addNote = (title, body) => {
    const
        notes = loadNotes(),
        takenTitle = notes.find(note => note.title === title);

    if (!takenTitle) {

        notes.push({
            title: title,
            body: body
        });

        saveNote(notes);
        console.log(greenMsg('Note added!'));
    } else {
        console.log(redMsg('Title already taken. Please try another one.'));
    }
};

const removeNote = (title) => {
    const
        notes = loadNotes(),
        notesToKeep = notes.filter(note => note.title !== title);

    if (notes.length !== notesToKeep.length) {
        saveNote(notesToKeep);
        console.log(greenMsg(`Note '${title} deleted.`));
    } else {
        console.log(redMsg(`Any note found with the given title.`));
    }

};

const listNotes = () => {
    const notes = loadNotes();

    if (notes.length !== 0) {
        console.log(blueMsg('--- Your notes ---'));
        notes.forEach(note => console.log(cyanMsg(`- ${note.title} `)));
    } else {
        console.log(redMsg('There is no notes to be displayed.'));
    }
};

const readNote = (title) => {
    const
        notes = loadNotes(),
        noteIndex = notes.findIndex(note => note.title === title);

    if (noteIndex >= 0) {
        console.log(blueMsg(`-- Reading '${notes[noteIndex].title}' --`));
        console.log(cyanMsg(`- ${notes[noteIndex].body} `));
    } else {
        console.log(redMsg(`Any note with the title '${title}' found.`));
    }
}

const saveNote = (notes) => {
    const notesJSON = JSON.stringify(notes);

    fs.writeFileSync('notes.json', notesJSON);
};

const loadNotes = () => {
    try {
        const
            dataBuffer = fs.readFileSync('notes.json');
            dataJSON = dataBuffer.toString();

        return JSON.parse(dataJSON);
    } catch (error) {
        return [];
    }
};

module.exports = {
    add: addNote,
    remove: removeNote,
    list: listNotes,
    read: readNote
};