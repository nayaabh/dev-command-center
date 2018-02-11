import { Component } from 'react'
import { GoGitBranch } from 'react-icons/lib/go'
import socketIOClient from "socket.io-client";
import { CommandButton, IconType } from '../command-buttons/command-button'
import * as Constants from "../../../backend/constants/command-types"
const SERVER_URL = `http://127.0.0.1:4001`
const ARTIFACT_URL = `${SERVER_URL}/${Constants.ARTIFACT}`

export class Artifact extends Component {
    static defaultProps = {
        id: 'my-demo-artifact',
        location: 'P:\\workspace\\websites\\dev-command-center',
    }
    constructor() {
        super();
        this.state = {
            isGitRepo: false,
            commitsBehind: 0,
            commitsAhead: 0,
            buildStatus: 0,
            testStatus: 0,
            lintStatus: 0,
            branch: 'master'
        }
        this.artifactIO = socketIOClient(ARTIFACT_URL);
    }
    componentDidMount() {
        this.syncGit()
    }
    syncGit() {
        const {id, location } = this.props
        const {isGitRepo } = this.state
        // Register Listeners
        this.artifactIO
        .on(`${Constants.ARTIFACT} ${Constants.GIT_SYNC} id:${id}`, ({ id:idReceived, isGitRepo, commitsAhead, commitsBehind, branch }) => {
            this.setState({
                isGitRepo,
                commitsAhead,
                commitsBehind,
                branch
            })
        })
        // Send Request
        this.artifactIO
        .emit(`${Constants.ARTIFACT} ${Constants.GIT_SYNC}`, {id, location, isGitRepo})
    }
    gitPull() {

    }
    gitPush() {

    }
    npmBuild() {

    }
    npmTest() {

    }
    npmLint() {

    }
    render() {
        const { id, location } = this.props;
        const { branch, commitsAhead, commitsBehind } = this.state;
        return (
            <div className="artifact-container">
                <h2 className="artifact-name"> { id }</h2>
                <span className="artifact-location"><strong>Location:</strong> { location }</span>
                <div className="commands-properties">
                    <div className="git-properties">
                        <span><GoGitBranch /> {branch}</span>
                    </div>
                    <div className="commands-container">
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoSync" 
                            onClick = {() => this.syncGit()}
                        />
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoCloudDownload"
                            text = {commitsBehind} 
                            onClick = {this.gitPull}
                        />
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoCloudUpload" 
                            text = {commitsAhead}
                            onClick = {this.gitPush}
                        />
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoPackage" 
                            onClick = {this.npmBuild}
                        />
                        <CommandButton 
                            type = {IconType.FA}
                            iconName = "FaFlask" 
                            onClick = {this.npmTest}
                         />
                         <CommandButton 
                            type = {IconType.FA}
                            iconName = "FaLeaf" 
                            onClick = {this.npmLint}
                         />
                    </div>
                </div>
            </div>
        )
    }
}