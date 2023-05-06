import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenSystemComponent } from './token-system.component';

describe('TokenSystemComponent', () => {
  let component: TokenSystemComponent;
  let fixture: ComponentFixture<TokenSystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenSystemComponent]
    });
    fixture = TestBed.createComponent(TokenSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
