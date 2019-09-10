import { IConstant } from '..';


export class Constants {
    consts: { [key: string]: IConstant } = {};

    private count: number = 0;

    static fromJSON(a: any) {

    }
    static toJSON(a: Constants) {

    }

    get ConstantsArray() {

        return Object.values(this.consts);
    }

    getConstant(constname: string) {
        return _.cloneDeep(this.consts[constname]);
    }

    addConstant(constant?: IConstant) {
        if (!constant) { constant = { name: '', id: 'constant-' + this.count, type: undefined, value: '' }; }
        this.consts[constant.id] = constant;
        return this;
    }

    removeConstant(id: string) {
        if (this.consts[id]) {
            delete this.consts[id];
        }
        return this;
    }


}
