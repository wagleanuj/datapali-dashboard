import { ILiteral } from './answer';
export declare class QACondition {
    literals: Array<ILiteral>;
    constructor();
    static fromJSON(data: {
        [key: string]: any;
    }): QACondition;
    static toJSON(data?: QACondition): {
        [key: string]: any;
    } | undefined;
    static checkIfValid(condition: QACondition): boolean;
    static Clone(condition: QACondition): QACondition;
    setLiterals(newLiterals: ILiteral[]): this;
    getClause(): string;
    readonly Literals: Array<ILiteral>;
    addLiteral(literal: ILiteral): void;
    deleteLiteral(literalIndex: number): this;
}
export declare enum QAFollowingOperator {
    OR = "||",
    AND = "&"
}
