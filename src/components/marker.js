import React from "react";

export default class Marker extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button id={this.props.markerId}
                    className={this.props.buttonStyle} title={this.props.title}
                    onClick={this.props.onClick}>
            <span className="icon">
                <i className={`fa ${this.props.iconStyle}`}></i>
            </span>
                <span className={this.props.descriptionStyle}>{this.props.description}</span>
            </button>
        );
    }
}
