import { Component } from 'react'
import socketIOClient from "socket.io-client";
import _ from 'lodash'
import { Artifact } from "../../components/artifact/artifact"
import * as Constants from "../../../backend/constants/command-types"
const SERVER_URL = `http://127.0.0.1:4001`
const APP_URL = `${SERVER_URL}/${Constants.APP}`
export class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            repositories: {},
            configs: {}
        }
        this.generalIO = socketIOClient(SERVER_URL);
        this.adminIO = socketIOClient(APP_URL);
    }
    componentDidMount() {
        this.fetchArtifacts()
        this.fetchConfigs()
    }

    fetchArtifacts() {
        // Register Listeners
        this.adminIO
        .on(`${Constants.REGISTERED_ARTIFACTS} ${Constants.FETCH}`, (data) => {
            console.log(data)
            this.setState({ repositories: data })
        })
        // Send Request
        this.adminIO
        .emit(`${Constants.REGISTERED_ARTIFACTS} ${Constants.FETCH}`)
        
    }
    fetchConfigs() {
        // Register Listeners
        this.adminIO
        .on(`${Constants.REGISTERED_CONFIGS} ${Constants.FETCH}`, (data) => {
            console.log(data)
            this.setState({ configs: data })
        })
        // Send Request
        this.adminIO
        .emit(`${Constants.REGISTERED_CONFIGS} ${Constants.FETCH}`)
       
    }

    render() {
        const { repositories, configs} = this.state
        return (
            <div className="dashboard-container">
                <div className="artifacts-container">
                    {
                        _.map(repositories, repo => <Artifact 
                            key = {repo.id}
                            id = {repo.id}
                            location = {repo.location}
                            />)  
                    }
                </div>
                <div className="configs-container">
                    {
                        _.map(configs, repo => <Artifact 
                            key = {repo.id}
                            id = {repo.id}
                            location = {repo.location}
                            />)
                    }
                </div>
            </div>
        )
    }
}