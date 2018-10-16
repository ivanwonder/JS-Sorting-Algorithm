import Loadable from "react-loadable";
import React from "react";

const loadable = file => {
  return Loadable({
    loader: () => file,
    loading: function Loading() {
      return <div>is loading...</div>;
    }
  });
};
export { loadable };
