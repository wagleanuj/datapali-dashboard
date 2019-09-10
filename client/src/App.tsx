import React from 'react';
import './App.css';
import { SurveyForm } from './components/SurveyForm';
import { getPradeshData } from './testData/pradeshdata';
import { RootSection } from 'dpform';

 export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

  }
  
  handleChange(form: RootSection) {
    this.setState({
      form: form
    })
  }

  render() {
    console.log(getPradeshData());
    return (
      <div className={"wrapper"}>
        <div className="main-panel">
          <div className="content">
            <SurveyForm root={RootSection.fromJSON(demo)} onChange={this.handleChange.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}