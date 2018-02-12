import { Component } from 'react'
import { GoGitBranch } from 'react-icons/lib/go'
import socketIOClient from "socket.io-client";
import { CommandButton, IconType } from '../command-buttons/command-button'
import * as Constants from "../../../backend/constants/constants"

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
            buildStatus: Constants.START,
            testStatus: Constants.START,
            lintStatus: Constants.START,
            branch: 'master',
            pullStatus: Constants.START,
            pushStatus: Constants.START,
            syncStatus: Constants.START
        }
        this.artifactIO = socketIOClient(Constants.ARTIFACT_URL);
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
            console.log(`GIT_SYNC ${id}: `, isGitRepo, commitsAhead, commitsBehind, branch)
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
        const {id, location } = this.props
        // Register Listeners
        this.artifactIO
        .on(`${Constants.ARTIFACT} ${Constants.GIT_PULL} id:${id}`, ({ id:idReceived, stdout, status }) => {
            console.log(`PULL-LOG : ${id} ${stdout}`)
            this.setState({
                pullStatus: status
            })
            this.syncGit()
        })
        // Send Request
        this.artifactIO
        .emit(`${Constants.ARTIFACT} ${Constants.GIT_PULL}`, {id, location})
    }
    gitPush() {
        const {id, location } = this.props
        const {isGitRepo } = this.state
        // Register Listeners
        this.artifactIO
        .on(`${Constants.ARTIFACT} ${Constants.GIT_PUSH} id:${id}`, ({ id:idReceived, stdout, state }) => {
            console.log(`PUSH-LOG : ${id} ${stdout}`)
            this.setState({
                pullStatus: status
            })
            this.syncGit()
        })
        // Send Request
        this.artifactIO
        .emit(`${Constants.ARTIFACT} ${Constants.GIT_PUSH}`, {id, location})
    }
    npmBuild() {
        const {id, location } = this.props
        // Register Listeners
        this.artifactIO
        .on(`${Constants.ARTIFACT} ${Constants.BUILD_JS} id:${id}`, ({ id:idReceived, stdout, status }) => {
            console.log(`BUILD-LOG : ${id} ${stdout}`)
            this.setState({
                buildStatus: status
            })
        })
        // Send Request
        this.artifactIO
        .emit(`${Constants.ARTIFACT} ${Constants.BUILD_JS}`, {id, location})
    }
    npmTest() {
        const {id, location } = this.props
        // Register Listeners
        this.artifactIO
        .on(`${Constants.ARTIFACT} ${Constants.TEST_JS} id:${id}`, ({ id:idReceived, stdout, status }) => {
            console.log(`TEST-LOG : ${id} ${stdout}`)
            this.setState({
                testStatus: status
            })
        })
        // Send Request
        this.artifactIO
        .emit(`${Constants.ARTIFACT} ${Constants.TEST_JS}`, {id, location})
    }
    npmLint() {
        const {id, location } = this.props
        // Register Listeners
        this.artifactIO
        .on(`${Constants.ARTIFACT} ${Constants.LINT_FIX_JS} id:${id}`, ({ id:idReceived, stdout, status }) => {
            console.log(`LINT-LOG : ${id} ${stdout}`)
            this.setState({
                lintStatus: status
            })
        })
        // Send Request
        this.artifactIO
        .emit(`${Constants.ARTIFACT} ${Constants.LINT_FIX_JS}`, {id, location})
    }
    render() {
        const { id, location } = this.props;
        const { branch, commitsAhead, commitsBehind, buildStatus, lintStatus, testStatus, isGitRepo
        ,pullStatus, pushStatus } = this.state;
        return (
            <div className="artifact-container">
                <h2 className="artifact-name"> { id }</h2>
                <span className="artifact-location"><strong>Location:</strong> { location }</span>
                <div className="commands-properties">
                    { isGitRepo && <div className="git-properties">
                        <span><GoGitBranch /> {branch}</span>
                    </div>
                    }
                    <div className="commands-container">
                        { isGitRepo && <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoSync" 
                            onClick = {() => this.syncGit()}
                        /> }
                        { isGitRepo && <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoCloudDownload"
                            text = {commitsBehind} 
                            status = {pullStatus}
                            onClick = {() => { 
                                if(commitsBehind !== 0)
                                this.gitPull()
                            }}
                        /> }
                        { isGitRepo && <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoCloudUpload" 
                            text = {commitsAhead}
                            status = {pushStatus}
                            onClick = {() => {
                                if(commitsAhead !== 0)
                                this.gitPush()
                            }}
                        /> }
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoPackage" 
                            status = {buildStatus}
                            onClick = {() => this.npmBuild()}
                        />
                        <CommandButton 
                            type = {IconType.FA}
                            iconName = "FaFlask" 
                            status = {testStatus}
                            onClick = {() => this.npmTest()}
                         />
                         <CommandButton 
                            type = {IconType.FA}
                            iconName = "FaLeaf" 
                            status = {lintStatus}
                            onClick = {() => this.npmLint()}
                         />
                    </div>
                </div>
            </div>
        )
    }
}