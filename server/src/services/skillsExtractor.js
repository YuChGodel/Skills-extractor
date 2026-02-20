const { SKILLS_LIST, LEVEL_KEYWORDS } = require('../config/skillsList');

/**
 * SkillsExtractorService analyzes text and identifies developer skills.
 * Single Responsibility: only handles skills identification from text.
 */
class SkillsExtractorService {
  /**
   * Determine the proficiency level for a skill based on surrounding text context.
   * Falls back to 'Intermediate' if no level keyword is found near the skill.
   * @param {string} text - Full CV text.
   * @param {string} keyword - The skill keyword to look up.
   * @returns {string} - The inferred skill level.
   */
  _inferLevel(text, keyword) {
    // Try progressively wider windows: same line first, then 50 chars, then 150 chars
    const lowerText = text.toLowerCase();
    const lines = text.split('\n');
    const lowerKeyword = keyword.toLowerCase();

    // 1. Check same line first (most precise)
    for (const line of lines) {
      if (line.toLowerCase().includes(lowerKeyword)) {
        for (const { pattern, level } of LEVEL_KEYWORDS) {
          if (pattern.test(line)) {
            return level;
          }
        }
      }
    }

    // 2. Fall back to a wider character window (captures multi-line context)
    let pos = lowerText.indexOf(lowerKeyword);
    while (pos !== -1) {
      const snippet = text.substring(Math.max(0, pos - 80), pos + keyword.length + 80);
      for (const { pattern, level } of LEVEL_KEYWORDS) {
        if (pattern.test(snippet)) {
          return level;
        }
      }
      pos = lowerText.indexOf(lowerKeyword, pos + 1);
    }

    return 'Intermediate';
  }

  /**
   * Extract skills from the provided CV text.
   * @param {string} text - The raw CV text.
   * @returns {{ name: string, level: string }[]} - Array of unique skill objects.
   */
  extractSkills(text) {
    const lowerText = ` ${text.toLowerCase()} `;
    const found = new Map();

    for (const { keyword, name } of SKILLS_LIST) {
      if (found.has(name)) {
        continue;
      }

      // Use word-boundary matching for short/common keywords to avoid false positives
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?<![\\w.])${escaped}(?![\\w.])`, 'i');

      if (pattern.test(lowerText)) {
        const level = this._inferLevel(text, keyword);
        found.set(name, { name, level });
      }
    }

    return Array.from(found.values());
  }
}

module.exports = new SkillsExtractorService();
