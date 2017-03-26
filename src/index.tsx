
import * as WinJS from 'winjs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

//import * as ReactWinJS from 'react-winjs';
var ReactWinJS = require('react-winjs');

//import PeoplePage from './PeoplePage';
var PeoplePage = require('./PeoplePage.tsx');
var OtherPage = require('./OtherPage.tsx');
import ProfilePicture from './ProfilePicture'

//import * as Data from './FakeData'
//var Data = require('./FakeData.ts');
var Data = require('./Data');

var splitViewId = "rootSplitView";

var splitViewConfigs: any = {
    small: {
        closedDisplayMode: "none",
        openedDisplayMode: "overlay"
    },
    medium: {
        closedDisplayMode: "inline",
        openedDisplayMode: "overlay"
    },
    large: {
        closedDisplayMode: "inline",
        openedDisplayMode: "inline"
    }
};

function merge(/* objs */) {
    var k: any;
    var result: any = {};
    for (var i = 0, len = arguments.length; i < len; i++) {
        var obj = arguments[i];
        if (obj) {
            for (k in obj) { result[k] = obj[k]; }
        }
    }
    return result;
}

function getMode() {
    return (
        window.innerWidth >= 1366 ? "large" :
            window.innerWidth >= 800 ? "medium" :
                "small"
    );
}

var App = React.createClass({
    getSplitViewConfig() {
        return splitViewConfigs[this.state.mode];
    },
    handlePeopleChanged(newPeople: any) {
        this.setState({
            people: newPeople
        });
    },
    handleNavigation(newLocation: any) {
        this.setState({
            location: newLocation
        });
    },
    handleBack() {
        var location = this.state.location;
        location.pop();
        this.handleNavigation(location);
    },
    handleResize() {
        var prevMode = this.state.mode;
        var nextMode = getMode();

        if (prevMode !== nextMode) {
            this.setState({ mode: nextMode });
        }
    },
    handleCommandInvoked(newLocation: any) {
        this.setState({
            location: newLocation,
            paneOpened: this.getSplitViewConfig().openedDisplayMode === "overlay" ? false : this.state.paneOpened
        });
    },
    handleTogglePane() {
        this.setState({ paneOpened: !this.state.paneOpened });
    },
    handleAfterClose() {
        this.setState({ paneOpened: false });
    },
    getInitialState() {
        var mode = getMode();

        var groupKey = function (data: any) {
            return data.name[0].toUpperCase();
        };

        var groupData = function (data: any) {
            return { title: groupKey(data) };
        };

        var sorter = function (a: any, b: any) {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        };

        var data = new WinJS.Binding.List(Data.people)
            .createSorted(sorter)
            .createGrouped(groupKey, groupData);

        return {
            people: data,
            mode: mode,
            location: ["people"]
        };
    },
    componentWillMount() {
        window.addEventListener("resize", this.handleResize);
    },
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },
    renderPeoplePage() {
        return (
            <PeoplePage
                mode={this.state.mode}
                people={this.state.people}
                location={this.state.location}
                onNavigate={this.handleNavigation}
                onPeopleChanged={this.handlePeopleChanged} />
        );
    },
    renderOtherPage() {
        return <OtherPage location={this.state.location} />
    },
    renderContent() {
        if (this.state.location.length === 0 || this.state.location[0] === "people") {
            return this.renderPeoplePage();
        } else {
            return this.renderOtherPage();
        }
    },
    // TODO: Fix Me!
    renderBackButton() {
        var canGoBack = this.state.location.length > 1;
        var shouldShowBackButton = canGoBack && this.state.mode === "small";
        return shouldShowBackButton ?
            <button style={{ display: "inline-block" }} className="win-backbutton" onClick={this.handleBack} /> :
            null;
    },
    render() {
        var paneComponent = (
            <div>
                <ReactWinJS.SplitView.Command
                    label="People"
                    icon="contact"
                    onInvoked={this.handleCommandInvoked.bind(null, ["people"])} />
                <ReactWinJS.SplitView.Command
                    label="What's New"
                    icon="comment"
                    onInvoked={this.handleCommandInvoked.bind(null, ["new"])} />
                <ReactWinJS.SplitView.Command
                    /* TODO: same as the text? */
                    label="Some other view."
                    icon="people"
                    onInvoked={this.handleCommandInvoked.bind(null, ["groups"])} />

                <ReactWinJS.SplitView.Command
                    style={{ position: "absolute", bottom: 0, width: "100%" }}
                    label="Settings"
                    icon="settings"
                    onInvoked={this.handleCommandInvoked.bind(null, ["settings"])} />
            </div>
        );

        var contentComponent = this.renderContent();

        return (
            <div style={{ height: "100%" }}>
                {/*top*/}
                <div style={{ height: 48, backgroundColor: "rgba(1, 121, 216, 0.3)" }} className="win-ui-dark">
                    <ReactWinJS.SplitViewPaneToggle
                        aria-controls={splitViewId}
                        style={{ display: 'inline-block' }}
                        paneOpened={this.state.paneOpened}
                        onInvoked={this.handleTogglePane} />
                    {this.renderBackButton()}
                    {/* TODO: add test for the html title */}
                    <h4 className="win-h4" style={{ display: "inline-block", marginLeft: 5 }}>fcuk</h4>
                </div>
                <ReactWinJS.SplitView
                    id={splitViewId}
                    style={{ height: "calc(100% - 48px)" }}
                    paneComponent={paneComponent}
                    contentComponent={contentComponent}
                    onAfterClose={this.handleAfterClose}
                    paneOpened={this.state.paneOpened}

                    /*{...this.getSplitViewConfig() }*/ />
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById("app"));


