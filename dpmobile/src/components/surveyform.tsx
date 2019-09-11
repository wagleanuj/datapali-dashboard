import React, { ReactNode } from 'react';
import { View, Picker, DatePickerAndroid, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { RadioButton, Button, Text, TextInput as Input } from 'react-native-paper';
// tslint:disable-next-line: max-line-length
import { QAQuestion, RootSection, QuestionSection, QORS, IValueType, ANSWER_TYPES, request, AnswerOptions, QACondition, QAComparisonOperator, QAFollowingOperator, ILiteral } from 'dpform';
import _ from 'lodash';
export type SurveyFormComponentProps = {}

interface SurveyFormComponentState {
  root: RootSection;
  activeSection: RootSection | QuestionSection;
  activeSectionPath: number[];
  answers: { [key: string]: string };
  activeQuestion: number[];
  allQuestions: { data: (QuestionSection | QAQuestion), path: number[] }[];
  currentQuestionIndex: number;
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgyMDY2MDMsImV4cCI6MTU2ODI5MzAwM30.8CfX_7_wx75nYSvG83dXscuIbhQqcrHqbnu30XWvR8A";

    return request('http://142.93.151.160:5000/graphql',
      'forms',
      requestBody,
      'Could not delete the game file',
      token).then(file => {
        file = file[0];
        if (file) {
          file.content = JSON.parse(file.content);
          const root = RootSection.fromJSON(file);
          const allq = RootSection.Entries(root, [0], 0, QORS.QUESTION);
          this.setState({
            root: root,
            activeSection: root,
            activeSectionPath: [0],
            allQuestions: allq,
          });
        }
      }).catch(err => console.log(err));
  }
  getQuestionPage(): ReactNode {
    const currentQuestion = this.state.allQuestions[this.state.currentQuestionIndex];
    if (currentQuestion && currentQuestion.data instanceof QAQuestion) {
      const questionText = <Text style={{ fontSize: 15, paddingBottom: 20 }}>
        {currentQuestion.data.questionContent.content}
      </Text>;
      const valueInput = this.getValueInput(currentQuestion.data.answerType,
        currentQuestion.data.options, currentQuestion.data);
      return (
        <View style={{ paddingTop: 20 }}>{questionText}
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
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
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
    if (this.state.currentQuestionIndex < this.state.allQuestions.length) {
      this.setState((prevState: SurveyFormComponentState) => {
        return {
          currentQuestionIndex: ++prevState.currentQuestionIndex,
        };
      });
    }
  }

  handlePrev() {
    if (this.state.currentQuestionIndex > 0) {
      this.setState((prevState: SurveyFormComponentState) => {
        return {
          currentQuestionIndex: --prevState.currentQuestionIndex,
        };
      });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button mode="contained" onPress={this.handlePrev.bind(this)}>Prev</Button>
          <Button mode="contained" onPress={this.handleNext.bind(this)}>Next</Button>
        </View>
        {this.getQuestionPage()}
      </View>
    );
  }
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingVertical: 24,
    paddingHorizontal: 16,
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
  evaluateCondition(condition: QACondition) {
    let finalResult = true;
    const question = this.props.question;
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
    const g = groups.filter(item => this.evaluateCondition(item.appearingCondition));
    const options = rootOptions.filter(item => this.evaluateCondition(item.appearingCondition));
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
    console.log('pr', this.props.value);
    return (
      <RadioButton.Group value={this.props.value} onValueChange={this.props.onSelectionChange}>
        {this.getOptions()}
      </RadioButton.Group>
    );
  }

}
