import { Component } from 'react'
import {  Dashboard } from './dashboard/dashboard'


const DASHBOARD = "Dashboard"
export const PageNames = { DASHBOARD }
const PageMap = {
    [DASHBOARD] : Dashboard
}

export class Pages extends Component {
    
    render() {
        const { name }  = this.props
        const Page = PageMap[name]
        return (
            <div className="page-container">
                <Page />
            </div>
        )
    }
}