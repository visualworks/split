import React from "react";

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const footer = (
            <footer>
                <div className={"container has-text-centered"}>
                    <div className={`notification ${this.props.notification.type}`}>
                        <button className={"delete"}
                                onClick={this.props.controller.onCloseNotification.bind(this.props.controller)}></button>
                        <p>{this.props.notification.message}</p>
                    </div>
                </div>
            </footer>
        );
        return this.props.notification.status > 0 ? footer : null;
    }
}