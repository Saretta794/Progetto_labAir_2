import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuoviArriviComponent } from './nuovi-arrivi.component';

describe('NuoviArriviComponent', () => {
  let component: NuoviArriviComponent;
  let fixture: ComponentFixture<NuoviArriviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuoviArriviComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuoviArriviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
