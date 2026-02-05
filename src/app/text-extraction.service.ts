import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class TextExtractionService {

    private apiUrl = 'https://api.api-ninjas.com/v1/imagetotext';
    private apiKey = 'jibFou9VztJiAnVklyOBuEd5uW8BXWJZBHpPuFL3';

    constructor(private http: HttpClient) { }

    extractText(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<any>(
            this.apiUrl,
            formData,
            {
                headers: {
                    'X-Api-Key': this.apiKey
                }
            }
        ).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return response.map(item => item.text).join(' ');
                } return '';
            })
        );
    }
}
