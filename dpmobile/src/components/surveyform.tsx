import React, { ReactNode, ReactElement } from 'react';
import { View, AsyncStorage, Picker } from 'react-native';
// tslint:disable-next-line: max-line-length
import { QAQuestion, RootSection, QuestionSection, IValueType, ANSWER_TYPES, request, AnswerOptions, QACondition, QAComparisonOperator, QAFollowingOperator, ILiteral, getReadablePath, DuplicateTimesType, Answer } from 'dpform';
import _ from 'lodash';
import { withStyles, ThemedStyleType, Layout, Text, ThemeType, Button, TopNavigationAction, TopNavigation, Icon, ButtonGroup, Select } from 'react-native-ui-kitten';
import { Showcase } from './showcase';
import { ShowcaseItem } from './showcaseitem';
import { AnswerStore } from '../answermachine';
import { SurveySection, QuestionComponent } from './section';
import { User, FilledForm } from './forms';
import { StorageUtil } from '../storageUtil';
import { ArrowIosBackFill, BulbIconFill, SaveIcon } from '../assets/icons';
import { Header } from 'react-navigation-stack';
import { textStyle } from '../themes/style';
import { KEY_NAVIGATION_BACK } from '../navigation/constants';
export type SurveyFormComponentProps = {
  answerStore: AnswerStore,
  root: RootSection,
  user: User,

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
  filledForm: FilledForm,
}

const routeName = "Survey Form";
export class SurveyFormComponent extends React.Component<SurveyFormComponentProps, SurveyFormComponentState> {
  static navigationOptions = (props) => {

    const renderLeftIcon = () => {
      return <TopNavigationAction onPress={() => props.navigation.goBack(KEY_NAVIGATION_BACK)} icon={ArrowIosBackFill} />
    }
    const renderRightControls = () => {
      let save = props.navigation.getParam("onSaveClick");
      return <TopNavigationAction onPress={() => save()} icon={SaveIcon} />
    }
    return {
      header: props => <TopNavigation
        style={{ height: Header.HEIGHT }}
        alignment='center'
        title={"Datapali"}
        subtitle={routeName}
        subtitleStyle={textStyle.caption1}
        leftControl={renderLeftIcon()}
        rightControls={renderRightControls()}
      />
    }
  }
  constructor(props: SurveyFormComponentProps) {
    super(props);
    let root = this.props.navigation.getParam("root") || new RootSection();

    let filledForm = this.props.navigation.getParam("filledForm")

    this.state = {
      root: root,
      activeSection: root,
      activeSectionPath: [0],
      activeQuestion: [],
      allQuestions: [],
      currentQuestionIndex: 0,
      history: [],
      currentIndex: -1,
      filledForm: filledForm,
    };
  }

  componentDidMount() {
    this.loadFile();
    this.props.navigation.setParams({ onSaveClick: this._saveAnswerToStorage.bind(this) })
  }

  _saveAnswerToStorage() {
    StorageUtil.saveFilledForm(this.state.filledForm);
  }



  loadFile() {
    let firstItem = this.getNextQuestion([0], 0, this.state.root);
    this.setState({
      currentItem: firstItem,
      activeSectionPath: [0],
      currentIndex: 0,
    });

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
    if (!condition) return true;
    condition.literals && condition.literals.forEach(literal => {
      const getValid = (item: ILiteral) => {
        let result = true;
        const answer = this.state.filledForm.answerStore.getById(item.questionRef);
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
        });

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
      });
    }
  }


  setAnswerFor(path: number[], iteration: number, value: string) {
    this.setState((prevState: SurveyFormComponentState) => {
      let a = prevState.filledForm;
      a.answerStore.setAnswerFor(path, iteration, value);
      return {
        filledForm: a
      }
    })
  }

  renderQuestionOrSection(index: number) {
    let item = RootSection.getFromPath([0, index], [this.state.root]);
    if (item instanceof QuestionSection) {
      return <SurveySection
        answerStore={this.state.filledForm.answerStore}
        setAnswer={this.setAnswerFor.bind(this)}
        evaluateCondition={this.evaluateCondition.bind(this)}
        section={item}
        path={[0, index]} />
    }
    else if (item instanceof QAQuestion) {
      return <QuestionComponent
        answerStore={this.state.filledForm.answerStore}
        evaluateCondition={this.evaluateCondition.bind(this)}
        defaultValue={this.state.filledForm.answerStore.getAnswerFor([0, index], 0)}
        onValueChange={this.setAnswerFor.bind(this, [0, index], 0)}
        question={item} path={[0, index]}
      />
    }
  }
  makeSectionOptions(){
    // let options = 
  }

  render() {
    return (
      <View style={this.props.themedStyle.container}>
        <ButtonGroup >

        </ButtonGroup>
        <View style={{ left: 0, right: 0, bottom: 0, flex: 0, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
          <Button status="success" icon={() => <Icon name="arrow-back"></Icon>} onPress={this.handlePrev.bind(this)}></Button>
          <View style={this.props.themedStyle.selectContainer}>
            <Picker selectedValue={null}
              style={this.props.themedStyle.select}
              onValueChange={(itemValue, itemIndex) => { }}>
              {}

            </Picker>
          </View>

          <Button status="success" icon={() => <Icon name="arrow-forward"></Icon>} onPress={this.handleNext.bind(this)}></Button>
        </View>
        <Showcase >
          <ShowcaseItem title="" >
            <View>

              {this.state.currentItem && this.renderQuestionOrSection(this.state.currentIndex)}
            </View>
          </ShowcaseItem>
        </Showcase>

      </View>
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
  },
  selectContainer: {
    flex: 0,
    flexDirection: "row",
    width: 150,
    backgroundColor: theme['color-primary-300'],
    borderRadius: 5,
  },
  select: {
    width: 150
  },
  customOptionStyle: {
    color: 'red',
  },
  labelStyle: {
    backgroundColor: 'white',
  },
  placeholderStyle: {
  },
  controlStyle: {
    backgroundColor: 'black',
  },
}));


// type CustomSelectProps = {

// }
// type CustomSelectState = {
//   data: { text: string }[]
// }
// class CustomSelectComponent extends React.Component<CustomSelectProps, CustomSelectState> {
//   constructor(props: CustomSelectProps) {
//     super(props);
//     this.state = {
//       data: []
//     }
//   }
//   renderItem(item) {
//     return (
//       <View>
//         <Text>{item.item.text}</Text>
//       </View>
//     )
//   }
//   render() {
//     return (
//       <Select

//         data={this.state.data}
//       />
//     )
//   }
// }
// export const CustomSelect = withStyles(CustomSelectComponent, theme => ({

// }))


