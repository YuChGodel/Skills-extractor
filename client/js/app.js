/**
 * app.js – Vue.js 3 application for the Skills Extractor client.
 * Handles file selection, upload, skill extraction request and result display.
 */

const API_BASE_URL = 'http://localhost:3000/api';

const { createApp } = Vue;

createApp({
  data() {
    return {
      /** @type {File|null} The selected PDF file */
      selectedFile: null,
      /** @type {{ name: string, level: string }[]} Extracted skills */
      skills: [],
      /** @type {boolean} Whether a request is in progress */
      isLoading: false,
      /** @type {string} Error message to display */
      errorMessage: '',
      /** @type {boolean} Whether the RUN action has been executed at least once */
      hasRun: false,
      /** @type {boolean} Whether the user is dragging a file over the drop zone */
      isDragging: false,
    };
  },

  methods: {
    /**
     * Handle file selection via the file input element.
     * @param {Event} event
     */
    onFileChange(event) {
      const file = event.target.files[0];
      this._setFile(file);
    },

    /**
     * Handle file dropped onto the drop zone.
     * @param {DragEvent} event
     */
    onDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      this._setFile(file);
    },

    /**
     * Validate and set the selected file.
     * @param {File} file
     */
    _setFile(file) {
      this.errorMessage = '';
      if (!file) return;
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Please select a PDF file.';
        return;
      }
      this.selectedFile = file;
      this.skills = [];
      this.hasRun = false;
    },

    /**
     * Send the selected PDF to the server and display extracted skills.
     */
    async run() {
      if (!this.selectedFile || this.isLoading) return;

      this.isLoading = true;
      this.errorMessage = '';
      this.skills = [];

      try {
        const formData = new FormData();
        formData.append('cv', this.selectedFile);

        const response = await fetch(`${API_BASE_URL}/skills/extract`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unexpected server error.');
        }

        this.skills = data.skills || [];
        this.hasRun = true;
      } catch (err) {
        this.errorMessage = err.message || 'Failed to connect to the server.';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Reset the form to its initial state.
     */
    reset() {
      this.selectedFile = null;
      this.skills = [];
      this.errorMessage = '';
      this.hasRun = false;
      this.$refs.fileInput.value = '';
    },

    /**
     * Format file size in human-readable format.
     * @param {number} bytes
     * @returns {string}
     */
    formatFileSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    },
  },
}).mount('#app');
