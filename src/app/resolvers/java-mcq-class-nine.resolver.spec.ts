import { TestBed } from '@angular/core/testing';

import { JavaMcqClassNineResolver } from './java-mcq-class-nine.resolver';

describe('JavaMcqClassNineResolver', () => {
  let resolver: JavaMcqClassNineResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(JavaMcqClassNineResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
