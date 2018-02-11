import { Component } from 'react'
import {GoGraph, GoSettings, GoTerminal } from 'react-icons/lib/go'

export class Menu extends Component {
    render() {
        return (
            <div className="menu-container">
                <div className="menu dashboard-icon active">
                    <GoGraph className="icons" />
                    Dashboard
                </div>
                <div className="menu settings-icon">
                    <GoSettings />
                    Settings
                </div>
                <div className="menu console-icon">
                    <GoTerminal />
                    Console
                </div>
            </div>
        )
    }
}