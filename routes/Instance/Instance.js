const express = require('express');
const router = express.Router();
const { db } = require('../../handlers/db.js');
const { isUserAuthorizedForContainer } = require('../../utils/authHelper');

router.get("/instance/:id", async (req, res) => {
    if (!req.user) return res.redirect('/');

    const { id } = req.params;
    if (!id) return res.redirect('/');

    const instance = await db.get(id + '_instance');
    if (!instance) return res.redirect('../instances');

    const isAuthorized = await isUserAuthorizedForContainer(req.user.userId, instance.ContainerId);
    if (!isAuthorized) {
        return res.status(403).send('Unauthorized access to this instance.');
    }

    const config = require('../../config.json');
    const { port, domain } = config;

    res.render('instance/instance', { 
        req, 
        instance, 
        port, 
        domain, 
        user: req.user, 
        name: await db.get('name') || 'Skyport', 
        logo: await db.get('logo') || false 
    });
});

module.exports = router;