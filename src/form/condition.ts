import { QALiteral } from "./answer";

export class QACondition {
    literals: Array<QALiteral>;

    constructor() {
        this.literals = Array<QALiteral>();
    }

    static Clone(condition: QACondition): QACondition {
        let newCondition = new QACondition();
        return newCondition;
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