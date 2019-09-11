import React from "react";

export default class FilterControls extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let optionLines = this.props.controller.getLines();
        let optionRoutes = this.props.controller.getRoutes();
        return (
            <div className="field is-horizontal">
                <div className="control">
                    <div className="select is-rounded">
                        <select value={this.props.selectedLineId} onChange={(event) => { this.props.controller.changeLines(event) }}>
                            {optionLines}
                        </select>
                    </div>
                </div>
                <div className="control">
                    <div className="select is-rounded">
                        <select value={this.props.selectedRouteId} onChange={(event) => { this.props.controller.changeRoutes(event) }}>
                            {optionRoutes}
                        </select>
                    </div>
                </div>
                <div className="control">
                    <button type="button" className="button is-success" onClick={ (event) => { this.props.controller.executeSearch(event) }}>Buscar</button>
                </div>
            </div>
        );
    }
}