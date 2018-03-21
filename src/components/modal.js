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
        this.filterVehicles = this.filterVehicles.bind(this);
    }
    filterVehicles() {
        let filteredList = []
        if (this.input.value) {
            this.props.vehiclesGarageList.forEach((vehicles) => {
                if (vehicles[this.select.value].toUpperCase().includes(this.input.value.toUpperCase())) {
                    filteredList.push(vehicles);
                }
            });            
        } else {
            filteredList = this.props.vehiclesGarageList;
        }
        this.setState({
            vehiclesGarageList: filteredList
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            vehiclesGarageList: nextProps.vehiclesGarageList
        });
    }
    render(){
        if (this.props.showVehiclesGarage) {
            let vehiclesListRow = [];
            if (this.state.vehiclesGarageList) {
                vehiclesListRow.push(this.state.vehiclesGarageList.map((vehicle, index) => {
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
                        <div className="field has-addons">
                            <p className="control is-expanded">
                                <input className="input" type="text" placeholder="Encontre um veículo" ref={ (input) => this.input = input } />
                            </p>
                            <p className="control">
                                <span className="select">
                                    <select ref={ (select) => this.select = select }>
                                        <option value="Descricao">pela descrição</option>
                                        <option value="Placa">pela placa</option>
                                        <option value="Identificacao">pela ID</option>
                                        <option value="Garagem">pela garagem</option>
                                    </select>
                                </span>
                            </p>
                            <p className="control">
                                <a className="button is-info" href="javascript:void(null)" onClick={ this.filterVehicles }>Filtrar</a>
                            </p>
                        </div>
                        <table className="table is-striped is-fullwidth is-narrow is-hoverable">
                            <thead>
                                <tr>
                                    <th nowrap="nowrap">ID</th>
                                    <th nowrap="nowrap">Descrição</th>
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