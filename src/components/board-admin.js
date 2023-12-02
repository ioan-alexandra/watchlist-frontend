import React, {Component} from "react";

import UserService from "../api/UserService";
import EventBus from "../common/EventBus";
import {confirmAlert} from "react-confirm-alert";
import {Button, ButtonGroup} from "reactstrap";
import {Link, withRouter} from "react-router-dom";

class BoardAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: []
        };
    }

    componentDidMount() {
        this.setState({});

        UserService.getAllUsers().then(
            response => {
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
            message: 'Are you sure you want to delete this user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => UserService.deleteUser(id).then(() => {
                        this.setState({});
                        UserService.getAllUsers().then((response) => {
                            this.setState({content: response.data})
                            this.props.history.push('/admin');
                        });
                    })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    render() {
        return (
            <div className="content">
                <h1 className="text-center"> Users </h1>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <td>Id</td>
                        <td>Username</td>
                        <td>Email</td>
                        <td>Role</td>
                        <td></td>
                    </tr>

                    </thead>
                    <tbody>
                    {
                        this.state.content.map(
                            user =>
                                <tr key={user.id}>
                                    <td> {user.id}</td>
                                    <td> {user.username}</td>
                                    <td> {user.email}</td>
                                    <td> {user.roles[0].name}</td>

                                    <td>
                                        <ButtonGroup>
                                            <Button color="success"
                                                    tag={Link} to={"/users/" + user.id}>Edit</Button>
                                            <button className="btn btn-secondary btn-block"
                                                    onClick={() => this.remove(user.id)}>Delete
                                            </button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withRouter(BoardAdmin);