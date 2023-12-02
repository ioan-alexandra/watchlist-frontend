import React, {Component} from 'react';
import ReportService from "../api/ReportService";
import EventBus from "../common/EventBus";
import {confirmAlert} from "react-confirm-alert";
import {Button, ButtonGroup} from "reactstrap";

class BoardModerator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: []
        };
    }

    componentDidMount() {
        this.setState({});

        ReportService.getReports().then(
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
                    onClick: () => ReportService.deleteReport(id).then(() => {
                        this.setState({});
                        ReportService.getReports().then((response) => {
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
        console.log(this.state.content);

        return (
            <div className="content">
                <h1 className="text-center"> Reports </h1>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <td>From</td>
                        <td>Text</td>
                    </tr>

                    </thead>
                    <tbody>
                    {
                        this.state.content.map(
                            report =>
                                <tr key={report.id}>
                                    <td> {report.from}</td>
                                    <td> {report.text}</td>
                                </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default BoardModerator;