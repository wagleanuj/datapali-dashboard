import { Drawer } from "@blueprintjs/core";
import React from "react";
import { formatted, getPradeshData, pradeshes, localgovs } from "../testData/pradeshdata";
import { getRandomId } from "../utils/getRandomId";
import { AnswerOptions, IOption } from "./AnswerOptions";
import { ANSWER_TYPES, IValueType } from "./AnswerType";
import _ from "lodash";
import { QACondition, QAFollowingOperator } from "../form/condition";
import { ILiteral, QAComparisonOperator, QAType } from "../form/answer";


const pradeshOptions = new AnswerOptions();
let pradeshData = getPradeshData();
Object.keys(pradeshData).forEach(item => {
    let newOption: IOption = {
        groupName: undefined,
        id: getRandomId("opt-"),
        type: { name: ANSWER_TYPES.STRING },
        value: item
    }
    pradeshOptions.addOption(newOption);
});


const DistrictOptions = new AnswerOptions();
Object.keys(formatted).forEach(item => {
    let newOption: IOption = {
        groupName: pradeshes[formatted[item].pradesh_id - 1],
        id: getRandomId("opt-"),
        type: { name: ANSWER_TYPES.STRING },
        value: formatted[item].name
    }
    DistrictOptions.addOption(newOption);
})

function answerOptionsFromObject(obj: any) {
    let a = new AnswerOptions();
    Object.keys(obj).forEach((g: any) => {
        let group = obj[g];
        if (group.hasOwnProperty("local_govs")) {
            group.local_govs.forEach((option: any) => {
                let opt: IOption = {
                    groupName: g,
                    id: getRandomId("opt-"),
                    type: { name: ANSWER_TYPES.STRING },
                    value: option.name
                };
                a.addOption(opt);
            });
        }

    });
    let r:any = {
        "गाेरखा": "opt-b4442643-1282-aaf2-773d-ff9167cde88b",
        "लम्जुङ": "opt-bc149af2-44ef-b205-fe71-36ea458f17f2",
        "तनहु": "opt-52019c5d-842a-974b-daf1-49cd79e2088a",
        "नवलपरासी (पुर्व)": "opt-32cf0551-99d8-0e1a-803a-22a552bac919",
        "स्याङ्जा": "opt-68f223e9-2add-ea8e-521e-6b44d5f792e2",
        "कास्की": "opt-b30976f2-bc1e-be5f-a5b7-97f9bd06ca3d",
        "पर्बत": "opt-3d54448b-4afe-72c3-6fe4-101afd68141a",
        "बाग्लुङ": "opt-9ad3bdd5-b4cc-7630-9f43-248f9f5ea567",
        "म्याग्दी ": "opt-521fd825-ec4f-72e0-218a-12b5c022f755",
        "मनाङ": "opt-943e1062-1ab5-981b-3e17-1a9353cff729",
        "मुस्ताङ्ग": "opt-7875201d-d499-4e26-2108-505d172a4a0b",
        "नवलपरासी (पश्चिम)": "opt-8658b6fe-fa24-c677-2f78-9889333125af",
        "रूपन्देही": "opt-25bc05f0-f74c-a799-7ca1-a6dd37843e70",
        "कपिलवस्तु": "opt-5e3fd82e-a24c-5cc7-f2e8-942d5e88d94c",
        "दाङ": "opt-36047176-8f1a-cc6d-22be-415b5371b56c",
        "बाँके": "opt-8d59e94a-2a29-72c0-33a2-bcd0219b0256",
        "बर्दिया": "opt-49c2ae85-4058-5ac1-d318-e6941d448bab",
        "रूकुम (पूर्व)": "opt-6141bd48-3761-a6ce-23db-7d00bf10402d",
        "राेल्पा": "opt-f8263fd4-9450-ee71-81ae-9de5e56d46c7",
        "प्युठान": "opt-7e4cbb01-a4fa-384e-438b-d7ce46c0e381",
        "गुल्मी ": "opt-c59dd7e3-77fd-3943-4ffe-70a3c97c5fbd",
        "अर्घखाँची": "opt-61ce69ed-9357-f34a-e808-0e20a8f4b16a",
        "पाल्पा": "opt-76078b46-d2a4-761e-f9c0-aa0bc7f79e1a",
        "ताप्लेजुङ": "opt-bab5d816-e76d-fbff-65b3-239b493db5b7",
        "पाँचथर": "opt-49a4c9e1-2351-44bb-ae37-d2a5f7a1f75e",
        "र्इलाम": "opt-51b80304-f06b-9ecc-3f72-ffd39de5d78b",
        "झापा": "opt-9d6582e5-ed5d-5451-74b1-bad493e4f39a",
        "माेरङ": "opt-40a8583e-02ae-7945-b979-a30b32236624",
        "सुनसरी": "opt-d2d70e69-6e8f-10a7-6716-35e5e763b09f",
        "धनकुटा": "opt-18a23432-fc93-e1dd-cd8a-6e4e968a4c02",
        "तेह्रथुम": "opt-f5cc8719-272c-211c-3b61-ef4b0d5a0857",
        "भाेजपुर": "opt-7b5e86a9-77bd-b641-a7a1-de36fe410633",
        "संखुवासभा": "opt-8c0afe54-ddee-f5ad-f860-a5726f4d6609",
        "साेलुखुम्बु": "opt-6789f493-0588-3d21-3bb3-682f45578a81",
        "अाेखलढुंगा": "opt-437f3175-a6f6-2668-6215-4d726b01f9c4",
        "खाेटाङ": "opt-063c552c-6ffd-08fa-7855-ffd7977c1561",
        "उदयपुर": "opt-79f1dad3-d94f-0dcc-ecf5-22f06ac96d2a",
        "सिन्धुली": "opt-47821bdf-b58f-fad6-0f7f-3af01da2553f",
        "रामेछाप": "opt-fcaa4ef5-cde4-c7e7-2da0-73501624e0ab",
        "दाेलखा": "opt-0ed1001b-3aef-677b-cd5c-cb910b67efe6",
        "सिन्धुपाल्चाेक": "opt-3ce9e83a-b3c7-15f6-e4f5-0f2736184a21",
        "काभ्रेपलाञ्चाेक": "opt-0409a7c2-cbb9-5c3a-10b4-7d38075ecef1",
        "नुवाकाेट": "opt-4a8e6639-ac06-c37b-6c56-10d525cc5e77",
        "रसुवा": "opt-c771741a-4fde-a1bb-7f00-42168d9f7f21",
        "भक्तपुर": "opt-44148028-c542-4ab9-d30d-3d0713edbd7d",
        "ललितपुर": "opt-6985c627-235d-b63d-6da2-c506f667b534",
        "काठमण्डाै": "opt-7798c658-0d97-ba00-753b-c52edf1505d5",
        "धादिङ": "opt-3240c989-4e06-6d09-0879-30fa16222278",
        "मकवानपुर": "opt-836df119-23ef-ea86-addc-48d16e8e4b5f",
        "चितवन": "opt-05f50c99-4ba6-4ac9-24af-a1869414b8b1",
        "सप्तरी": "opt-8b64d308-3030-2175-a56a-3e87430d3178",
        "सिरहा": "opt-e3561984-1174-2a2a-70ef-26dcf73bedd5",
        "धनुषा": "opt-fe1fe8fc-820d-4c8b-30de-789ca422fb5e",
        "महाेत्तरी": "opt-fc38cd65-88f7-2441-b09b-f8c8d0f5d36a",
        "सर्लाही": "opt-2a332608-58ee-dc38-5243-dca2f4c386dd",
        "राैटहट": "opt-eac4d155-2cfb-6703-3857-95c61e09511e",
        "बारा": "opt-5009498d-b709-f14c-da94-18bf431a0406",
        "पर्सा": "opt-88d15cbe-cd18-7008-8c0b-1b9bc1b35ffe",
        "हुम्ला": "opt-54fbd101-bc9e-8ae2-fb16-7dbb08a73dc2",
        "मुगु": "opt-ade0d21e-5a6f-8231-773b-c98f77eccdbd",
        "डाेल्पा": "opt-85b56f5a-9a0d-202a-c2c7-7401b817ae13",
        "जुम्ला": "opt-5596de39-a125-7d9c-6c9f-e67c13663a69",
        "कालिकाेट": "opt-42c4c17b-877c-decd-92e5-92dbdaf622ad",
        "दैलेख": "opt-4342d870-db8d-50c8-22ea-671cdfd7587d",
        "जाजरकाेट": "opt-bb6d632b-60f1-005c-6f48-515aed610cff",
        "रूकुम (पश्चिम)": "opt-934a1518-006e-4465-a27b-a3a6addf0fa4",
        "सल्यान": "opt-06fbc9dc-30ac-31de-14e7-df3b1384578d",
        "सुर्खेत": "opt-ae4f20b3-5bdd-2014-3309-7b80dec4ea22",
        "कैलाली": "opt-f12432d1-99c9-0ce4-dbb2-a5757d312706",
        "कन्चनपुर": "opt-552cbce8-ebc4-3c42-bd00-ce3375be6001",
        "डडेलधुरा": "opt-050f3035-4749-a9d6-1811-4ca1d24af39b",
        "बैतडी": "opt-b36a73e3-1e3e-d136-68ff-a3b541f6531c",
        "डाेटी": "opt-06f7da64-42ba-821b-9a72-a10d726cd259",
        "अछाम": "opt-7ad94d3c-3160-9ac9-f35d-562169356c1f",
        "बाजुरा": "opt-f475d439-9446-4ba5-f329-251fa5973553",
        "बझाङ": "opt-4659e755-530f-cbde-9b7f-baa32e5aefe4",
        "दार्चुला": "opt-be494339-fdf0-e206-5c45-e054c7912fef"
      }
    Object.keys(a.optionGroupMap).forEach(item => {
        let group = a.optionGroupMap[item];
        group.appearingCondition = new QACondition();
        console.log(group.name);
        let literal: ILiteral = {
            literalId: getRandomId("lit-"),
            questionRef: "q-72524cdf-ee33-1feb-619d-6820d8dc5084",
            comparisonOperator: QAComparisonOperator.Equal,
            comparisonValue: { type: QAType.String, content: r[group.name] },
            followingOperator: QAFollowingOperator.AND
        }
           group.appearingCondition.setLiterals([literal])
    })
    return a;
}


const MunicipalityOptions = answerOptionsFromObject(localgovs);

interface IConstant {
    name: string
    id: string
    type?: IValueType
    value: AnswerOptions | string
}
export class Constants {
    consts: { [key: string]: IConstant } = {
        municipalities: {
            name: "municipalities",
            id: getRandomId("const-"),
            type: { name: ANSWER_TYPES.SELECT, ofType: { name: ANSWER_TYPES.STRING } },
            value: MunicipalityOptions,
        },
        districts: {
            name: "districts",
            id: getRandomId("const-"),
            type: { name: ANSWER_TYPES.SELECT, ofType: { name: ANSWER_TYPES.STRING } },
            value: DistrictOptions,
        },
        pradesh: {
            name: "pradesh",
            id: getRandomId("const-"),
            type: { name: ANSWER_TYPES.SELECT, ofType: { name: ANSWER_TYPES.STRING } },
            value: pradeshOptions,
        }
    }
    private count: number = 0;

    static fromJSON(a: any) {

    }
    static toJSON(a: Constants) {

    }

    get ConstantsArray() {
        console.log("sad");
        console.log(formatted);
        return Object.values(this.consts);
    }

    getConstant(constname: string) {
        return _.cloneDeep(this.consts[constname]);
    }

    addConstant(constant?: IConstant) {
        if (!constant) constant = { name: "", id: "constant-" + this.count, type: undefined, value: "" }
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


interface ConstantDefinitionsState {

}
interface ConstantDefinitionsProps {
    isOpen: boolean,
}
export class ConstantDefinitions extends React.Component<ConstantDefinitionsProps, ConstantDefinitionsState>{

    constructor(props: ConstantDefinitionsProps) {
        super(props);
        this.state = {

        }
    }
    render() {
        console.log(pradeshOptions);
        console.log(DistrictOptions);
        console.log("mun", MunicipalityOptions)
        return (
            <Drawer isOpen={this.props.isOpen}>

            </Drawer>
        )
    }
}