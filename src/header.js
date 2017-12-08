import React, {Component} from "react";
import App from "app";

export default class Header extends App {
    constructor(props){
        super(props);
        this.setClient = props.setClient;
        this.showVehiclesGarage = props.showVehiclesGarage;
        this.doLogout = props.doLogout;
        this.doLogin = props.doLogin;
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }
    _handleKeyPress(event) {
        if (event.key === "Enter") {
            this.doLogin(event, this.username.value, this.password.value);
        }
    }
    render() {
        let dropdown = [];
        if (this.props.clientList) {
            this.props.clientList.forEach((client, index) => {
                dropdown.push(<a key={index} href={"#" + client.Nome} className="navbar-item" onClick={(event) => { this.setClient(event, client.Id_Cliente, client.Nome)}}>{client.Nome}</a>)
            });
        }
        let loggedInMenu = <div className="navbar-end">
            <a href="#veiculos-garagem" onClick={(event) => {this.showVehiclesGarage(event)}} className="navbar-item">Veículos na Garagem</a>
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link" href="javascript:void(null)">
                    Clientes
                </a>
                <div className="navbar-dropdown is-boxed">
                    {dropdown}
                </div>
            </div>
            <div className="navbar-item">
                <p className="control">
                    <a className={(this.props.clientId) ? "button is-info" : "button is-warning"} href="javascript:void(null)">
                    <span className="icon">
                        <i className="fa fa-bus"></i>
                    </span>
                    <span>{this.props.clientName}</span>
                    </a>
                </p>
            </div>
            <div className="navbar-item">
                <p className="control">
                    <a href="javascript:void(null)" onClick={(event) => {this.doLogout(event)}} className={(this.props.userId) ? "button is-danger" : "button is-success"}>
                    <span className="icon">
                        <i className="fa fa-unlock"></i>
                    </span>
                    <span>{(this.props.userId) ? "Sair" : "Entrar"}</span>
                    </a>
                </p>
            </div>
        </div>;
        let loggedOutMenu = <div className="navbar-end">
            <div className="navbar-item">
                <input ref={(username) => { this.username = username; }} className="input" type="text" placeholder="usuário" />
            </div>
            <div className="navbar-item">
                <input ref={(password) => { this.password = password; }} onKeyPress={this._handleKeyPress} className="input" type="password" placeholder="senha" />
            </div>
            <div className="navbar-item">
                <p className="control">
                    <a href="javascript:void(null)" onClick={(event) => {this.doLogin(event, this.username.value, this.password.value)}}  className={(this.props.userId) ? "button is-danger" : "button is-success"}>
                    <span className="icon">
                        <i className="fa fa-lock"></i>
                    </span>
                    <span>{(this.props.userId) ? "Sair" : "Entrar"}</span>
                    </a>
                </p>
            </div>
        </div>;
        let navbar = <div className="navbar" role="navigation" aria-label="main-navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a href="javascript:void(null)" className="navbar-item">
                        <img src="./img/logo-zirix.png" alt="Zirix Soluções em Rastreamento" title="Zirix Soluções em Rastreamento" className="logo"/>
                        <img src="./img/logo-jal.jpg" alt="Grupo JAL" title="Grupo JAL" className="logo" />
                    </a>
                </div>
                {(this.props.userId) ? loggedInMenu : loggedOutMenu}
            </div>
        </div>;
        return (navbar);
    }
}