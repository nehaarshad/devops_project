import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputGenerator } from './output-generator';

describe('OutputGenerator', () => {
  let component: OutputGenerator;
  let fixture: ComponentFixture<OutputGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
