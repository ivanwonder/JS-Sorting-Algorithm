import React from "react";
import config from "./config";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";

class RouteLink extends React.Component {
  render() {
    return config.map(element => {
      return (
        <ListItem key={element.path}>
          <Link to={element.path}>
            {element.name}
          </Link>
        </ListItem>
      );
    });
  }
}

export { RouteLink };
