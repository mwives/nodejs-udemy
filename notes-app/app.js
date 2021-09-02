const { describe } = require('yargs');
const
    yargs = require('yargs'),
    notes = require('./notes');

// 'add' command
yargs.command({
    command: 'add',
    aliases: 'a',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            alias: 't',
            type: 'string',
            demandOption: true
        },
        body: {
            describe: 'Note body',
            alias: 'b',
            type: 'string',
            demandOption: true
        }
    },
    handler(argv) {
        notes.add(argv.title, argv.body);
    }
});

// 'remove' command
yargs.command({
    command: 'remove',
    aliases: ['rm', 'r'],
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'Title of the note to be removed',
            alias: 't',
            type: 'string',
            demandOption: true
        }
    },
    handler(argv) {
        notes.remove(argv.title);
    }
});

// 'list' command
yargs.command({
    command: 'list',
    aliases: ['ls', 'l'],
    describe: 'List all the notes',
    handler() {
        notes.list();
    }
});

// 'read' commmand
yargs.command({
    command: 'read',
    aliases: ['rd', 'r'],
    describe: 'Read a note',
    builder: {
        title: {
            alias: 't',
            describe: 'Note title',
            type: 'string',
            demandOption: true
        }
    },
    handler(argv) {
        notes.read(argv.title);
    }
});

yargs.parse();