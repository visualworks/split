import React, {Component} from "react";
import ReactDOM from "react-dom";
export default class Header extends Component {
    constructor(props){
        super(props);
        this.state = {clients: [], selectedClientId: 0, selectedClientName: "Escolha um cliente"};
        this.fetchClients = this.fetchClients.bind(this);
        this.setNewClient = this.setNewClient.bind(this);
    }
    fetchClients(){
        const self = this;
        const soapUrl = "http://zirix-henrique145173.codeanyapp.com/soap.php?op=listaClientesPorUsuario";
        let clients = [];
        self.setState({clients: [], selectedClient: 0});
        fetch(soapUrl).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok.");
        }).then((json) => {
            let clients = json.ListaClientesPorUsuarioResult.WSCliente;
            let dropdown = [];
            clients.forEach((element, index) => {
                let clientId = element.Id_Cliente;
                let clientName = element.Nome;
                dropdown.push(<a key={index} href="#" className="navbar-item" onClick={(e) => { self.setNewClient(e, clientId, clientName)}}>{clientName}</a>);
            });
            self.setState({clients: dropdown})
        });
    }
    setNewClient(event, clientId, clientName) {
        event.preventDefault();
        if (clientId) {
            this.setState({selectedClientId: clientId});
            this.setState({selectedClientName: clientName});
            this.props.toggleClient(clientId);
        }
    }
    componentWillMount(nextProps) {
        this.setState({
            clients: [],
            selectedClientId: 0,
            selectedClientName: "Escolha um cliente"
        });
        this.fetchClients();
    }
    render() {
        let navbar = <div className="navbar" role="navigation" aria-label="main-navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a href="#" className="navbar-item">
                        <img src="./img/logo-zirix.png" alt="Zirix Soluções em Rastreamento" title="Zirix Soluções em Rastreamento" className="logo"/>
                        <img src="./img/logo-jal.jpg" alt="Grupo JAL" title="Grupo JAL" className="logo" />
                    </a>
                </div>
                <div className="navbar-end">
                    <a href="#veiculos-rota" onClick={this.props.toggleModal} className="navbar-item">Veículos em Rota</a>
                    <a href="#veiculos-garagem" onClick={this.props.toggleModal} className="navbar-item">Veículos na Garagem</a>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link" href="#">
                            Clientes
                        </a>
                        <div className="navbar-dropdown is-boxed">
                            {this.state.clients}
                        </div>
                    </div>
                    <div className="navbar-item">
                        <p className="control">
                            <a className="button is-info" href="javascript:void(null)">
                            <span className="icon">
                                <i className="fa fa-bus"></i>
                            </span>
                            <span>{this.state.selectedClientName}</span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>;
        return (navbar);
    }
}