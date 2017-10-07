import React, {Component} from "react";
export default class TableRow extends Component {
    render(){
        const data = this.props.data;
        return (<tbody>
            {data.map((object, index) => {
                return <tr key={index}>
                    <td>{object.Identificacao}</td>
                    <td>{object.Descricao}</td>
                    <td>{object.Placa}</td>
                    <td>{object.Garagem}</td>
                </tr>
            })}
        </tbody>);
    }
}