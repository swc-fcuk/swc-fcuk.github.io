
//import * as WinJS from 'winjs';
import * as React from 'react';

//var ReactWinJS = require('react-winjs');


export interface ProfilePictureProps {
    // TODO: State or Props?
    backgroundUrl: string;
    size: number;
}


export interface ProfilePictureState {

}


export default class ProfilePicture extends React.Component<ProfilePictureProps,
    ProfilePictureState> {

    render() {
        const size: number = this.props.size
        const cssUrl: string = "url(" + this.props.backgroundUrl + ")"

        return (
            <div className="profilePicture" style={{
                backgroundImage: cssUrl,
                width: size,
                height: size,
                WebkitBorderRadius: size,
                MozBorderRadius: size,
                borderRadius: size,
                backgroundSize: "cover",
                display: "inline-block"
            }}>
                <img src="src/images/profile.png" height={size} width={size} />
            </div>
        );
    }

}


