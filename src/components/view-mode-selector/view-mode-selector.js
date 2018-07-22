import React, { Component } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import {FaListUl, FaList} from 'react-icons/lib/fa'
import * as Constants from '../../../backend/constants/constants'

const supportedIcons = {
    [Constants.LARGE_LIST]: <FaListUl />,
    [Constants.LIST]: <FaList/>
}
export class ViewModeSelector extends Component {

    render() {
        const { modeList, onClick, selectedMode} = this.props

        return (
            <div className="view-mode-selector">
                 { _.map(modeList, mode => {
                      return (<span 
                        className={classNames("mode", mode.toLowerCase(), {"selected": selectedMode === mode})}
                        key = {mode}
                        onClick={() => onClick(mode)}
                        >
                        { supportedIcons[mode] }
                        </span>)
                  })
                }  
            </div>
        )
    }
}