import React, { ReactNode } from 'react';
import { Text, Button, Radio, Input, ButtonGroup } from 'react-native-ui-kitten/ui';
import { View, Picker, TextInput, DatePickerAndroid } from 'react-native';
import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten/theme';
import { textStyle } from '../common';
import { ComponentProps } from '@src/core/navigation';

import * as DPForm from '../../form';
import { QAQuestion, RootSection, IValueType, ANSWER_TYPES, QORS } from '../../form';
import { Showcase } from '@src/containers/components/common/showcase.component';
import { ShowcaseSection } from '@src/containers/components/common/showcaseSection.component';

export type SurveyFormComponentProps = ThemedComponentProps & ComponentProps;

interface SurveyFormComponentState {
  root: DPForm.RootSection;
  activeSection: DPForm.RootSection | DPForm.QuestionSection;
  activeSectionPath: number[];
  answers: { [key: string]: string };
  activeQuestion: number[];
  allQuestions: QAQuestion[];
}


class SurveyFormComponent extends React.Component<SurveyFormComponentProps, SurveyFormComponentState> {
  constructor(props: SurveyFormComponentProps) {
    super(props);
    const root = new DPForm.RootSection();
    this.state = {
      root: root,
      activeSection: root,
      activeSectionPath: [0],
      answers: {},
      activeQuestion: [],
      allquestions: [],
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
    return DPForm.request('http://192.168.2.22:5000/graphql',
      'forms',
      requestBody,
      'Could not delete the game file',
      token).then(file => {
        file = file[0];
        if (file) {
          file.content = JSON.parse(file.content);
          const root = DPForm.RootSection.fromJSON(file);
          root.name = 'test';
          const allq = root.Iterator2([0], 0, QORS.QUESTION);
          const rr = [...allq].map(item => item.path);
          console.log(rr);
          this.setState({
            root: root,
            activeSection: root,
            activeSectionPath: [0],

          });
        }
      });
  }
  getQuestionPage(): ReactNode {
    let activeQuestion;
    let valueInput = null;
    let questionText = null;
    if (this.state.activeQuestion.length > 0) {
      activeQuestion = RootSection.getFromPath(this.state.activeQuestion, [this.state.root]);
      if (activeQuestion instanceof QAQuestion) {
        const type = activeQuestion.answerType;
        const text = activeQuestion.questionContent.content;
        questionText = <Text>{text}</Text>;
        valueInput = this.getValueInput(type);
      }
    }

    return (
      <>{questionText}
        {valueInput}</>

    );
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
    const currentQuestion = this.state.activeQuestion;
    const currentSection = RootSection.getFromPath(this.state.activeSectionPath, [this.state.root]);
    if (currentSection instanceof QAQuestion) { return; } else {
      const nextIndex = currentQuestion.length > 0 ? currentQuestion[currentQuestion.length - 1] + 1 : 0;
      // currentSection.content[];l
    }
    this.setState((prevState: SurveyFormComponentState) => {

    });
  }

  handlePrev() {

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



