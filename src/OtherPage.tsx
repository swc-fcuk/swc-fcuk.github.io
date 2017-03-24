
import * as React from 'react';

var urlToContent: any = {
    new: "What's New",
    groups: "Some other view",
    settings: "Settings"
};

var OtherPage = React.createClass({
    propTypes: {
        location: React.PropTypes.array.isRequired
    },
    render() {
        var title = urlToContent[this.props.location] || "Other";
        return <h2 className="win-h2" style={{ marginLeft: "10px" }}>{title}</h2>
    }
});

module.exports = OtherPage;
