import { Component } from 'react'
import { Menu } from './components/menu/menu'
import { Search } from './components/search/search'
import { Pages, PageNames } from './pages/pages'
// import * as config from '../configs/artifacts.json'

export class App extends Component {
    constructor() {
        super()
        this.state = {
            page: "HOME"
        }
    }
    render() {
        const {page} = this.state
        return (
            <div className="dev-commander-root">
                <header>
                    <h1 className="heading">Dashboard</h1>
                    <Search />   
                </header>
                <Menu />
                <Pages 
                    name = {PageNames.DASHBOARD}
                />
            </div>
        ) 
    }
}