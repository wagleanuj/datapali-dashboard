import { ANSWER_TYPES } from '@datapali/dpform';
import { DatePicker, Radio, TimePicker } from 'antd';
import React from 'react';

export const BooleanInput = (props: any) => {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    return (
        <Radio.Group onChange={props.onChange} value={props.value}>
            <Radio style={radioStyle} value={"true"}>
                Yes
        </Radio>
            <Radio style={radioStyle} value={"false"}>
                No
        </Radio>
        </Radio.Group>
    )
}

export const ValueInputC = (props: any) => {
    switch (props.valueType.name) {
        case ANSWER_TYPES.BOOLEAN:
            return <BooleanInput />;
        case ANSWER_TYPES.DATE:
            return <DatePicker value={props.value} onChange={(date, dateString) => props.onChange(dateString)} />
        case ANSWER_TYPES.TIME:
            return <TimePicker onChange={props.onChange}
    }
    return null;
}
