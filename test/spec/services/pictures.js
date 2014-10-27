'use strict';

describe('Service: Pictures', function () {

  // load the service's module
  beforeEach(module('photomapApp'));

  // instantiate service
  var Pictures;
  beforeEach(inject(function (_Pictures_) {
    Pictures = _Pictures_;
  }));

  it('should do something', function () {
    expect(!!Pictures).toBe(true);
  });

});
