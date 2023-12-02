import React, {Component} from "react";
import './App.css';
import {Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "./api/AuthService";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Watchlist from "./components/watchlist-user";
import Login from "./components/Login";
import Profile from "./components/Profile";
import BoardUser from "./components/board-user";
import BoardModerator from "./components/board-moderator";
import BoardAdmin from "./components/board-admin";
import {SignUp, UserEdit} from "./components";
import Report from "./components/report-users"
class App extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        this.setState({});
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
            });
        }
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const {currentUser, showModeratorBoard, showAdminBoard} = this.state;

        return (
            <div className = "height">
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand">
                        com.alex.watchlist
                    </Link>
                    <div className="navbar-nav mr-auto">

                        {showModeratorBoard && (
                            <li className="nav-item">
                                <Link to={"/mod"} className="nav-link">
                                    Moderator Board
                                </Link>
                            </li>
                        )}

                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to={"/admin"} className="nav-link">
                                    Admin Board
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/user"} className="nav-link">
                                    Search
                                </Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link">
                                    {currentUser.username}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/watchlist"} className="nav-link">
                                    Watchlist
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/report"} className="nav-link">
                                    Report
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={this.logOut}>
                                    LogOut
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link">
                                    Sign Up
                                </Link>
                            </li>

                        </div>
                    )}
                </nav>

                <div className="homeBg">
                    <div className="homeOverlay">
                <Switch>
                    <Route exact path={["/", "/login"]} component={Login}/>
                    <Route exact path="/register" component={SignUp}/>
                    <Route exact path="/profile" component={Profile}/>
                    <Route path="/user" component={BoardUser}/>
                    <Route path="/users/:id" component={UserEdit}/>
                    <Route path="/mod" component={BoardModerator}/>
                    <Route path="/admin" component={BoardAdmin}/>
                    <Route path="/watchlist" component={Watchlist}/>
                    <Route path="/report" component={Report}/>

                </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;