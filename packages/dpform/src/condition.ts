import { ILiteral } from './answer';
import _ from 'lodash';

export class QACondition {

    literals: Array<ILiteral>;

    constructor() {
        this.literals = Array<ILiteral>();
    }

    static fromJSON(data: { [key: string]: any }) {
        if (!data) { return new QACondition(); }
        const c = new QACondition();
        const literals: ILiteral[] = data.literals;
        c.setLiterals(literals);
        return c;
    }

    static toJSON(data?: QACondition): { [key: string]: any } | undefined {
        if (!data) { return undefined; }
        return {
            literals: JSON.parse(JSON.stringify(data.literals)),
        };
    }

    static checkIfValid(condition: QACondition) {
        if (!condition.literals) { return false; }
        let isValid = true;
        condition.literals.forEach((literal) => {
            const validity: boolean = Object.values(literal).every((x: ILiteral) => !_.isNil(x));
            if (!validity) { isValid = false; }
        });
        return isValid;

    }

    static Clone(condition: QACondition): QACondition {
        const newCondition = new QACondition();
        return newCondition;
    }
    setLiterals(newLiterals: ILiteral[]) {
        this.literals = newLiterals;
        return this;
    }

    getClause(): string {
        let clause = '';
        this.literals.forEach((literal, key) => {
            clause += `l${key}${key === this.literals.length - 1 ? literal.followingOperator : ''}`;
        });
        return clause;
    }

    get Literals(): Array<ILiteral> {
        return this.literals;
    }

    addLiteral(literal: ILiteral) {
        this.literals.push(literal);
        console.log(this.literals);
    }

    deleteLiteral(literalIndex: number) {
        this.literals.splice(literalIndex, 1);
        return this;
    }
}




export enum QAFollowingOperator {
    OR = '||',
    AND = '&',
}
