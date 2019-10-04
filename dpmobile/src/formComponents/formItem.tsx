import React from "react";
import { IValueType } from "dpform";

interface ISelectOption  {
    id: string;
    label: string;
    value: string;
}

type FormItemProps = {
    path: number[];
    value: string;
    options?: ISelectOption[];
    type: IValueType;
    errror: string;
    onChange: (value: string)=>void;
    onBlur: (value: string)=>void;
}

export class FormItem extends React.Component{
    constructor(props: FormItemProps){
        super(props);
      
    }
    getInputComponent(type: IValueType){
        
    }
}