import * as React from "react";
import * as ReactDOM from "react-dom";
import Hello from "./Hello";
import Slack from "./Slack";
import Tree from "./Tree";

ReactDOM.render(
  <Slack />,
  document.getElementById("hello")
);

ReactDOM.render(
  <Hello name="fcuk..." />,
  document.getElementById("slack")
);

ReactDOM.render(
  <Tree />, 
  document.getElementById("tree")
);



