require("../env");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.area");

var π = Math.PI;

suite.addBatch({
  "area": {
    topic: function() {
      return d3.geo.area;
    },
    "Point": function(area) {
      assert.equal(area({type: "Point", coordinates: [0, 0]}), 0);
    },
    "MultiPoint": function(area) {
      assert.equal(area({type: "MultiPoint", coordinates: [[0, 1], [2, 3]]}), 0);
    },
    "LineString": function(area) {
      assert.equal(area({type: "LineString", coordinates: [[0, 1], [2, 3]]}), 0);
    },
    "MultiLineString": function(area) {
      assert.equal(area({type: "MultiLineString", coordinates: [[[0, 1], [2, 3]], [[4, 5], [6, 7]]]}), 0);
    },
    "Polygon": {
      "semilune": function(area) {
        assert.equal(area({type: "Polygon", coordinates: [[[0, 0], [0, 90], [90, 0], [0, 0]]]}), π / 2);
      },
      "lune": function(area) {
        assert.equal(area({type: "Polygon", coordinates: [[[0, 0], [0, 90], [90, 0], [0, -90], [0, 0]]]}), π);
      },
      "hemispheres": {
        "North": function(area) {
          assert.equal(area({type: "Polygon", coordinates: [[[0, 0], [-90, 0], [180, 0], [90, 0], [0, 0]]]}), 2 * π);
        },
        "South": function(area) {
          assert.equal(area({type: "Polygon", coordinates: [[[0, 0], [90, 0], [180, 0], [-90, 0], [0, 0]]]}), 2 * π);
        },
        "East": function(area) {
          assert.equal(area({type: "Polygon", coordinates: [[[0, 0], [0, 90], [180, 0], [0, -90], [0, 0]]]}), 2 * π);
        },
        "West": function(area) {
          assert.equal(area({type: "Polygon", coordinates: [[[0, 0], [0, -90], [180, 0], [0, 90], [0, 0]]]}), 2 * π);
        }
      },
      "graticule outline": {
        "sphere": function(area) {
          assert.inDelta(area(d3.geo.graticule().extent([[-180, -90], [180, 90]]).outline()), 4 * π, 1e-5);
        },
        "hemisphere": function(area) {
          assert.inDelta(area(d3.geo.graticule().extent([[-180, 0], [180, 90]]).outline()), 2 * π, 1e-5);
        },
        "semilune": function(area) {
          assert.inDelta(area(d3.geo.graticule().extent([[0, 0], [90, 90]]).outline()), π / 2, 1e-5);
        }
      },
      "circles": {
        "hemisphere": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(90)()), 2 * π, 1e-5);
        },
        "45°": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(45).precision(.1)()), π * (2 - Math.SQRT2), 1e-5);
        },
        "45° North": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(45).precision(.1).origin([0, 90])()), π * (2 - Math.SQRT2), 1e-5);
        },
        "45° South": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(45).precision(.1).origin([0, -90])()), π * (2 - Math.SQRT2), 1e-5);
        },
        "135°": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(135).precision(.1)()), π * (2 + Math.SQRT2), 1e-5);
        },
        "135° North": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(135).precision(.1).origin([0, 90])()), π * (2 + Math.SQRT2), 1e-5);
        },
        "135° South": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(135).precision(.1).origin([0, -90])()), π * (2 + Math.SQRT2), 1e-5);
        },
        "tiny": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(1e-6).precision(.1)()), 0, 1e-6);
        },
        "huge": function(area) {
          assert.inDelta(area(d3.geo.circle().angle(180 - 1e-6).precision(.1)()), 4 * π, 1e-6);
        }
      }
    },
    "MultiPolygon": {
      "two hemispheres": function(area) {
        assert.equal(area({type: "MultiPolygon", coordinates: [
          [[[0, 0], [-90, 0], [180, 0], [90, 0], [0, 0]]],
          [[[0, 0], [90, 0], [180, 0], [-90, 0], [0, 0]]]
        ]}), 4 * π);
      }
    },
    "Sphere": function(area) {
      assert.equal(area({type: "Sphere"}), 4 * π);
    },
    "GeometryCollection": function(area) {
      assert.equal(area({type: "GeometryCollection", geometries: [{type: "Sphere"}]}), 4 * π);
    },
    "FeatureCollection": function(area) {
      assert.equal(area({type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "Sphere"}}]}), 4 * π);
    },
    "Feature": function(area) {
      assert.equal(area({type: "Feature", geometry: {type: "Sphere"}}), 4 * π);
    }
  }
});

suite.export(module);