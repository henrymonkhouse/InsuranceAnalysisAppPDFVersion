const express = require('express');
const router = express.Router();
const bookletController = require('../../controllers/booklet/bookletController');

// Booklet routes
router.get('/', bookletController.getAllBooklets);
router.get('/:id', bookletController.getBooklet);
router.post('/', bookletController.createBooklet);
router.put('/:id', bookletController.updateBooklet);
router.delete('/:id', bookletController.deleteBooklet);
router.post('/:id/duplicate', bookletController.duplicateBooklet);

// Tab-specific data route
router.put('/:id/tabs/:tabId', bookletController.updateTabData);

module.exports = router;