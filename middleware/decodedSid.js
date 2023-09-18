const signature = require('cookie-signature');

function decodeSid(req, res, next) {
    const rawSid = req.cookies['connect.sid'];
    console.log('Raw SID:', rawSid);

    if (!rawSid) {
        return res.status(400).send('No session ID found.');
    }

    if (!rawSid.startsWith('s:')) {
        return res.status(400).send('Invalid session ID format.');
    }

    // Strip the signature and decode connect.sid
    const sid = rawSid.slice(2);
    const decodedSid = signature.unsign(sid, 'secret-key');



    if (decodedSid === false) {
        return res.status(400).send('Failed to decode session ID.');
    }

    req.decodedSid = decodedSid;
    next();
}

module.exports = {
    decodeSid
};