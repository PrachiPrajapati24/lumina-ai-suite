import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// ==========================================
// OpenRouter Initialization
// ==========================================

console.log(
  "OpenRouter API Key:",
  process.env.OPENROUTER_API_KEY ? "FOUND" : "MISSING"
);

// ==========================================
// OpenRouter Helper Function
// ==========================================

const generateOpenRouterResponse = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',

        messages: [
          {
            role: 'system',
            content:
              'You are a premium AI assistant inside Lumina AI Suite. Generate highly creative, engaging, polished, professional content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      'OpenRouter Error:',
      error.response?.data || error.message
    );

    return null;
  }
};

// ==========================================
// Generate Caption
// ==========================================

export const generateCaption = async (
  topic,
  platform,
  tone,
  keywords
) => {
  const promptText = `
Generate a highly engaging social media caption.

Platform: ${platform}
Topic: ${topic}
Tone: ${tone}
Keywords: ${keywords || 'none'}

Requirements:
- Make it creative and platform-specific.
- Add emotional hooks.
- Include emojis naturally.
- Include trending hashtags.
- Use proper formatting and spacing.
- Make it feel premium and human-written.
`;

  const aiResponse =
    await generateOpenRouterResponse(promptText);

  if (aiResponse) {
    return aiResponse;
  }

  return getMockCaption(
    topic,
    platform,
    tone,
    keywords
  );
};

// ==========================================
// Generate Blog
// ==========================================

export const generateBlog = async (
  title,
  keywords,
  audience,
  length
) => {
  const promptText = `
Write a professional SEO-optimized blog article.

Title: ${title}
Keywords: ${keywords || 'none'}
Audience: ${audience}
Length: ${length}

Requirements:
- Use markdown formatting.
- Include headings and subheadings.
- Make it highly engaging.
- Add practical insights.
- Write like a professional content writer.
`;

  const aiResponse =
    await generateOpenRouterResponse(promptText);

  if (aiResponse) {
    return aiResponse;
  }

  return getMockBlog(
    title,
    keywords,
    audience,
    length
  );
};

// ==========================================
// Generate Study Notes
// ==========================================

export const generateStudyNotes = async (
  subject,
  topicText,
  detailLevel
) => {
  const promptText = `
Create highly structured academic study notes.

Subject: ${subject}
Topic: ${topicText}
Detail Level: ${detailLevel}

Requirements:
- Use markdown formatting.
- Include summaries.
- Use bullet points.
- Include important concepts.
- Make notes clean and exam-friendly.
`;

  const aiResponse =
    await generateOpenRouterResponse(promptText);

  if (aiResponse) {
    return aiResponse;
  }

  return getMockStudyNotes(
    subject,
    topicText,
    detailLevel
  );
};

// ==========================================
// Mock Caption Fallback
// ==========================================

function getMockCaption(
  topic,
  platform,
  tone,
  keywords
) {
  return `
✨ AI Fallback Mode Activated

Your topic was:
${topic}

Tone:
${tone}

Platform:
${platform}

Keywords:
${keywords || 'none'}

This is a temporary fallback response because the AI provider is currently unavailable.
`;
}

// ==========================================
// Mock Blog Fallback
// ==========================================

function getMockBlog(
  title,
  keywords,
  audience,
  length
) {
  return `
# ${title}

This is a temporary fallback blog response.

Audience: ${audience}
Length: ${length}
Keywords: ${keywords}
`;
}

// ==========================================
// Mock Study Notes Fallback
// ==========================================

function getMockStudyNotes(
  subject,
  topicText,
  detailLevel
) {
  return `
# ${subject} Notes

Topic:
${topicText}

Detail Level:
${detailLevel}

This is a temporary fallback study note response.
`;
}