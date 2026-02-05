import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextExtractionService } from './text-extraction.service';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'Image to Text Converter';
    selectedFile: File | null = null;
    previewUrl: string | null = null;
    errorMessage: string | null = null;
    extractedText = "";
    loading = false;


    constructor(private textExtractionService: TextExtractionService) { }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (!input.files || input.files.length === 0) {
            this.selectedFile = null;
            this.previewUrl = null;
            return;
        }
        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            this.errorMessage = 'Please choose the image.';
            this.selectedFile = null;
            this.previewUrl = null;
            return;
        }
        if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
            this.errorMessage = 'Allowed formats: JPEG or PNG.';
            this.selectedFile = null;
            this.previewUrl = null;
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.errorMessage = 'File must be less than 2MB.';
            this.selectedFile = null;
            this.previewUrl = null;
            return;
        }
        this.selectedFile = file;
        this.errorMessage = null;

        const reader = new FileReader();
        reader.onload = () => {
            this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    extractText(): void {
        if (!this.selectedFile) {
            this.errorMessage = 'Please choose a file first.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.textExtractionService.extractText(this.selectedFile).subscribe({
            next: (text: string) => {
                this.extractedText = text;
                this.loading = false;
            },
            error: () => {
                this.errorMessage = 'Failed to extract text.';
                this.loading = false;
            }
        });
    }

}