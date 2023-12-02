import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import 'bootstrap/dist/css/bootstrap.min.css';
import UserService from "../api/UserService";
import {isEmail} from "validator";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

class UserEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedUser: {
                id: "",
                username: "",
                email: "",
                password: "",
            },
            message: "",
            successful: false,
        };
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        UserService.getCurrentUserById(this.props.match.params.id).then(
            response => {
                this.setState({
                    selectedUser: response.data,
                    message: response.data.message,
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    message: resMessage
                });
            }
        );
    }

    onChangeUsername(e) {
        const usrnm = e.target.value;
        this.setState(function (prevState) {
            return {
                selectedUser: {
                    ...prevState.selectedUser,
                    username: usrnm
                }
            };
        });
    }

    onChangeEmail(e) {
        const eml = e.target.value;
        this.setState(function (prevState) {
            return {
                selectedUser: {
                    ...prevState.selectedUser,
                    email: eml
                }
            };
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {selectedUser} = this.state;
        console.log(selectedUser)
        UserService.updateUser(selectedUser.id, selectedUser).then(() => {
            this.setState({});
            UserService.getAllUsers().then((response) => {
                this.setState({users: response.data})
            });
        })

        this.props.history.push('/admin');
    }

    render() {
        const {selectedUser} = this.state;
        return (
            <div>
                <div className="content-50">
                    <Form onSubmit={this.handleSubmit}>
                        <div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={selectedUser.username}
                                    onChange={this.onChangeUsername}
                                    validations={[required, vusername]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={this.onChangeEmail}
                                    validations={[required, email]}
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Update</button>
                            </div>
                        </div>
                        {this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{display: "none"}}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        )
    }
}

export default withRouter(UserEdit);