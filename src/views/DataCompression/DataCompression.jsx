import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropType from "prop-types";
import { LZW } from "../../../algorithm/DataCompression";
import BinaryDump from "./BinaryDump";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class DataCompressionComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      compress: "",
      expand: "",
      expandResult: ""
    };
  }

  compress() {
    this.setState({
      expand: LZW.compress(this.state.compress)
    });
  }

  expand() {
    this.setState({
      expandResult: LZW.expand(this.state.expand)
    });
  }

  render() {
    const { classes } = this.props;
    const buttonStyle = {
      variant: "contained",
      color: "primary"
    };
    return (
      <div>
        <div className={classes.inputContainer}>
          <TextField
            label="compress string:"
            margin="normal"
            multiline
            variant="outlined"
            className={classes.textField}
            value={this.state.compress}
            onChange={event =>
              this.setState({
                compress: event.target.value
              })
            }
          />
          <div className={classes.button}>
            <Button {...buttonStyle} onClick={this.compress.bind(this)}>
              compress
            </Button>
          </div>
        </div>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              the data before compress:
            </Typography>
            <Typography variant="h5" component="h2">
              {this.state.compress}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              the compressed data:
            </Typography>
            <Typography variant="h5" component="h2">
              {this.state.expand}
            </Typography>
            <Typography component="p">
              compression ratio:{" "}
              {this.state.compress
                ? (this.state.expand.length / this.state.compress.length) * 100
                : 0}
              %
            </Typography>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color="textSecondary" gutterBottom>
                  the BinaryDump of data before compress:
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <BinaryDump renderData={this.state.compress} />
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color="textSecondary" gutterBottom>
                  the BinaryDump of compressed data:
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <BinaryDump renderData={this.state.expand} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </CardContent>
        </Card>

        <div className={classes.inputContainer}>
          <TextField
            label="expand string:"
            margin="normal"
            multiline
            variant="outlined"
            className={classes.textField}
            value={this.state.expand}
            onChange={event =>
              this.setState({
                expand: event.target.value
              })
            }
          />
          <div className={classes.button}>
            <Button {...buttonStyle} onClick={this.expand.bind(this)}>
              expand
            </Button>
          </div>
        </div>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              the data before expand:
            </Typography>
            <Typography variant="h5" component="h2">
              {this.state.expand}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              the expanded data:
            </Typography>
            <Typography variant="h5" component="h2">
              {this.state.expandResult}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const styles = theme => ({
  inputContainer: {
    display: "flex"
  },
  textField: {
    flex: 1
  },
  button: {
    flex: 0,
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing.unit
  }
});

DataCompressionComponent.propTypes = {
  classes: PropType.object.isRequired
};

export default withStyles(styles)(DataCompressionComponent);
