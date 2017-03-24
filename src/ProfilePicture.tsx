
import * as React from 'react';


export interface ProfilePictureProps {
    backgroundUrl: string;
    size: number;
}


export default class ProfilePicture extends React.Component<ProfilePictureProps, undefined> {

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
                <img src="assets/img/profile.png" height={size} width={size} />
            </div>
        );
    }

}


