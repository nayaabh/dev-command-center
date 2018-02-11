import { Component } from 'react'
import { GoRocket } from 'react-icons/lib/go'
export class Search extends Component {
    render() {
        return (
            <div className="search-container">
                <input type="text" placeholder="> Type a command" />
                <GoRocket size="35" />
            </div>
        )
    }
}