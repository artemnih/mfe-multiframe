import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: '',
  schemas: [NO_ERRORS_SCHEMA]
})
export class WrapperComponent implements OnInit {
  elm = inject(ElementRef);
  
  async ngOnInit() {
    loadRemoteModule('mfe1', './MyReactComponent');

    const element = document.createElement('my-react-component');
    this.elm.nativeElement.appendChild(element);
  }
}