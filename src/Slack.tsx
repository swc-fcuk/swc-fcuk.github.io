import * as React from "react";

interface SlackProps {
  
}

class Slack extends React.Component<SlackProps, {}> {
  render() {
    return <div>
      <iframe src="https://swc-fcuk-slack-inviter.herokuapp.com/"
        width='400px'
        height='400px'
        frameBorder='none' />
    </div>;
  }
}

export default Slack;
