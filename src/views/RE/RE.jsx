import React from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { RE } from "../../../algorithm/RE";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import MySnackbarContentWrapper from "../../component/snackBar";

class REComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      re: "",
      str: "",
      open: false,
      icon: "success",
      info: ""
    };

    this.handleClose = this.handleClose.bind(this);
  }

  checkStr(str) {
    const state = {
      open: true,
      icon: "success",
      info: `the string '${
        this.state.str
      }' is matched by the regular expression '${this.state.re}'`
    };
    if (!new RE(this.state.re).recognizes(this.state.str)) {
      state.icon = "error";
      state.info = `the string '${
        this.state.str
      }' is not matched by the regular expression '${this.state.re}'`;
    }
    this.setState(state);
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const buttonStyle = {
      variant: "contained",
      color: "primary",
      className: classes.button
    };

    const Code = ({ children }) => (
      <code style={{ "backgroundColor": "rgba(220,220,220,.5)", padding: "0 2px" }}>
        {children}
      </code>
    );

    return (
      <div>
        <TextField
          label="Regular Expressions:"
          fullWidth={true}
          margin="normal"
          value={this.state.re}
          onChange={event =>
            this.setState({
              re: event.target.value
            })
          }
        />
        <Typography variant="caption" gutterBottom>
          Special characters supported in regular expressions.(
          <Code>*</Code>,
          <Code>.</Code>,
          <Code>|</Code>,
          <Code>(</Code>,
          <Code>)</Code>
        )
        </Typography>
        <TextField
          label="string:"
          fullWidth={true}
          margin="normal"
          value={this.state.str}
          onChange={event =>
            this.setState({
              str: event.target.value
            })
          }
        />
        <Button {...buttonStyle} onClick={this.checkStr.bind(this)}>
          check
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={this.state.icon}
            message={this.state.info}
            className={classes.snackRoot}
          />
        </Snackbar>
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
  },
  snackRoot: {
    "flex-wrap": "nowrap"
  }
});

REComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(REComponent);
