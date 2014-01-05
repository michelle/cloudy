(function(exports) {

  function Puff(left, top, radius) {
    this.left = left; // p = top
    this.top = top; // q = -top
    this.radius = radius; // r = radius

    this.intersections = {};
    this.calculateIntersections();

    // TODO: generate $el!
  }

  // Calculate the 'left' values where the circle intersects the y axis (top=0).
  Puff.prototype.calculateIntersections = function() {
    // (x - p)^2 + (-q)^2 = r^2
    // x^2 - 2px + q^2 - r^2 + p^2 = 0
    var p = this.left;
    var q = -this.top;
    var r = this.radius;

    // Ax^2 + Bx + C = 0
    var a = 1;
    var b = -2 * p;
    var c = Math.pow(q, 2) - Math.pow(r, 2) + Math.pow(p, 2);

    // Determinant? Discriminant? IDK.
    // B^2 - 4AC
    var d = Math.pow(b, 2) - 4 * a * c;
    if (d === 0) {
      // Only one point of intersection
      this.intersections.left = this.intersections.right = -b / (2 * a);
    } else if (d > 0) {
      this.intersections.left = (-b - Math.sqrt(d)) / (2 * a);
      this.intersections.right = (-b + Math.sqrt(d)) / (2 * a);
    }
  }

  // Generates a random puff that falls within the maxLeft and maxTop, taking into
  // account a reference point if given.
  //  reference = {top: t, left: l, radius: r}
  Puff.random = function(maxLeft, maxTop, reference) {
    // Needs to make sure reference circle and this one intersect.
    // TODO TODO TODO!!!
    var left = 0;
    var top = 0;
    var radius = 4;
    return new Puff(left, top, radius);
  }

  window.Puff = Puff;

  function Cloud($container, options) {
    this.$el = $('<div>').addClass('cloud').css({
      position: 'relative',
      width: '100%'
    });

    this.puffs = [];
  }

  Cloud.prototype.fillGaps = function() {
    if (this.puffs.length > 0) {
      var gaps = [];

      var left = this.puffs[0].intersections.left
      var right = this.puffs[0].intersections.right;
      var possibleGap;
      for (var i = 1, ii = this.puffs.length; i < ii; i += 1) {
        var puff = this.puffs[i];
        var puffRight = puff.intersections.right;
        var puffLeft = puff.intersections.left;

        // No intersection.
        if (!puffRight) {
          continue;
        }

        if (puffRight > right) {
          if (right > puffLeft) {
            left = puffLeft;
            right = puffRight;
          } else {
            if (possibleGap) {
              gaps.push(possibleGap);
            }

            // Record possible gap.
            possibleGap = {
              left: right,
              right: puffLeft
            }
          }
        }

        if (possibleGap) {
          if (puffLeft <= possibleGap.left && puffRight >= possibleGap.right) {
            // No longer gap~~
            possibleGap = null;
          } else if (puffLeft <= possibleGap.left && puffRight > possibleGap.left) {
            // Reduce gap!
            possibleGap.left = puffRight;
          } else if (puffLeft < possibleGap.right && puffRight >= possibleGap.right) {
            possibleGap.right = puffLeft;
          }
          // There's still the case where it falls between, in which case we can
          // just fill it in anyways...in fact, we should probably delete that
          // one.
        }
      }
    }
    // no-op if there's nothing to fill.
  }

  // TODO TODO TODO!!
  Cloud.prototype.generate = function() {
    // generate top, then bottom.
  }

  exports.generateCloud = function($container, options) {
    return new Cloud($container, options).$el;
  }

})(window);
