
import * as WinJS from 'winjs';
import * as React from 'react';

import ProfilePicture from './ProfilePicture';

var ReactWinJS = require('react-winjs');

function calc100PercentMinus(n: number) {
    return n === 0 ?
        "100%" :
        "calc(100% - " + (n + "px") + ")";
}

var PeoplePage = React.createClass({
    handleToggleSelectionMode() {
        this.setState({
            selectionMode: !this.state.selectionMode
        });
        this.props.onNavigate(["people"]);
        this.refs.listView.winControl.selection.clear();
    },
    handleSelectionChanged(eventObject: any) {
        var listView = eventObject.currentTarget.winControl;
        var indices = listView.selection.getIndices();
        // Post to avoid navigating while in the middle of the event handler
        setTimeout(function () {
            this.setState({ selectedPeople: indices });
            this.props.onNavigate(indices.length === 1 && !this.state.selectionMode ? ["people", indices[0]] : ["people"]);
        }.bind(this), 0);
    },
    handleDelete() {
        var people = this.props.people;
        var indices = this.state.selectedPeople;
        indices.sort();
        indices.reverse();
        indices.forEach(function (i: number) {
            people.splice(i, 1);
        });
        this.setState({
            selectedPeople: [],
            selectionMode: false
        });
        this.props.onPeopleChanged(people);
    },
    handleContentAnimating(eventObject: any) {
        //// Disable ListView's entrance animation
        //if (eventObject.detail.type === "entrance") {
        //    eventObject.preventDefault();
        //}
    },
    personRenderer: ReactWinJS.reactRenderer(function (person: any) {
        return (
            <div>
                <ProfilePicture backgroundUrl={person.data.picture} size={34} />
                <span className="name">{person.data.name}</span>
            </div>
        );
    }),
    //groupHeaderRenderer: ReactWinJS.reactRenderer(function(item: any) {
    //    return (
    //        <div>{item.data.title}</div>
    //    );
    //}),
    renderPeoplePane(peoplePaneWidth: number) {

        return (
            <div className="peopleSearchPane" style={{ height: "100%", width: peoplePaneWidth, display: "inline-block", verticalAlign: "top" }}>
                <ReactWinJS.ListView
                    ref="listView"
                    className="peopleListView win-selectionstylefilled"
                    style={{ height: "calc(100% - 48px)" }}
                    itemDataSource={this.props.people.dataSource}
                    itemTemplate={this.personRenderer}
                    //groupDataSource={this.props.people.groups.dataSource}
                    //groupHeaderTemplate={this.groupHeaderRenderer}
                    layout={this.state.layout}
                    selectionMode={this.state.selectionMode ? "multi" : "single"}
                    tapBehavior={this.state.selectionMode ? "toggleSelect" : "directSelect"}
                    onSelectionChanged={this.handleSelectionChanged}
                    onContentAnimating={this.handleContentAnimating} />
            </div>
        );
    },
    renderProfilePane(selectedIndex: any, peoplePaneWidth: number) {
        if (selectedIndex === null) {
            return (
                <div className="profilePane" style={{ height: "100%", width: calc100PercentMinus(peoplePaneWidth), display: "inline-block", verticalAlign: "top" }}>
                    <div style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <h1 className="win-h1" style={{ color: "grey" }}>No Selection</h1>
                    </div>
                </div>
            );
        } else {
            var selectedPerson = this.props.people.getAt(selectedIndex);
            return (
                <div className="profilePane" style={{ height: "100%", width: calc100PercentMinus(peoplePaneWidth), display: "inline-block", verticalAlign: "top" }}>
                    <div className="profileHeader">
                        <div className="name">{selectedPerson.name}</div>
                        <div className="personInfo">
                            <ProfilePicture backgroundUrl={selectedPerson.picture} size={100} />
                            <div className="profileStatus">
                                <span className="message">
                                    {selectedPerson.status}
                                </span>
                                <span className="source">{selectedPerson.statusHoursAgo} hours ago</span>
                            </div>
                        </div>
                    </div>
                    <div className="separator" />
                    <div className="profileContent">
                        <ul>
                            <li><span className="messageIcon" />Message</li>
                            <li><span className="emailIcon" />Email work</li>
                            <li><span className="mapIcon" />Map home</li>
                        </ul>
                    </div>
                </div>
            );
        }
    },
    propTypes: {
        mode: React.PropTypes.oneOf(["small", "medium", "large"]).isRequired,
        people: React.PropTypes.object.isRequired,
        location: React.PropTypes.array.isRequired,
        onNavigate: React.PropTypes.func.isRequired,
        onPeopleChanged: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            layout: { type: WinJS.UI.ListLayout },
            selectedPeople: [],
            selectionMode: false
        };
    },
    render() {
        var selectedIndex = this.props.location.length >= 2 ? this.props.location[1] : null;

        if (this.props.mode === "small") {
            if (selectedIndex === null) {
                return this.renderPeoplePane("100%");
            } else {
                return this.renderProfilePane(selectedIndex, 0);
            }
        } else {
            var peoplePaneWidth = 320;
            return (
                <div style={{ height: "100%" }}>
                    {this.renderPeoplePane(peoplePaneWidth)}
                    {this.renderProfilePane(selectedIndex, peoplePaneWidth)}
                </div>
            );
        }
    }
});

module.exports = PeoplePage;


