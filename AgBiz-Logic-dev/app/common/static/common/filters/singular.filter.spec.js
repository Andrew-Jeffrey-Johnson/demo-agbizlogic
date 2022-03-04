(function() {
  'use strict';

  describe("Filter: Singular", function() {
    var filter;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      filter = $injector.get("singularFilter");
    }));


    it("should take off the letter 's'", function() {
      expect(filter("Years")).toEqual("Year");
    });


    it("does nothing to strings that do not end in 's'", function() {
      expect(filter("potato")).toEqual("potato");
    });


    it("does nothing if string ends in non-letter character", function() {
      expect(filter("potato!")).toEqual("potato!");
    });

  });

}());
