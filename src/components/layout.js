import React, {Component} from "react";
import App from "app";
import Header from "components/header";
import Content from "components/content";
import Modal from "components/modal";
import Dialog from "components/dialog";
import Auth from "auth";

export default class Layout extends App {
    constructor(props) {
        super(props);
        this.setClient = this.setClient.bind(this);
        this.showVehiclesGarage = this.showVehiclesGarage.bind(this);
        this.hideVehiclesGarage = this.hideVehiclesGarage.bind(this);
        this.changeLines = this.changeLines.bind(this);
        this.getLines = this.getLines.bind(this);
        this.changeRoutes = this.changeRoutes.bind(this);
        this.getRoutes = this.getRoutes.bind(this);
        this.executeSearch = this.executeSearch.bind(this);
        this.locateVehicleGarage = this.locateVehicleGarage.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.doLogout = this.doLogout.bind(this);
        this.manageUsers = this.manageUsers.bind(this);
        this.loadDirectLink = this.loadDirectLink.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onChangeTraffic = this.onChangeTraffic.bind(this);
        this.onChangeTransit = this.onChangeTransit.bind(this);
        this.onChangeMapType = this.onChangeMapType.bind(this);
        this.setMap = this.setMap.bind(this);
    }
    setClient(event, clientId, clientName) {
        event.preventDefault();
        if (clientId) {
            this.getLinesPerClient(clientId, clientName)
        }
    }
    doLogin(event, username, password) {
        event.preventDefault();
        const myAuth = new Auth();
        let oBodyData = {
            "user": username,
            "passwd": password,
            "op": "authenticateUser"
        };
        let response = myAuth.doPost(oBodyData).then((response) => {
            if (response.user && response.role) {
                this.setState({
                    userId: 1,
                    userName: response.user,
                    userRole: response.role
                });
                this.getClientList();
            } else {
                alert(response.result);
            }                
        });
    }
    doLogout(event) {
        event.preventDefault();
        this.unsetVehiclesGarage();
        this.resetDefaultState();
    }
    manageUsers(event) {
        this.setState({
            showUsersManagement: true
        });
    }
    onCloseDialog() {
        this.setState({
            showUsersManagement: false
        });
    }
    onSubmitForm(user, passwd, rePasswd, adminUser, adminPasswd) {
        if (passwd !== rePasswd) {
            alert("Senha e Confirmação de Senha não são idênticas.");
        } else if (this.state.userRole !== "admin") {
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
                let response = myAuth.doPost(oBodyData).then((response) => {
                    if (response.result) {
                        alert(response.result);
                    }
                });
            } catch (e) {
                throw new Error(e);
            }
        }
        // adminUser, user, passwd, rePasswd, adminPasswd
    }
    showVehiclesGarage(event) {
        event.preventDefault();
        this.getVehiclesGarage();
    }
    hideVehiclesGarage(event) {
        event.preventDefault();
        this.unsetVehiclesGarage();
    }
    locateVehicleGarage(event, vehicle) {
        this.hideVehiclesGarage(event);
        if (this.state.intervalID > 0) {
            clearInterval(this.state.intervalID);
            this.setState({
                intervalID: 0
            });
        }
        this.setState({
            selectedLineId: 0,
            selectedRouteId: 0,
            referencePointsList: [],
            vehiclesGarageList: [],
            vehiclesInRoute: [vehicle],
            mapCenter: {lat: vehicle.Latitude, lng: vehicle.Longitude},
            mapZoom: 18
        });
    }
    changeLines(event) {
        let selectedLineId = event.target.value;
        this.setState({
            selectedLineId: selectedLineId
        });
        this.getRoutesPerLine(selectedLineId);
    }
    getLines() {
        let optionLines = [];
        if (this.state.linesList.length > 1) {
            this.state.linesList.forEach((line, index) => {
                optionLines.push(<option key={index} value={line.Id_Linha}>{"(" + line.Id_Linha + ") " + line.Numero} - {line.Nome}</option>);
            });
        } else if (this.state.linesList.Id_Linha) {
            optionLines.push(<option key={0} value={this.state.linesList.Id_Linha}>{"(" + this.state.linesList.Id_Linha + ") " + this.state.linesList.Numero} - {this.state.linesList.Nome}</option>);
        }
        return optionLines;
    }
    changeRoutes(event){
        let selectedRouteId = event.target.value;
        this.setState({
            selectedRouteId: selectedRouteId
        });
    }
    getRoutes() {
        let optionRoutes = [];
        if (this.state.routesList.length > 1) {
            this.state.routesList.forEach((route, index) => {
                optionRoutes.push(<option key={index} value={route.Id_Rota}>{"(" + route.Id_Rota + ") " + route.Nome}</option>);
            });
        } else if (this.state.routesList.Id_Rota) {
            optionRoutes.push(<option key={0} value={this.state.routesList.Id_Rota}>{"(" + this.state.routesList.Id_Rota + ") " + this.state.routesList.Nome}</option>);
        }
        return optionRoutes;
    }
    executeSearch(event) {
        event.preventDefault();
        this.getReferencePointsPerRoute(this.state.selectedRouteId);
        this.getVehiclesInRoute(this.state.selectedLineId, this.state.selectedRouteId);
    }
    onChangeTraffic(bShowTraffic) {
        this.setState({
            showTrafficLayer: bShowTraffic
        });
    }
    onChangeTransit(bShowTransit) {
        this.setState({
            showTransitLayer: bShowTransit
        });
    }
    onChangeMapType(sMapType) {
        if (sMapType === "satellite") {
            this.setState({
                showTransitLayer: false,
                showTrafficLayer: false
            });
        } else if (sMapType === "roadmap") {
            this.setState({
                showTransitLayer: true,
                showTrafficLayer: true
            });
        }
        this.setState({
            mapTypeId: sMapType
        });
        this.state.map.setMapTypeId(sMapType);
    }
    setMap(args) {
        // args.map.setMapTypeId(this.props.mapTypeId);
        this.setState({
            map: args.map,
            maps: args.maps
        });
    }
    componentDidMount() {
        this.loadDirectLink()
    }
    render() {
        return (
            <div className="layout">
                <Header isDirectLink={this.state.isDirectLink} userId={this.state.userId} userName={this.state.userName} userRole={ this.state.userRole } doLogin={this.doLogin} doLogout={this.doLogout} manageUsers={ this.manageUsers } clientId={this.state.clientId} clientName={this.state.clientName} clientList={this.state.clientList} setClient={this.setClient} showVehiclesGarage={this.showVehiclesGarage} />
                <Content setMap={ this.setMap } mapTypeId={ this.state.mapTypeId } onChangeMapType={ this.onChangeMapType } onChangeTraffic={ this.onChangeTraffic } onChangeTransit={ this.onChangeTransit } showTrafficLayer={ this.state.showTrafficLayer } showTransitLayer={ this.state.showTransitLayer } isDirectLink={this.state.isDirectLink} mapZoom={this.state.mapZoom} mapCenter={this.state.mapCenter} vehiclesInRoute={this.state.vehiclesInRoute} referencePointsList={this.state.referencePointsList} changeRoutes={this.changeRoutes} executeSearch={this.executeSearch} getRoutes={this.getRoutes} getLines={this.getLines} changeLines={this.changeLines} clientId={this.state.clientId} linesList={this.state.linesList} selectedLineId={this.state.selectedLineList} routesList={this.state.routesList} selectedRouteId={this.state.selectedRouteId} />
                <Modal isDirectLink={this.state.isDirectLink} showVehiclesGarage={this.state.showVehiclesGarage} hideVehiclesGarage={this.hideVehiclesGarage} locateVehicleGarage={this.locateVehicleGarage} vehiclesGarageList={this.state.vehiclesGarageList} />
                <Dialog showDialog={ this.state.showUsersManagement } title="Gerenciar Usuários" onCloseDialog={ this.onCloseDialog } onSubmitForm={ this.onSubmitForm } />
            </div>
        );
    }
}