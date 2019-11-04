import { Classes, Icon, IconName, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { Component, ReactNode } from 'react';

type SidebarItemProps = {
    children?: ReactNode;
    title: string;
    className: string;
    onClick: () => void;
    iconName: IconName;
    isSelected: boolean;
}
export default class SidebarItem extends Component<SidebarItemProps, {}> {
    render() {
        const { title, className, children, onClick } = this.props;
        return (
            <a style={{ lineHeight: '40px' }} onClick={onClick} className={classNames({
                [Classes.ACTIVE]: this.props.isSelected,
            }, Classes.MENU_ITEM, Classes.LARGE, className)}  >
                <div className={'frc'}>
                    {this.props.iconName && <Icon color={'rgba(19,124,189,.8)'} iconSize={20} icon={this.props.iconName} />}
                    <span style={{ marginLeft: 7 }} className={Classes.TEXT_LARGE}>{title}</span>
                </div>

            </a>)
    }
}
