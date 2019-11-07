import { RootSection, QuestionSection, QAQuestion, AnswerOptions } from 'dpform';
import React from 'react';
import './App.css';
import { SurveyForm } from './components/SurveyForm';
import { Login } from './ui/login';
import { getRandomId } from './utils/getRandomId';
import _ from 'lodash';
declare global {
  interface Window {

  }
}
(window as any)['QuestionSection'] = QuestionSection;
(window as any)['RootSection'] = RootSection;
(window as any)['QAQuestion'] = QAQuestion;
(window as any)['AnswerOptions'] = AnswerOptions;
(window as any)['getRandomId'] = getRandomId;

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoggedIn: false,
      token: null,
    }

  }

  handleChange(form: RootSection) {
    this.setState({
      form: form
    })
  }

  render() {
    return (
      <div className={"wrapper"}>
        {!this.state.isLoggedIn && <Login onLoggedIn={token => this.setState({ token: token, isLoggedIn: true })} />}
        {this.state.isLoggedIn && <div className="main-panel">
          <div className="content">
            <SurveyForm onSave={this.props.onSave} token={this.state.token} root={this.props.root || new RootSection()} onChange={this.handleChange.bind(this)} />
          </div>
        </div>}
      </div>
    )
  }
}

//denormalize the app state root form
function convert(all: any, converting: string = "root-53c37497-3808-cfd8-c886-1361dbaab171") {
  const a = all[converting];
  const retObj = _.clone(a);
  retObj.content = [];
  if (a._type === "root") {
    a.childNodes.forEach((c: any) => {
      const item = all[c];
      if (item._type === "question") {
        retObj.content.push(item)
      } else {
        retObj.content.push(convert(all, c))
      }
    })
    delete retObj['childNodes'];
  }
  return retObj;
}