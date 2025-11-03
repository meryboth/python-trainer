import { GoogleGenAI, Type } from "@google/genai";
import { Level, Question } from '../types';
import { LEVELS } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The question text, which may include a Python code block using markdown.",
    },
    options: {
      type: Type.ARRAY,
      description: "An array of four possible answers as strings.",
      items: { type: Type.STRING },
    },
    answer: {
      type: Type.STRING,
      description: "The correct answer, which must be one of the provided options.",
    },
    explanation: {
      type: Type.STRING,
      description: "A clear and concise explanation for why the answer is correct.",
    },
  },
  required: ["question", "options", "answer", "explanation"],
};


export const generatePythonQuestion = async (level: Level, seenQuestions: string[]): Promise<Question> => {
  const levelInfo = LEVELS[level];
  const seenQuestionsPrompt = seenQuestions.length > 0
    ? `Avoid creating questions similar to these: ${seenQuestions.slice(-10).join('; ')}`
    : '';

  const prompt = `
    You are an expert Python interviewer. Your task is to generate one high-quality, multiple-choice technical interview question about Python.

    - **Difficulty Level:** The question should be suitable for a developer at the "${levelInfo.name}" level.
    - **Topic:** The question should cover ${levelInfo.description}.
    - **Uniqueness:** The question must be original and challenging. ${seenQuestionsPrompt}
    - **Format:** The response must be a valid JSON object adhering to the provided schema. The question can include a markdown code block if needed. Ensure all options and the answer are strings.

    Generate the question now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 1, // Higher temperature for more creative/varied questions
      },
    });

    const jsonString = response.text.trim();
    const parsedQuestion = JSON.parse(jsonString) as Question;

    // Basic validation
    if (
      !parsedQuestion.question ||
      !Array.isArray(parsedQuestion.options) ||
      parsedQuestion.options.length !== 4 ||
      !parsedQuestion.answer ||
      !parsedQuestion.options.includes(parsedQuestion.answer) ||
      !parsedQuestion.explanation
    ) {
      throw new Error("Generated question has an invalid format.");
    }

    return parsedQuestion;
  } catch (error) {
    console.error("Error generating question from Gemini API:", error);
    throw new Error("Failed to generate a new question. Please try again.");
  }
};

export const generateLevelSummary = async (questions: Question[]): Promise<string> => {
    const questionDetails = questions.map(q => 
        `- Question: ${q.question.replace(/```python[\s\S]*?```/, '(code block)')}\n- Explanation: ${q.explanation}`
    ).join('\n\n');

    const prompt = `
        Based on the following set of Python questions and their explanations that a user just answered, generate a concise and encouraging summary in Markdown format.

        The summary should:
        1.  Start with a positive, congratulatory message.
        2.  Briefly highlight the key concepts and topics the user has just practiced.
        3.  Be formatted cleanly using Markdown (e.g., headings, bullet points, code snippets with backticks).
        4.  End with an encouraging note about moving to the next level.

        Here are the questions and explanations:
        ${questionDetails}

        Generate the summary now.
    `;

    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating level summary from Gemini API:", error);
        throw new Error("Failed to generate a level summary.");
    }
};
