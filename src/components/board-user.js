import React, {Component} from "react";
import {searchAmazon} from 'unofficial-amazon-search';
import {Button, Container, Input, Row} from "reactstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import ProductsService from "../api/ProductsService";
import {confirmAlert} from "react-confirm-alert";

export default class BoardUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: {
                product_name: '',
                product_url: '',
                original_price: 0
            },
            content: [],
            user: JSON.parse(localStorage.getItem("user")),
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        searchAmazon('laptop', {page: 1, includeSponsoredResults: true}).then(data => {
            console.log(data.pageNumber)    // 2
            console.log(data.searchResults) // (page 2 results)\
            this.setState({
                content: data.searchResults,
            });
        });
    }

    handleSearch(event) {
        let searchTerm = '';
        console.log(document.getElementById('searchTerm').value)
        if (document.getElementById('searchTerm').value) {
            searchTerm = document.getElementById('searchTerm').value;
            this.setState({});
            searchAmazon(searchTerm, {page: 1, includeSponsoredResults: true}).then(data => {
                console.log(data.pageNumber)    // 2
                console.log(data.searchResults) // (page 2 results)\
                this.setState({
                    content: data.searchResults,
                });
            });
        }
    }

    handleSave(product) {
        const {item} = this.state;
        item.product_name = product.title;
        item.product_url = "https://www.amazon.com" + product.productUrl;
        item.original_price = product.prices[0].price;
        ProductsService.save(this.state.user.id,item).then(
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Product' + product.title + 'was saved in your watchlist!',
                buttons: [
                    {
                        label: 'Ok!',
                    }
                ]
            })
        );
    }

    render() {
        return (<div>
            <InputGroup className="mb-3">
                <Input type="text" placeholder="Search..." id="searchTerm"/>
                <Button onClick={this.handleSearch} variant="outline-secondary" id="button-addon2">
                    Search... </Button>
            </InputGroup>
            <Container>
                <Row>
                    {this.state.content.map(product => (
                        <Card style={{width: '18rem'}}>
                            <Card.Header>{product.rating.score} / 5
                                - {product.prices.length > 0 && product.prices[0].price} $
                            </Card.Header>

                            <Card.Img variant="top" src={product.imageUrl}/>
                            <Card.Body>
                                <center><Card.Title>
                                    <a href={"amazon.com" + product.productUrl}>
                                        {product.title}</a></Card.Title>
                                    <Button onClick={() => this.handleSave(product)} variant="primary">Save to
                                        watchlist</Button></center>
                            </Card.Body>
                        </Card>
                    ))}
                </Row>
            </Container>

        </div>);
    }
}