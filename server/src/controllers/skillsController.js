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

  /**
   * POST /api/skills/compare
   * Accepts two PDF files (cvA and cvB), extracts skills from both, and returns comparison.
   */
  async compare(req, res) {
    try {
      if (!req.files || !req.files.cvA || !req.files.cvB) {
        return res.status(400).json({ error: 'Both CV files (cvA and cvB) are required.' });
      }

      // Extract skills from both CVs
      const textA = await pdfService.extractText(req.files.cvA[0].buffer);
      const textB = await pdfService.extractText(req.files.cvB[0].buffer);
      
      const skillsA = skillsExtractor.extractSkills(textA);
      const skillsB = skillsExtractor.extractSkills(textB);

      // Create comparison result
      const comparison = this._compareSkills(skillsA, skillsB);

      return res.status(200).json(comparison);
    } catch (err) {
      console.error('Error comparing skills:', err);
      return res.status(500).json({ error: 'Failed to compare skills from PDFs.' });
    }
  }

  /**
   * Helper method to compare two skill arrays
   * @private
   */
  _compareSkills(skillsA, skillsB) {
    const skillLevels = {
      'Expert': 5,
      'Advanced': 4,
      'Proficient': 3,
      'Intermediate': 2,
      'Basic': 1,
      'Beginner': 1,
      'Familiar': 1
    };

    // Create maps for faster lookup
    const mapA = new Map(skillsA.map(s => [s.name, s]));
    const mapB = new Map(skillsB.map(s => [s.name, s]));

    // Get all unique skill names
    const allSkills = new Set([...mapA.keys(), ...mapB.keys()]);

    const comparisonResults = [];

    for (const skillName of allSkills) {
      const skillA = mapA.get(skillName);
      const skillB = mapB.get(skillName);

      const levelA = skillA ? (skillLevels[skillA.level] || 2) : 0;
      const levelB = skillB ? (skillLevels[skillB.level] || 2) : 0;

      let comparison;
      if (!skillA) {
        comparison = 'exclusive_b';
      } else if (!skillB) {
        comparison = 'exclusive_a';
      } else if (levelA > levelB) {
        comparison = 'stronger_a';
      } else if (levelB > levelA) {
        comparison = 'stronger_b';
      } else {
        comparison = 'equal';
      }

      comparisonResults.push({
        name: skillName,
        cvA: skillA ? { level: skillA.level, numericLevel: levelA } : null,
        cvB: skillB ? { level: skillB.level, numericLevel: levelB } : null,
        comparison,
        difference: Math.abs(levelA - levelB)
      });
    }

    return {
      skillsA,
      skillsB,
      comparison: comparisonResults
    };
  }
}

module.exports = new SkillsController();
