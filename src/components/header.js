import React, {Component} from "react";
import ReactDOM from "react-dom";
import App from "app";

export default class Header extends App {
    constructor(props){
        super(props);
        this.setClient = props.setClient;
        this.showVehiclesGarage = props.showVehiclesGarage;
        this.doLogout = props.doLogout;
        this.doLogin = props.doLogin;
        this.manageUsers = props.manageUsers;
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    }
    _handleKeyPress(event) {
        if (event.key === "Enter") {
            this.doLogin(event, this.username.value, this.password.value);
        }
    }
    toggleMobileMenu(event) {
        let btnClasses = this.btnNavBurger.className;
        let navBarClasses = this.navBarDisplay.className;
        let btnDeactiveClasses = "burger navbar-burger";
        let btnActiveClasses = "burger navbar-burger is-active";
        switch(btnClasses) {
            case btnDeactiveClasses:
                btnClasses = btnActiveClasses;
                navBarClasses = "navbar-menu is-active";
                break;
            case btnActiveClasses:
                btnClasses = btnDeactiveClasses;
                navBarClasses = "navbar-menu";
                break;
        }
        this.btnNavBurger.className = btnClasses;
        this.navBarDisplay.className = navBarClasses;
    }
    componentDidMount() {
        if (this.username) {
            this.username.focus();
        }
    }
    componentDidUpdate() {
        if (this.username) {
            this.username.focus();
        }
    }
    render() {
        let dropdown = [];
        if (this.props.clientList) {
            this.props.clientList.forEach((client, index) => {
                dropdown.push(<a key={index} href={"#" + client.Nome} className="navbar-item" onClick={(event) => { this.setClient(event, client.Id_Cliente, client.Nome)}}>{"(" + client.Id_Cliente + ") "+ client.Nome}</a>)
            });
        }
        let fnVeiculosGaragem = (event) => { this.showVehiclesGarage(event) };
        const msgLoading = <div className={`navbar-item ${this.props.showLoading}`}>
            <small>carregando</small>
            <span className={"icon"}>
                <i className={"fa fa-cog fa-spin"}></i>
            </span>
        </div>;
        const btnVeiculosGaragem = <a href="#veiculos-garagem" onClick={ fnVeiculosGaragem } className="navbar-item">Veículos na Garagem</a>;
        let fnDoLogout = (event) => { this.doLogout(event) };
        let btnLogin = <div className="navbar-item">
            <p className="control">
                <a href="javascript:void(null)" onClick={ fnDoLogout } className={(this.props.userId) ? "button is-danger" : "button is-success"}>
                <span className="icon">
                    <i className="fa fa-unlock"></i>
                </span>
                <span>{(this.props.userId) ? this.props.userName + " (Sair)" : "Entrar"}</span>
                </a>
            </p>
        </div>;
        let fnManageUsers = (event) => { this.manageUsers(event) };
        let btnManageUsers = <div className="navbar-item">
            <p className="control">
                <a href="javascript:void(null)" onClick={ fnManageUsers } className="button">
                    <span className="icon">
                        <i className="fa fa-users"></i>
                    </span>
                </a>
            </p>
        </div>;
        let loggedInMenu = <div className="navbar-end">
            {msgLoading}
            {btnVeiculosGaragem}
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
                    <span>{"(" + this.props.clientId + ") " + this.props.clientName}</span>
                    </a>
                </p>
            </div>
            { btnLogin }
            { (this.props.userRole === "admin") ? btnManageUsers : "" }
        </div>;
        let loggedOutMenu = <div className="navbar-end">
            {msgLoading}
            {btnVeiculosGaragem}
            <div className="navbar-item">
                <input ref={(username) => { this.username = username; }} className="input" type="text" placeholder="usuário" autoFocus={true} />
            </div>
            <div className="navbar-item">
                <input ref={(password) => { this.password = password; }} onKeyPress={this._handleKeyPress} className="input" type="password" placeholder="senha" />
            </div>
            <div className="navbar-item">
                <p className="control">
                    <a href="javascript:void(null)" onClick={(event) => { this.doLogin(event, this.username.value, this.password.value); }}  className={(this.props.userId) ? "button is-danger" : "button is-success"}>
                    <span className="icon">
                        <i className="fa fa-lock"></i>
                    </span>
                    <span>{(this.props.userId) ? this.props.userName + " (Sair)" : "Entrar"}</span>
                    </a>
                </p>
            </div>
        </div>;
        let burgerMenu = <div data-target="navbar-display" ref={(btnNavBurger) => { this.btnNavBurger = btnNavBurger; }} className="burger navbar-burger" onClick={this.toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
        </div>;
        let navbarDisplay = <div id="navbar-display" ref={(navBarDisplay) => { this.navBarDisplay = navBarDisplay; }} className="navbar-menu">{(this.props.userId) ? loggedInMenu : loggedOutMenu}</div>;
        let navbar = <div className="navbar" role="navigation" aria-label="main-navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a href="javascript:void(null)" className="navbar-item">
                        <img src="/img/logo-zirix.png" alt="Zirix Soluções em Rastreamento" title="Zirix Soluções em Rastreamento" className="logo"/>
                        <img src="/img/logo-jal.jpg" alt="Grupo JAL" title="Grupo JAL" className="logo" />
                    </a>
                    { this.props.isDirectLink ? '' : burgerMenu }
                </div>
                { this.props.isDirectLink ? '' : navbarDisplay }
            </div>
        </div>;
        return (navbar);
    }
}