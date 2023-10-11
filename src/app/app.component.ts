import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  loading$ = this.loader.loading$;
idleState = 'Not started.';
  timedOut = false;  
  title = 'angular-idle-timeout';


  constructor(public loader: LoadingService, private idle: Idle, private keepalive: Keepalive ) {
     // sets an idle timeout of 5 seconds, for testing purposes.
     idle.setIdle(5);
     // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
     idle.setTimeout(5);
     // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
     idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
 
     idle.onIdleEnd.subscribe(() => { 
       this.idleState = 'No longer idle.'
       console.log(this.idleState);
       this.reset();
     });
     
     idle.onTimeout.subscribe(() => {
       this.idleState = 'Timed out!';
       this.timedOut = true;
       console.log(this.idleState);      
      
     });
     
     idle.onIdleStart.subscribe(() => {
         this.idleState = 'You\'ve gone idle!'
         console.log(this.idleState);
         //this.childModal.show();
     });
     
     idle.onTimeoutWarning.subscribe((countdown) => {
       this.idleState = 'You will time out in ' + countdown + ' seconds!'
       console.log(this.idleState);
     });
 
     // sets the ping interval to 15 seconds
     keepalive.interval(15); 
 
     this.reset();
   }
 
   reset() {
     this.idle.watch();
     this.idleState = 'Started.';
     this.timedOut = false;
   }
  }




