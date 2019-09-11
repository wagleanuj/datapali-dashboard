import React, { ReactNode } from 'react';
import { Text, Button, Radio, Input, ButtonGroup } from 'react-native-ui-kitten/ui';
import { View, Picker, TextInput, DatePickerAndroid } from 'react-native';
import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten/theme';
import { textStyle } from '../common';
import { RadioButton } from 'react-native-paper';
// tslint:disable-next-line: max-line-length
import { QAQuestion, RootSection, QuestionSection, QORS, IValueType, ANSWER_TYPES, request, AnswerOptions, QACondition, QAComparisonOperator } from '../../form';
import { Showcase } from '../../containers/components/common/showcase.component';
import { ComponentProps } from '../../core/navigation';
import { any } from 'prop-types';
export type SurveyFormComponentProps = ThemedComponentProps & ComponentProps;

interface SurveyFormComponentState {
  root: RootSection;
  activeSection: RootSection | QuestionSection;
  activeSectionPath: number[];
  answers: { [key: string]: string };
  activeQuestion: number[];
  allQuestions: { data: (QuestionSection | QAQuestion), path: number[] }[];
  currentQuestionIndex: number;
}


class SurveyFormComponent extends React.Component<SurveyFormComponentProps, SurveyFormComponentState> {
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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgxNTg3ODYsImV4cCI6MTU2ODI0NTE4Nn0.GcpY7iZWFY0Pls05LeOpJtisyiMBvmymdPqi2eOkAAY';
    return request('http://192.168.2.22:5000/graphql',
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
          comp = null;
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
      <Showcase>

        <View style={this.props.themedStyle.container}>
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button onPress={this.handlePrev.bind(this)}>Prev</Button>
            <Button onPress={this.handleNext.bind(this)}>Next</Button>
          </View>
          {this.getQuestionPage()}
        </View>
      </Showcase>
    );
  }
}
export const SurveyForm = withStyles(SurveyFormComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
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
    ...textStyle.button,
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
    ...textStyle.headline,
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
}));


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
  evaluateCondition(condition: QACondition) {
    let result = true;
    condition.literals.forEach(item => {
      const question = this.props.question;
      const answer = this.props.answerStore[item.questionRef];
      console.log(question.id, item.comparisonValue.content, item.comparisonOperator, answer);
      if (question) {
        switch (item.comparisonOperator) {
          case QAComparisonOperator.Equal:
            result = item.comparisonValue.content === answer;
            console.log(result);
            break;
          case QAComparisonOperator.Greater_Than:
            result = item.comparisonValue.content > answer;
            break;
          case QAComparisonOperator.Greater_Than_Or_Equal:
            result = item.comparisonValue.content >= answer;
            break;
          case QAComparisonOperator.Less_Than:
            result = item.comparisonValue.content < answer;
            break;
          case QAComparisonOperator.Less_Than_Or_Equal:
            result = item.comparisonValue.content <= answer;
            break;
        }
      }
    });
    console.log("value is", result)
    return result;
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
