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
        const isLoggedUser = this.props.controller.component.state.userName && this.props.controller.component.state.clientId > 0;
        const overlayVisible = isLoggedUser ? null : "is-invisible";
        let filterControls = <div id="overlayer-map" className={`${overlayVisible} box is-widescreen`}>
            <FilterControls controller={this.props.controller} isMobile={this.props.isMobile}
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
