import {Component, ElementRef, signal, ViewChild, WritableSignal} from '@angular/core';
import { Message, OpenAIService } from "../../services/openai.service";

@Component({
  selector: 'app-openai-page',
  standalone: false,
  templateUrl: './openai-page.component.html',
  styleUrl: './openai-page.component.css'
})
export class OpenaiPageComponent {
  @ViewChild('textAreaElement') textAreaElement!: ElementRef;
  userInput: string = '';
  chatResponse: string = '';
  chatBoxResponse: string = '';
  userChatInput: string = '';
  chatHistory: Message[] = [{role:'system', content:'This chatbot is used for the thema cash stuffing.', type:'text'}];

  operationOptions: string[] = ['I want to ask a question', 'I want to generate a picture', 'I want to generate a chart'];
  selectedOption: string = '';
  selected: WritableSignal<string> = signal('');


  constructor(private openAIService: OpenAIService) {
  }

  generateResponse() {
    if (!this.userInput.trim()) return;

    this.openAIService.getChatCompletion(this.userInput).subscribe(
      response => {
        this.chatResponse = response.choices[0].message.content;
      },
      error => {
        console.error('Error:', error);
        this.chatResponse = 'Error retrieving Response!';
      }
    );
  }

  generateChatResponse() {
    if (!this.userChatInput.trim()) return;

    const userMessage = new Message('user', this.userChatInput, 'text');
    this.chatHistory.push(userMessage);

    const lowerCaseInput = this.userChatInput.toLowerCase();

    if (lowerCaseInput.includes('generate a picture')) {
      this.requestPictureFromAI();
    } else if (lowerCaseInput.includes('generate a plot') || lowerCaseInput.includes('generate a chart') || lowerCaseInput.includes('generate a graph')) {
      this.requestChartDataFromAI();
    } else {
      this.openAIService.getChatCompletionFromMessages(this.chatHistory, 0.7).subscribe(
        response => {
          const aiMessage = new Message('assistant', response.choices[0].message.content, 'text');
          this.chatHistory.push(aiMessage);
          this.chatBoxResponse = aiMessage.content;
        },
        error => {
          console.error('Error:', error);
          this.chatBoxResponse = 'Error retrieving Response!';
        }
      );
    }
    this.userChatInput = '';
    this.selectedOption = '';
  }

  requestPictureFromAI(){
    this.openAIService.generateImage(this.userChatInput).subscribe(
      res => {
        const imageUrl = res.data[0].url;
        const aiImageMessage = new Message('assistant', imageUrl, 'image');
        this.chatHistory.push(aiImageMessage);
      },
      err => {
        console.error('Error generating image:', err);
        const errorMessage = new Message('assistant', 'Error generating image. Please try again.', 'text');
        this.chatHistory.push(errorMessage);
      }
    )
  }

  requestChartDataFromAI() {
    const systemMessage: Message = {
      role: "system",
      content: `Generate a chart based on the following user input. Only return the direct image URL without any
      additional text, formatting, or explanation:`,
      type: "text"
    };

    this.openAIService.getChatCompletionFromMessages([systemMessage, { role: "user", content: this.userChatInput, type:'text' }], 0.7)
      .subscribe(
        res => {
          const imgUrl = res.choices[0].message.content.trim();
          if (imgUrl.startsWith("http")) {
            const chartMessage = new Message('assistant', imgUrl, 'image');
            this.chatHistory.push(chartMessage);
          } else {
            this.chatHistory.push(new Message('assistant', 'Could not generate chart. Please try again.', 'text'));
          }
        },
        err => {
          console.error('Error:', err);
        }
      );
  }

  updateInput() {
    this.userChatInput = '';
    const messages: {[key:string]: string} = {
      'I want to ask a question': `I want to ask the following question: \n`,
      'I want to generate a picture': `I want to generate a picture about the following thema: \n`,
      'I want to generate a chart': 'I want to generate a chart using the following description: \n'
    }

    this.selected.set(messages[this.selectedOption] || '');
    this.userChatInput += this.selected();
  }
}
