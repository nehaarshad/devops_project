import { Component } from '@angular/core';
import { CodeInput, QuizPreferences, QuizResponse, GeneratedQuestion } from './models/quizModel';
import { GroqApiService } from './services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OutputGenerator } from './components/output-generator/output-generator';
import { QuizGenerator } from './components/quiz-generator/quiz-generator';
import { CodeInputComponent } from './components/code-input/code-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule, OutputGenerator, QuizGenerator, CodeInputComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AI Coding Quiz Generator';
  
  currentStep: 'input' | 'preferences' | 'quiz' = 'input';
  codeInput: CodeInput | null = null;
  quizPreferences: QuizPreferences | null = null;
  quizResponse: QuizResponse | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private groqApiService: GroqApiService) {}

  onCodeSubmitted(codeInput: CodeInput): void {
    this.codeInput = codeInput;
    this.currentStep = 'preferences';
    this.error = null;
  }

  onPreferencesSubmitted(preferences: QuizPreferences): void {
    this.quizPreferences = preferences;
    this.generateQuiz();
  }

  generateQuiz(): void {
    if (!this.codeInput || !this.quizPreferences) return;

    this.isLoading = true;
    this.error = null;
    this.currentStep = 'quiz';

    this.groqApiService.generateQuiz(this.codeInput, this.quizPreferences)
      .subscribe({
        next: (response) => {
          try {
            this.quizResponse = this.groqApiService.parseQuizResponse(response);
          } catch (error) {
            this.error = 'Failed to generate quiz. Please try again.';
            console.error('Quiz generation error:', error);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'API Error: ' + (error.error?.error?.message || error.message || 'Unknown error');
          this.isLoading = false;
          console.error('API Error:', error);
        }
      });
  }

  resetApp(): void {
    this.currentStep = 'input';
    this.codeInput = null;
    this.quizPreferences = null;
    this.quizResponse = null;
    this.error = null;
  }
}