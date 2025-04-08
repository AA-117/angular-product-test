import {Component} from '@angular/core';
import {LumberjackService} from "@ngworker/lumberjack";
import {LoggingService} from "../../services/logging.service";

@Component({
  selector: 'app-logging-tool-page',
  standalone: false,
  templateUrl: './logging-tool-page.component.html',
  styleUrl: './logging-tool-page.component.css'
})
export class LoggingToolPageComponent {

  constructor(
    private lumberjack: LumberjackService,
    private logging: LoggingService,
    ) {
    this.lumberjack.logInfo('Test log');
    this.logging.infoLog('This is an info log', {UserId: 123, role: 'admin'});
  }

  logSomething() {
    this.logging.criticalLog('This is a critical log', {ProcessId: 3344, Target: 'News'});
  }
}
