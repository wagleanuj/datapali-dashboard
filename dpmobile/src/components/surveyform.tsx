import React, { ReactNode } from 'react';
import { View, Picker, DatePickerAndroid, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { RadioButton, Button, Text, TextInput as Input, Headline, List } from 'react-native-paper';
// tslint:disable-next-line: max-line-length
import { QAQuestion, RootSection, QuestionSection, QORS, IValueType, ANSWER_TYPES, request, AnswerOptions, QACondition, QAComparisonOperator, QAFollowingOperator, ILiteral, getReadablePath, DuplicateTimesType } from 'dpform';
import _ from 'lodash';
export type SurveyFormComponentProps = {}

interface SurveyFormComponentState {
  root: RootSection;
  activeSection: RootSection | QuestionSection;
  activeSectionPath: number[];
  answers: { [key: string]: string };
  activeQuestion: number[];
  allQuestions: { data: (QuestionSection | QAQuestion), path: number[] }[];
  history: { data: (QuestionSection | QAQuestion), path: number[] }[]
  currentQuestionIndex: number;
  currentItem?: { data: (QuestionSection | QAQuestion), path: number[] }

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
      history: []
    };
  }
  componentDidMount() {
    //  let root =  DPForm.RootSection.fromJSON()
    console.log("mounted")
    this.loadFile();
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgzMDEzMTIsImV4cCI6MTU2ODM4NzcxMn0.dYfY4zz4b5zx9nynbbo9Y4Oigk8r1r7pDJQkNIJbE6I";
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
      if(isDuplicating && isSectionValid) {
        console.log("duplicating section")
        return {path: [0, i], data: currSection}
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

  getSectionPage(section: QuestionSection, path: number[]): ReactNode {
    let comp = section.content.map((item, index) => {
      let isValid = this.evaluateCondition(item.appearingCondition);
      if (item instanceof QAQuestion) {
        return isValid ? this.getQuestionPage(item, path.concat(index)) : <></>;
      }
      else if (item instanceof QuestionSection) {
        return isValid ? this.getSectionPage(item, path.concat(index)) : <></>;
      }
    });
    return <View key={section.id}>
      {comp}
    </View>

  }

  getQuestionPage(currentQuestion: QAQuestion, path: number[]): ReactNode {
    if (currentQuestion && currentQuestion instanceof QAQuestion) {
      const questionText = <Text style={{ fontSize: 15, paddingBottom: 20 }}>
        {getReadablePath(path)}{" : "}{currentQuestion.questionContent.content}
      </Text>;
      const valueInput = this.getValueInput(currentQuestion.answerType,
        currentQuestion.options, currentQuestion);
      return (
        <View key={currentQuestion.id} style={{ paddingTop: 20 }}>{questionText}
          {valueInput}
        </View>
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
  getValueInput(type: IValueType, options: AnswerOptions, question: QAQuestion): ReactNode {
    let comp = null;
    if (type) {

      switch (type.name) {
        case ANSWER_TYPES.NUMBER:
          comp = <Input
            mode="outlined"
            defaultValue={this.state.answers[question.id]}
            onChangeText={this.storeAnswers.bind(this, question.id)}
            placeholder=''
            keyboardType='number-pad'
          />;
          break;
        case ANSWER_TYPES.STRING:
          comp = <Input
            mode="outlined"
            defaultValue={this.state.answers[question.id]}
            onChangeText={this.storeAnswers.bind(this, question.id)} />;
          break;
        case ANSWER_TYPES.DATE:
          let date = this.state.answers[question.id] ? new Date(this.state.answers[question.id]) : new Date();
          comp = <TouchableOpacity onPress={this.openDatePicker.bind(this, date, (date) => {
            let stringified = date.toDateString();
            this.storeAnswers(question.id, stringified);
          })}>
            <Input mode="flat"
              defaultValue={date.toDateString()}
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
    if (this.state.currentItem) {
      let path = this.state.currentItem.path.slice(0);
      let index = path.pop() + 1;
      let nextItem = this.getNextQuestion(path, index, this.state.root);
      if (!nextItem) return;
      this.setState((prevState: SurveyFormComponentState) => {
        let newhistory = _.clone(prevState.history);
        newhistory.push(this.state.currentItem);
        return {
          currentItem: nextItem,
          history: newhistory,
        };
      });
    }
  }

  handlePrev() {
    if (this.state.history.length >= 1) {
      this.setState((prevState: SurveyFormComponentState) => {
        let newHistory = _.clone(prevState.history);
        let newItem = newHistory.pop();
        return {
          currentItem: newItem,
          history: newHistory
        };
      });
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
    let children = []
    for (let i = 0; i < times; i++) {
      children.push(
        <View key={section.id + i}>
          <List.Accordion title="duplicate 1">
            {this.getSectionPage(section, path.concat(i))}
          </List.Accordion>
        </View>
      )
    }
    return <View>
      {children}
    </View>
  }

  renderQuestionOrSection(item: { data: (QuestionSection | QAQuestion), path: number[] }) {
    if (item.data instanceof QuestionSection) {
      if (item.data.duplicatingSettings.isEnabled) return this.renderDuplicatingSection(item.data, item.path);
      return this.getSectionPage(item.data, item.path);
    }
    else if (item.data instanceof QAQuestion) {
      return this.getQuestionPage(item.data, item.path)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Headline>Section</Headline>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button mode="contained" onPress={this.handlePrev.bind(this)}>Prev</Button>
          <Button mode="contained" onPress={this.handleNext.bind(this)}>Next</Button>
        </View>
        <ScrollView>
          {this.state.currentItem && this.renderQuestionOrSection(this.state.currentItem)}
        </ScrollView>
      </View>
    );
  }
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  socialAuthContainer: {
    marginTop: 48,
  },
  ewaButton: {
    maxWidth: 72,
    paddingHorizontal: 0,
  },
  textColor: {
    color: 'black',
  },
  ewaButtonIcon: {
    marginHorizontal: 0,
    tintColor: 'white',
  },
  formContainer: {
    flex: 1,
    marginTop: 48,
  },
  signInLabel: {
    flex: 1,

    color: 'white',
  },
  signUpButton: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 0,
  },
  signUpButtonText: {
    color: 'white',
  },
  signUpButtonIcon: {
    marginHorizontal: 0,
    tintColor: 'white',
  },
  socialAuthIcon: {
    tintColor: 'white',
  },
  socialAuthHint: {
    color: 'white',
  },
});


interface SelInputProps {
  options: AnswerOptions;
  answerType: IValueType;
  onSelectionChange: (optId: string) => void;
  value?: string;
  definedQuestions: { data: (QuestionSection | QAQuestion), path: number[] }[];
  answerStore: { [key: string]: string };
  question: QAQuestion;

}
export class SelInput extends React.Component<SelInputProps, any> {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(nextProps, this.props)) {
      return false;
    }
    return true;
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
  evaluateCondition(condition: QACondition, question: QAQuestion) {
    let finalResult = true;
    let pendingOperator = null;
    condition.literals.forEach(literal => {
      const getValid = (item: ILiteral) => {
        let result = true;
        const answer = this.props.answerStore[item.questionRef];
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
  filterByCondition() {
    const { groups, rootOptions } = this.props.options.SortedOptions;
    const g = groups.filter(item => this.evaluateCondition(item.appearingCondition, this.props.question));
    const options = rootOptions.filter(item => this.evaluateCondition(item.appearingCondition, this.props.question));
    return { groups: g, rootOptions: options };

  }
  getOptions() {
    const { groups, rootOptions } = this.filterByCondition();
    let returnComp = groups.map(item => {
      return <View key={item.id} >
        <View>
          <Text style={{ fontSize: 10, opacity: 0.5 }}>{item.name}</Text>
        </View>
        <View>
          {item.members.map(option => {
            return <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }} key={option.id}>
              <Text>{option.value}</Text>
              <RadioButton value={option.id} />
            </View>;
          })}
        </View>
      </View>;
    });
    const groupless = rootOptions.map(item => {
      return <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }} key={item.id}>
        <Text>{item.value}</Text>
        <RadioButton value={item.id} /></View>;
    });
    returnComp = returnComp.concat(...groupless);
    return returnComp;


  }
  render() {
    return (
      <RadioButton.Group value={this.props.value} onValueChange={this.props.onSelectionChange}>
        {this.getOptions()}
      </RadioButton.Group>
    );
  }

}

