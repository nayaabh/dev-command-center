import { Component } from 'react'
import { GoGitBranch } from 'react-icons/lib/go'
import { CommandButton, IconType } from '../command-buttons/command-button'

export class Artifact extends Component {
    static defaultProps = {
        id: 'my-demo-artifact',
        location: 'P:\\workspace\\websites\\dev-command-center',
        branchName: 'master'
    }

    render() {
        const { id, location, branchName } = this.props;
        return (
            <div className="artifact-container">
                <h2 className="artifact-name"> { id }</h2>
                <span className="artifact-location"><strong>Location:</strong> { location }</span>
                <div className="commands-properties">
                    <div className="git-properties">
                        <span><GoGitBranch /> {branchName}</span>
                    </div>
                    <div className="commands-container">
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoSync" 
                        />
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoCloudDownload" 
                        />
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoCloudUpload" 
                        />
                        <CommandButton 
                            type = {IconType.GO}
                            iconName = "GoPackage" 
                        />
                        <CommandButton 
                            type = {IconType.FA}
                            iconName = "FaFlask" 
                         />
                         <CommandButton 
                            type = {IconType.FA}
                            iconName = "FaLeaf" 
                         />
                    </div>
                </div>
            </div>
        )
    }
}