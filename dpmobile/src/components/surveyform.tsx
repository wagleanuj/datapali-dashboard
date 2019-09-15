import React, { ReactNode, ReactElement } from 'react';
import { View, Picker, DatePickerAndroid, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
// tslint:disable-next-line: max-line-length
import { QAQuestion, RootSection, QuestionSection, QORS, IValueType, ANSWER_TYPES, request, AnswerOptions, QACondition, QAComparisonOperator, QAFollowingOperator, ILiteral, getReadablePath, DuplicateTimesType } from 'dpform';
import _ from 'lodash';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { withStyles, ThemedStyleType, Layout, ThemeType, Button, Text, Input, RadioGroup, Radio } from 'react-native-ui-kitten';
import { List } from 'react-native-paper';
import { ScrollableAvoidKeyboard } from './scrollableAvoidKeyboard';
import { Showcase } from './showcase';
import { ShowcaseItem } from './showcaseitem';
import { Section } from 'react-native-paper/typings/components/Drawer';
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
  answers: { [key: string]: string };
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
      answers: {},
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1Njg1NzY4NTgsImV4cCI6MTU2ODY2MzI1OH0.vTE76XSSrfi-z1yYbTmm-0Y-MoPa7M9XeWfC_i9n_bM";
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
        const answer = this.state.answers[item.questionRef];
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


  getSectionPage(section: QuestionSection, path: number[]) {
    let comp = section.content.map((item, index) => {
      let isValid = this.evaluateCondition(item.appearingCondition);
      if (item instanceof QAQuestion) {
        return isValid ? this.getQuestionPage(item, path.concat(index)) : null;
      }
      else if (item instanceof QuestionSection) {
        if (isValid) {
          if (item.duplicatingSettings.isEnabled) {
            return this.renderDuplicatingSection(item, path.concat(index));
          }
          return isValid ? this.getSectionPage(item, path.concat(index)) : null;

        }
      }
    });
    return <View key={section.id}>
      {comp}
    </View>

  }

  getQuestionPage(currentQuestion: QAQuestion, path: number[]): ReactNode {
    if (currentQuestion && currentQuestion instanceof QAQuestion) {
      const questionText = <Text style={{ fontSize: 15, paddingBottom: 20 }}>
        {`${getReadablePath(path)} : ${currentQuestion.questionContent.content}`}
      </Text>;
      const valueInput = this.getValueInput(currentQuestion.answerType,
        currentQuestion.options, currentQuestion);
      return (
        <Layout key={currentQuestion.id} style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 5, paddingRight: 5, marginBottom: 5, marginTop: 5 }}>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            {questionText}
            {valueInput}
          </View>
        </Layout>
      );
    }
  }

  storeAnswers(questionId: string, value: string) {
    this.setState((prevState: SurveyFormComponentState) => {
      const newAnswers = prevState.answers;
      newAnswers[questionId] = value;
      return {
        answers: newAnswers,
      };
    });
  }

  async openDatePicker(defaultDate: Date, onDateChange?: (date: Date) => void) {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: defaultDate || new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        if (onDateChange) onDateChange(new Date(year, month, day));
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }
  getValueInput(type: IValueType, options: AnswerOptions, question: QAQuestion) {
    let comp = null;
    if (type) {

      switch (type.name) {
        case ANSWER_TYPES.NUMBER:
          comp = <Input
            defaultValue={this.state.answers[question.id]}
            onChangeText={this.storeAnswers.bind(this, question.id)}
            placeholder=''
            keyboardType='number-pad'
          />;
          break;
        case ANSWER_TYPES.STRING:
          comp = <Input
            defaultValue={this.state.answers[question.id]}
            onChangeText={this.storeAnswers.bind(this, question.id)} />;
          break;
        case ANSWER_TYPES.DATE:
          let date = this.state.answers[question.id] ? new Date(this.state.answers[question.id]) : new Date();
          comp = <TouchableOpacity onPress={this.openDatePicker.bind(this, date, (date) => {
            let stringified = date.toDateString();
            this.storeAnswers(question.id, stringified);
          })}>
            <Input
              defaultValue={date.toDateString()}
              status={"primary"}
              disabled
            />
          </TouchableOpacity>;

          break;
        case ANSWER_TYPES.SELECT:
          comp = <SelInput
            question={question}
            definedQuestions={this.state.allQuestions}
            answerStore={this.state.answers}
            value={this.state.answers[question.id]}
            onSelectionChange={this.storeAnswers.bind(this, question.id)}
            answerType={type}
            options={options} />;
          break;
      }
    }
    return comp;
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

  renderDuplicatingSection(section: QuestionSection, path: number[]) {
    let repeatType: DuplicateTimesType = section.duplicatingSettings.duplicateTimes.type;
    let times = 0;
    if (repeatType === "number") {
      times = parseInt(section.duplicatingSettings.duplicateTimes.value);
    } else {
      let ans = this.state.answers[section.duplicatingSettings.duplicateTimes.value];
      if (ans) {
        times = parseInt(ans);
      }
    }
    times = 5;
    let { theme } = this.props;
    let children = []
    for (let i = 0; i < times; i++) {
      children.push(
        <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }} key={section.id + i}>
          <List.Accordion style={this.props.themedStyle.accordion} title={getReadablePath(path.concat(i))}>
            <View style={{ paddingLeft: 5, paddingRight: 5, paddingBottom: 20 }}>
              {this.getSectionPage(section, path.concat(i))}
            </View>
          </List.Accordion>
        </View>
      )
    }
    return <Layout style={{ marginTop: 20, marginBottom: 20 }} key={section.id + "root-duplicated"}>
      <Text style={{ padding: 5 }}>{`${getReadablePath(path)} : ${section.name}`}</Text>
      {children}
    </Layout>
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






