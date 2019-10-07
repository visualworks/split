import React from "react";

export default class FilterControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilter: true,
            isMobile: props.isMobile
        };
    }

    render() {
        let optionLines = this.props.controller.getLines();
        let optionRoutes = this.props.controller.getRoutes();
        const toggleFiltersVisibility = (event) => {
            event.preventDefault();
            this.setState({
                showFilter: !this.state.showFilter
            });
        };
        const doSearch = (event) => {
            if (this.state.isMobile) {
                toggleFiltersVisibility(event);
            }
            this.props.controller.executeSearch(event);
        };
        const textShowHideFilters = this.state.showFilter ? "Esconder" : "Mostrar";
        const filtersVisible = this.state.showFilter ? null : "is-invisible";
        const filtersInvisible = this.state.showFilter ? "is-invisible" : null;
        return (
            <div>
                <div className={`${filtersVisible} field`}>
                    <div className={`${filtersVisible} control`}>
                        <div className={`${filtersVisible} select is-rounded`}>
                            <select value={this.props.selectedLineId} onChange={(event) => {
                                this.props.controller.changeLines(event)
                            }}>
                                {optionLines}
                            </select>
                        </div>
                    </div>
                </div>
                <div className={`${filtersVisible} field`}>
                    <div className={`${filtersVisible} control`}>
                        <div className={`${filtersVisible} select is-rounded`}>
                            <select value={this.props.selectedRouteId} onChange={(event) => {
                                this.props.controller.changeRoutes(event)
                            }}>
                                {optionRoutes}
                            </select>
                        </div>
                    </div>
                </div>
                <div className={`${filtersVisible} field`}>
                    <div className={`${filtersVisible} control`}>
                        <button type="button" className={`${filtersVisible} button is-success`}
                                onClick={doSearch}>Buscar
                        </button>
                    </div>
                </div>
                <div className={"field is-pulled-right"}>
                    <div className={"control"}>
                        <a onClick={toggleFiltersVisibility} className={`${filtersVisible} button is-white is-small`}
                           title={`${textShowHideFilters} filtro de linhas e rotas`}>
                            <span className={"icon is-small"}>
                                <i className={"fas fa-angle-double-left"}></i>
                            </span>
                        </a>
                        <a onClick={toggleFiltersVisibility} className={`${filtersInvisible} button is-white is-small`}
                           title={`${textShowHideFilters} filtro de linhas e rotas`}>
                            <span className={"icon is-small"}>
                                <i className={"fas fa-angle-double-right"}></i>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}