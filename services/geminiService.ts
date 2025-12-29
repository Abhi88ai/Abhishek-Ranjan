
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, IssuePriority } from "../types";

// Always use the recommended initialization pattern for GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeIssue = async (
  description: string,
  imageData?: string // base64
): Promise<AIAnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  const contents: any[] = [{ text: `Analyze this civic issue report. If an image is provided, use it to verify the details. If only text is provided, analyze the text description.
  
  Report Description: "${description}"` }];

  if (imageData) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1] || imageData
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          issue_type: { 
            type: Type.STRING, 
            description: "The category of issue (e.g., Pothole, Illegal Dumping, Water Leak, Broken Streetlight, Fallen Tree)." 
          },
          priority: { 
            type: Type.STRING, 
            description: "Suggested priority: Low, Medium, High, or Critical." 
          },
          department: { 
            type: Type.STRING, 
            description: "The municipal department responsible (e.g., Roads & Bridges, Sanitation, Utilities, Forestry)." 
          },
          confidence: { 
            type: Type.NUMBER, 
            description: "Confidence score of the analysis (0.0 to 1.0)." 
          },
          summary: { 
            type: Type.STRING, 
            description: "A 1-sentence concise summary of the issue." 
          }
        },
        required: ["issue_type", "priority", "department", "confidence", "summary"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text || '{}') as AIAnalysisResult;
    return result;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      issue_type: "General Inquiry",
      priority: IssuePriority.MEDIUM,
      department: "Public Works",
      confidence: 0.5,
      summary: description.substring(0, 100)
    };
  }
};
