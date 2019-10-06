import React from "react";
import ReactDOM from "react-dom";
import {Map, View} from 'ol';
import {Vector as VectorLayer} from "ol/layer";
import {Vector as VectorSource} from "ol/source";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import {Style, Stroke} from 'ol/style';
import Overlay from "ol/Overlay";
import Auth from "auth";
import Marker from "./components/marker";

export default class App {
    static defaultState() {
        return {
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
            mapCenter: {lat: -22.9032, lng: -43.1729},
            mapZoom: 13,
            defaultMapCenter: {lat: -22.9032, lng: -43.1729},
            defaultMapZoom: 13,
            vehiclesGarageList: [],
            showVehiclesGarage: false,
            showUsersManagement: false,
            showTrafficLayer: true,
            showTransitLayer: true,
            showLoading: "is-hidden",
            notification: {
                type: "is-info",
                message: "Hello World",
                status: 0
            },
            intervalID: 0,
            CONST_MAPPINGS: require("const.json"),
            isDirectLink: false,
            isMobile: false
        };
    }

    static isResponsive() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth >= 769 && window.innerWidth <= 1023;
        return isMobile || isTablet;
    }

    constructor(component) {
        this.component = component;
        this.map = new Map({
            size: ["100%", "100%"]
        });
        const source = new OSM();
        const layer = new TileLayer({
            source: source
        });
        this.map.addLayer(layer);
        source.on("tileloadstart", (event) => this.component.state.showLoading = "");
        source.on("tileloadend", (event) => this.component.state.showLoading = "is-hidden");
        source.on("tileloaderror", (event) => console.log("tileloaderror", event));
        this.map.setView(new View({
            center: fromLonLat([this.component.state.mapCenter.lng, this.component.state.mapCenter.lat]),
            zoom: this.component.state.mapZoom
        }));
    }

    getAPIUrl(path) {
        return `${this.component.state.CONST_MAPPINGS.API_URL}${path}`;
    }

    showVehiclesGarage() {
        return this.component.state.showVehiclesGarage;
    }

    getVehiclesGarage() {
        const wsCollection = this.component.state.CONST_MAPPINGS.API_VEHICLES_GARAGE;
        const wsVehiclesGarage = this.getAPIUrl(`${wsCollection}?configId=2`);
        let vehiclesGarageList = [];
        this.component.setState({
            vehiclesGarageList: vehiclesGarageList,
            showLoading: this.component.state.showLoading ? "" : this.component.state.showLoading
        });
        fetch(wsVehiclesGarage).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response);
        }).then((json) => {
            if (json.body) {
                vehiclesGarageList = json.body;
                this.component.setState({
                    vehiclesGarageList: vehiclesGarageList,
                    showVehiclesGarage: true,
                    showLoading: !this.component.state.showLoading ? "is-hidden" : this.component.state.showLoading
                });
                return vehiclesGarageList;
            }
            this.component.setState({
                notification: {
                    type: "is-danger",
                    message: this.component.state.CONST_MAPPINGS.RESPONSE_DATA_CHANGED,
                    code: 500
                }
            });
            const error = this.component.state.CONST_MAPPINGS.RESPONSE_DATA_CHANGED;
            this.showNotification(response, "is-danger", error, 500);
            // throw new Error(error);
        }).catch((response) => {
            const error = this.component.state.CONST_MAPPINGS.RESPONSE_NOT_OK;
            this.showNotification(response, "is-danger", `${error}: ${response}`, 500);
        });
        return vehiclesGarageList;
    }

    unsetVehiclesGarage() {
        this.component.setState({
            vehiclesGarageList: [],
            showVehiclesGarage: false,
            showLoading: "is-hidden"
        });
    }

    getClientList() {
        const wsCollection = this.component.state.CONST_MAPPINGS.API_CLIENT_PER_USER;
        const wsClientPerUser = this.getAPIUrl(`${wsCollection}?configId=2`);
        let clientList = [];
        this.component.setState({
            showLoading: this.component.state.showLoading ? "" : this.component.state.showLoading
        });
        fetch(wsClientPerUser).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response);
        }).then((json) => {
            if (json && json.hasOwnProperty("body")) {
                clientList = json.body;
                this.component.setState({
                    clientList: clientList,
                    showLoading: !this.component.state.showLoading ? "is-hidden" : this.component.state.showLoading
                });
                return clientList;
            }
            const error = this.component.state.CONST_MAPPINGS.RESPONSE_DATA_CHANGED;
            this.showNotification(json, "is-danger", error, 500);
            // throw new Error(error);
        }).catch((response) => {
            const error = this.component.state.CONST_MAPPINGS.RESPONSE_NOT_OK;
            this.showNotification(response, "is-danger", `${error}: ${response}`, 500);
        });
        return clientList;
    }

    getLinesPerClient(clientId, clientName, resolve) {
        let linesList = [];
        if (clientId) {
            this.component.setState({
                clientId: clientId,
                clientName: clientName,
                linesList: linesList,
                selectedLineId: 0,
                showLoading: this.component.state.showLoading ? "" : this.component.state.showLoading
            });
            const wsCollection = this.component.state.CONST_MAPPINGS.API_LINES_PER_CLIENT;
            const wsLinesPerClient = this.getAPIUrl(`${wsCollection}?configId=2&companyId=${clientId}`);
            fetch(wsLinesPerClient).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response);
            }).then((json) => {
                if (json && json.hasOwnProperty("body")) {
                    linesList = json.body;
                    let selectedLineId = (linesList.routeId) ? linesList.routeId : linesList[0].routeId;
                    this.component.setState({
                        linesList: linesList,
                        selectedLineId: selectedLineId,
                        showLoading: !this.component.state.showLoading ? "is-hidden" : this.component.state.showLoading
                    });
                    this.getRoutesPerLine(selectedLineId);
                    if (resolve) {
                        resolve();
                    }
                    return linesList;
                }
                const error = this.component.state.CONST_MAPPINGS.RESPONSE_DATA_CHANGED;
                this.showNotification(json, "is-danger", error, 500);
                // throw new Error(error);
                if (resolve) {
                    resolve(undefined);
                }
            }).catch((response) => {
                const error = this.component.state.CONST_MAPPINGS.RESPONSE_NOT_OK;
                this.showNotification(response, "is-danger", `${error}: ${response}`, 500);
            });
        }
        return linesList;
    }

    getRoutesPerLine(lineId) {
        const route = this.component.state.linesList.find((line) => line.routeId === lineId);
        const directions = route ? route.directions : [];
        this.component.setState({
            selectedLineId: lineId,
            routesList: directions,
            selectedRouteId: (directions.directionId) ? directions.directionId : directions[0].directionId,
            showLoading: !this.component.state.showLoading ? "is-hidden" : this.component.state.showLoading
        });
        return directions;
    }

    getReferencePointsPerRoute(routeId, resolve) {
        let referencePointsList = [];
        if (routeId) {
            const wsCollection = this.component.state.CONST_MAPPINGS.API_REFERENCE_POINTS;
            const wsReferencePoints = this.getAPIUrl(`${wsCollection}?configId=2&directionId=${routeId}`);
            fetch(wsReferencePoints).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response);
            }).then((json) => {
                if (json && json.hasOwnProperty("body")) {
                    referencePointsList = json.body;
                    if (resolve) {
                        resolve(referencePointsList);
                    }
                    return referencePointsList;
                } else {
                    const error = this.component.state.CONST_MAPPINGS.REFERENCE_POINTS_NOT_FOUND;
                    this.showNotification(json, "is-danger", error, 500);
                    if (resolve) {
                        resolve(undefined);
                    }
                    throw new Error(error);
                }
            }).catch((response) => {
                const error = this.component.state.CONST_MAPPINGS.RESPONSE_NOT_OK;
                this.showNotification(response, "is-danger", `${error}: ${response}`, 500);
                if (this.component.state.isDirectLink) {
                    this.executeSearch();
                }
            });
        }
        return referencePointsList;
    }

    _centerMap(routePointsList) {
        const middlePoint = Math.ceil(routePointsList.length / 2);
        const center = this.getMarkerPosition(routePointsList[middlePoint]);
        this.map.getView().setCenter(center);
        const zoom = routePointsList.length > 300 ? this.component.state.defaultMapZoom : this.component.state.defaultMapZoom + 2;
        this.map.getView().setZoom(zoom);
    }

    getMarkerPosition(marker) {
        return fromLonLat([parseFloat(marker.longitude), parseFloat(marker.latitude)]);
    }

    getVehiclesInRoute(lineId, routeId, resolve) {
        let vehiclesInRoute = [];
        let routePointsList = this.component.state.routePointsList || [];
        if (lineId && routeId) {
            const wsCollection = this.component.state.CONST_MAPPINGS.API_VEHICLES_ROUTE;
            const wsVehiclesInRoute = this.getAPIUrl(`${wsCollection}?configId=2&routeId=${lineId}&directionId=${routeId}`);
            fetch(wsVehiclesInRoute).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response);
            }).then((json) => {
                if (json && json.hasOwnProperty("body")) {
                    let nextState = {};
                    if (json.body.length > 0) {
                        nextState.vehiclesInRoute = json.body[0].vehicles;
                        if (nextState.vehiclesInRoute.length > 0 && this.component.state.intervalID === 0) {
                            nextState.intervalID = setInterval(() => {
                                this.executeSearch();
                            }, 30000);
                        }
                        if (JSON.stringify(routePointsList) !== JSON.stringify(json.body[0].stops)) {
                            nextState.routePointsList = json.body[0].stops;
                        }
                    }
                    if (resolve) {
                        resolve(nextState);
                    }
                    return vehiclesInRoute;
                } else {
                    const error = this.component.state.CONST_MAPPINGS.VEHICLES_IN_ROUTE_NOT_FOUND;
                    this.showNotification(json, "is-danger", error, 404);
                    if (resolve) {
                        resolve(undefined);
                    }
                }
            }).catch((response) => {
                const error = this.component.state.CONST_MAPPINGS.RESPONSE_NOT_OK;
                this.showNotification(response, "is-danger", `${error}: ${response}`, 500);
                if (this.component.state.isDirectLink) {
                    this.executeSearch();
                }
            });
        }
        return vehiclesInRoute;
    }

    showRoute(routePointsList) {
        if (routePointsList.length > 2) {
            const aWaypoints = routePointsList.map((reference) => ([
                parseFloat(reference.longitude),
                parseFloat(reference.latitude)
            ]));
            const geometryLines = new LineString(aWaypoints).transform("EPSG:4326", "EPSG:3857");
            const vectorFeature = new Feature({
                geometry: geometryLines,
                name: "Route Line",
                id: "RouteLine"
            });
            vectorFeature.setStyle(new Style({
                stroke: new Stroke({
                    color: "#209cee",
                    width: 7
                })
            }));
            const layerLines = new VectorLayer({
                source: new VectorSource({
                    features: [vectorFeature]
                })
            });
            this.map.addLayer(layerLines);
            this._centerMap(routePointsList);
        }
    }

    checkDirectLink() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        if (params.has("cliente") && params.has("linha") && params.has("rota")) {
            return {
                isDirectLink: true,
                clientId: params.get("cliente"),
                lineId: params.get("linha"),
                selectedLineId: params.get("linha"),
                routeId: params.get("rota"),
                selectedRouteId: params.get("rota")
            };
        }
        return {};
    }

    loadDirectLink() {
        if (this.component.state.isDirectLink) {
            try {
                this.executeSearch();
            } catch (error) {
                const errorMessage = `${this.component.state.CONST_MAPPINGS.LOAD_DIRECT_LINK_FAILED} ${error}`;
                this.showNotification({}, "is-danger", errorMessage, 500);
                // throw new Error(errorMessage);
            }
        }
    }

    resetDefaultState() {
        this.component.setState(App.defaultState());
    }

    /* ##########################################
        Layout.js
     */
    setClient(event, clientId, clientName) {
        if (event) {
            event.preventDefault();
        }
        if (clientId) {
            this.getLinesPerClient(clientId, clientName);
            localStorage.setItem("clientId", clientId);
            localStorage.setItem("clientName", clientName);
        }
    }

    doLogin(event, username, password) {
        this.component.setState({
            showLoading: this.component.state.showLoading ? "" : this.component.state.showLoading
        });
        event.preventDefault();
        const myAuth = new Auth();
        let oBodyData = {
            "user": username,
            "passwd": password,
            "op": "authenticateUser"
        };
        myAuth.doPost(oBodyData).then((response) => {
            if (response.user && response.role) {
                const userInfo = {
                    userId: 1,
                    userName: response.user,
                    userRole: response.role
                };
                localStorage.setItem("userId", userInfo.userId);
                localStorage.setItem("userName", userInfo.userName);
                localStorage.setItem("userRole", userInfo.userRole);
                this.component.setState(userInfo);
                this.getClientList();
            } else {
                this.showNotification({}, "is-danger", response.result, 500);
                // throw new Error(response.result);
            }
            this.component.setState({
                showLoading: !this.component.state.showLoading ? "is-hidden" : this.component.state.showLoading
            });
        });
    }

    doLogout(event) {
        event.preventDefault();
        this.unsetVehiclesGarage();
        this.resetDefaultState();
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("clientId");
        localStorage.removeItem("clientName");
    }

    checkUserSession() {
        if (localStorage.getItem("userName") && this.component.state.userName === "") {
            this.component.setState({
                userId: localStorage.getItem("userId"),
                userName: localStorage.getItem("userName"),
                userRole: localStorage.getItem("userRole")
            });
            this.getClientList();
            if (localStorage.getItem("clientId") && this.component.state.clientId === 0) {
                this.component.setState({
                    clientId: localStorage.getItem("clientId"),
                    clientName: localStorage.getItem("clientName")
                });
                this.setClient(null, localStorage.getItem("clientId"), localStorage.getItem("clientName"));
            }
        }
    }

    manageUsers() {
        this.component.setState({
            showUsersManagement: true
        });
    }

    showNotification(response, type = "is-warning", message = "", status = 0) {
        this.onCloseNotification();
        console.error(response);
        this.component.setState({
            showLoading: "is-hidden",
            notification: {
                type: type,
                message: message,
                status: status || parseInt(response.status)
            }
        });
    }

    onCloseNotification(event) {
        if (event) {
            event.preventDefault();
        }
        this.component.setState({
            showLoading: "is-hidden",
            notification: {
                type: "is-info",
                message: "Hello World",
                status: 0
            }
        });
    }

    onCloseDialog() {
        this.component.setState({
            showUsersManagement: false
        });
    }

    onSubmitForm(user, passwd, rePasswd, adminUser, adminPasswd) {
        if (passwd !== rePasswd) {
            alert("Senha e Confirmação de Senha não são idênticas.");
        } else if (this.component.state.userRole !== "admin") {
            alert("Seu usuário não tem permissões para esta função.");
        } else {
            try {
                let oBodyData = {
                    "user": user,
                    "passwd": passwd,
                    "adminUser": adminUser,
                    "adminPasswd": adminPasswd,
                    "rePasswd": rePasswd,
                    "op": "updateUser"
                };
                const myAuth = new Auth();
                myAuth.doPost(oBodyData).then((response) => {
                    if (response.result) {
                        this.showNotification(response, "is-danger", response.result, 500);
                        // throw new Error(response.result);
                    }
                });
            } catch (e) {
                this.showNotification(e, "is-danger", e, 500);
                // throw new Error(e);
            }
        }
        // adminUser, user, passwd, rePasswd, adminPasswd
    }

    showVehiclesGarage(event) {
        event.preventDefault();
        this.component.setState({
            showLoading: ""
        });
        this.getVehiclesGarage();
    }

    hideVehiclesGarage(event) {
        event.preventDefault();
        this.component.setState({
            showLoading: "is-hidden"
        });
        this.unsetVehiclesGarage();
    }

    locateVehicleGarage(event, vehicle) {
        ReactDOM.unmountComponentAtNode(document.getElementById("vehiclesInRoute"));
        this.map.getOverlays().clear();
        this.hideVehiclesGarage(event);
        if (this.component.state.intervalID > 0) {
            clearInterval(this.component.state.intervalID);
            this.component.setState({
                intervalID: 0
            });
        }
        this.component.setState({
            selectedLineId: 0,
            selectedRouteId: 0,
            referencePointsList: [],
            vehiclesGarageList: [],
            vehiclesInRoute: [vehicle]
        });
        const marker = this.createMarkersVehicles(vehicle, 0);
        const overlay = this.createOverlay(vehicle, 0);
        const vehiclesElement = React.createElement("div", {}, marker);
        ReactDOM.render(vehiclesElement, document.getElementById("vehiclesInRoute"));
        overlay.setElement(document.getElementById(`vehicleId-${vehicle.id}-0`));
        this.map.addOverlay(overlay);
        this.map.getView().setCenter(this.getMarkerPosition(vehicle));
        this.map.getView().setZoom(18);
    }

    changeLines(event) {
        let selectedLineId = event.target.value;
        this.component.setState({
            selectedLineId: selectedLineId
        });
        this.getRoutesPerLine(selectedLineId);
    }

    getLines() {
        const lineList = this.component.state.linesList;
        return (lineList.routeId || lineList).map((line, index) => {
            return (<option key={index}
                            value={line.routeId} title={line.number}>{line.name}</option>);
        });
    }

    changeRoutes(event) {
        let selectedRouteId = event.target.value;
        this.component.setState({
            selectedRouteId: selectedRouteId
        });
    }

    getRoutes() {
        const routeList = this.component.state.routesList;
        return (routeList.directionId || routeList).map((route, index) => {
            return (<option key={index}
                            value={route.directionId} title={route.number}>{route.name}</option>);
        });
        return routeList;
    }

    executeSearch(event) {
        if (event) {
            event.preventDefault();
        }
        const isNewSearch = Boolean(event && event.type);
        const loadingState = {
            showLoading: this.component.state.showLoading ? "" : this.component.state.showLoading
        };
        if (isNewSearch || this.component.state.isDirectLink) {
            clearInterval(this.component.state.intervalID);
            loadingState.intervalID = 0;
            loadingState.notification = {
                type: "is-info",
                message: "Hello World",
                status: 0
            };
        }
        this.component.setState(loadingState);
        const loadingData = new Promise((resolve) => {
            if (isNewSearch || (this.component.state.isDirectLink && this.component.state.referencePointsList.length === 0)) {
                return this.getReferencePointsPerRoute(this.component.state.selectedRouteId, resolve)
            } else {
                resolve(this.component.state.referencePointsList);
            }
        });
        loadingData.then((referencePointsList) => {
            let newState = {};
            if ((isNewSearch || this.component.state.isDirectLink) && referencePointsList.length > 0) {
                newState.referencePointsList = referencePointsList;
            }
            let nextProps = {
                vehiclesInRoute: [],
                routePointsList: this.component.state.routePointsList,
                showLoading: !this.component.state.showLoading ? "is-hidden" : this.component.state.showLoading
            };
            nextProps = Object.assign(nextProps, newState);
            const loadVehiclesInRoute = new Promise((resolve) => {
                return this.getVehiclesInRoute(this.component.state.selectedLineId, this.component.state.selectedRouteId, resolve);
            });
            loadVehiclesInRoute.then((vehicleProps) => {
                ReactDOM.unmountComponentAtNode(document.getElementById("vehiclesInRoute"));
                ReactDOM.unmountComponentAtNode(document.getElementById("referencePoints"));
                this.map.getOverlays().clear();
                if (isNewSearch) {
                    if (this.map.getLayers()) {
                        this.map.getLayers().forEach((layer) => {
                            if (layer.getType() === "VECTOR") {
                                this.map.removeLayer(layer);
                            }
                        });
                    }
                }
                return vehicleProps;
            }).then((vehicleProps) => {
                const finalState = Object.assign(nextProps, vehicleProps);
                this.component.setState(finalState);
                const isNewSearchOrDirectLink = isNewSearch === true || this.component.state.isDirectLink === true || false;
                this.createAndRenderMarkers(finalState, isNewSearchOrDirectLink);
                if (isNewSearch || this.component.state.isDirectLink) {
                    this.showRoute(finalState.routePointsList);
                }
                const overlaysVehiclesInRoute = (finalState.vehiclesInRoute || []).map(this.createOverlay.bind(this));
                const overlaysReferencePoints = (finalState.referencePointsList || []).map(this.createOverlay.bind(this));
                return overlaysReferencePoints.concat(overlaysVehiclesInRoute);
            }).then((overlays) => {
                overlays.forEach((overlay) => {
                    const markerId = overlay.getId().substr(8, overlay.getId().length);
                    if (document.getElementById(markerId)) {
                        overlay.setElement(document.getElementById(markerId));
                        this.map.addOverlay(overlay);
                    } else {
                        console.log("markerId not found", markerId);
                    }
                });
            });
        });
    }

    createOverlay(marker, index) {
        let markerId = "";
        if (marker.vehicleId || marker.id) {
            markerId = `vehicleId-${marker.vehicleId || marker.id}-${index}`
        } else if (marker.referenceId) {
            markerId = `referenceId-${marker.referenceId}-${index}`;
        }
        return new Overlay({
            autoPan: true,
            id: `overlay-${markerId}`,
            position: this.getMarkerPosition(marker),
            positioning: "center-left",
            stopEvent: false
        });
    }

    createAndRenderMarkers(finalState, isNewSearchOrDirectLink) {
        const vehiclesInRouteMarkers = (finalState.vehiclesInRoute || []).map(this.createMarkersVehicles.bind(this));
        const vehiclesElement = React.createElement("div", {}, ...vehiclesInRouteMarkers);
        ReactDOM.render(vehiclesElement, document.getElementById("vehiclesInRoute"));
        if (isNewSearchOrDirectLink) {
            const referencePointsMarkers = (finalState.referencePointsList || []).map(this.createMarkersReferencePoint.bind(this));
            const referencesElement = React.createElement("div", {}, ...referencePointsMarkers);
            ReactDOM.render(referencesElement, document.getElementById("referencePoints"));
        }
    }

    createMarkersVehicles(marker, index) {
        const markerId = `vehicleId-${marker.vehicleId || marker.id}-${index}`;
        const props = {
            key: markerId,
            markerId: markerId,
            iconStyle: "fa-bus",
            buttonStyle: "button is-small is-primary is-rounded marker-vehicles-route",
            description: marker.description
        };
        return React.createElement(Marker, {...props});
    }

    createMarkersReferencePoint(marker, index) {
        const markerId = `referenceId-${marker.referenceId}-${index}`;
        const toggleReferencePointName = (event) => {
            let target;
            switch (event.target.classList[0]) {
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
            event.preventDefault();
        };
        const props = {
            key: markerId,
            markerId: markerId,
            iconStyle: "fa-map-pin",
            buttonStyle: "button is-small is-danger marker-reference-point",
            description: marker.name,
            descriptionStyle: "is-invisible",
            onClick: toggleReferencePointName
        };
        return React.createElement(Marker, {...props});
    }
}
