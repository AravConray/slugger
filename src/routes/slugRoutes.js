const express = require('express');
const slugController = require('../controllers/slugController');

const router = express.Router();

router.post('/', slugController.generateSlug);
router.get('/:slug', slugController.getSlug);

module.exports = router;