(function() {
  'use strict';

  describe("Filter: Capitalize", function() {
    var filter;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      filter = $injector.get("capitalizeFilter");
    }));


    it("should capitalize all lowercase words", function() {
      expect(filter("hello")).toEqual("Hello");
    });


    it("should only capitalize first word of many", function() {
      expect(filter("hello world")).toEqual("Hello world");
    });


    it("should not do anything to already capitalized strings", function() {
      expect(filter("Hello World")).toEqual("Hello world");
    });


    it("should do nothing to non character inputs", function() {
      expect(filter(2)).toEqual(2);
    });

  });

}());
