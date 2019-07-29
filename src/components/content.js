import React, {Component} from "react";
import App from "app";
import GoogleMapReact from 'google-map-react';
import FilterControls from "components/filter-controls";

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
        const toggleText = (event) => {
            let target;
            switch(event.target.classList[0]) {
                case "fa":
                    target = event.target.parentNode.parentNode.childNodes[1];
                    break;
                case "icon":
                    target = event.target.parentNode.childNodes[1];
                    break;
                case "button":
                    target = event.target.childNodes[1];
                    break;
            }
            if (target && target.classList) {
                target.classList.toggle("is-invisible");
            }
        };
        if (this.props.referencePointsList.length > 0) {
            const ReferencePointMarker = ({ text }) => {
                return (<a className="button is-small is-danger marker-reference-point" title={text} onClick={toggleText}><span className="icon"><i className="fa fa-map-pin"></i></span><span className="is-invisible"> {text}</span></a>);
            };
            this.props.referencePointsList.forEach((referencePoint, index) => {
                if (typeof(parseFloat(referencePoint.latitude)) === "number" && typeof(parseFloat(referencePoint.longitude)) === "number") {
                    this.referencePointsList.push(<ReferencePointMarker key={index} lat={parseFloat(referencePoint.latitude)} lng={parseFloat(referencePoint.longitude)} text={referencePoint.name} />);
                }
            });
        }
        const VehiclesInRouteMarker = ({text}) => {
            return (<a className="button is-small is-primary is-rounded marker-vehicles-route" title={text}><span className="icon"><i className="fa fa-bus"></i></span>&nbsp;{text}</a>);
        };
        if (this.props.vehiclesInRoute.length > 0) {
            this.props.vehiclesInRoute.forEach((vehicleInRoute, index) => {
                this.vehiclesInRoute.push(<VehiclesInRouteMarker key={index} lat={parseFloat(vehicleInRoute.latitude)} lng={parseFloat(vehicleInRoute.longitude)} text={vehicleInRoute.description} />)
            });
        }
        let filterControls = <div id="overlayer-map">
            <FilterControls mapTypeId={ this.props.mapTypeId } onChangeMapType={ this.props.onChangeMapType } showTransitLayer={ this.props.showTransitLayer } showTrafficLayer={ this.props.showTrafficLayer } onChangeTraffic={ this.props.onChangeTraffic } onChangeTransit={ this.props.onChangeTransit } changeRoutes={this.props.changeRoutes} executeSearch={this.props.executeSearch} getRoutes={this.props.getRoutes} getLines={this.props.getLines} changeLines={this.props.changeLines} clientId={this.props.clientId} linesList={this.props.linesList} selectedLineId={this.props.selectedLineId} routesList={this.props.routesList} selectedRouteId={this.props.selectedRouteId} />
        </div>;
        let aLayerTypes = [];
        if (this.props.showTransitLayer) {
            aLayerTypes.push("TransitLayer");
        } else {
            let fnFindRemove = (element, index) => {
                if(element === "TransitLayer") {
                    aLayerTypes.splice(index, 1);
                }
            };
            aLayerTypes.find(fnFindRemove);
        }
        if (this.props.showTrafficLayer){
            aLayerTypes.push("TrafficLayer");
        } else {
            let fnFindRemove = (element, index) => {
                if(element === "TrafficLayer") {
                    aLayerTypes.splice(index, 1);
                }
            };
            aLayerTypes.find(fnFindRemove);
        }
        return (<section className="content">
            <div id="map">
                { this.props.isDirectLink ? '' : filterControls }
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: this.state.mapAccessKey.key,
                        language: 'pt',
                        region: 'br'
                    }}
                    layerTypes={ aLayerTypes }
                    yesIWantToUseGoogleMapApiInternals={ true }
                    onGoogleApiLoaded={ this.props.setMap }
                    defaultCenter={ this.mapCenter }
                    center={ this.props.mapCenter }
                    defaultZoom={ this.mapZoom }
                    zoom={ this.props.mapZoom }>
                    { this.referencePointsList }
                    { this.vehiclesInRoute }
                </GoogleMapReact>
            </div>
        </section>);
    }
}