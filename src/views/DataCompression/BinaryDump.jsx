import React from "react";
import PropTypes from "prop-types";
import { BinaryIn } from "../../../algorithm/DataCompression";
import { withStyles } from "@material-ui/core/styles";

const width = 10;
const height = 10;
const minCanvasHeight = 50;

class BinaryDumpComponent extends React.Component {
  constructor() {
    super();
    this.canvas = React.createRef();
    this.canvasWidth = 300;
  }

  beginDraw(ctx, position) {
    while (!BinaryIn.isEmpty()) {
      ctx.fillStyle = BinaryIn.readBoolean() ? "black" : "white";
      ctx.fillRect(position.x, position.y, width, height);
      if (position.x + width > this.canvasWidth) {
        position.x = 0;
        position.y += height;
      } else {
        position.x += width;
      }
    }
  }

  componentDidMount() {
    this.canvasWidth = this.canvas.current.parentNode.getBoundingClientRect().width;
    const { renderData } = this.props;
    BinaryIn.initialize(renderData);
    const strBite = this.props.renderData.length * 16;
    const canvasHeight = Math.ceil(strBite / Math.floor(this.canvasWidth / width)) * height;
    this.canvas.current.width = this.canvasWidth;
    this.canvas.current.height = Math.max(canvasHeight, minCanvasHeight);
    const ctx = this.canvas.current.getContext("2d");
    ctx.clearRect(0, 0, this.canvasWidth, canvasHeight);
    this.beginDraw(ctx, { x: 0, y: 0 });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.renderData !== this.props.renderData) {
      this.componentDidMount();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <canvas ref={this.canvas} />
      </div>
    );
  }
}

BinaryDumpComponent.propTypes = {
  renderData: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

const style = theme => ({
  container: {
    // flexWrap: "wrap",
    // display: "flex"
    width: "100%"
  },
  blackBlock: {
    backgroundColor: "black",
    width,
    height,
    display: "inline-block"
  },
  whiteBlock: {
    backgroundColor: "white",
    width,
    height,
    display: "inline-block"
  }
});

export default withStyles(style)(BinaryDumpComponent);
