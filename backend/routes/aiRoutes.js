const express = require('express');
const router = express.Router();
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-resume', async (req, res) => {
  // Destructure with default fallback values
  const {
    jobRole = '',
    jobDescription = '',
    requiredSkills = [],
    userInfo = {}
  } = req.body;

  // Basic validation
  if (!jobRole || !jobDescription || requiredSkills.length === 0 || !userInfo.name) {
    return res.status(400).json({ error: 'Missing required fields in request body.' });
  }

  const prompt = `
              You are an expert professional resume writer.
              Generate a modern, ATS-friendly resume in clean text format based on the following user details.
              Use clear section headings in ALL CAPS and keep formatting consistent.
              Do not use Markdown formatting, bullet emojis, or decorative symbols other than plain text bullets (•).
              Align everything properly so the resume looks professional and ready for copy-paste into a document.

              Formatting rules:
              - Use plain text only (no Markdown, HTML, or special formatting).
              - Use "•" (U+2022 bullet character) followed by one space for all bullet points.
              - Do not use "*" or "-" for bullet points.
              - Escape all newlines as \\n in the resumeContent string.

              Sections to include in this order:
              1. Full Name and Contact Info (single line with phone, email, location in center of page)
              2. Professional Summary (3–4 concise sentences highlighting experience, skills, and achievements)
              3. Education (degree, university, graduation year)
              4. Skills (list of relevant technical and soft skills)
              5. Work Experience (company, role, dates, responsibilities in bullet points)
              6. Projects (project name, brief description, key technologies used)
              7. Certifications (certification name, issuing organization, year)
              8. Achievements (short bullet points of key recognitions or awards)

              Here are the user details to base the resume on:
              - Job Role: ${jobRole}
              - Job Description: ${jobDescription}
              - Required Skills: ${requiredSkills.join(', ')}
              - Candidate Info: ${JSON.stringify(userInfo)}

              Return ONLY a JSON object in the following format:
              {
                "resumeContent": "formatted resume string with \\n for newlines",
                "suggestedProjects": [
                  { "title": "Project Name", "description": "Brief description" },
                  { "title": "Project Name", "description": "Brief description" }
                ],
                "certifications": [
                  { "name": "Certification Name", "description": "Issuing Organization, Year" },
                  { "name": "Certification Name", "description": "Issuing Organization, Year" }
                ]
              }
      `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON only if present
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Could not parse Gemini JSON response');
    }

    const jsonString = text.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);

    res.json(parsed);
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Failed to generate resume. Please try again later.' });
  }
});

module.exports = router;
