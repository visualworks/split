import React from "react";
import FilterControls from "components/filter-controls";

export default class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.controller.map.setTarget("map");
    }

    render() {
        let filterControls = <div id="overlayer-map" className={"box container is-widescreen"}>
            <FilterControls controller={this.props.controller}
                            clientId={this.props.clientId} linesList={this.props.linesList}
                            selectedLineId={this.props.selectedLineId} routesList={this.props.routesList}
                            selectedRouteId={this.props.selectedRouteId}/>
        </div>;
        return (<div>
            <div id={"map"} className={"map"}>
                {this.props.isDirectLink ? null : filterControls}
                <div id={"referencePoints"}></div>
                <div id={"vehiclesInRoute"}></div>
            </div>
        </div>);
    }
}
