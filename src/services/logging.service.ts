import {Injectable} from "@angular/core";
import {LumberjackLogger} from "@ngworker/lumberjack";

@Injectable({
  providedIn: 'root'
})
export class LoggingService extends LumberjackLogger{
  static scope = 'angular product app';

  criticalLog(message: string, payload?: any) {
    this.createCriticalLogger(message)
      .withScope(LoggingService.scope)
      .withPayload(payload)
      .build()();
  }

  infoLog(message: string, payload?: any) {
    this.createInfoLogger(message)
      .withScope(LoggingService.scope)
      .withPayload(payload)
      .build()();
  }
}
