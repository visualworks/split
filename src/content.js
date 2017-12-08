import React, {Component} from "react";
import App from "app";
import GoogleMapReact from 'google-map-react';
import FilterControls from "filter-controls";

export default class Content extends App {
    constructor(props) {
        super(props);
        this.mapCenter = this.getDefaultMapCenter();
        this.mapZoom = this.getDefaultMapZoom();
        this.referencePointsList = [];
        this.vehiclesInRoute = [];
    }
    componentWillReceiveProps(){
        this.referencePointsList = [];
        this.vehiclesInRoute = [];
    }
    render() {
        const ReferencePointMarker = ({ text }) => {
            return (<a className="button is-small is-danger" title={text}><span className="icon"><i className="fa fa-minus-square"></i></span></a>);
        };
        if (this.props.referencePointsList.length > 0) {
            this.props.referencePointsList.forEach((referencePoint, index) => {
                this.referencePointsList.push(<ReferencePointMarker key={index} lat={referencePoint.Latitude} lng={referencePoint.Longitude} text={referencePoint.Nome} />);
            });
        }
        const VehiclesInRouteMarker = ({text}) => {
            return (<a className="button is-medium is-primary" title={text}><span classNme="icon"><i className="fa fa-bus"></i></span></a>);
        };
        if (this.props.vehiclesInRoute.length > 0) {
            this.props.vehiclesInRoute.forEach((vehicleInRoute, index) => {
                this.vehiclesInRoute.push(<VehiclesInRouteMarker key={index} lat={vehicleInRoute.Latitude} lng={vehicleInRoute.Longitude} text={vehicleInRoute.Descricao} />)
            });
        }
        return (<section className="content">
            <div id="map">
                <div id="overlayer-map">
                    <FilterControls changeRoutes={this.props.changeRoutes} executeSearch={this.props.executeSearch} getRoutes={this.props.getRoutes} getLines={this.props.getLines} changeLines={this.props.changeLines} clientId={this.props.clientId} linesList={this.props.linesList} selectedLineId={this.props.selectedLineId} routesList={this.props.routesList} selectedRouteId={this.props.selectedRouteId} />
                </div>
                <GoogleMapReact 
                    bootstrapURLKeys={this.state.mapAccessKey}
                    defaultCenter={this.mapCenter}
                    center={this.props.mapCenter}
                    defaultZoom={this.mapZoom}
                    zoom={this.props.mapZoom}>
                    {this.referencePointsList}
                    {this.vehiclesInRoute}
                </GoogleMapReact>
            </div>
        </section>);
    }
}