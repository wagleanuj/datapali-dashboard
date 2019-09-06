import { IValueType } from "./AnswerType";

import { AnswerOptions } from "./AnswerOptions";
import { Breadcrumb } from "@blueprintjs/core";
import React from "react";

export class Constant {
    name!:string;
    id!: string;
    type!: IValueType;
    value!: AnswerOptions|string

    static fromJSON(a:any){

    }
    static toJSON(a: Constant){

    }

}
<Breadcrumb></Breadcrumb>

// export class ConstantDefinitions extends React.Component<>