import { TestBed } from '@angular/core/testing';

import { NostrAcctMgmtService } from './nostr-acct-mgmt.service';

describe('NostrAcctMgmtService', () => {
  let service: NostrAcctMgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NostrAcctMgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
