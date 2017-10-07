import React, {Component} from "react";

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: 0,
            progressBar: 0,
            busLines: []
        };
        this.fetchLinhas = this.fetchLinhas.bind(this);
    }
    fetchLinhas(clientId) {
        const self = this;
        const soapUrl = "http://zirix-henrique145173.codeanyapp.com/soap.php?op=listaLinhasCliente&clientId=" + clientId;
        let headers = new Headers({body: {Cliente: clientId}});

        self.setState({
            progressBar: 0,
            busLines: []
        });

        let updateProgressBar = window.setInterval(() => {
            if (this.state.progressBar < 100){
                this.setState({
                    progressBar: this.state.progressBar + 10
                });
            } else {
                this.setState({
                    progressBar: this.state.progressBar - 10
                });
            }
        }, 1000);

        fetch(soapUrl, headers).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response is not ok.");
        }).then((json) => {
            if (json.ListaLinhasClienteResult){
                let result = json.ListaLinhasClienteResult.WSLinha;
                let busLines = [];
                if (result.length > 1) {
                    result.forEach((element, index) => {
                        busLines.push(<option key={index}>{element.Numero} - {element.Nome}</option>);
                    });
                } else {
                    busLines.push(<option key={1}>{result.Numero} - {result.Nome}</option>);
                }
                self.setState({
                    busLines: busLines,
                    progressBar: 0
                });
            } else {
                self.setState({progressBar: -1});
            }
            return json;
        }).then((json) => {
            clearInterval(updateProgressBar);
            
        }).catch(error => {
            console.log(error);
        });;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedClientId > 0){
            this.fetchLinhas(nextProps.selectedClientId);
            this.setState({
                progressBar: 1,
                clientId: nextProps.selectedClientId
            });
        }
    }
    componentWillMount() {
        this.fetchLinhas(0);
    }
    render() {
        // if(this.state.busLines.length === 0) {
        //     return (null);
        // } else {
            if (this.state.progressBar > 0) {
                return (<progress className="progress is-primary" value={this.state.progressBar} max="100">Carregando...</progress>);
            } else if (this.state.progressBar < 0) {
                return null;
            } else {
                return (<div className="field is-grouped">
                    <div className="control">
                        <div className="select">
                            <select>
                                {this.state.busLines}
                            </select>
                        </div>
                    </div>
                    <div className="control">
                        <div className="select">
                            <select>
                                <option>Ida</option>
                                <option>Volta</option>
                            </select>
                        </div>
                    </div>
                    <div className="control">
                        <button className="button is-success">Buscar</button>
                    </div>
                </div>);
            }
        // }
    }
}