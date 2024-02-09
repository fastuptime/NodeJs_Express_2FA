const twofactor = require("node-2fa");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


let db = []
app.get('/', (req, res) => {
    if (!req.cookies.id) {
        res.send(`
        <form action="/create" method="post">
            <input type="text" name="account" placeholder="Account">
            <button type="submit">Create</button>
        </form>
        `)
    } else {
        const user = db.find(x => x.id == req.cookies.id);
        res.send(`
        <form action="/verify" method="post">
            <input type="text" name="token" placeholder="Token">
            <button type="submit">Verify</button>
        </form>
        `)
    }
});


app.post('/create', (req, res) => {
    id = Math.floor(Math.random() * 1000000);
    res.cookie('id', id);
    const secret = twofactor.generateSecret({ name: 'My Test APP', account: req.body.account });
    db.push({ name: req.body.name, account: req.body.account, secret: secret.secret, id: id });
    res.send(`<img src="${secret.qr}" />`);
});

app.post('/verify', (req, res) => {
    const user = db.find(x => x.id == req.cookies.id);
    const verified = twofactor.verifyToken(user.secret, req.body.token);
    if (verified) {
        res.send('Verified');
    } else {
        res.send('Not Verified');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});