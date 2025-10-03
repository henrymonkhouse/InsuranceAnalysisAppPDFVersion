const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class BookletStorageService {
  constructor() {
    // Store booklets in user data directory when in Electron
    this.bookletDir = process.env.ELECTRON_MODE === 'true' 
      ? path.join(process.env.APPDATA || process.env.HOME, 'insurance-data-app', 'booklets')
      : path.join(__dirname, '../../data/booklets');
  }

  async ensureDirectoryExists() {
    try {
      await fs.mkdir(this.bookletDir, { recursive: true });
    } catch (error) {
      console.error('Error creating booklet directory:', error);
      throw error;
    }
  }

  async getAllBooklets() {
    await this.ensureDirectoryExists();
    
    try {
      const files = await fs.readdir(this.bookletDir);
      const booklets = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(this.bookletDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            const booklet = JSON.parse(content);
            
            // Calculate completion percentage
            const selectedTabsCount = booklet.metadata.selectedTabs.length;
            const completedTabsCount = Object.values(booklet.metadata.completionStatus).filter(Boolean).length;
            const completionPercentage = selectedTabsCount > 0 
              ? Math.round((completedTabsCount / selectedTabsCount) * 100)
              : 0;

            booklets.push({
              id: booklet.metadata.id,
              name: booklet.metadata.name,
              description: booklet.metadata.description,
              updatedAt: booklet.metadata.updatedAt,
              completionPercentage
            });
          } catch (error) {
            console.error(`Error reading booklet file ${file}:`, error);
          }
        }
      }

      // Sort by most recently updated
      return booklets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('Error getting all booklets:', error);
      return [];
    }
  }

  async getBooklet(id) {
    try {
      const filePath = path.join(this.bookletDir, `${id}.json`);
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('Booklet not found');
      }
      throw error;
    }
  }

  async createBooklet(data) {
    await this.ensureDirectoryExists();

    const id = uuidv4();
    const now = new Date().toISOString();
    
    const booklet = {
      metadata: {
        id,
        name: data.name,
        description: data.description || '',
        createdAt: now,
        updatedAt: now,
        completionStatus: {},
        selectedTabs: data.selectedTabs || []
      },
      data: data.data || {
        sharedDetails: {
          organizationName: '',
          effectiveDate: ''
        },
        tabs: {}
      }
    };

    // Initialize completion status for selected tabs
    data.selectedTabs?.forEach(tabId => {
      booklet.metadata.completionStatus[tabId] = false;
    });

    const filePath = path.join(this.bookletDir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(booklet, null, 2));

    return booklet;
  }

  async updateBooklet(id, updates) {
    const booklet = await this.getBooklet(id);
    
    // Update metadata
    if (updates.name !== undefined) booklet.metadata.name = updates.name;
    if (updates.description !== undefined) booklet.metadata.description = updates.description;
    if (updates.selectedTabs !== undefined) {
      booklet.metadata.selectedTabs = updates.selectedTabs;
      
      // Update completion status for new tabs
      updates.selectedTabs.forEach(tabId => {
        if (!(tabId in booklet.metadata.completionStatus)) {
          booklet.metadata.completionStatus[tabId] = false;
        }
      });
      
      // Remove completion status for deselected tabs
      Object.keys(booklet.metadata.completionStatus).forEach(tabId => {
        if (!updates.selectedTabs.includes(tabId)) {
          delete booklet.metadata.completionStatus[tabId];
        }
      });
    }
    
    // Update data
    if (updates.data) {
      booklet.data = { ...booklet.data, ...updates.data };
      
      // Update completion status based on data
      if (updates.data.tabs) {
        Object.keys(updates.data.tabs).forEach(tabId => {
          const tabData = updates.data.tabs[tabId];
          // Consider a tab complete if it has any non-empty data
          const hasData = tabData && Object.values(tabData).some(value => 
            value !== null && value !== undefined && value !== ''
          );
          if (tabId in booklet.metadata.completionStatus) {
            booklet.metadata.completionStatus[tabId] = hasData;
          }
        });
      }
    }
    
    booklet.metadata.updatedAt = new Date().toISOString();

    const filePath = path.join(this.bookletDir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(booklet, null, 2));

    return booklet;
  }

  async deleteBooklet(id) {
    try {
      const filePath = path.join(this.bookletDir, `${id}.json`);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('Booklet not found');
      }
      throw error;
    }
  }

  async duplicateBooklet(id, newName) {
    const originalBooklet = await this.getBooklet(id);
    
    const duplicatedData = {
      name: newName || `${originalBooklet.metadata.name} (Copy)`,
      description: originalBooklet.metadata.description,
      selectedTabs: originalBooklet.metadata.selectedTabs,
      data: JSON.parse(JSON.stringify(originalBooklet.data)) // Deep clone
    };

    return await this.createBooklet(duplicatedData);
  }

  // Get the directory where booklets are stored
  getBookletDirectory() {
    return this.bookletDir;
  }
}

module.exports = new BookletStorageService();