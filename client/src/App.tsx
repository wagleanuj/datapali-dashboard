import { RootSection, QuestionSection, QAQuestion, AnswerOptions } from 'dpform';
import React from 'react';
import './App.css';
import { SurveyForm } from './components/SurveyForm';
import { Login } from './ui/login';
import { getRandomId } from './utils/getRandomId';
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
            <SurveyForm token={this.state.token} root={new RootSection()} onChange={this.handleChange.bind(this)} />
          </div>
        </div>}
      </div>
    )
  }
}

function parseThings(divs) {
  const qs = []
  divs.forEach(div => {
    const q = new QAQuestion();
    q.id = getRandomId("q-");
    const label = div.firstElementChild.innerText;
    q.questionContent.content = label;
    const secondChild = div.children[1];
    let type = { name: 'string' };
    const hasMultipleChoices = false;
    const mul = (Array.from(div.children)).filter(item => item.nodeName === "INPUT" && item.getAttribute("type") === "checkbox");
    const labs = mul.map(item => {
      let id = item.getAttribute("id");
      const text = document.querySelector(`label[for='${id}']`).innerText;
      return text;
    })
    console.log(mul)
    if (secondChild.nodeName === "SELECT") {
      type = { name: "select", ofType: { name: 'string' } }
      let op = new AnswerOptions();
      let arr = Array.from(secondChild.children).slice(1);
      let options = arr.forEach(item => {
        op.addOption({
          id: "opt-" + Object.keys(op.optionsMap).length,
          appearingCondition: undefined,
          groupName: undefined,
          type: type.ofType,
          value: item.innerText,
        })
      });
      q.setOptions(op);

    } else if (mul.length > 0) {
      type = { name: "select", ofType: { name: 'string' } }
      let op = new AnswerOptions();
      labs.forEach(item => {
        op.addOption({
          id: "opt-" + Object.keys(op.optionsMap).length,
          appearingCondition: undefined,
          groupName: undefined,
          type: type.ofType,
          value: item,
        })
      });
      q.setOptions(op);


    }
    q.setAnswerType(type);
    qs.push(q);
  })
  return qs;

}