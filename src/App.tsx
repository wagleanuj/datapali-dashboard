import React from 'react';
import './App.css';

import { SurveyForm, QuestionSection } from './components/SurveyForm';
import { testQuestion, testQuestion2, testQuestion3, testQuestion4, testQuestion5 } from './testData/TestQuestions';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      form: new QuestionSection().setContent([testQuestion, testQuestion2, testQuestion3, new QuestionSection().setContent([testQuestion4, testQuestion5]).setName("true things")]),

    }
  }
  handleChange(form: QuestionSection){
    this.setState({
      form: form
    })
  }

  render() {
    return (
      <div className={"wrapper"}>
        <div className="main-panel">
          <div className="content">
            <SurveyForm form={this.state.form} onChange={this.handleChange.bind(this)}/>
          </div>
         
        </div>
        </div>
        )
      }
    }
    
    export default App;
