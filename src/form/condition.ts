import { QALiteral } from "./answer";
import _ from "lodash";

export class QACondition {

    literals: Array<QALiteral>;

    constructor() {
        this.literals = Array<QALiteral>();
    }

    static checkIfValid(condition: QACondition) {
        if (!condition.literals) return false;
        let isValid = true;
        condition.literals.forEach((literal) => {
            let validity: boolean = Object.values(literal).every((x: QALiteral) => !_.isNil(x));
            if (!validity) isValid = false;
        });
        console.log(isValid);
        return isValid;

    }

    static Clone(condition: QACondition): QACondition {
        let newCondition = new QACondition();
        return newCondition;
    }
    setLiterals(newLiterals: QALiteral[]) {
        this.literals = newLiterals;
        return this;
    }

    getClause(): string {
        let clause = "";
        this.literals.forEach((literal, key) => {
            clause += `l${key}${key === this.literals.length - 1 ? literal.followingOperator : ""}`
        });
        return clause;
    }

    get Literals(): Array<QALiteral> {
        return this.literals;
    }

    addLiteral(literal: QALiteral) {
        this.literals.push(literal);
        console.log(this.literals);
    }

    deleteLiteral(literalIndex: number) {
        this.literals.splice(literalIndex, 1);
        return this;
    }
}




export enum QAFollowingOperator {
    OR = "||",
    AND = "&"
}