import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDomainComponent } from './add-domain.component';

describe('AddDomainComponent', () => {
  let component: AddDomainComponent;
  let fixture: ComponentFixture<AddDomainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDomainComponent]
    });
    fixture = TestBed.createComponent(AddDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
