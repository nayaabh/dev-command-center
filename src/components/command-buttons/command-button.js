import { Component } from 'react'
import * as GoIconPack from 'react-icons/lib/go'
import * as MaterialDesignPack from 'react-icons/lib/md'
import * as FontAwesomePack from 'react-icons/lib/fa'
import * as TypIconsPack from 'react-icons/lib/ti'

const GO = "GO"
const MD = "MD"
const FA = "FA"
const TI = "TI"

export const IconType = {
    GO, MD, FA, TI
}
const IconLib = {
    [IconType.GO]: GoIconPack,
    [IconType.MD]: MaterialDesignPack,
    [IconType.FA]: FontAwesomePack,
    [IconType.TI]: TypIconsPack
}
export class CommandButton extends Component {
    static defaultProps = {
        type: GO,
        iconName: "GoSettings",
    }

    render() {
        const { type, iconName, text, onClick } = this.props;
        const Icon = IconLib[type][iconName]
        return (
            <div className="commands" onClick={onClick}>
                <span className="badge">{text}</span>
                <Icon />
            </div>
        )
    }
}