import { IConstant } from './constant';
export declare class Constants {
    consts: {
        [key: string]: IConstant;
    };
    private count;
    static fromJSON(a: any): void;
    static toJSON(a: Constants): void;
    readonly ConstantsArray: IConstant[];
    getConstant(constname: string): IConstant;
    addConstant(constant?: IConstant): this;
    removeConstant(id: string): this;
}