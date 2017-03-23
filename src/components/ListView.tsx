var React = require('react');
var ReactWinJS = require('react-winjs');



module.exports = React.createClass({
    itemRenderer: ReactWinJS.reactRenderer(function (item: any) {
        return <div>{item.data.title}</div>;
    }),
    getInitialState: function () {
        return {
            list: new WinJS.Binding.List([
                { title: "Apple" },
                { title: "Banana" },
                { title: "Grape" },
                { title: "Lemon" },
                { title: "Mint" },
                { title: "Orange" },
                { title: "Pineapple" },
                { title: "Strawberry" }
            ]),
            layout: { type: WinJS.UI.ListLayout }
        };
    },
    render: function () {
        return (
            <ReactWinJS.ListView
                className="listViewExample win-selectionstylefilled"
                style={{ height: "200px" }}
                itemDataSource={this.state.list.dataSource}
                itemTemplate={this.itemRenderer}
                layout={this.state.layout}
                selectionMode="single"
                tapBehavior="directSelect" />
        );
    }
});
