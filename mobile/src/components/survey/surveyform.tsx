import React, { ReactNode } from 'react';
import { Text, Button, Radio, Input, ButtonGroup } from 'react-native-ui-kitten/ui';
import { View, Picker, TextInput, DatePickerAndroid } from 'react-native';
import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten/theme';
import { textStyle } from '../common';
import { ComponentProps } from '@src/core/navigation';

import { Showcase } from '@src/containers/components/common/showcase.component';
import { ShowcaseSection } from '@src/containers/components/common/showcaseSection.component';
import { QAQuestion, RootSection, QuestionSection, QORS, IValueType, ANSWER_TYPES, request } from '@dpForm/index';
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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgwNDk0NzksImV4cCI6MTU2ODEzNTg3OX0.zUP4kHxUVtLfHNkUSjswB62YtBAzZrUwmowdFPbM3Uw';
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
      });
  }
  getQuestionPage(): ReactNode {
    const currentQuestion = this.state.allQuestions[this.state.currentQuestionIndex];
    if (currentQuestion.data instanceof QAQuestion) {


      const questionText = currentQuestion.data.questionContent.content;
      const valueInput = this.getValueInput(currentQuestion.data.answerType);
      return (
        <>{questionText}
          {valueInput}</>
      );
    }
  }

  getValueInput(type: IValueType) {
    let comp = null;
    switch (type.name) {
      case ANSWER_TYPES.NUMBER:
        comp = <Input
          placeholder=''
          keyboardType='numeric'
        />;
        break;
      case ANSWER_TYPES.STRING:
        comp = <Input keyboardType='default' />;
        break;
      case ANSWER_TYPES.DATE:
        comp = null;
        break;
      case ANSWER_TYPES.SELECT:
        comp = null;
        break;
    }
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
          currentQuestionIndex: ++prevState.currentQuestionIndex,
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



