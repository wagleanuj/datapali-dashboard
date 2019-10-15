import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from '../styles/slider';
import { ConnectedFormNode } from './reduxFormComponents/formNode';
type Props = {
    id: string;
    locationName: string;
    path: number[];
    formId: string;
    rootId: string;
}
export default class SliderEntry extends Component<Props, {}> {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };



    render() {
        // const { data: { title, subtitle }, even } = this.props;

        // const uppercaseTitle = title ? (
        //     <Text
        //         style={[styles.title, even ? styles.titleEven : {}]}
        //         numberOfLines={2}
        //     >
        //         {title}
        //     </Text>
        // ) : false;
        const even = true;
        return (
            <View
                style={styles.slideInnerContainer}
            >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>

                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    {/* {uppercaseTitle} */}
                    <ConnectedFormNode
                        id={this.props.id}
                        locationName={this.props.locationName}
                        formId={this.props.formId}
                        rootId={this.props.rootId}

                    />
                    <Text
                        style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                        numberOfLines={2}
                    >
                        {/* {subtitle} */}
                    </Text>
                </View>
            </View>
        );
    }
}