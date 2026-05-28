const auth = require('basic-auth');

const user = auth(req);
if (!user || user.name !== 'admin' || user.pass !== '1234') {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send();
}

