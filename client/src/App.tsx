import { RootSection } from 'dpform';
import React from 'react';
import './App.css';
import { SurveyForm } from './components/SurveyForm';
import { Login } from './ui/login';
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