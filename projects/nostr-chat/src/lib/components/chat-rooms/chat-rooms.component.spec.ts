import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomsComponent } from './chat-rooms.component';

describe('ChatRoomsComponent', () => {
  let component: ChatRoomsComponent;
  let fixture: ComponentFixture<ChatRoomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomsComponent]
    });
    fixture = TestBed.createComponent(ChatRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
