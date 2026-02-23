const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const pdfService = require('../services/pdfService');
const skillsExtractor = require('../services/skillsExtractor');
const reportService = require('../services/reportService');

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

  /**
   * GET /api/skills/download
   * Returns the last saved skills as a ZIP archive containing JSON + HTML files.
   */
  download(req, res) {
    if (!fs.existsSync(SKILLS_FILE)) {
      return res.status(404).json({ error: 'No processed CV found.' });
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(SKILLS_FILE, 'utf8'));
    } catch (_) {
      return res.status(500).json({ error: 'Failed to read skills data.' });
    }

    const skills = Array.isArray(data.skills) ? data.skills : [];

    let jsonContent, htmlContent;
    try {
      jsonContent = reportService.generateJson(skills);
      htmlContent = reportService.generateHtml(skills);
    } catch (err) {
      console.error('Error generating report content:', err);
      return res.status(500).json({ error: 'Failed to generate report.' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="skills-report.zip"');

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      // Headers already sent; end the response to signal the stream is done
      res.end();
    });

    archive.pipe(res);
    archive.append(jsonContent, { name: 'skills.json' });
    archive.append(htmlContent, { name: 'skills-report.html' });
    archive.finalize();
  }
}

module.exports = new SkillsController();
