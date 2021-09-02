const
    express = require('express'),
    User = require('../models/user'),
    auth = require('../middleware/auth'),
    { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account'),
    multer = require('multer'),
    Jimp = require('jimp');
const { MIME_PNG } = require('jimp');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();

        sendWelcomeEmail('ivo', 'ivesmw@gmail.com');

        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const
        updates = Object.keys(req.body),
        allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates.' });

    try {
        const user = req.user;

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.delete();
        sendCancelationEmail(req.user.name, req.user.email);
        res.send(req.user);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be jpg, jpeg or png'));
        }

        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const avatar = await Jimp.read(req.file.buffer);
    avatar.cover(250, 250);

    const avatarBuffer = await avatar.getBufferAsync(Jimp.MIME_PNG);

    req.user.avatar = avatarBuffer;

    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (err) {
        res.status(204).send();
    }
});

module.exports = router;