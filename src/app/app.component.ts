import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, FormsModule, NgIf, NgFor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  textInput: string = '';
  imageString: string = '';
  questions: string[] = [];
  headerText: string = 'upload or yapload';
  resultsContent: string = '';
  resultAvailable: boolean = false;

  //app state variables
  userHasEntered: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('AppComponent initialized');
    this.resetAndUploadAgain(); //reset the buffer everytime the app is refreshed
  }

  clearButtonCallback(): void {
    this.resultAvailable = false;
  }

  resetAndUploadAgain(): void {
    this.apiService.purgeEverything().subscribe(
      response => {
        console.log('Purged everything successfully:', response);
      },
      error => {
        alert('Error purging everything: ' + error);
      }
    );
  }

  buttonOnClick(): void { //animation for the upload button
    //this.buttonAnimationState = this.buttonAnimationState === 'unclicked' ? 'clicked' : 'unclicked';
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.userHasEntered = true;
      this.headerText = 'loading';
      this.uploadTextAndInfer();
    }
  }

  uploadTextAndInfer(): void {
    if (!this.textInput) { alert('Please type something.'); return }

    const postData = {
      text: this.textInput
    };
    this.apiService.sendText(postData).subscribe(
      response => {
        this.headerText = 'Done uploading. Inferencing...';

        this.apiService.startTextInference().subscribe(
          response => {
              this.questions = response.output;
              console.log(this.questions);
              console.log(response.output);
              this.headerText = 'upload or yapload';
              this.userHasEntered = false;
              this.resultsContent = this.questions.join('\n\n');
              this.resultAvailable = true;
          }
        );
      }
    );
  }

  uploadImageAndInfer(): void {
    if (!this.imageString) {
      alert('No image selected!');
      return;
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.userHasEntered = true;
    if (!file) {
      alert('No file selected!');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imageString = (reader.result as string).split(',')[1];
      const postData = {
        "b64_string": this.imageString
      };
      this.apiService.sendImage(postData).subscribe(
        response => {
          this.headerText = 'uploaded';
          this.apiService.startImageInference().subscribe(
            response => {
              this.questions = response.output;
              console.log(this.questions);
              console.log(response.output);
              this.headerText = 'done';
              this.userHasEntered = false;
              this.resultsContent = this.questions.join('\n\n');
              this.resultAvailable = true;
            }
          );
        }
      );
    }
    reader.readAsDataURL(file);
  }
}
