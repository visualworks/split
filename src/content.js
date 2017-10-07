import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import Menu from "./menu";

const Marker = ({ text }) => <div>{text}</div>;

export default class Content extends Component {
    constructor(props) {
        super(props);
        let defaultProps = {
            center: {lat: -22.79575, lng: -43.36342},
            zoom: 12
        };
        this.state = {defaultProps: defaultProps};
    }
    
    render() {
        let googleMaps = <GoogleMapReact
            bootstrapURLKeys={{key: "AIzaSyCMfQ6a_eX4SwWbyfUqEVCdXYnovZfg9fk"}}
            defaultCenter={this.state.defaultProps.center}
            defaultZoom={this.state.defaultProps.zoom}
            minZoom={this.state.defaultProps.zoom}>
        </GoogleMapReact>;
        return (<section className="content">
            <div id="map">
                <div id="overlayer-map"><Menu selectedClientId={this.props.selectedClientId} /></div>
                {googleMaps}
            </div>
        </section>);
    }
}