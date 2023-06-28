import { Component, Inject, Optional, Self } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';
import { TestService } from './test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  text = this.testService.data;

  constructor(
    @Optional() @Self() @Inject(WINDOW) readonly window: Window,
    private testService: TestService
  ) {}
}
