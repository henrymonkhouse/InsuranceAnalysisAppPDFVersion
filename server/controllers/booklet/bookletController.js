const bookletStorageService = require('../../services/booklet/bookletStorageService');

class BookletController {
  // Get all booklets
  async getAllBooklets(req, res, next) {
    try {
      const booklets = await bookletStorageService.getAllBooklets();
      res.json(booklets);
    } catch (error) {
      next(error);
    }
  }

  // Get a single booklet
  async getBooklet(req, res, next) {
    try {
      const { id } = req.params;
      const booklet = await bookletStorageService.getBooklet(id);
      res.json(booklet);
    } catch (error) {
      if (error.message === 'Booklet not found') {
        res.status(404).json({ error: 'Booklet not found' });
      } else {
        next(error);
      }
    }
  }

  // Create a new booklet
  async createBooklet(req, res, next) {
    try {
      const booklet = await bookletStorageService.createBooklet(req.body);
      res.status(201).json(booklet);
    } catch (error) {
      next(error);
    }
  }

  // Update a booklet
  async updateBooklet(req, res, next) {
    try {
      const { id } = req.params;
      const booklet = await bookletStorageService.updateBooklet(id, req.body);
      res.json(booklet);
    } catch (error) {
      if (error.message === 'Booklet not found') {
        res.status(404).json({ error: 'Booklet not found' });
      } else {
        next(error);
      }
    }
  }

  // Delete a booklet
  async deleteBooklet(req, res, next) {
    try {
      const { id } = req.params;
      await bookletStorageService.deleteBooklet(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Booklet not found') {
        res.status(404).json({ error: 'Booklet not found' });
      } else {
        next(error);
      }
    }
  }

  // Duplicate a booklet
  async duplicateBooklet(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const booklet = await bookletStorageService.duplicateBooklet(id, name);
      res.status(201).json(booklet);
    } catch (error) {
      if (error.message === 'Booklet not found') {
        res.status(404).json({ error: 'Booklet not found' });
      } else {
        next(error);
      }
    }
  }

  // Update specific tab data
  async updateTabData(req, res, next) {
    try {
      const { id, tabId } = req.params;
      const tabData = req.body;

      // Get current booklet
      const booklet = await bookletStorageService.getBooklet(id);
      
      // Update the specific tab data
      if (!booklet.data.tabs) {
        booklet.data.tabs = {};
      }
      booklet.data.tabs[tabId] = tabData;

      // Update shared details if provided
      if (tabData.organizationName || tabData.effectiveDate) {
        booklet.data.sharedDetails = {
          organizationName: tabData.organizationName || booklet.data.sharedDetails.organizationName,
          effectiveDate: tabData.effectiveDate || booklet.data.sharedDetails.effectiveDate
        };
      }

      // Save the updated booklet
      const updatedBooklet = await bookletStorageService.updateBooklet(id, {
        data: booklet.data
      });

      res.json(updatedBooklet);
    } catch (error) {
      if (error.message === 'Booklet not found') {
        res.status(404).json({ error: 'Booklet not found' });
      } else {
        next(error);
      }
    }
  }
}

module.exports = new BookletController();