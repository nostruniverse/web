import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSignInComponent } from './email-sign-in.component';

describe('EmailSignInComponent', () => {
  let component: EmailSignInComponent;
  let fixture: ComponentFixture<EmailSignInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailSignInComponent]
    });
    fixture = TestBed.createComponent(EmailSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
