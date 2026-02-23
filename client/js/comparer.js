/**
 * comparer.js – Vue.js 3 application for the Skills Comparer page.
 * Handles dual file upload, comparison request and result visualization.
 */

const API_BASE_URL = 'http://localhost:3000/api';

const { createApp } = Vue;

createApp({
  data() {
    return {
      /** @type {File|null} The selected PDF file for CV A */
      fileA: null,
      /** @type {File|null} The selected PDF file for CV B */
      fileB: null,
      /** @type {boolean} Whether a request is in progress */
      isLoading: false,
      /** @type {string} Error message to display */
      errorMessage: '',
      /** @type {boolean} Whether a comparison has been executed */
      hasCompared: false,
      /** @type {boolean} Whether the user is dragging a file over drop zone A */
      isDraggingA: false,
      /** @type {boolean} Whether the user is dragging a file over drop zone B */
      isDraggingB: false,
      /** @type {Array} Raw comparison results from API */
      comparisonResults: [],
      /** @type {string} Current sort option */
      sortBy: 'difference',
      /** @type {string} Current filter option */
      filterBy: 'all',
    };
  },

  computed: {
    /**
     * Check if both files are selected
     */
    canCompare() {
      return this.fileA && this.fileB;
    },

    /**
     * Apply filtering and sorting to comparison results
     */
    filteredAndSortedResults() {
      let results = [...this.comparisonResults];

      // Apply filtering
      if (this.filterBy === 'differences') {
        results = results.filter(item => item.comparison !== 'equal');
      } else if (this.filterBy === 'exclusive') {
        results = results.filter(item => 
          item.comparison === 'exclusive_a' || item.comparison === 'exclusive_b'
        );
      }

      // Apply sorting
      if (this.sortBy === 'difference') {
        results.sort((a, b) => b.difference - a.difference);
      } else if (this.sortBy === 'alphabetical') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      }

      return results;
    }
  },

  methods: {
    /**
     * Handle file selection for CV A
     * @param {Event} event
     */
    onFileChangeA(event) {
      const file = event.target.files[0];
      this._setFileA(file);
    },

    /**
     * Handle file dropped for CV A
     * @param {DragEvent} event
     */
    onDropA(event) {
      this.isDraggingA = false;
      const file = event.dataTransfer.files[0];
      this._setFileA(file);
    },

    /**
     * Handle file selection for CV B
     * @param {Event} event
     */
    onFileChangeB(event) {
      const file = event.target.files[0];
      this._setFileB(file);
    },

    /**
     * Handle file dropped for CV B
     * @param {DragEvent} event
     */
    onDropB(event) {
      this.isDraggingB = false;
      const file = event.dataTransfer.files[0];
      this._setFileB(file);
    },

    /**
     * Validate and set file A
     * @param {File} file
     */
    _setFileA(file) {
      this.errorMessage = '';
      if (!file) return;
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Please select PDF files only.';
        return;
      }
      this.fileA = file;
      this.comparisonResults = [];
      this.hasCompared = false;
    },

    /**
     * Validate and set file B
     * @param {File} file
     */
    _setFileB(file) {
      this.errorMessage = '';
      if (!file) return;
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Please select PDF files only.';
        return;
      }
      this.fileB = file;
      this.comparisonResults = [];
      this.hasCompared = false;
    },

    /**
     * Send both PDFs to the server and display comparison results
     */
    async compare() {
      if (!this.canCompare || this.isLoading) return;

      this.isLoading = true;
      this.errorMessage = '';
      this.comparisonResults = [];

      try {
        const formData = new FormData();
        formData.append('cvA', this.fileA);
        formData.append('cvB', this.fileB);

        const response = await fetch(`${API_BASE_URL}/skills/compare`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unexpected server error.');
        }

        this.comparisonResults = data.comparison || [];
        this.hasCompared = true;
      } catch (err) {
        this.errorMessage = err.message || 'Failed to connect to the server.';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Reset the form to its initial state
     */
    reset() {
      this.fileA = null;
      this.fileB = null;
      this.comparisonResults = [];
      this.errorMessage = '';
      this.hasCompared = false;
      this.sortBy = 'difference';
      this.filterBy = 'all';
      this.$refs.fileInputA.value = '';
      this.$refs.fileInputB.value = '';
    },

    /**
     * Format file size in human-readable format
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
