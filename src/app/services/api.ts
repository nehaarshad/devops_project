import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { CodeInput, QuizPreferences, QuizResponse, GeneratedQuestion } from '../models/quizModel';

@Injectable({
  providedIn: 'root'
})
export class GroqApiService {
  private apiUrl = environment.groqApiUrl;
  private apiKey = environment.groqApiKey;

  constructor(private http: HttpClient) {}
    private availableModels = [
    'llama3-8b-8192',
    'llama3-70b-8192', 
    'mixtral-8x7b-32768',
    'gemma-7b-it'
  ];


  generateQuiz(codeInput: CodeInput, preferences: QuizPreferences): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const prompt = this.buildPrompt(codeInput, preferences);
    
    const requestBody = {
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that generates coding quiz questions from code. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
   model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" }
    };

    return this.http.post(this.apiUrl, requestBody, { headers });
  }

  private buildPrompt(codeInput: CodeInput, preferences: QuizPreferences): string {
    const { code, language } = codeInput;
    const { numberOfQuestions, difficulty, questionTypes } = preferences;

    return `
    Generate a coding quiz based on the following ${language} code.

    CODE:
    \`\`\`${language}
    ${code}
    \`\`\`

    REQUIREMENTS:
    - Number of questions: ${numberOfQuestions}
    - Difficulty level: ${difficulty}
    - Question types: ${questionTypes.join(', ')}
    
    Please generate questions in the following JSON format:
    {
      "questions": [
        {
          "id": "unique_id",
          "type": "mcq|output_prediction|debugging",
          "question": "Question text",
          "options": ["Option1", "Option2", "Option3", "Option4"], // Only for MCQ
          "correctAnswer": "Correct answer or option",
          "explanation": "Detailed explanation",
          "difficulty": "easy|medium|hard",
          "codeSnippet": "Relevant code snippet if applicable"
        }
      ]
    }

    GUIDELINES:
    - Create diverse questions covering different aspects of the code
    - For MCQ questions, provide 4 plausible options
    - For output prediction, ask what the code outputs
    - For debugging, provide code with errors and ask to identify/fix them
    - Ensure explanations are clear and educational
    - Match the specified difficulty level
    `;
  }

  parseQuizResponse(apiResponse: any): QuizResponse {
    try {
      const content = apiResponse.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in API response');
      }

      const parsedData = JSON.parse(content);
      
      return {
        questions: parsedData.questions || [],
        totalQuestions: parsedData.questions?.length || 0,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing quiz response:', error);
      throw new Error('Failed to parse quiz questions from API response');
    }
  }
}