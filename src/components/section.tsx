import { ButtonGroup } from "@blueprintjs/core";
import { QuestionSection} from "./SurveyForm";
import { QAQuestion } from "../form/question";
import React from "react";
import { QuestionButton } from "./questionButton";
import { DPFormItem } from "./DPFormItem";
import { SectionButton } from "./sectionButton";
import { DuplicateSettings, DupeSettings } from "./duplicateSettings";
import { getRandomId } from "../utils/getRandomId";

interface SectionCProps {
    section: QuestionSection|RootSection,
    definedQuestions : QAQuestion[],
    handleQuestionChange: (question: QAQuestion, _path: number[]) => void,
    parentPath: number[],
    handleDeleteChildSectionOrQuestion: (deleteid: string, _path: number[]) => void,
    handleSectionDuplicatingSettingsChange :(id:string, dupe: DupeSettings)=>void,
    handleSectionClick: (sectionid: string, _path: number[]) => void,
}
interface SectionCState {
}
export class SectionC extends React.Component<SectionCProps, SectionCState>{
    constructor(props: SectionCProps) {
        super(props);
        this.state = {
        }
    }

    handleQuestionChange(q: QAQuestion, path: number[]) {
        if (this.props.handleQuestionChange) this.props.handleQuestionChange(q, path);
    }
    handleDuplicatingSettingsSave(id: string, dupe: DupeSettings){
        if(this.props.handleSectionDuplicatingSettingsChange) this.props.handleSectionDuplicatingSettingsChange(id, dupe)
    }
    handleDuplicatingSettingsCancel(){

    }

    render() {
        let comp = null;
        let readablePath = getReadablePath(this.props.parentPath);
        if (readablePath) readablePath += ".";
        comp = this.props.section.content.map((item, index) => {
            let childPath = this.props.parentPath.concat(index);
            if (item instanceof QAQuestion) {
                return <QuestionButton path={childPath} questionId={item.id} handleDeletion={this.props.handleDeleteChildSectionOrQuestion} readablePath={readablePath + (index + 1)} key={item.id} isExpanded={false}>
                    <DPFormItem onChange={(q) => this.handleQuestionChange(q, childPath)} question={item} />
                </QuestionButton>
            }
            else if (item instanceof QuestionSection) {
                return <SectionButton path={childPath} handleDeletion={this.props.handleDeleteChildSectionOrQuestion} sectionId={item.id} readablePath={readablePath + (index + 1)} key={item.id} onClick={this.props.handleSectionClick}>
                    <DuplicateSettings definedQuestions = {this.props.definedQuestions} handleSave = {(d)=>this.handleDuplicatingSettingsSave(item.id,d )} handleCancel={this.handleDuplicatingSettingsCancel} {...item.duplicatingSettings} />
                </SectionButton>
            }
            return null;
        })
        return (
            <ButtonGroup fill vertical>
                {comp}

            </ButtonGroup>

        )
    }
}



export function getReadablePath(nu: number[]) {
    return nu.slice(1).map(item => item + 1).join(".");

}


export class RootSection {
    questions: {[key:string]: QAQuestion} = {};
    sections: {[key: string]: QuestionSection} = {};
    content: (QuestionSection|QAQuestion)[]=[];
    name!: string;
    id: string;
    constructor(){
        this.id = getRandomId("root-");
    }
    
    static getFromPath(path:number[], root:(RootSection| QuestionSection| QAQuestion)[] ) : RootSection|QuestionSection|QAQuestion{
        let el = root[path[0]];
        if(path.length ===1) return el;
        return RootSection.getFromPath(path.slice(1), el.content)
    }
    

    addQuestion( parentPath: number[], q?: (QAQuestion)[]){
        if(!q) q = [new QAQuestion()];
        let section = RootSection.getFromPath(parentPath, [this])
        for(let i = 0; i<q.length;i++){
            let current = q[i];
            if(this.questions[current.id]) throw new Error("Question id conflict");
            this.questions[current.id] = current;
            if(!(section instanceof QAQuestion)){
                section.content.push(current);
            }


        }
        return this;
    }

    addSection( parentPath: number[], q?: (QuestionSection)[]){
        if(!q) q = [new QuestionSection()];
        let section = RootSection.getFromPath(parentPath, [this])
        for(let i = 0; i<q.length;i++){
            let current = q[i];
            if(this.questions[current.id]) throw new Error("Section id conflict");
            this.sections[current.id] = current;
            if(!(section instanceof QAQuestion)){
                section.content.push(current);
            }
        }
        return this;
    }
    
    removeQuestion(questionId: string, path: number[]){
        let parentSection = RootSection.getFromPath(path,[this]);
        if (!(parentSection instanceof QAQuestion)){
            let foundIndex = parentSection.content.findIndex(item=>item.id===questionId);
            if(foundIndex>-1){
                parentSection.content.splice(foundIndex, 1);
                delete this.questions[questionId];
            }
        }
        return this;
    }

    removeSection(sectionId: string, path: number[]){
        let parentSection = RootSection.getFromPath(path,[this]);
        if (!(parentSection instanceof QAQuestion)){
            let foundIndex = parentSection.content.findIndex(item=>item.id===sectionId);
            if(foundIndex>-1){
                parentSection.content.splice(foundIndex, 1);
                delete this.sections[sectionId];
            }
        }
        return this;
    }

    moveItem(prevPath: number[], newPath:number[]){
        let itemAtPath = RootSection.getFromPath(prevPath, [this]);
        let newParentPath = newPath.slice(0, newPath.length-1);
        let oldParentPath = prevPath.slice(0, prevPath.length-1);
        let newParent = RootSection.getFromPath(newParentPath, [this]);
        let oldParent = RootSection.getFromPath(oldParentPath,[this]);
        let foundIndex = oldParent.content.findIndex(item=>item.id===itemAtPath.id);
        if(foundIndex>-1 && !(oldParent instanceof QAQuestion)){
          let removed =  oldParent.content.splice(foundIndex,1);
            
        if(!(newParent instanceof QAQuestion)){
            if(removed instanceof QuestionSection){
               newParent.content.push( this.sections[removed[0].id]);
            }
            else if(removed instanceof QAQuestion){
                newParent.content.push(this.sections[removed[0].id])
            }
        }
        return this;
    }

    }
}