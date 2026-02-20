const fs = require('fs');
const path = require('path');
const pdfService = require('../services/pdfService');
const skillsExtractor = require('../services/skillsExtractor');

const SKILLS_FILE = path.join(__dirname, '../../data/skills.json');

/**
 * SkillsController handles HTTP requests for skill extraction and retrieval.
 * Single Responsibility: orchestrates request handling and delegates to services.
 */
class SkillsController {
  /**
   * POST /api/skills/extract
   * Accepts a PDF file upload, extracts skills, saves and returns the result.
   */
  async extract(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded.' });
      }

      const text = await pdfService.extractText(req.file.buffer);
      const skills = skillsExtractor.extractSkills(text);
      const result = { skills };

      fs.writeFileSync(SKILLS_FILE, JSON.stringify(result, null, 2), 'utf8');

      return res.status(200).json(result);
    } catch (err) {
      console.error('Error extracting skills:', err);
      return res.status(500).json({ error: 'Failed to extract skills from PDF.' });
    }
  }

  /**
   * GET /api/skills
   * Returns the last saved skills JSON file.
   */
  getSkills(req, res) {
    try {
      if (!fs.existsSync(SKILLS_FILE)) {
        return res.status(200).json({ skills: [] });
      }
      const data = JSON.parse(fs.readFileSync(SKILLS_FILE, 'utf8'));
      return res.status(200).json(data);
    } catch (err) {
      console.error('Error reading skills file:', err);
      return res.status(500).json({ error: 'Failed to read skills data.' });
    }
  }
}

module.exports = new SkillsController();
