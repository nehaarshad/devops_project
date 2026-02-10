import { Component, Input } from '@angular/core';
import { QuizResponse } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-output-generator',
  imports: [CommonModule,FormsModule],
  templateUrl: './output-generator.html',
  styleUrl: './output-generator.css'
})
export class OutputGenerator {

  @Input() quizResponse: QuizResponse | null = null;
  @Input() isLoading: boolean = false;

  selectedAnswers: { [key: string]: string } = {};
  showResults: boolean = false;
  score: number = 0;

  onAnswerSelect(questionId: string, answer: string): void {
    this.selectedAnswers[questionId] = answer;
  }

  calculateScore(): void {
    if (!this.quizResponse) return;

    this.score = 0;
    this.quizResponse.questions.forEach(question => {
      if (this.selectedAnswers[question.id] === question.correctAnswer) {
        this.score++;
      }
    });
    this.showResults = true;
  }

  resetQuiz(): void {
    this.selectedAnswers = {};
    this.showResults = false;
    this.score = 0;
  }

  getQuestionNumber(index: number): string {
    return (index + 1).toString();
  }
}
