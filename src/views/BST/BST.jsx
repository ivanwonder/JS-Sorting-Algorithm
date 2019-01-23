import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { BST } from "../../../algorithm/BST";
import { buildTreeCanvas } from "../../../lib/buildTreeCanvas";

class BSTComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ""
    };
    this.tree = null;
    this.container = React.createRef();
  }

  componentDidMount() {
    this.tree = new BST();
    this.tree.buildRandomTree(10);
    let canvas = buildTreeCanvas(this.tree.head);
    this.container.current.appendChild(canvas);
  }

  deleteMin() {
    this.tree.deleteMin();
    if (this.tree.head) {
      const canvas = buildTreeCanvas(this.tree.head);
      this.container.current.appendChild(canvas);
    }
  }

  deleteMax() {
    this.tree.deleteMax();
    if (this.tree.head) {
      const canvas = buildTreeCanvas(this.tree.head);
      this.container.current.appendChild(canvas);
    }
  }

  deleteValue(value) {
    const node = this.tree.delete(Number(value));
    if (node) {
      const canvas = buildTreeCanvas(this.tree.head);
      this.container.current.appendChild(canvas);
    }
  }

  render() {
    const { classes } = this.props;
    const buttonStyle = {
      variant: "contained",
      color: "primary",
      className: classes.button
    };

    return (
      <div>
        <Button onClick={this.deleteMin.bind(this)} {...buttonStyle}>
          delete minimal node
        </Button>
        <Button onClick={this.deleteMax.bind(this)} {...buttonStyle}>
          delete maximal node
        </Button>
        <TextField
          label="value need to be deleted:"
          fullWidth={true}
          margin="normal"
          value={this.state.value}
          onChange={event =>
            this.setState({
              value: event.target.value
            })
          }
        />
        <Button
          onClick={this.deleteValue.bind(this, this.state.value)}
          {...buttonStyle}
        >
          delete value
        </Button>
        <div ref={this.container} />
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

BSTComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BSTComponent);
