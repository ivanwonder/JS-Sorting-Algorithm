import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
// import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import RouteLink from "./route/buildRouteLink";
import { withRouter } from "react-router";
import { getName } from "./route/config";

const drawerWidth = 240;
const ios = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth,
    height: "100vh"
  },
  swipeableDrawer: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    height: `calc(100vh - ${theme.spacing.unit * 3 * 2}px)`,
    overflow: "auto",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentCommon: {
    padding: theme.spacing.unit * 3
  },
  "content-left": {
    marginLeft: isMobile ? 0 : -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  }
});

class PersistentDrawer extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      anchor: "left",
      prePathname: "",
      routeName: ""
    };
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  handleChangeAnchor(event) {
    this.setState({
      anchor: event.target.value
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== state.prePathname) {
      state.prePathname = props.location.pathname;
      state.routeName = getName(state.prePathname);
      return state;
    }
    return null;
  }

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;

    const OwnDrawer = isMobile ? SwipeableDrawer : Drawer;
    const _props = isMobile
      ? {
        onClose: this.handleDrawerClose.bind(this),
        onOpen: this.handleDrawerOpen.bind(this),
        disableBackdropTransition: !ios,
        disableDiscovery: ios
      }
      : {
        variant: "persistent"
      };

    const drawerStyle = !isMobile
      ? {
        classes: {
          paper: classes.drawerPaper
        }
      }
      : {
        classes: {
          paper: classes.swipeableDrawer
        }
      };

    const root = !isMobile ? {
      className: classes.root
    } : {}

    const contentStyle = {
      className: classNames(classes.contentCommon)
    }

    if (!isMobile) {
      contentStyle.className = classNames(classes.content, classes[`content-${anchor}`], {
        [classes.contentShift]: open,
        [classes[`contentShift-${anchor}`]]: open
      }, contentStyle.className)
    }

    const drawer = (
      <OwnDrawer {..._props} {...drawerStyle} anchor={anchor} open={open}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose.bind(this)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <RouteLink routeChange={this.handleDrawerClose.bind(this)}/>
        </List>
      </OwnDrawer>
    );

    let before = null;
    let after = null;

    if (anchor === "left") {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div { ...root }>
        <AppBar
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
            [classes[`appBarShift-${anchor}`]]: open
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen.bind(this)}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {this.state.routeName}
            </Typography>
          </Toolbar>
        </AppBar>
        {before}
        <main
          {...contentStyle}
        >
          <div className={classes.drawerHeader} />
          {this.props.children}
        </main>
        {after}
      </div>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  children: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(
  withStyles(styles, { withTheme: true })(PersistentDrawer)
);

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
