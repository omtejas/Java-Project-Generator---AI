
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedFile, JavaConcept } from "../types";

const buildPrompt = (projectDescription: string, concepts: JavaConcept[]): string => {
  const conceptLabels = concepts.map(c => c.label).join(', ');
  
  return `
    Project Idea: "${projectDescription}"

    Please generate a complete, simple, and well-documented Java project based on this idea.
    The project must demonstrate the following core Java concepts: ${conceptLabels}.

    Specific requirements for each concept:
    1.  **Classes & Inheritance**: Create a clear class hierarchy. For example, a base class and at least one subclass that extends it.
    2.  **Exception Handling**: Implement at least one custom exception and use try-catch-finally blocks for robust error management, especially for file I/O and database operations.
    3.  **MultiThreading**: Use \`Thread\` or implement \`Runnable\` to demonstrate a concurrent operation. This could be a background task like writing data to a file asynchronously.
    4.  **File I/O**: Include code that reads from AND writes to a text file (e.g., \`output.txt\`).
    5.  **JDBC**: Provide a complete, self-contained example of connecting to an in-memory H2 database. Include creating a table, inserting data, and querying data. Also, add comments in the code explaining the necessary Maven/Gradle dependency for H2.

    General instructions:
    -   The code should be organized into multiple, logical files.
    -   Each file must be complete and ready to compile.
    -   Add clear comments throughout the code, especially indicating where each of the required concepts is implemented.
    -   The example should be practical and related to the project idea.
    -   Return the output as a valid JSON array of objects. Each object must have a "fileName" property (e.g., "Main.java") and a "code" property (the full Java code as a string). Do not include any text or markdown formatting outside of the JSON structure.
  `;
};

export const generateJavaCode = async (
  projectDescription: string,
  concepts: JavaConcept[]
): Promise<GeneratedFile[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = buildPrompt(projectDescription, concepts);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              fileName: {
                type: Type.STRING,
                description: "The name of the Java file, e.g., Main.java"
              },
              code: {
                type: Type.STRING,
                description: "The complete source code for the file."
              }
            },
            required: ["fileName", "code"],
          }
        },
        temperature: 0.5,
      }
    });

    const jsonString = response.text.trim();
    const generatedFiles: GeneratedFile[] = JSON.parse(jsonString);
    
    if (!Array.isArray(generatedFiles) || generatedFiles.some(f => !f.fileName || !f.code)) {
        throw new Error("Invalid response format from API.");
    }
    
    return generatedFiles;

  } catch (error) {
    console.error("Error generating Java code:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate code: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating code.");
  }
};
