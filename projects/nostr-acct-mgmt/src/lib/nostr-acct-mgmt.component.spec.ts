import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NostrAcctMgmtComponent } from './nostr-acct-mgmt.component';

describe('NostrAcctMgmtComponent', () => {
  let component: NostrAcctMgmtComponent;
  let fixture: ComponentFixture<NostrAcctMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NostrAcctMgmtComponent]
    });
    fixture = TestBed.createComponent(NostrAcctMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
