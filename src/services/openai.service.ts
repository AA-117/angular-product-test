import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// export interface Message {
//   role: string;
//   content: string;
// }
@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';  // OpenAI API URL
  private imageApiUrl = 'https://api.openai.com/v1/images/generations'; // DALL·E API
  private apiKey = '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';  // ✅ Replace with your OpenAI API key

  constructor(private http: HttpClient) { }

  getChatCompletion(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: 'gpt-3.5-turbo',  // ✅ Choose the correct OpenAI model
      messages: [{ role: 'user', content: prompt, type: 'text'}],
      temperature: 0
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

  getChatCompletionFromMessages(messages: Message[], temperature?: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: temperature ?? 0.7
    };

    return this.http.post<any>(this.apiUrl, body, {headers});
  }

  generateImage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: 'dall-e-2', // ✅ Use the DALL·E model for image generation
      prompt: prompt,
      n: 1,
      size: "512x512"  // ✅ Change resolution if needed
    };

    return this.http.post<any>(this.imageApiUrl, body, { headers });
  }
}

export class Message {
  constructor(
    public role: string,
    public content: string,
    public type: 'text' | 'image' = 'text',
  ) {}
}
