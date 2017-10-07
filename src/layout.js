import React, {Component} from 'react';
import Header from "./header";
import Content from "./content";
import Modal from "./modal";

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleModal: false,
            selectedClientId: 0
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleClient = this.toggleClient.bind(this);
    }
    toggleModal(event) {
        event.preventDefault();
        this.setState({
            toggleModal: !this.state.toggleModal
        });
    }
    toggleClient(clientId) {
        this.setState({
            selectedClientId: clientId
        });
    }
    render() {
        return (
            <div className="layout">
                <Header toggleModal={(e) => {this.toggleModal(e)}} toggleClient={this.toggleClient} />
                <Content selectedClientId={this.state.selectedClientId} />
                <Modal isActive={this.state.toggleModal} toggleModal={(e) => {this.toggleModal(e)}} />
            </div>
        );
    }
}