import React, {Component} from "react";
import TableRow from "./table-row";

export default class Modal extends Component {
    constructor(props){
        super(props);
        this.state = {
            veiculosNaGaragem: [],
            progressBar: 0,
            isActive: props.isActive,
            notification: null,
            rowItem: []
        };
        this.fetchVeiculosNaGaragem = this.fetchVeiculosNaGaragem.bind(this);
    }
    fetchVeiculosNaGaragem() {
        const soapUrl = "http://zirix-henrique145173.codeanyapp.com/soap.php?op=listaVeiculoGaragem";
        let veiculosNaGaragem = [];
        const self = this;

        self.setState({
            progressBar: 0,
            veiculosNaGaragem: [],
            notification: null,
            rowItem: []
        });

        let updateProgressBar = window.setInterval(() => {
            if (self.state.progressBar < 100){
                self.setState({
                    progressBar: self.state.progressBar + 10
                });
            } else {
                self.setState({
                    progressBar: self.state.progressBar - 10
                });
            }
        }, 1000);
        
        fetch(soapUrl).then((response) => {
            if (response.ok){
                return response.json();
            }
            throw new Error("Network response was not ok.");
        }).then((json) => {
            veiculosNaGaragem = json.ListaVeiculoGaragemResult.WSGaragem;
            if (veiculosNaGaragem.length > 0){
                self.setState({veiculosNaGaragem: veiculosNaGaragem});
                let rowItem = <TableRow data={veiculosNaGaragem} />;
                self.setState({rowItem: rowItem});
            } else {
                self.setState({notification: "Houve um erro na consulta. Feche esta janela e abra novamente."});
            }
        }).then(() => {
            clearInterval(updateProgressBar);
            self.setState({progressBar: 0});
        }).catch(error => {
            self.setState({notification: "Houve um erro na consulta. Feche esta janela e abra novamente."});
            console.log(error);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive){
            this.setState({
                isActive: nextProps.isActive,
                toggleModal: nextProps.isActive
            });
            this.fetchVeiculosNaGaragem();
        }
    }
    render(){
        if (this.props.isActive) {
            let progressBar = <progress className="progress is-primary" value={this.state.progressBar} max="100">Carregando...</progress>;
            let notification = <div className="notification is-danger">{this.state.notification}</div>;
            return(<div className={this.props.isActive ? "is-active modal" : "modal"}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Veículos na Garagem: {this.state.veiculosNaGaragem.length > 0 ? this.state.veiculosNaGaragem.length : "Carregando..."}</p>
                        <button className="delete" aria-label="close" onClick={this.props.toggleModal}></button>
                    </header>
                    <section className="modal-card-body">
                        {(this.state.progressBar > 0) ? progressBar : ""}
                        {(this.state.notification) ? notification : ""}
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Identificação</th>
                                    <th>Descrição</th>
                                    <th>Placa</th>
                                    <th nowrap="nowrap">Garagem</th>
                                </tr>
                            </thead>
                            {this.state.rowItem}
                        </table>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success">Ver no mapa</button>
                        <button className="button" onClick={this.props.toggleModal}>Fechar</button>
                    </footer>
                </div>
            </div>);
        } else {
            return null;
        }
    }
}