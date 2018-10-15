import React from "react";
import config, { getIndex } from "./config";
import { withRouter } from "react-router";
import ListItem from "@material-ui/core/ListItem";
import PropTypes from "prop-types";

class RouteLink extends React.Component {
  constructor() {
    super();
    this.state = {
      prePathname: "",
      selectedIndex: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== state.prePathname) {
      state.prePathname = props.location.pathname;
      state.selectedIndex = getIndex(state.prePathname);
      return state;
    }
    return null;
  }

  handleClicked(index) {
    const currentPath = config[index].path;
    if (this.props.location.pathname !== currentPath) {
      this.props.history.push(currentPath);
    }
  }

  render() {
    return config.map((element, index) => {
      return (
        <ListItem
          key={element.path}
          button
          selected={this.state.selectedIndex === index}
          onClick={this.handleClicked.bind(this, index)}
        >
          <div>{element.name}</div>
        </ListItem>
      );
    });
  }
}

RouteLink.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(RouteLink);
