import { Directive, HostListener, ElementRef } from '@angular/core';


@Directive({
  selector: 'imageView',
})
export class PreviewDirective { 

  constructor(private el: ElementRef) { 
   
  }

  @HostListener('click', ['$event'])  
  imageChange() { 
      
      
     var src:any = this.el.nativeElement.src;
     var prev:any = document.getElementById("preview");
     prev.src = src;
  }
  
  
  
  
}
