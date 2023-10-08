import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NostrSignInComponent } from './nostr-sign-in.component';

describe('NostrSignInComponent', () => {
  let component: NostrSignInComponent;
  let fixture: ComponentFixture<NostrSignInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NostrSignInComponent]
    });
    fixture = TestBed.createComponent(NostrSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
