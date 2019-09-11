import React from "react";

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.onCloseDialog = props.onCloseDialog;
        this.submitForm = this.submitForm.bind(this);
        this.onSubmitForm = props.onSubmitForm;
        this.createDOMStructure = this.createDOMStructure.bind(this);
    }
    close(event) {
        event.preventDefault();
        this.setState({
            showUsersManagement: false
        });
        this.onCloseDialog();
    }
    submitForm(event, user, passwd, rePasswd, adminUser, adminPasswd) {
        event.preventDefault();
        this.onSubmitForm(user, this.passwd.value, this.rePasswd.value, this.adminUser.value, this.adminPasswd.value)
    }
    createDOMStructure() {
        let sHTML = <div className="is-active modal">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{ this.props.title }</p>
                    <button className="delete" aria-label="close" onClick={ this.close }></button>
                </header>
                <section className="modal-card-body">
                    <form method="POST">
                        <div className="hide">
                            <input type="hidden" name="adminUser" value="portaljal_admin" ref={ (input) => { this.adminUser = input; } } />
                        </div>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="text" name="user" value="portaljal" readOnly="true" ref={ (input) => { this.user = input; } } />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-user"></i>
                                </span>
                                <span className="icon is-small is-right">
                                    <i className="fa fa-check"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" name="passwd" placeholder="Nova Senha" ref={ (input) => { this.passwd = input; } } />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" name="rePasswd" placeholder="Confirme Nova Senha" ref={ (input) => { this.rePasswd = input; } } />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <label className="label">Digite a senha do seu usuário Administrador</label>
                            <div className="control has-icons-left">
                                <input className="input" type="password" name="adminPasswd" placeholder="Sua senha" ref={ (input) => { this.adminPasswd = input; } } />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <p className="control">
                                <button type="submit" className="button is-success" onClick={ (event) => this.submitForm(event, this.user.value, this.passwd.value, this.rePasswd.value, this.adminUser.value, this.adminPasswd.value) }>Alterar Senha</button>
                            </p>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot">
                    <button className="button" onClick={ this.close }>Fechar</button>
                </footer>
            </div>
        </div>;
        return sHTML;
    }
    render() {
        if (this.props.showDialog) {
            return (this.createDOMStructure());
        } else {
            return null;
        }
    }
}