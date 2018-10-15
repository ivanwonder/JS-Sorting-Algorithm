import React, { Component } from "react";
import {
  Particle,
  CollisionSystem,
  Environment
} from "../../../algorithm/Event-Driven-Simulation";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

class Simulates {
  constructor() {
    this._simu = [];
  }

  stop() {
    for (const iterator of this._simu) {
      iterator.stop();
    }
    this._simu = [];
  }

  add(simu) {
    this._simu.push(simu);
  }
}

class Collisions extends Component {
  constructor() {
    super();
    this.canvas = React.createRef();
    this.simulates = new Simulates();

    this.state = {
      width: 0,
      height: 0,
      particleNum: 0
    };
    // this.runExample = this.runExample.bind(this);
  }

  runExample(num) {
    if (typeof num !== "number") {
      const simu = new CollisionSystem(
        this.buildRandomEDS(
          this.state.width,
          this.state.height,
          this.state.particleNum
        ),
        new Environment(
          this.state.width,
          this.state.height,
          this.canvas.current
        )
      ).simulate(new Date().getTime() + 5 * 60 * 1000);

      this.simulates.stop();
      simu && this.simulates.add(simu);
    } else {
      this.example(num);
    }
  }

  example(exam) {
    let particles = [];
    switch (exam) {
      case 0:
        particles = [
          new Particle(30, 90, 135, 0, 15, 300),
          new Particle(150, 90, -135, 0, 5, 150),
          new Particle(270, 95, -135, 0, 15, 300)
        ];
        break;
      case 1:
        particles = [
          new Particle(123, 240, 0, 0, 10, 100),
          new Particle(143.001, 240, 0, 0, 10, 100),
          new Particle(163.002, 240, 0, 0, 10, 100),
          new Particle(183.003, 240, 0, 0, 10, 100),
          new Particle(132, 220, 0, 0, 10, 100),
          new Particle(152.001, 220, 0, 0, 10, 100),
          new Particle(172.002, 220, 0, 0, 10, 100),
          new Particle(141, 202, 0, 0, 10, 100),
          new Particle(161.001, 202, 0, 0, 10, 100),
          new Particle(150, 182, 0, 0, 10, 100),
          new Particle(120, 30, 0, 150, 10, 400)
        ];
        break;
      case 2:
        particles = [
          new Particle(30, 90, 150, 0, 10, 100),
          new Particle(135, 90, 0, 0, 10, 100),
          new Particle(155.001, 90, 0, 0, 10, 100),
          new Particle(175.002, 90, 0, 0, 10, 100)
        ];
        break;
      default:
        break;
    }

    const simulate = new CollisionSystem(
      particles,
      new Environment(300, 300, this.canvas.current)
    ).simulate(new Date().getTime() + 5 * 60 * 1000);

    this.simulates.stop();
    simulate && this.simulates.add(simulate);
  }

  buildRandomEDS(width, height, num) {
    /**
     * @type {Array<Particle>}
     */
    const randomParticles = [];
    function buildRandomParticle() {
      const radius = Math.round(10 * Math.random() + 10);
      const intervalRx = width - 2 * radius;
      const intervalRy = height - 2 * radius;
      const rx = Math.random() * intervalRx + radius;
      const ry = Math.random() * intervalRy + radius;
      const vx = Math.random() * 100 + 100;
      const vy = Math.random() * 100 + 100;
      return new Particle(rx, ry, vx, vy, radius, 100);
    }

    loop1: while (randomParticles.length < num) {
      const _par = buildRandomParticle();
      for (const _particle of randomParticles) {
        if (_particle.isOverlapped(_par)) {
          continue loop1;
        }
      }
      randomParticles.push(_par);
    }

    return randomParticles;
  }

  componentWillUnmount() {
    this.simulates.stop();
  }

  render() {
    const { classes } = this.props;
    const buttonStyle = {
      variant: "contained",
      color: "primary",
      className: classes.button
    };
    const textFieldStyle = {
      fullWidth: true,
      margin: "normal"
    };

    return (
      <div>
        <TextField
          label="canvas width:"
          {...textFieldStyle}
          value={this.state.width}
          onChange={event =>
            this.setState({
              width: event.target.value
            })
          }
        />
        <TextField
          label="canvas height:"
          {...textFieldStyle}
          value={this.state.height}
          onChange={event =>
            this.setState({
              height: event.target.value
            })
          }
        />
        <TextField
          label="particle count:"
          {...textFieldStyle}
          value={this.state.particleNum}
          onChange={event =>
            this.setState({
              particleNum: event.target.value
            })
          }
        />
        <Button onClick={this.runExample.bind(this, "")} {...buttonStyle}>
          run
        </Button>
        <Button onClick={this.runExample.bind(this, 0)} {...buttonStyle}>
          example 1
        </Button>
        <Button onClick={this.runExample.bind(this, 1)} {...buttonStyle}>
          example 2
        </Button>
        <Button onClick={this.runExample.bind(this, 2)} {...buttonStyle}>
          example 3
        </Button>
        <br />
        <canvas
          width="0"
          height="0"
          style={{ backgroundColor: "aliceblue" }}
          ref={this.canvas}
        />
      </div>
    );
  }
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

Collisions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Collisions);
