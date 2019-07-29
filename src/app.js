import React, {Component} from "react";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: 0,
            userId: 0,
            userName: "",
            userRole: "",
            clientName: "Escolha um cliente",
            clientList: [],
            linesList: [],
            selectedLineId: 0,
            routesList: [],
            selectedRouteId: 0,
            referencePointsList: [],
            routePointsList: [],
            vehiclesInRoute: [],
            map: {},
            maps: {},
            routePolyline: undefined,
            mapCenter: {lat: -22.79575, lng: -43.36342},
            mapZoom: 16,
            mapTypeId: "satellite",
            defaultMapCenter: {lat: -22.79575, lng:  -43.36342},
            defaultMapZoom: 16,
            mapAccessKey: {
                key: process.env.MAP_ACCESS_KEY
            },
            vehiclesGarageList: [],
            showVehiclesGarage: false,
            showUsersManagement: false,
            showTrafficLayer: true,
            showTransitLayer: true,
            showLoading: "is-hidden",
            intervalID: 0,
            CONST_MAPPINGS: require("const.json"),
            isDirectLink: false
        };
    }
    getSOAPUrl(soapCollection, soapParams) {
        let soapUrl = this.state.CONST_MAPPINGS.SOAP_URL;
        if (soapCollection) {
            const SOAP_OPERATOR = this.state.CONST_MAPPINGS.SOAP_OPERATOR;
            soapUrl = soapUrl + "?" + SOAP_OPERATOR + "=" + soapCollection;
            if (soapParams && typeof(soapParams) === "object") {
                let urlParams = "";
                Object.keys(soapParams).forEach((parameter, index) => {
                    urlParams = urlParams + "&" + parameter + "=" + soapParams[parameter];
                });
                soapUrl = soapUrl + urlParams;
            }
            soapUrl = soapUrl + "&cache=" + Date.now(new Date());
        }
        return soapUrl;
    }
    getAPIUrl(path) {
        return `${this.state.CONST_MAPPINGS.API_URL}${path}`;
    }
    showVehiclesGarage() {
        return this.state.showVehiclesGarage;
    }
    getProgressBarSize() {
        return this.state.progressBarSize;
    }
    getClientId() {
        return this.state.clientId;
    }
    getClientName() {
        return this.state.clientName;
    }
    getVehiclesGarage() {
        const wsCollection = this.state.CONST_MAPPINGS.API_VEHICLES_GARAGE;
        const wsVehiclesGarage = this.getAPIUrl(`${wsCollection}?configId=2`);
        let vehiclesGarageList = [];
        this.setState({
            vehiclesGarageList: vehiclesGarageList,
            showLoading: ""
        });
        fetch(wsVehiclesGarage).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(this.state.CONST_MAPPINGS.RESPONSE_NOT_OK);
        }).then((json) => {
            if (json.body) {
                vehiclesGarageList = json.body;
                this.setState({
                    vehiclesGarageList: vehiclesGarageList,
                    showVehiclesGarage: true,
                    showLoading: "is-hidden"
                });
                return vehiclesGarageList;
            }
            throw new Error(this.state.CONST_MAPPINGS.RESPONSE_DATA_CHANGED);
        });
        return vehiclesGarageList;
    }
    unsetVehiclesGarage() {
        this.setState({
            vehiclesGarageList: [],
            showVehiclesGarage: false,
            showLoading: "is-hidden"
        });
    }
    getClientList() {
        const wsCollection = this.state.CONST_MAPPINGS.API_CLIENT_PER_USER;
        const wsClientPerUser = this.getAPIUrl(`${wsCollection}?configId=2`);
        let clientList = [];
        this.setState({
            showLoading: ""
        });
        fetch(wsClientPerUser).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(this.state.CONST_MAPPINGS.RESPONSE_NOT_OK)
        }).then((json) => {
            if (json && json.hasOwnProperty("body")) {
                clientList = json.body;
                this.setState({
                    clientList: clientList,
                    showLoading: "is-hidden"
                });
                return clientList;
            }
            throw new Error(this.state.CONST_MAPPINGS.RESPONSE_DATA_CHANGED);
        });
        return clientList;
    }
    getLinesPerClient(clientId, clientName) {
        let linesList = [];
        if (clientId && clientName) {
            this.setState({
                clientId: clientId,
                clientName: clientName,
                linesList: linesList,
                selectedLineId: 0,
                showLoading: ""
            });
            const wsCollection = this.state.CONST_MAPPINGS.API_LINES_PER_CLIENT;
            const wsLinesPerClient = this.getAPIUrl(`${wsCollection}?configId=2&companyId=${clientId}`);
            fetch(wsLinesPerClient).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(this.state.CONST_MAPPINGS.RESPONSE_NOT_OK);
            }).then((json) => {
                if (json && json.hasOwnProperty("body")) {
                    linesList = json.body;
                    let selectedLineId = (linesList.routeId) ? linesList.routeId : linesList[0].routeId;
                    this.setState({
                        linesList: linesList,
                        selectedLineId: selectedLineId,
                        showLoading: "is-hidden"
                    });
                    this.getRoutesPerLine(selectedLineId);
                    return linesList;
                }
                throw new Error(this.state.CONST_MAPPINGS.RESPONSE_DATA_CHANGED);
            });
        }
        return linesList;
    }
    getRoutesPerLine(lineId) {
        const route = this.state.linesList.find((line) => line.routeId === lineId);
        const directions = route ? route.directions : [];
        this.setState({
            selectedLineId: lineId,
            routesList: directions,
            selectedRouteId: (directions.directionId) ? directions.directionId : directions[0].directionId,
            showLoading: "is-hidden"
        });
        return directions;
    }
    getReferencePointsPerRoute(routeId) {
        let referencePointsList = [];
        const maps = this.state.maps;
        if (maps && typeof(maps.DirectionsRenderer) === "function") {
            const directionsDisplay = new maps.DirectionsRenderer();
            directionsDisplay.setMap(null);
        }
        if (routeId) {
            this.setState({
                selectedRouteId: routeId,
                referencePointsList: referencePointsList,
                showLoading: ""
            });
            const wsCollection = this.state.CONST_MAPPINGS.API_REFERENCE_POINTS;
            const wsReferencePoints = this.getAPIUrl(`${wsCollection}?configId=2&directionId=${routeId}`);
            fetch(wsReferencePoints).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(this.state.CONST_MAPPINGS.RESPONSE_NOT_OK);
            }).then((json) => {
                if (json && json.hasOwnProperty("body")) {
                    referencePointsList = json.body;
                    let centerReference = Math.ceil(referencePointsList.length/2);
                    this.setState({
                        referencePointsList: referencePointsList,
                        mapCenter: {
                            lat: parseFloat(referencePointsList[centerReference].latitude),
                            lng: parseFloat(referencePointsList[centerReference].longitude)
                        },
                        mapZoom: (referencePointsList.length > 15) ? this.state.defaultMapZoom - 3 : this.state.defaultMapZoom + 1,
                        showLoading: "is-hidden"
                    });
                    return referencePointsList;
                } else {
                    throw new Error(this.state.CONST_MAPPINGS.REFERENCE_POINTS_NOT_FOUND);
                }
            });
        }
        return referencePointsList;
    }
    showRoutePoints() {
        const routePointsList = this.state.routePointsList;
        if (routePointsList.length > 0) {
            let centerReference = Math.ceil(routePointsList.length/2);
            this.setState({
                mapCenter: {
                    lat: parseFloat(routePointsList[centerReference].latitude),
                    lng: parseFloat(routePointsList[centerReference].longitude)
                },
                mapZoom: (routePointsList.length > 10) ? this.state.defaultMapZoom - 3 : this.state.defaultMapZoom + 1
            });
            this.showRoute();
        }
    }
    getVehiclesInRoute(lineId, routeId) {
        let vehiclesInRoute = [];
        if (this.state.intervalID > 0) {
            clearInterval(this.state.intervalID);
        }
        this.setState({
            vehiclesInRoute: vehiclesInRoute,
            intervalID: 0,
            showLoading: ""
        });
        if (lineId, routeId) {
            const wsCollection = this.state.CONST_MAPPINGS.API_VEHICLES_ROUTE;
            const wsVehiclesInRoute = this.getAPIUrl(`${wsCollection}?configId=2&routeId=${lineId}&directionId=${routeId}`);
            fetch(wsVehiclesInRoute).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(this.state.CONST_MAPPINGS.RESPONSE_NOT_OK);
            }).then((json) => {
                if (json && json.hasOwnProperty("body")) {
                    if (json.body.length > 0) {
                        vehiclesInRoute = json.body[0].vehicles;
                        if (vehiclesInRoute.length > 0) {
                            let intervalID = setInterval(() => {
                                this.getVehiclesInRoute(this.state.selectedLineId, this.state.selectedRouteId);
                            }, 30000);
                            this.setState({
                                vehiclesInRoute: vehiclesInRoute,
                                intervalID: intervalID,
                                showLoading: "is-hidden"
                            });
                        }
                        let routePointsList = json.body[0].stops;
                        if (this.state.routePointsList !== routePointsList) {
                            this.setState({
                                routePointsList: routePointsList,
                                showLoading: "is-hidden"
                            });
                            this.showRoutePoints();
                        }
                    }
                    return vehiclesInRoute;
                } else {
                    throw new Error(this.state.CONST_MAPPINGS.VEHICLES_IN_ROUTE_NOT_FOUND);
                }
            });
        }
        return vehiclesInRoute;
    }
    showRoute() {
        const maps = this.state.map;
        const routePointsList = this.state.routePointsList;
        if (routePointsList.length > 2) {
            const aWaypoints = routePointsList.map((reference) => ({
                lat: parseFloat(reference.latitude),
                lng: parseFloat(reference.longitude)
            }));
            if (this.state.routePolyline) {
                this.state.routePolyline.setMap(null);
                this.state.routePolyline.setPath([]);
            }
            const routePolyline = new google.maps.Polyline({
                path: aWaypoints,
                geodesic: true,
                strokeColor: '#209cee',
                strokeOpacity: 1.0,
                strokeWeight: 5
            });
            this.setState({
                routePolyline: routePolyline
            });
            this.state.routePolyline.setMap(maps);
        }
	}
    loadDirectLink() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        if (params.has("cliente")) {
            this.setState({
                clientId: params.get("cliente")
            });
            if (params.has("linha")) {
                this.setState({
                    lineId: params.get("linha")
                });
                if (params.has("rota")) {
                    this.setState({
                        routeId: params.get("rota"),
                        selectedRouteId: params.get("rota")
                    });
                    try {
                        this.getLinesPerClient(params.get("cliente"));
                        this.getRoutesPerLine(params.get("linha"));
                        this.getReferencePointsPerRoute(params.get("rota"));
                        this.getVehiclesInRoute(params.get("linha"), params.get("rota"));
                        this.setState({
                            isDirectLink: true
                        });
                    } catch (error) {
                        alert(`${this.state.CONST_MAPPINGS.LOAD_DIRECT_LINK_FAILED} ${error}`);
                        throw new Error(`${this.state.CONST_MAPPINGS.LOAD_DIRECT_LINK_FAILED} ${error}`);
                    }
                } else {
                    alert(this.state.CONST_MAPPINGS.ID_ROUTE_NOT_FOUND);
                    throw new Error(this.state.CONST_MAPPINGS.ID_ROUTE_NOT_FOUND);
                }
            } else {
                alert(this.state.CONST_MAPPINGS.ID_LINE_NOT_FOUND);
                throw new Error(this.state.CONST_MAPPINGS.ID_LINE_NOT_FOUND);
            }
        }
    }
    getDefaultMapCenter() {
        return this.state.defaultMapCenter;
    }
    getDefaultMapZoom() {
        return this.state.defaultMapZoom;
    }
    getMapAccessKeys() {
        return this.state.mapAccessKey;
    }
    resetDefaultState() {
        const maps = this.state.maps;
        if (maps && typeof(maps.DirectionsRenderer) === "function") {
            const directionsDisplay = new maps.DirectionsRenderer();
            directionsDisplay.setMap(null);
        }
        this.setState({
            clientId: 0,
            userId: 0,
            userName: "",
            userRole: "",
            clientName: "Escolha um cliente",
            clientList: [],
            linesList: [],
            selectedLineId: 0,
            routesList: [],
            selectedRouteId: 0,
            referencePointsList: [],
            routePointsList: [],
            vehiclesInRoute: [],
            map: {},
            maps: {},
            routePolyline: undefined,
            mapCenter: {lat: -22.79575, lng: -43.36342},
            mapZoom: 16,
            mapTypeId: "satellite",
            defaultMapCenter: {lat: -22.79575, lng:  -43.36342},
            defaultMapZoom: 16,
            mapAccessKey: {
                key: process.env.MAP_ACCESS_KEY
            },
            vehiclesGarageList: [],
            showVehiclesGarage: false,
            showUsersManagement: false,
            showTrafficLayer: true,
            showTransitLayer: true,
            intervalID: 0,
            CONST_MAPPINGS: require("const.json"),
            isDirectLink: false
        });
    }
}