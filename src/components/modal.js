import React, {Component} from "react";
import App from "app";

export default class Modal extends App {
    constructor(props){
        super(props);
        this.state = {
            vehiclesGarageList: props.vehiclesGarageList,
            showVehiclesGarage: props.showVehiclesGarage
        };
        this.hideVehiclesGarage = props.hideVehiclesGarage;
        this.locateVehicleGarage = props.locateVehicleGarage;
    }
    render(){
        if (this.props.showVehiclesGarage) {
            let vehiclesListRow = [];
            if (this.props.vehiclesGarageList) {
                vehiclesListRow.push(this.props.vehiclesGarageList.map((vehicle, index) => {
                    return <tr key={index}>
                        <td>{vehicle.Identificacao}</td>
                        <td>{vehicle.Descricao}</td>
                        <td><a onClick={(e) => {this.locateVehicleGarage(e, vehicle)}}>{vehicle.Placa}</a></td>
                        <td>{vehicle.Garagem}</td>
                    </tr>
                }));
            }
            return(<div className={this.props.showVehiclesGarage ? "is-active modal" : "modal"}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Veículos na Garagem: {this.props.vehiclesGarageList.length > 0 ? this.props.vehiclesGarageList.length : "Carregando..."}</p>
                        <button className="delete" aria-label="close" onClick={(event) => {this.hideVehiclesGarage(event)}}></button>
                    </header>
                    <section className="modal-card-body">
                        <table className="table is-striped is-fullwidth is-narrow is-hoverable">
                            <thead>
                                <tr>
                                    <th nowrap="nowrap">ID</th>
                                    <th nowrap="nowrap">Descricao</th>
                                    <th nowrap="nowrap">Placa</th>
                                    <th nowrap="nowrap">Garagem</th>
                                </tr>
                            </thead>
                            <tbody>{vehiclesListRow}</tbody>
                        </table>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button" onClick={(event) => {this.hideVehiclesGarage(event)}}>Fechar</button>
                    </footer>
                </div>
            </div>);
        } else {
            return null;
        }
    }
}