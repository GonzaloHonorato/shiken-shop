import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { App } from './app';

// Stub components para el testing
@Component({ selector: 'app-header', template: '', standalone: true })
class HeaderStubComponent {}

@Component({ selector: 'app-footer', template: '', standalone: true })
class FooterStubComponent {}

@Component({ selector: 'app-notification', template: '', standalone: true })
class NotificationStubComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]) // Proveedor de router para componentes standalone
      ]
    })
    .overrideComponent(App, {
      remove: { 
        imports: [] 
      },
      add: { 
        imports: [
          HeaderStubComponent,
          FooterStubComponent,
          NotificationStubComponent
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
