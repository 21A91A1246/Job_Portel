const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const extractSkillsFromJD = async (jobRole, jobDescription) => {
  const prompt = `Extract 5-10 relevant technical and soft skills from the following job role and description:\n\nJob Role: ${jobRole}\n\nDescription: ${jobDescription}\n\nRespond with a JSON array of skill names.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const response = completion.choices[0].message.content;
    const skills = JSON.parse(response);
    return skills;
  } catch (err) {
    console.error('Error extracting skills:', err.message);
    return [];
  }
};

module.exports = extractSkillsFromJD;
