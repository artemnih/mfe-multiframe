import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: '<my-react-component></my-react-component>',
  schemas: [NO_ERRORS_SCHEMA]
})
export class WrapperComponent implements OnInit {
  elm = inject(ElementRef);
  
  async ngOnInit() {
    loadRemoteModule('mfe1', './MyReactComponent');


    // the following code replaces `template: '<my-react-component></my-react-component>',`
    // if you want to dynamically create the element instead of hardcoding it, read that MFE article for more information



    // const element = document.createElement('my-react-component');
    // this.elm.nativeElement.appendChild(element);

    // PS: if this code is used, template can be empty string template: ''
  }
}