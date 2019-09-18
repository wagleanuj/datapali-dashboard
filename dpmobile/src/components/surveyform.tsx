import React, { ReactNode, ReactElement } from 'react';
import { View, Picker, DatePickerAndroid, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
// tslint:disable-next-line: max-line-length
import { QAQuestion, RootSection, QuestionSection, QORS, IValueType, ANSWER_TYPES, request, AnswerOptions, QACondition, QAComparisonOperator, QAFollowingOperator, ILiteral, getReadablePath, DuplicateTimesType } from 'dpform';
import _ from 'lodash';
import { withStyles, ThemedStyleType, Layout, ThemeType, Button, Text, Input, RadioGroup, Radio } from 'react-native-ui-kitten';
import { Showcase } from './showcase';
import { ShowcaseItem } from './showcaseitem';
import { AnswerStore } from '../answermachine';
import { SurveySection, QuestionComponent } from './section';
export type SurveyFormComponentProps = {
  setTitle: (newTitle: string) => void,
  setSubTitle: (newSub: string) => void,
} & ThemedStyleType

interface SurveyFormComponentState {
  root: RootSection;
  activeSection: RootSection | QuestionSection;
  activeSectionPath: number[];
  activeQuestion: number[];
  allQuestions: { data: (QuestionSection | QAQuestion), path: number[] }[];
  history: number[]
  currentQuestionIndex: number;
  currentItem?: { data: (QuestionSection | QAQuestion), path: number[] },
  currentIndex: number;
  answerStore: AnswerStore

}


export class SurveyFormComponent extends React.Component<SurveyFormComponentProps, SurveyFormComponentState> {
  constructor(props: SurveyFormComponentProps) {
    super(props);
    const root = new RootSection();
    this.state = {
      root: root,
      activeSection: root,
      activeSectionPath: [0],
      activeQuestion: [],
      allQuestions: [],
      currentQuestionIndex: 0,
      history: [],
      currentIndex: -1,
      answerStore: new AnswerStore(root).init()
    };
  }
  componentDidMount() {
    //  let root =  DPForm.RootSection.fromJSON()
    console.log("mounted")
    this.loadFile().then(res => {
      this.handleItemChange();
    });
  }
  handleItemChange() {
    this.props.setTitle(
      this.state.root.name
    )

    let rS = RootSection.getFromPath([0, this.state.currentIndex], [this.state.root]);

    if (rS instanceof QuestionSection) {
      let sub = `${getReadablePath([0, this.state.currentIndex])} : ${rS.name}`
      this.props.setSubTitle(sub);
    }
  }

  loadFile() {
    const requestBody = {
      query: `
        query GetForm($formId: String!){
            forms(id: $formId){
              id
              name
              content
            }
          }`,
      variables: {
        formId: 'root-5eadfe10-ed7a-3898-769b-490bbd5d849e',
      },
    };
    // tslint:disable-next-line:max-line-length
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1Njg3NTMyNjIsImV4cCI6MTU2ODgzOTY2Mn0.x6kbVhr3nIFOlPgt_HCBgE2o9PheBDrqmzvEMUHX81E";
     return request('http://142.93.151.160:5000/graphql',
      'forms',
      requestBody,
      'Could not find the file',
      token).then(file => {
        file = file[0];
        if (file) {
          file.content = JSON.parse(file.content);
          const root = RootSection.fromJSON(file);
          console.log(root.content.length);

          let firstItem = this.getNextQuestion([0], 0, root);
          // console.log(firstItem);
          // const allq = RootSection.Entries(root, [0], 0, QORS.QUESTION);
          this.setState({
            root: root,
            currentItem: firstItem,
            activeSection: root,
            activeSectionPath: [0],
            currentIndex: 0,
            answerStore: new AnswerStore(root).init()
          });
        }
      }).catch(err => console.log(err));
  }

  getReactNodeFor(questionOrSection: QuestionSection | QAQuestion) {

  }


  transformValueToType(type: IValueType, value: string) {
    switch (type.name) {
      case ANSWER_TYPES.BOOLEAN:
        return Boolean(value);
      case ANSWER_TYPES.DATE:
        return new Date(value);
      case ANSWER_TYPES.NUMBER:
        return parseFloat(value);
      case ANSWER_TYPES.STRING:
        return value;
      case ANSWER_TYPES.TIME:
        return new Date(value);
    }
    return value;
  }

  evaluateCondition(condition: QACondition) {
    let finalResult = true;
    let pendingOperator = null;
    condition.literals.forEach(literal => {
      const getValid = (item: ILiteral) => {
        let result = true;
        const answer = this.state.answerStore.getById(item.questionRef);
        const question = this.state.root.questions[item.questionRef];
        console.log(question.id, item.comparisonValue.content, item.comparisonOperator, answer);
        let c2 = this.transformValueToType(question.answerType, item.comparisonValue.content);
        let c1 = this.transformValueToType(question.answerType, answer);

        if (question) {
          switch (item.comparisonOperator) {
            case QAComparisonOperator.Equal:
              result = c1 === c2;
              console.log(result);
              break;
            case QAComparisonOperator.Greater_Than:
              result = c1 > c2;
              break;
            case QAComparisonOperator.Greater_Than_Or_Equal:
              result = c1 >= c2;
              break;
            case QAComparisonOperator.Less_Than:
              result = c1 < c2;
              break;
            case QAComparisonOperator.Less_Than_Or_Equal:
              result = c1 >= c2;
              break;
          }
        }
        return result;
      }
      let currentResult = getValid(literal);
      if (!pendingOperator) {
        finalResult = currentResult;
        pendingOperator = literal.followingOperator
      }
      else if (pendingOperator) {
        switch (pendingOperator) {
          case QAFollowingOperator.AND:
            finalResult = finalResult && currentResult;
            break;
          case QAFollowingOperator.OR:
            finalResult = finalResult || currentResult;
            break;
        }
      }

    });
    return finalResult;
  }

  getNextQuestion(startPath: number[], startIndex: number, root: RootSection) {
    if (startPath.length > 2) return;
    let curRIndex = startPath[startPath.length - 1];
    for (let i = curRIndex; i < root.content.length; i++) {
      let currSection = root.content[i];
      let kk = i === curRIndex ? startIndex : 0;
      if ((currSection instanceof QAQuestion)) return;
      let isSectionValid = this.evaluateCondition(currSection.appearingCondition);
      let isDuplicating = currSection.duplicatingSettings.isEnabled;
      if (isDuplicating && isSectionValid) {
        return { path: [0, i], data: currSection }
      }
      if (isSectionValid && kk <= currSection.content.length) {
        for (let j = kk; j < currSection.content.length; j++) {
          let item = currSection.content[j];
          let isItemValid = this.evaluateCondition(item.appearingCondition);
          if (isItemValid) {
            return { path: [0, i, j], data: item };
          }
        }
      }
    }
  }





  handleNext() {
    for (let i = this.state.currentIndex + 1; i < this.state.root.content.length; i++) {
      let nextItem = RootSection.getFromPath([0, i], [this.state.root]);
      if (nextItem && !(nextItem instanceof RootSection) && this.evaluateCondition(nextItem.appearingCondition)) {
        return this.setState((prevState: SurveyFormComponentState) => {
          let newhistory = _.clone(prevState.history);
          newhistory.push(prevState.currentIndex);
          return {
            history: newhistory,
            currentIndex: i
          };
        }, this.handleItemChange.bind(this));

      }
    }
  }

  handlePrev() {
    if (this.state.history.length >= 1) {
      this.setState((prevState: SurveyFormComponentState) => {
        let newHistory = _.clone(prevState.history);
        let newItem = newHistory.pop();
        return {
          currentIndex: newItem,
          history: newHistory
        };
      }, this.handleItemChange.bind(this));
    }
  }


  setAnswerFor(path: number[], iteration: number, value: string) {
    this.setState((prevState: SurveyFormComponentState) => {
      let a = prevState.answerStore;
      a.setAnswerFor(path, iteration, value);
      return {
        answerStore: a
      }
    })
  }

  renderQuestionOrSection(index: number) {
    let item = RootSection.getFromPath([0, index], [this.state.root]);
    if (item instanceof QuestionSection) {
      return <SurveySection
        answerStore={this.state.answerStore}
        setAnswer={this.setAnswerFor.bind(this)}
        evaluateCondition={this.evaluateCondition.bind(this)}
        section={item}
        path={[0, index]} />
    }
    else if (item instanceof QAQuestion) {
      return <QuestionComponent
        answerStore={this.state.answerStore}
        evaluateCondition={this.evaluateCondition.bind(this)}
        defaultValue={this.state.answerStore.getAnswerFor([0, index], 0)}
        onValueChange={this.setAnswerFor.bind(this, [0, index], 0)}
        question={item} path={[0, index]}
      />
    }
  }

  render() {
    return (
      <Showcase style={this.props.themedStyle.container}>
        <ShowcaseItem title="" >
          <View>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button onPress={this.handlePrev.bind(this)}>Prev</Button>
              <Button onPress={this.handleNext.bind(this)}>Next</Button>
            </View>
            {this.state.currentItem && this.renderQuestionOrSection(this.state.currentIndex)}
          </View>
        </ShowcaseItem>


      </Showcase>
    );
  }
}
export const SurveyForm = withStyles(SurveyFormComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: theme['background-basic-color-2'],
  },
  accordion: {
    backgroundColor: theme['color-primary-300']
  }
}));






