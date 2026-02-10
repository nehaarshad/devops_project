import { Component, EventEmitter, Output } from '@angular/core';
import { QuestionType, QuizPreferences } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-generator',
  imports: [CommonModule,FormsModule],
  templateUrl: './quiz-generator.html',
  styleUrl: './quiz-generator.css'
})
export class QuizGenerator {

  @Output() preferencesSubmitted = new EventEmitter<QuizPreferences>();

  preferences: QuizPreferences = {
    numberOfQuestions: 5,
    difficulty: 'medium',
    questionTypes: ['mcq', 'output_prediction', 'debugging']
  };

  questionTypeOptions: { value: QuestionType, label: string }[] = [
    { value: 'mcq', label: 'Multiple Choice Questions' },
    { value: 'output_prediction', label: 'Output Prediction' },
    { value: 'debugging', label: 'Debugging Questions' }
  ];

  onQuestionTypeChange(type: QuestionType, event: any): void {
    if (event.target.checked) {
      this.preferences.questionTypes.push(type);
    } else {
      const index = this.preferences.questionTypes.indexOf(type);
      if (index > -1) {
        this.preferences.questionTypes.splice(index, 1);
      }
    }
  }

  isQuestionTypeSelected(type: QuestionType): boolean {
    return this.preferences.questionTypes.includes(type);
  }

  onSubmit(): void {
    if (this.preferences.questionTypes.length > 0) {
      this.preferencesSubmitted.emit({ ...this.preferences });
    }
  }
}