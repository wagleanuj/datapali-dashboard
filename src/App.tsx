import React from 'react';
import './App.css';

import { SurveyForm, QuestionSection } from './components/SurveyForm';
import { testQuestion, testQuestion2, testQuestion3, testQuestion4, testQuestion5 } from './testData/TestQuestions';
import { RootSection } from './components/section';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    
  }
  handleChange(form: RootSection){
    this.setState({
      form: form
    })
  }

  render() {

  

    return (
      <div className={"wrapper"}>
        <div className="main-panel">
          <div className="content">
            <SurveyForm  onChange={this.handleChange.bind(this)}/>
          </div>
        </div>
        </div>
        )
      }
    }
    
    export default App;
