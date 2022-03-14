const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/SiteControllers');



router.post('/login', sitecontroller.login);
router.get('/', sitecontroller.index);

module.exports = router;
