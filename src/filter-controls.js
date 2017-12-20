import React, {Component} from "react";
import App from "app";

export default class FilterControls extends App {
    constructor(props) {
        super(props);
    }
    render() {
        let optionLines = this.props.getLines();
        let optionRoutes = this.props.getRoutes();
        return (
            <div className="field is-horizontal">
                <div className="control">
                    <div className="select is-rounded">
                        <select value={this.props.selectedLineId} onChange={(event) => { this.props.changeLines(event) }}>
                            {optionLines}
                        </select>
                    </div>
                </div>
                <div className="control">
                    <div className="select is-rounded">
                        <select value={this.props.selectedRouteId} onChange={(event) => { this.props.changeRoutes(event) }}>
                            {optionRoutes}
                        </select>
                    </div>
                </div>
                <div className="control">
                    <button type="button" className="button is-success" onClick={ (event) => { this.props.executeSearch(event) }}>Buscar</button>
                </div>
            </div>
        );
    }
}