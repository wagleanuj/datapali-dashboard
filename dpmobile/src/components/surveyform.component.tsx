// tslint:disable-next-line: max-line-length
import { ANSWER_TYPES, ILiteral, IValueType, QAComparisonOperator, QACondition, QAFollowingOperator, QAQuestion, QORS, QuestionSection, RootSection } from 'dpform';
import _ from 'lodash';
import React from 'react';
import { ToastAndroid, View } from 'react-native';
import { ThemedComponentProps, ThemeType, TopNavigation, TopNavigationAction, withStyles } from 'react-native-ui-kitten';
import { NavigationScreenProps } from 'react-navigation';
import { Header } from 'react-navigation-stack';
import { AnswerSection } from '../answer.store';
import { ArrowIosBackFill, SaveIcon } from '../assets/icons';
import { KEY_NAVIGATION_BACK } from '../navigation/constants';
import { StorageUtil } from '../storageUtil';
import { textStyle } from '../themes/style';
import { AutoCompleteItem, FilledForm, User } from './forms.component';
import { Question } from './question.component';
import { SurveySection } from './section.component';
import { Showcase } from './showcase.component';
import { ShowcaseItem } from './showcaseitem.component';
import { Toolbar } from './toolbar';
export type SurveyFormComponentProps = {
  root: RootSection,
  user: User,
} & ThemedComponentProps & NavigationScreenProps

interface SurveyFormComponentState {
  root: RootSection;
  activeSection: RootSection | QuestionSection;
  activeSectionPath: number[];
  activeQuestion: number[];
  allQuestions: { data: (QuestionSection | QAQuestion), path: number[] }[];
  history: number[]
  currentQuestionIndex: number;
  currentItem?: { data: (QuestionSection | QAQuestion), path: number[] },
  currentSectionIndex: number;
  filledForm: FilledForm,
}

const routeName = "Survey Form";
export class SurveyFormComponent extends React.Component<SurveyFormComponentProps, SurveyFormComponentState> {
  getAutoCompleteDataForPath: (questionId: string) => AutoCompleteItem[];
  private sectionOptions: { data: QuestionSection | QAQuestion; path: number[]; }[] = [];
  as: AnswerSection;
  static navigationOptions = (props) => {

    const renderLeftIcon = () => {
      return <TopNavigationAction onPress={() => {
        const save = props.navigation.getParam("onSaveClick");
        save().then(res => {
          props.navigation.goBack(KEY_NAVIGATION_BACK)

        })
      }} icon={ArrowIosBackFill} />
    }
    const renderRightControls = () => {
      const save = props.navigation.getParam("onSaveClick");
      const saveComponent = <TopNavigationAction onPress={save} icon={SaveIcon} />


      return [saveComponent];
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

    let filledForm = this.props.navigation.getParam("filledForm");
    this.getAutoCompleteDataForPath = this.props.navigation.getParam("getAutoCompleteDataForPath");

    this.state = {
      root: root,
      activeSection: root,
      activeSectionPath: [0],
      activeQuestion: [],
      allQuestions: [],
      currentQuestionIndex: 0,
      history: [],
      currentSectionIndex: -1,
      filledForm: filledForm,
    };
  }

  componentDidMount() {
    this.loadFile();
    this.props.navigation.setParams({ onSaveClick: this._saveAnswerToStorage.bind(this) })
  }

  _saveAnswerToStorage() {
    return StorageUtil.saveFilledForm(this.state.filledForm);
  }



  loadFile() {
    let firstItem = this.getNextQuestion([0], 0, this.state.root);
    this.setState({
      currentItem: firstItem,
      activeSectionPath: [0],
      currentSectionIndex: 0,
    }, this.makeSectionOptions.bind(this))

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
        const answer = this.state.filledForm.answerSection.getById(item.questionRef);
        const question = this.state.root.questions[item.questionRef];
        let c2 = this.transformValueToType(question.answerType, item.comparisonValue.content);
        let c1 = this.transformValueToType(question.answerType, answer);

        if (question) {
          switch (item.comparisonOperator) {
            case QAComparisonOperator.Equal:
              result = c1 === c2;
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
    for (let i = this.state.currentSectionIndex + 1; i < this.state.root.content.length; i++) {
      let nextItem = RootSection.getFromPath([0, i], [this.state.root]);
      if (nextItem && !(nextItem instanceof RootSection)) {
        const isValid = this.evaluateCondition(nextItem.appearingCondition);
        if (!isValid) ToastAndroid.show("This section is not unlocked, skipping", 500);
        if (isValid) {
          return this.setState((prevState: SurveyFormComponentState) => {
            let newhistory = _.clone(prevState.history);
            newhistory.push(prevState.currentSectionIndex);
            return {
              history: newhistory,
              currentSectionIndex: i
            };
          });
        }

      }
    }
  }

  handlePrev() {
    if (this.state.history.length >= 1) {
      this.setState((prevState: SurveyFormComponentState) => {
        let newHistory = _.clone(prevState.history);
        let newItem = newHistory.pop();
        return {
          currentSectionIndex: newItem,
          history: newHistory
        };
      });
    }
  }


  setAnswerFor(path: number[], value: string) {
    this.setState((prevState: SurveyFormComponentState) => {
      let ff = prevState.filledForm;
      ff.answerSection.setAnswerFor(path, value);
      return {
        filledForm: ff
      }
    })
  }

  renderQuestionOrSection(index: number) {
    let item = RootSection.getFromPath([0, index], [this.state.root]);
    if (item instanceof QuestionSection) {
      return <SurveySection
        iteration={0}
        handleAnswerSectionChange={() => this.setState(prevState => ({ answerSection: prevState.answerSection }))}
        answerSection={this.state.filledForm.answerSection}
        getAutoCompleteDataForPath={this.getAutoCompleteDataForPath}
        setAnswer={this.setAnswerFor.bind(this)}
        evaluateCondition={this.evaluateCondition.bind(this)}
        section={item}
        _path={[0, index]}
        path={[0, index]}
      />
    }
    else if (item instanceof QAQuestion) {
      return <Question
        autoCompleteData={this.getAutoCompleteDataForPath(item.id)}
        answerSection={this.state.filledForm.answerSection}
        evaluateCondition={this.evaluateCondition.bind(this)}
        defaultValue={this.state.filledForm.answerSection.getAnswerFor([0, index], 0)}
        onValueChange={this.setAnswerFor.bind(this, [0, index], 0)}
        question={item} path={[0, index]}
      />
    }
  }
  makeSectionOptions() {
    let options = RootSection.Entries(this.state.root, [0], 0, QORS.SECTION);
    let filtered = options.filter(item => item.path.length <= 2 && item.data instanceof QuestionSection);
    this.sectionOptions = filtered;
  }

  jumpToSection(path: number[]) {
    this.setState((prevState: SurveyFormComponentState) => {
      let newHistory = _.clone(prevState.history);
      let newIndex = path[path.length - 1];
      let currentIndex = prevState.currentSectionIndex;
      const nextSection = RootSection.getFromPath(path, [this.state.root]);
      const isValid = nextSection instanceof QuestionSection && this.evaluateCondition(nextSection.appearingCondition);
      if (!isValid) {
        ToastAndroid.show("This section has not unlocked yet", 500);
        return;
      }
      if (newIndex > currentIndex) {
        newHistory.push(prevState.currentSectionIndex);
        for (let i = newHistory[newHistory.length - 1] + 1; i < newIndex; i++) {
          newHistory.push(i);
        }
      } else if (newIndex < currentIndex) {
        newHistory = [];
        for (let i = 0; i < newIndex; i++) {
          newHistory.push(i);
        }
      }
      return {
        history: newHistory,
        currentSectionIndex: newIndex
      }
    })

  }



  render() {
    let selectedSection = this.sectionOptions.find(item => item.path[item.path.length - 1] === this.state.currentSectionIndex);
    let selectedValue = selectedSection ? selectedSection.path : null;
    return (
      <View style={this.props.themedStyle.container}>

        <Toolbar
          backButtonDisabled={this.state.currentSectionIndex === 0}
          nextButtonDisabled={false}
          onBackButtonPress={this.handlePrev.bind(this)}
          onNextButtonPress={this.handleNext.bind(this)}
          jumpToSection={this.jumpToSection.bind(this)}
          selectedSectionPath={selectedValue}
          sectionOptions={this.sectionOptions}
        />
        <Showcase style={this.props.themedStyle.showcaseContainer}>
          <ShowcaseItem title="" >
            <View>
              {this.state.currentItem && this.renderQuestionOrSection(this.state.currentSectionIndex)}
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
  showcaseContainer: {
    marginTop: 5,
  },

  accordion: {
    backgroundColor: theme['color-primary-300']
  },


}));
