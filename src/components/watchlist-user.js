import React, {Component} from "react";
import EventBus from "../common/EventBus";
import {confirmAlert} from "react-confirm-alert";
import {Button, ButtonGroup, Input} from "reactstrap";
import {withRouter} from "react-router-dom";
import ProductsService from "../api/ProductsService";
import InputGroup from "react-bootstrap/InputGroup";

class Watchlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: [],
            user: JSON.parse(localStorage.getItem("user")),
        };
    }

    componentDidMount() {
        this.setState({});

        ProductsService.getUserWatchlist(this.state.user.id).then(
            response => {
                console.log(response)

                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }

    async remove(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to delete this product?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => ProductsService.deleteProduct(id).then(() => {
                        this.setState({});
                        ProductsService.getUserWatchlist(this.state.user.id).then(
                            response => {
                                console.log(response)

                                this.setState({
                                    content: response.data
                                });
                                this.props.history.push('/watchlist');
                            });
                    })
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    async filter(x) {
        console.log(x);
        this.setState({});
        let newArray = this.state.content.filter(function (el) {
            return el.productName.toLowerCase().includes(x.toLowerCase())
        });
        this.setState({content: newArray});
    }

    render() {
        console.log(this.state);
        const {content} = this.state;

        return (
            <div className="content">
                <h1 className="text-center"> Watchlist </h1>
                <InputGroup className="mb-3">
                    <Input type="text" placeholder="Search..." id="searchTerm"/>
                    <Button size="sm" color="primary"
                            onClick={() => this.filter(document.getElementById("searchTerm").value)}>Search</Button>
                </InputGroup>

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <td>Id</td>
                        <td>Name</td>
                        <td>URL</td>
                        <td>Original Price</td>
                        <td>Added on</td>
                    </tr>

                    </thead>
                    {content && (<tbody>
                    {
                        this.state.content.map(
                            product =>
                                <tr key={product.id}>
                                    <td> {product.id}</td>
                                    <td> {product.productName}</td>
                                    <td><a target="_blank" href={product.productUrl}>Link</a></td>
                                    <td> {product.price}</td>
                                    <td> {product.addedDate}</td>

                                    <td>
                                        <ButtonGroup>
                                            <Button size="sm" color="danger"
                                                    onClick={() => this.remove(product.id)}>Delete</Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                        )
                    }
                    </tbody>)}
                    {!content && (
                        <p>test</p>
                    )}

                    {this.state.message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {this.state.message}
                            </div>
                        </div>
                    )}
                </table>
            </div>
        );
    }
}

export default withRouter(Watchlist);