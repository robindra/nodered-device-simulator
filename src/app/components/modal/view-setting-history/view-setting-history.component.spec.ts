import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSettingHistoryComponent } from './view-setting-history.component';

describe('ViewSettingHistoryComponent', () => {
  let component: ViewSettingHistoryComponent;
  let fixture: ComponentFixture<ViewSettingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSettingHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSettingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
