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
import MySnackbarContentWrapper from "../../component/snackBar";
import Snackbar from "@material-ui/core/Snackbar";
import { encodeToHex, decodeFromHex } from "../../util/encode";

class DataCompressionComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      compress: "",
      compressData: "",
      compressResult: "",
      expand: "",
      decodeExpand: "",
      expandResult: "",

      open: false,
      icon: "error",
      info: ""
    };
    this.handleClose = this.handleClose.bind(this);
  }

  compress() {
    const compress = LZW.compress(this.state.compress);
    this.setState({
      expand: encodeToHex(compress),
      compressResult: compress,
      compressData: this.state.compress
    });
  }

  expand() {
    let decodeExpand;
    let expandResult;

    try {
      decodeExpand = decodeFromHex(this.state.expand);
    } catch (e) {
      return this.setState({
        open: true,
        info: "the string need to be expanded cannot be decoded;"
      });
    }

    try {
      expandResult = LZW.expand(decodeExpand);
    } catch (e) {
      return this.setState({
        open: true,
        info: "Maybe the data is not generated by this program"
      });
    }

    this.setState({
      expandResult,
      decodeExpand
    });
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
      color: "primary"
    };
    return (
      <div>
        <div className={classes.inputContainer}>
          <TextField
            label="compress string:"
            margin="normal"
            multiline
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
              {this.state.compressData}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              the compressed data:
            </Typography>
            <Typography variant="h5" component="h2">
              {this.state.compressResult}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              compression ratio:{" "}
              {this.state.compressData.length
                ? (this.state.compressResult.length /
                    this.state.compressData.length) *
                  100
                : 0}
              %;
            </Typography>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color="textSecondary" gutterBottom>
                  the BinaryDump of data before compress:
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <BinaryDump renderData={this.state.compressData} />
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color="textSecondary" gutterBottom>
                  the BinaryDump of compressed data:
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <BinaryDump renderData={this.state.compressResult} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </CardContent>
        </Card>

        <div className={classes.inputContainer}>
          <TextField
            label="expand string:(hexadecimal code which only need last four bits)"
            margin="normal"
            multiline
            className={classes.textField}
            value={this.state.expand}
            onChange={event => {
              this.setState({
                expand: event.target.value
              });
            }}
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
              {this.state.decodeExpand}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              the expanded data:
            </Typography>
            <Typography variant="h5" component="h2">
              {this.state.expandResult}
            </Typography>
          </CardContent>
        </Card>

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
  },
  snackRoot: {
    "flex-wrap": "nowrap"
  }
});

DataCompressionComponent.propTypes = {
  classes: PropType.object.isRequired
};

export default withStyles(styles)(DataCompressionComponent);
