import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { App } from './app';

// Stub components para el testing
@Component({ selector: 'app-header', template: '', standalone: true })
class HeaderStubComponent {}

@Component({ selector: 'app-footer', template: '', standalone: true })
class FooterStubComponent {}

@Component({ selector: 'app-notification', template: '', standalone: true })
class NotificationStubComponent {}

@Component({ selector: 'router-outlet', template: '', standalone: true })
class RouterOutletStubComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App]
    })
    .overrideComponent(App, {
      remove: { 
        imports: [RouterOutlet] 
      },
      add: { 
        imports: [
          HeaderStubComponent,
          FooterStubComponent,
          NotificationStubComponent,
          RouterOutletStubComponent
        ]
      }
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title signal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']()).toBe('shiken-shop-angular');
  });
});
