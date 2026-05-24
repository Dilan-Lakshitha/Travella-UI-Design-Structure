import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationModalComponent } from './conversation-modal.component';

describe('ConversationModalComponent', () => {
  let component: ConversationModalComponent;
  let fixture: ComponentFixture<ConversationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
