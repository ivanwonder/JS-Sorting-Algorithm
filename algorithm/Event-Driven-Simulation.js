import { isNull } from "../lib/unit";
import { MinPQ } from "./PQ";

class Environment {
  /**
   * @param {number} width
   * @param {number} height
   * @param {HTMLCanvasElement} canvas
   */
  constructor(width, height, canvas) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this._ctx = null;

    canvas.style.height = this.height + "px";
    canvas.style.width = this.width + "px";
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;
    canvas
      .getContext("2d")
      .scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  getCtx() {
    if (isNull(this._ctx)) {
      this._ctx = this.canvas.getContext("2d");
    }

    return this._ctx;
  }
}

/**
 * @description the physical formulas comes from https://algs4.cs.princeton.edu/61event/
 */
class Particle {
  /**
   * @param {number} rx
   * @param {number} ry
   * @param {number} vx
   * @param {number} vy
   * @param {number} radius
   * @param {number} mass
   */
  constructor(rx, ry, vx, vy, radius, mass, color) {
    if (arguments.length) {
      this.rx = rx;
      this.ry = ry;
      this.vx = vx;
      this.vy = vy;
      this.radius = radius;
      this.mass = mass;
      this.color = color || `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255 * Math.random()})`;
    } else {
    }
    this._count = 0;
  }

  /**
   * @description draw the particle
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.rx, this.ry, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
  }

  /**
   * @description change the particle of position to reflect the passage of time
   * @param {number} time the time of passed
   */
  move(time) {
    this.rx += time * this.vx;
    this.ry += time * this.vy;
  }

  /**
   * @description the number of collisions involving the particle
   */
  count() {
    return this._count;
  }

  /**
   * @description time until this particle hits the passed particle
   * @param {Particle} particle
   */
  timeToHit(particle) {
    if (this === particle) return Number.POSITIVE_INFINITY;
    // if (this.vx === 0 && particle.vx === 0) {
    //   return Number.POSITIVE_INFINITY;
    // }

    // if (this.vy === 0 && particle.vy === 0) {
    //   return Number.POSITIVE_INFINITY;
    // }

    // if (this.vx !== 0 && particle.vx !== 0 && this.vy !== 0 && particle.vy !== 0 && this.vx) {
    //   return Number.POSITIVE_INFINITY;
    // }
    const dx = particle.rx - this.rx;
    const dy = particle.ry - this.ry;
    const dvx = particle.vx - this.vx;
    const dvy = particle.vy - this.vy;
    const dvdr = dx * dvx + dy * dvy;
    if (dvdr > 0) return Number.POSITIVE_INFINITY;
    const dvdv = dvx * dvx + dvy * dvy;
    if (dvdv === 0) return Number.POSITIVE_INFINITY;
    const drdr = dx * dx + dy * dy;
    const sigma = this.radius + particle.radius;
    const d = dvdr * dvdr - dvdv * (drdr - sigma * sigma);
    // if (drdr < sigma*sigma) StdOut.println("overlapping particles");
    if (d < 0) return Number.POSITIVE_INFINITY;
    const time = -(dvdr + Math.sqrt(d)) / dvdv;

    /**
     * the Evnet of two particles which direction of movement is same and are close to each other will be added to the MinPQ continuously and the canvas will be the same.
     */
    if (time === 0) {
      // magnitude of normal force
      const magnitude =
        (2 * this.mass * particle.mass * dvdr) /
        ((this.mass + particle.mass) * sigma);

      // normal force, and in x and y directions
      const fx = (magnitude * dx) / sigma;
      const fy = (magnitude * dy) / sigma;
      if (fx === 0 && fy === 0) {
        return Number.POSITIVE_INFINITY;
      }
    }

    return time;
  }

  /**
   * @description time until this particle hits a horizontal wall
   */
  timeToHitHorizontalWall(height) {
    if (this.vy > 0) return (height - this.ry - this.radius) / this.vy;
    else if (this.vy < 0) return (this.radius - this.ry) / this.vy;
    else return Number.POSITIVE_INFINITY;
  }

  /**
   * @description time until this particle hits a vertical wall
   */
  timeToHitVerticalWall(width) {
    if (this.vx > 0) return (width - this.rx - this.radius) / this.vx;
    else if (this.vx < 0) return (this.radius - this.rx) / this.vx;
    else return Number.POSITIVE_INFINITY;
  }

  /**
   * @description change particle velocities to reflect collision
   * @param {Partial} particle
   */
  bounceOff(particle) {
    const dx = particle.rx - this.rx;
    const dy = particle.ry - this.ry;
    const dvx = particle.vx - this.vx;
    const dvy = particle.vy - this.vy;
    const dvdr = dx * dvx + dy * dvy; // dv dot dr
    const dist = this.radius + particle.radius; // distance between particle centers at collison

    // magnitude of normal force
    const magnitude =
      (2 * this.mass * particle.mass * dvdr) /
      ((this.mass + particle.mass) * dist);

    // normal force, and in x and y directions
    const fx = (magnitude * dx) / dist;
    const fy = (magnitude * dy) / dist;

    // update velocities according to normal force
    this.vx += fx / this.mass;
    this.vy += fy / this.mass;
    particle.vx -= fx / particle.mass;
    particle.vy -= fy / particle.mass;

    // update collision counts
    this._count++;
    particle._count++;
  }

  /**
   * @description change velocity to reflect hitting horizontal wall
   */
  bounceOffHorizontalWall() {
    this.vy = -this.vy;
    this._count++;
  }

  /**
   * @description change velocity to reflect hitting vertical wall
   */
  bounceOffVerticalWall() {
    this.vx = -this.vx;
    this._count++;
  }
}

class Event {
  /**
   * @param {number} time the time of the event happen
   * @param {Particle} a
   * @param {Particle} b
   */
  constructor(time, a, b) {
    this.time = time;
    this.a = a;
    this.b = b;

    this.countA = a instanceof Particle ? a.count() : -1;
    this.countB = b instanceof Particle ? b.count() : -1;
  }

  /**
   * @param {Event} that
   */
  compareTo(that) {
    if (this.time < that.time) return -1;
    if (this.time > that.time) return +1;
    return 0;
  }

  isValid() {
    if (this.a instanceof Particle && this.countA !== this.a.count()) {
      return false;
    }
    if (this.b instanceof Particle && this.countB !== this.b.count()) {
      return false;
    }
    return true;
  }
}

class CollisionSystem {
  /**
   * @param {Array<Particle>} particles
   * @param {Environment} environment
   */
  constructor(particles, environment) {
    this.particles = particles;
    this.time = new Date().getTime();
    this.minPQ = new MinPQ();
    this.environment = environment;
  }

  /**
   * @param {Particle} particle
   * @param {number} limit
   */
  predictCollisions(particle, limit) {
    if (isNull(particle)) return;

    for (const _particle of this.particles) {
      const _time = particle.timeToHit(_particle) * 1000;
      if (this.time + _time < limit) {
        this.minPQ.insert(new Event(this.time + _time, particle, _particle));
      }
    }

    const _timeforVer =
      particle.timeToHitVerticalWall(this.environment.width) * 1000;
    if (this.time + _timeforVer < limit) {
      this.minPQ.insert(new Event(this.time + _timeforVer, particle, null));
    }

    const _timeforHor =
      particle.timeToHitHorizontalWall(this.environment.height) * 1000;
    if (this.time + _timeforHor < limit) {
      this.minPQ.insert(new Event(this.time + _timeforHor, null, particle));
    }
  }

  /**
   * @param {Event} event
   */
  predictCollisionsOneByOne(event, limit) {
    for (const _particle of this.particles) {
      _particle.move((event.time - this.time) / 1000);
    }
    this.time = event.time;

    const a = event.a;
    const b = event.b;
    if (!isNull(a) && !isNull(b)) {
      a.bounceOff(b);
    }
    if (isNull(a) && !isNull(b)) {
      b.bounceOffHorizontalWall();
    }
    if (isNull(b) && !isNull(a)) {
      a.bounceOffVerticalWall();
    }

    this.predictCollisions(a, limit);
    this.predictCollisions(b, limit);
  }

  getNextValidEvent() {
    while (!this.minPQ.isEmpty()) {
      /**
       * @type {Event}
       */
      const event = this.minPQ.delMin();
      if (!event.isValid()) continue;
      return event;
    }

    return null;
  }

  redraw() {
    const canvas = this.environment.canvas;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, this.environment.width, this.environment.height);

    for (const _particle of this.particles) {
      _particle.draw(ctx);
    }
  }

  /**
   * @param {number} limit
   */
  simulate(limit) {
    for (const _particle of this.particles) {
      this.predictCollisions(_particle, limit);
    }
    const self = this;
    let event = self.getNextValidEvent();
    if (isNull(event)) return;

    function draw() {
      const currentTime = new Date().getTime();
      if (currentTime >= event.time) {
        self.predictCollisionsOneByOne(event, limit);
        event = self.getNextValidEvent();
        if (isNull(event)) return;
      } else {
        for (const _particle of self.particles) {
          _particle.move((currentTime - self.time) / 1000);
        }
        self.time = currentTime;
      }
      self.redraw();
      window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
  }
}

export { Environment, Particle, Event, CollisionSystem };
