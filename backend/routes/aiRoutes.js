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
You are an expert resume writer. Create a professional, ATS-friendly resume using the following candidate and job information.

**Formatting Guidelines:**
- Use clear section headings in **bold**
- Use bullet points for experience, skills where appropriate
- Avoid unnecessary filler
- Keep it concise, impactful, and job-specific

**Job Details:**
- Job Role: ${jobRole}
- Job Description: ${jobDescription}
- Required Skills: ${requiredSkills.join(', ')}

**Candidate Info:**
${JSON.stringify(userInfo)}

**Return JSON with:**
{
  "resumeContent": "formatted resume string (use \\n for line breaks)",
  "suggestedProjects": [ { "title": "...", "description": "..." }, ... ],(array of 2)
  "certifications": [ { "name": "...", "description": "..." }, ... ],(array of 2)
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
