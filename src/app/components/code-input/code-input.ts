import { Component, Output, EventEmitter } from '@angular/core';
import { CodeInput } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-code-input',
  imports: [CommonModule,FormsModule],
  templateUrl: './code-input.html',
  styleUrls: ['./code-input.css']
})
export class CodeInputComponent {
  @Output() codeSubmitted = new EventEmitter<CodeInput>();

  code: string = '';
  selectedLanguage: 'python' | 'java' | 'cpp' | 'javascript' = 'python';
  fileName: string = '';

  languages = [
    { value: 'python', label: 'Python', extension: '.py' },
    { value: 'java', label: 'Java', extension: '.java' },
    { value: 'cpp', label: 'C++', extension: '.cpp' },
    { value: 'javascript', label: 'JavaScript', extension: '.js' }
  ];

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.code = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  onSubmit(): void {
    if (this.code.trim()) {
      const codeInput: CodeInput = {
        code: this.code,
        language: this.selectedLanguage,
        fileName: this.fileName || undefined
      };
      this.codeSubmitted.emit(codeInput);
    }
  }

  onLanguageChange(): void {
    // Auto-detect language from filename if possible
    if (this.fileName) {
      const extension = this.fileName.split('.').pop()?.toLowerCase();
      const langMap: { [key: string]: any } = {
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'js': 'javascript'
      };
      if (extension && langMap[extension]) {
        this.selectedLanguage = langMap[extension];
      }
    }
  }
}


