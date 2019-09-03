import React from 'react';
import './App.css';
import { DPNavbar } from './ui/Navbar';
// import { DPFormItem } from './components/DPFormItem';
// import { Row, Col } from 'reactstrap';
import { SurveyForm_, FormTree } from './components/SurveyForm';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <div className={"wrapper"}>
        <div className="main-panel">
          <div className="content">
            <SurveyForm_ />
          </div>
         
        </div>
        </div>
        )
      }
    }
    
    export default App;
