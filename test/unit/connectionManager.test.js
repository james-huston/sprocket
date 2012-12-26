var Sprocket = require("../../");
var connectionManager = Sprocket.ConnectionManager;
var expect = require("expect.js");

describe("A standard connection manager", function () {

  describe("when instantiated", function() {
    it("should have an empty connectionArray", function () {
      var testManager = new connectionManager();
      expect(testManager.connectionArray.length).to.equal(0);
    });
  });

  describe("when an item is added", function () {
    var testManager = new connectionManager();
    var testObject = {name: "blarg!"};
    testManager.add(testObject);

    it("should have that item in its connectionArray", function () {
      expect(testManager.connectionArray.length).to.equal(1);
      expect(testManager.connectionArray[0]).to.equal(testObject);
    });

    it("should remove the item when delete is called", function () {
      testManager.del(testObject);
      expect(testManager.connectionArray.length).to.equal(0);
    });
  });
});

