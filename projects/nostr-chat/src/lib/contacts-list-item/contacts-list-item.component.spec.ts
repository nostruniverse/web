import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsListItemComponent } from './contacts-list-item.component';

describe('ContactsListItemComponent', () => {
  let component: ContactsListItemComponent;
  let fixture: ComponentFixture<ContactsListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactsListItemComponent]
    });
    fixture = TestBed.createComponent(ContactsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
