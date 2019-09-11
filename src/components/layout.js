import React from "react";
import App from "app";
import Header from "components/header";
import Content from "components/content";
import Modal from "components/modal";
import Dialog from "components/dialog";
import Notification from "components/notification";

export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = App.defaultState();
        this.app = new App(this);
        const stateDirectLink = this.app.checkDirectLink();
        this.state = Object.assign(this.state, stateDirectLink);
    }

    componentDidMount() {
        if (this.state.isDirectLink) {
            this.app.loadDirectLink();
        }
        this.app.checkUserSession();
    }

    render() {
        return (
            <div className="layout">
                <Header controller={this.app} showLoading={this.state.showLoading}
                        isDirectLink={this.state.isDirectLink} userId={this.state.userId} userName={this.state.userName}
                        userRole={this.state.userRole} clientId={this.state.clientId} clientName={this.state.clientName}
                        clientList={this.state.clientList}/>
                <Content controller={this.app} isDirectLink={this.state.isDirectLink}
                         vehiclesInRoute={this.state.vehiclesInRoute} routePointsList={this.state.routePointsList}
                         referencePointsList={this.state.referencePointsList} clientId={this.state.clientId}
                         linesList={this.state.linesList} selectedLineId={this.state.selectedLineId}
                         routesList={this.state.routesList} selectedRouteId={this.state.selectedRouteId}/>
                <Modal controller={this.app} isDirectLink={this.state.isDirectLink}
                       showVehiclesGarage={this.state.showVehiclesGarage} locateVehicleGarage={this.app.locateVehicleGarage}
                       vehiclesGarageList={this.state.vehiclesGarageList}/>
                <Dialog showDialog={this.state.showUsersManagement} title="Gerenciar Usuários"/>
                <Notification controller={this.app} notification={this.state.notification}/>
            </div>
        );
    }
}
