import { Component } from 'react'
import socketIOClient from "socket.io-client";
import { Artifact } from "../../components/artifact/artifact"
const SERVER_URL = `http://127.0.0.1:4001`
const ADMIN_URL = `${SERVER_URL}/admin`
export class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            sockResponse: "nothing",
            adminResponse: "nothing"
        }

    }
    componentDidMount() {
        const { adminResponse } = this.state

        this.generalIO = socketIOClient(SERVER_URL);
        this.adminIO = socketIOClient(ADMIN_URL);
        this.generalIO.on("from-dashboard", data => this.setState({ sockResponse: data }));
        this.generalIO.on("from-client-disconnect", data => this.setState({ sockResponse: data }));
        this.adminIO.on("ADMIN_ACK", data => this.setState({ adminResponse: data }));
        this.adminIO.on("ADMIN_DATA", data => {
            console.log(data)
            // setTimeout(this.setState({ adminResponse: adminResponse+data }), 100)
        })
        this.adminIO.on("APP_CONFIG", data => {
            console.log(data)
            data.newproperty = "Some old text"
            this.adminIO.emit("setConfig", data)
        })
        this.adminIO.on("APP_CONFIG_SET", () => {
            console.log("Data Set")
        })
        this.generalIO.emit("dashboard")
        this.adminIO.emit("getConfig")
        
        // setTimeout(()=> this.generalIO.emit("client-disconnect", "done"), 3000)
    }

    render() {
        return (
            <div className="dashboard-container">
                <Artifact />
                <Artifact />
                <Artifact />
            </div>
        )
    }
}