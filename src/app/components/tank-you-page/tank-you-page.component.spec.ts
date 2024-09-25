import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankYouPageComponent } from './tank-you-page.component';

describe('TankYouPageComponent', () => {
  let component: TankYouPageComponent;
  let fixture: ComponentFixture<TankYouPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TankYouPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankYouPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
