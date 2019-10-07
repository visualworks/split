import React from "react";

export default class Modal extends React.Component {
    constructor(props){
        super(props);
        this.filterVehicles = this.filterVehicles.bind(this);
        this.createListItem = this.createListItem.bind(this);
        this.vehiclesListRow = [];
    }
    filterVehicles() {
        this.vehiclesListRow = [];
        if (this.input.value) {
            this.props.vehiclesGarageList.forEach((vehicles, index) => {
                if (vehicles[this.select.value].toUpperCase().includes(this.input.value.toUpperCase())) {
                    this.createListItem(vehicles, index);
                }
            });            
        } else {
            this.vehiclesListRow = this.props.vehiclesGarageList;
        }
        this.forceUpdate();
    }
    createListItem(vehicle, index) {
        this.vehiclesListRow.push(
            <tr key={index}>
                <td className={"is-hidden-mobile"}>{vehicle.id}</td>
                <td className={"is-hidden-mobile"}>{vehicle.description}</td>
                <td><a onClick={(e) => {
                    this.props.controller.locateVehicleGarage(e, vehicle)
                }}>{vehicle.plate}</a></td>
                <td>{vehicle.garage}</td>
            </tr>
        );
    }
    render(){
        if (this.props.showVehiclesGarage) {
            if (this.vehiclesListRow.length === 0) {
                this.props.vehiclesGarageList.forEach(this.createListItem);
            }
            return(<div className={this.props.showVehiclesGarage ? "is-active modal" : "modal"}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Veículos na Garagem: {this.props.vehiclesGarageList.length > 0 ? this.props.vehiclesGarageList.length : "Carregando..."}</p>
                        <button className="delete" aria-label="close" onClick={ (event) => this.props.controller.hideVehiclesGarage(event) }></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="field has-addons">
                            <p className="control is-expanded">
                                <input className="input" type="text" placeholder="Encontre um veículo" ref={ (input) => this.input = input } />
                            </p>
                            <p className="control">
                                <span className="select">
                                    <select ref={ (select) => this.select = select }>
                                        <option value="description" defaultValue={"description"}>pela descrição</option>
                                        <option value="plate">pela placa</option>
                                        <option value="id">pela ID</option>
                                        <option value="garage">pela garagem</option>
                                    </select>
                                </span>
                            </p>
                            <p className="control">
                                <button className="button is-info" onClick={ this.filterVehicles }>Filtrar</button>
                            </p>
                        </div>
                        <table className="table is-striped is-fullwidth is-narrow is-hoverable">
                            <thead>
                                <tr>
                                    <th className={"is-hidden-mobile"} nowrap="nowrap">ID</th>
                                    <th className={"is-hidden-mobile"} nowrap="nowrap">Descrição</th>
                                    <th nowrap="nowrap">Placa</th>
                                    <th nowrap="nowrap">Garagem</th>
                                </tr>
                            </thead>
                            <tbody>{ this.vehiclesListRow }</tbody>
                        </table>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button" onClick={ (event) => this.props.controller.hideVehiclesGarage(event) }>Fechar</button>
                    </footer>
                </div>
            </div>);
        } else {
            return null;
        }
    }
}