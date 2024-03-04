import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieListPage } from './movie-list.page';

describe('MovieListPage', () => {
  let component: MovieListPage;
  let fixture: ComponentFixture<MovieListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MovieListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
