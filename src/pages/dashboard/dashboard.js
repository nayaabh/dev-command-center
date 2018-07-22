import { Component } from 'react'
import socketIOClient from "socket.io-client";
import _ from 'lodash'
import { Artifact } from "../../components/artifact/artifact"
import { ViewModeSelector } from "../../components/view-mode-selector/view-mode-selector"
import * as Constants from "../../../backend/constants/constants"
import { IconType, CommandButton } from "../../components/command-buttons/command-button"
// import electron from 'electron'

// const { dialog } = electron.remote
export class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            repositories: {},
            configs: {},
            viewMode: Constants.LIST
        }
        this.generalIO = socketIOClient(Constants.SERVER_URL);
        this.adminIO = socketIOClient(Constants.APP_URL);
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
    switchViewMode(mode) {
        this.setState({
            viewMode: mode
        })
    }
    // showDialogue() {
    //     dialog.showMessageBox({
    //         type: 'info',
    //         buttons: ['OK', 'NOT OK', 'LOL', 'Cancel'],
    //         message: 'How are you doing?'
    //     })
    // }
    // <button onClick = {this.showDialogue}>Show Dialogue</button>
    render() {
        const { repositories, configs, viewMode} = this.state
        return (
            <div className="dashboard-wrapper">
                <ViewModeSelector 
                    modeList = {[Constants.LARGE_LIST, Constants.LIST]}
                    onClick = {(mode) => this.switchViewMode(mode)}
                    selectedMode = {viewMode}
                />
                <div className="commands-container">
                    <CommandButton 
                        type = {IconType.GO}
                        iconName = "GoPackage" 
                        onClick = {() => this.npmBuildSelected()}
                    />
                    <CommandButton 
                        type = {IconType.FA}
                        iconName = "FaFlask" 
                        onClick = {() => this.npmTestSelected()}
                        />
                        <CommandButton 
                        type = {IconType.FA}
                        iconName = "FaLeaf" 
                        onClick = {() => this.npmLintSelected()}
                        />
                </div>
                <div className="dashboard-container">
                    <div className="artifacts-container">
                        <span> Artifacts </span>
                        {
                            _.map(repositories, repo => <Artifact 
                                key = {repo.id}
                                id = {repo.id}
                                configs = {configs}
                                viewMode = {viewMode}
                                location = {repo.location}
                                onSelect = {(isSelected) => this.registerRepo(isSelected, repo)}
                                />)  
                        }
                    </div>
                    <div className="configs-container">
                        <span> Configs </span>
                        {
                            _.map(configs, repo => <Artifact 
                                key = {repo.id}
                                id = {repo.id}
                                configs = {configs}
                                viewMode = {viewMode}
                                location = {repo.location}
                                />)
                        }
                    </div>
                </div>
            </div>
        )
    }
}