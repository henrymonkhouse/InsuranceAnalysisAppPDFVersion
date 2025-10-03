const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class BookletAPI {
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }
    return response.json();
  }

  // Get all booklets
  async getAllBooklets() {
    const response = await fetch(`${API_BASE_URL}/booklets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  // Get a single booklet
  async getBooklet(id) {
    const response = await fetch(`${API_BASE_URL}/booklets/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  // Create a new booklet
  async createBooklet(data) {
    const response = await fetch(`${API_BASE_URL}/booklets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Update a booklet
  async updateBooklet(id, data) {
    const response = await fetch(`${API_BASE_URL}/booklets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Delete a booklet
  async deleteBooklet(id) {
    const response = await fetch(`${API_BASE_URL}/booklets/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }
  }

  // Duplicate a booklet
  async duplicateBooklet(id, name) {
    const response = await fetch(`${API_BASE_URL}/booklets/${id}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return this.handleResponse(response);
  }

  // Update tab data for a booklet
  async updateTabData(bookletId, tabId, data) {
    const response = await fetch(`${API_BASE_URL}/booklets/${bookletId}/tabs/${tabId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

export default new BookletAPI();