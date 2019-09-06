import React from 'react';
import './App.css';

import { SurveyForm, QuestionSection } from './components/SurveyForm';
import { testQuestion, testQuestion2, testQuestion3, testQuestion4, testQuestion5 } from './testData/TestQuestions';
import { RootSection } from './components/section';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

  }
  handleChange(form: RootSection) {
    this.setState({
      form: form
    })
  }

  render() {
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
const demo = {
  "id": "root-f2a26046-c266-5407-48a5-9c60cff67f26",
  "content": [
    {
      "id": "ss-76662375-aee2-e050-a91b-268924d8dddd",
      "content": [
        {
          "id": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
          "isRequired": true,
          "appearingCondition": {
            "literals": [
              {
                "literalId": "lit-110d360f-55ea-cd3a-56f0-cfdbc5b62d44",
                "questionRef": "question-2",
                "comparisonOperator": ">=",
                "comparisonValue": {
                  "content": "opt-1a1e4ca7-0821-9430-69b1-96a97cca780a",
                  "type": "string"
                },
                "followingOperator": "||"
              }
            ]
          },
          "questionContent": {
            "content": "what is your favorite tv show?",
            "type": "string"
          },
          "autoAnswer": {
            "isEnabled": false,
            "answeringConditions": []
          },
          "options": {
            "optionsMap": {
              "opt-0": {
                "appearingCondition": {
                  "literals": [
                    {
                      "literalId": "lit-3a8a474e-6116-742c-554d-4847e95c20a3",
                      "questionRef": "question-1",
                      "comparisonOperator": ">=",
                      "comparisonValue": {
                        "content": "opt-b4a155a5-465f-3243-3c89-ab3d69050cd8",
                        "type": "string"
                      },
                      "followingOperator": "&"
                    }
                  ]
                },
                "type": {
                  "name": "number"
                },
                "id": "opt-0",
                "groupName": "ni"
              },
              "opt-1": {
                "appearingCondition": {
                  "literals": []
                },
                "type": {
                  "name": "date"
                },
                "id": "opt-1",
                "value": "9/25/2019",
                "groupName": "ni"
              }
            },
            "optionGroupMap": {
              "ni": {
                "id": "opt-grp0",
                "name": "ni",
                "appearingCondition": {
                  "literals": []
                },
                "members": [
                  {
                    "appearingCondition": {
                      "literals": [
                        {
                          "literalId": "lit-3a8a474e-6116-742c-554d-4847e95c20a3",
                          "questionRef": "question-1",
                          "comparisonOperator": ">=",
                          "comparisonValue": {
                            "content": "opt-b4a155a5-465f-3243-3c89-ab3d69050cd8",
                            "type": "string"
                          },
                          "followingOperator": "&"
                        }
                      ]
                    },
                    "type": {
                      "name": "number"
                    },
                    "id": "opt-0",
                    "groupName": "ni"
                  },
                  {
                    "appearingCondition": {
                      "literals": []
                    },
                    "type": {
                      "name": "date"
                    },
                    "id": "opt-1",
                    "value": "9/25/2019",
                    "groupName": "ni"
                  }
                ]
              },
              "group-1": {
                "id": "opt-grp1",
                "name": "group-1",
                "appearingCondition": {
                  "literals": []
                },
                "members": []
              }
            }
          },
          "answerType": {
            "name": "select",
            "ofType": {
              "name": "string",
              "ofType": {}
            }
          }
        },
        {
          "id": "q-54ea074e-8117-3bda-09d8-8dea41d42062",
          "appearingCondition": {
            "literals": []
          },
          "questionContent": {
            "content": "Do you like having tea?",
            "type": "string"
          },
          "autoAnswer": {
            "isEnabled": false,
            "answeringConditions": []
          },
          "options": {
            "optionsMap": {},
            "optionGroupMap": {}
          },
          "answerType": {
            "name": "select",
            "ofType": {}
          }
        },
        {
          "id": "ss-34029fd3-a90d-b6c6-6457-0de5592b492b",
          "content": [],
          "duplicatingSettings": {
            "isEnabled": false,
            "condition": {
              "literals": []
            },
            "duplicateTimes": {
              "value": {
                "value": "",
                "type": "number"
              },
              "type": "number"
            }
          }
        },
        {
          "id": "ss-e9f5253e-148f-3a01-93fa-f16c29420523",
          "content": [],
          "duplicatingSettings": {
            "isEnabled": false,
            "duplicateTimes": {
              "value": "",
              "type": "number"
            }
          }
        }
      ],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": {
                "value": "",
                "type": "number"
              },
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "q-a93bd9a3-70aa-e03c-5af7-6542a56cd585",
      "appearingCondition": {
        "literals": []
      },
      "questionContent": {
        "content": "what is your cat's name?",
        "type": "string"
      },
      "autoAnswer": {
        "isEnabled": false,
        "answeringConditions": []
      },
      "options": {
        "optionsMap": {
          "opt-f829c6d2-d91f-50ad-3c18-e307c2aff83d": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-f829c6d2-d91f-50ad-3c18-e307c2aff83d",
            "value": "cat0"
          },
          "opt-144ce4d7-3351-3327-78fe-da2ce0cdbef6": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-144ce4d7-3351-3327-78fe-da2ce0cdbef6",
            "value": "cat1"
          },
          "opt-c6fda469-1194-57a6-5c6b-ee6cda462634": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-c6fda469-1194-57a6-5c6b-ee6cda462634",
            "value": "cat2"
          },
          "opt-3dfa4960-99ea-76c6-f64d-3407b1ba02ca": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-3dfa4960-99ea-76c6-f64d-3407b1ba02ca",
            "value": "cat3"
          },
          "opt-e7c4e53b-791c-ecbd-4560-ea7946c81d8c": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-e7c4e53b-791c-ecbd-4560-ea7946c81d8c",
            "value": "cat4"
          }
        },
        "optionGroupMap": {}
      },
      "answerType": {
        "name": "select",
        "ofType": {}
      }
    },
    {
      "id": "ss-ead4c521-c8a2-7c5e-294a-7ded31b40d3e",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": {
                "value": "",
                "type": "number"
              },
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-a476db99-bf82-23be-c4d4-aa3b7dc804c8",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-5d48827a-542e-9e28-5270-5c3980febff5",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-05a50ce0-6332-5109-5dc5-41199b99d077",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-5742c13b-fe11-d19f-6d6c-5d7fc8f59645",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-ef0177fe-1668-7c5c-c84d-caf4cf1a946e",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-f43b66b7-a42b-2086-aad1-fd8c5a58c1b5",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-39cbc923-edd2-ff6c-c5e3-340f977d46e4",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-ebaeb911-474d-d888-93b7-c603acd871ac",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-2153e68c-f03a-37ef-2408-529ba5bfbcad",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-910c3d5a-166c-1b3d-7960-ad0c9108a56e",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-aac4ef7c-d0dd-7fff-2303-586f2ab4dc62",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    {
      "id": "ss-8905bd3f-509c-b3aa-028b-eb27bd491094",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    }
  ],
  "questions": {
    "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd": {
      "id": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
      "isRequired": true,
      "appearingCondition": {
        "literals": [
          {
            "literalId": "lit-110d360f-55ea-cd3a-56f0-cfdbc5b62d44",
            "questionRef": "question-2",
            "comparisonOperator": ">=",
            "comparisonValue": {
              "content": "opt-1a1e4ca7-0821-9430-69b1-96a97cca780a",
              "type": "string"
            },
            "followingOperator": "||"
          }
        ]
      },
      "questionContent": {
        "content": "what is your favorite tv show?",
        "type": "string"
      },
      "autoAnswer": {
        "isEnabled": false,
        "answeringConditions": []
      },
      "options": {
        "optionsMap": {
          "opt-0": {
            "appearingCondition": {
              "literals": [
                {
                  "literalId": "lit-3a8a474e-6116-742c-554d-4847e95c20a3",
                  "questionRef": "question-1",
                  "comparisonOperator": ">=",
                  "comparisonValue": {
                    "content": "opt-b4a155a5-465f-3243-3c89-ab3d69050cd8",
                    "type": "string"
                  },
                  "followingOperator": "&"
                }
              ]
            },
            "type": {
              "name": "number"
            },
            "id": "opt-0",
            "groupName": "ni"
          },
          "opt-1": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "date"
            },
            "id": "opt-1",
            "value": "9/25/2019",
            "groupName": "ni"
          }
        },
        "optionGroupMap": {
          "ni": {
            "id": "opt-grp0",
            "name": "ni",
            "appearingCondition": {
              "literals": []
            },
            "members": [
              {
                "appearingCondition": {
                  "literals": [
                    {
                      "literalId": "lit-3a8a474e-6116-742c-554d-4847e95c20a3",
                      "questionRef": "question-1",
                      "comparisonOperator": ">=",
                      "comparisonValue": {
                        "content": "opt-b4a155a5-465f-3243-3c89-ab3d69050cd8",
                        "type": "string"
                      },
                      "followingOperator": "&"
                    }
                  ]
                },
                "type": {
                  "name": "number"
                },
                "id": "opt-0",
                "groupName": "ni"
              },
              {
                "appearingCondition": {
                  "literals": []
                },
                "type": {
                  "name": "date"
                },
                "id": "opt-1",
                "value": "9/25/2019",
                "groupName": "ni"
              }
            ]
          },
          "group-1": {
            "id": "opt-grp1",
            "name": "group-1",
            "appearingCondition": {
              "literals": []
            },
            "members": []
          }
        }
      },
      "answerType": {
        "name": "select",
        "ofType": {
          "name": "string",
          "ofType": {}
        }
      }
    },
    "q-54ea074e-8117-3bda-09d8-8dea41d42062": {
      "id": "q-54ea074e-8117-3bda-09d8-8dea41d42062",
      "appearingCondition": {
        "literals": []
      },
      "questionContent": {
        "content": "Do you like having tea?",
        "type": "string"
      },
      "autoAnswer": {
        "isEnabled": false,
        "answeringConditions": []
      },
      "options": {
        "optionsMap": {},
        "optionGroupMap": {}
      },
      "answerType": {
        "name": "select",
        "ofType": {}
      }
    },
    "q-a93bd9a3-70aa-e03c-5af7-6542a56cd585": {
      "id": "q-a93bd9a3-70aa-e03c-5af7-6542a56cd585",
      "appearingCondition": {
        "literals": []
      },
      "questionContent": {
        "content": "what is your cat's name?",
        "type": "string"
      },
      "autoAnswer": {
        "isEnabled": false,
        "answeringConditions": []
      },
      "options": {
        "optionsMap": {
          "opt-f829c6d2-d91f-50ad-3c18-e307c2aff83d": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-f829c6d2-d91f-50ad-3c18-e307c2aff83d",
            "value": "cat0"
          },
          "opt-144ce4d7-3351-3327-78fe-da2ce0cdbef6": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-144ce4d7-3351-3327-78fe-da2ce0cdbef6",
            "value": "cat1"
          },
          "opt-c6fda469-1194-57a6-5c6b-ee6cda462634": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-c6fda469-1194-57a6-5c6b-ee6cda462634",
            "value": "cat2"
          },
          "opt-3dfa4960-99ea-76c6-f64d-3407b1ba02ca": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-3dfa4960-99ea-76c6-f64d-3407b1ba02ca",
            "value": "cat3"
          },
          "opt-e7c4e53b-791c-ecbd-4560-ea7946c81d8c": {
            "appearingCondition": {
              "literals": []
            },
            "type": {},
            "id": "opt-e7c4e53b-791c-ecbd-4560-ea7946c81d8c",
            "value": "cat4"
          }
        },
        "optionGroupMap": {}
      },
      "answerType": {
        "name": "select",
        "ofType": {}
      }
    }
  },
  "sections": {
    "ss-76662375-aee2-e050-a91b-268924d8dddd": {
      "id": "ss-76662375-aee2-e050-a91b-268924d8dddd",
      "content": [
        {
          "id": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
          "isRequired": true,
          "appearingCondition": {
            "literals": [
              {
                "literalId": "lit-110d360f-55ea-cd3a-56f0-cfdbc5b62d44",
                "questionRef": "question-2",
                "comparisonOperator": ">=",
                "comparisonValue": {
                  "content": "opt-1a1e4ca7-0821-9430-69b1-96a97cca780a",
                  "type": "string"
                },
                "followingOperator": "||"
              }
            ]
          },
          "questionContent": {
            "content": "what is your favorite tv show?",
            "type": "string"
          },
          "autoAnswer": {
            "isEnabled": false,
            "answeringConditions": []
          },
          "options": {
            "optionsMap": {
              "opt-0": {
                "appearingCondition": {
                  "literals": [
                    {
                      "literalId": "lit-3a8a474e-6116-742c-554d-4847e95c20a3",
                      "questionRef": "question-1",
                      "comparisonOperator": ">=",
                      "comparisonValue": {
                        "content": "opt-b4a155a5-465f-3243-3c89-ab3d69050cd8",
                        "type": "string"
                      },
                      "followingOperator": "&"
                    }
                  ]
                },
                "type": {
                  "name": "number"
                },
                "id": "opt-0",
                "groupName": "ni"
              },
              "opt-1": {
                "appearingCondition": {
                  "literals": []
                },
                "type": {
                  "name": "date"
                },
                "id": "opt-1",
                "value": "9/25/2019",
                "groupName": "ni"
              }
            },
            "optionGroupMap": {
              "ni": {
                "id": "opt-grp0",
                "name": "ni",
                "appearingCondition": {
                  "literals": []
                },
                "members": [
                  {
                    "appearingCondition": {
                      "literals": [
                        {
                          "literalId": "lit-3a8a474e-6116-742c-554d-4847e95c20a3",
                          "questionRef": "question-1",
                          "comparisonOperator": ">=",
                          "comparisonValue": {
                            "content": "opt-b4a155a5-465f-3243-3c89-ab3d69050cd8",
                            "type": "string"
                          },
                          "followingOperator": "&"
                        }
                      ]
                    },
                    "type": {
                      "name": "number"
                    },
                    "id": "opt-0",
                    "groupName": "ni"
                  },
                  {
                    "appearingCondition": {
                      "literals": []
                    },
                    "type": {
                      "name": "date"
                    },
                    "id": "opt-1",
                    "value": "9/25/2019",
                    "groupName": "ni"
                  }
                ]
              },
              "group-1": {
                "id": "opt-grp1",
                "name": "group-1",
                "appearingCondition": {
                  "literals": []
                },
                "members": []
              }
            }
          },
          "answerType": {
            "name": "select",
            "ofType": {
              "name": "string",
              "ofType": {}
            }
          }
        },
        {
          "id": "q-54ea074e-8117-3bda-09d8-8dea41d42062",
          "appearingCondition": {
            "literals": []
          },
          "questionContent": {
            "content": "Do you like having tea?",
            "type": "string"
          },
          "autoAnswer": {
            "isEnabled": false,
            "answeringConditions": []
          },
          "options": {
            "optionsMap": {},
            "optionGroupMap": {}
          },
          "answerType": {
            "name": "select",
            "ofType": {}
          }
        },
        {
          "id": "ss-34029fd3-a90d-b6c6-6457-0de5592b492b",
          "content": [],
          "duplicatingSettings": {
            "isEnabled": false,
            "condition": {
              "literals": []
            },
            "duplicateTimes": {
              "value": {
                "value": "",
                "type": "number"
              },
              "type": "number"
            }
          }
        },
        {
          "id": "ss-e9f5253e-148f-3a01-93fa-f16c29420523",
          "content": [],
          "duplicatingSettings": {
            "isEnabled": false,
            "duplicateTimes": {
              "value": "",
              "type": "number"
            }
          }
        }
      ],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": {
                "value": "",
                "type": "number"
              },
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-34029fd3-a90d-b6c6-6457-0de5592b492b": {
      "id": "ss-34029fd3-a90d-b6c6-6457-0de5592b492b",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": "",
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-ead4c521-c8a2-7c5e-294a-7ded31b40d3e": {
      "id": "ss-ead4c521-c8a2-7c5e-294a-7ded31b40d3e",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": {
                "value": "",
                "type": "number"
              },
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-a476db99-bf82-23be-c4d4-aa3b7dc804c8": {
      "id": "ss-a476db99-bf82-23be-c4d4-aa3b7dc804c8",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-5d48827a-542e-9e28-5270-5c3980febff5": {
      "id": "ss-5d48827a-542e-9e28-5270-5c3980febff5",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-05a50ce0-6332-5109-5dc5-41199b99d077": {
      "id": "ss-05a50ce0-6332-5109-5dc5-41199b99d077",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-5742c13b-fe11-d19f-6d6c-5d7fc8f59645": {
      "id": "ss-5742c13b-fe11-d19f-6d6c-5d7fc8f59645",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-ef0177fe-1668-7c5c-c84d-caf4cf1a946e": {
      "id": "ss-ef0177fe-1668-7c5c-c84d-caf4cf1a946e",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-f43b66b7-a42b-2086-aad1-fd8c5a58c1b5": {
      "id": "ss-f43b66b7-a42b-2086-aad1-fd8c5a58c1b5",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-39cbc923-edd2-ff6c-c5e3-340f977d46e4": {
      "id": "ss-39cbc923-edd2-ff6c-c5e3-340f977d46e4",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-ebaeb911-474d-d888-93b7-c603acd871ac": {
      "id": "ss-ebaeb911-474d-d888-93b7-c603acd871ac",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-2153e68c-f03a-37ef-2408-529ba5bfbcad": {
      "id": "ss-2153e68c-f03a-37ef-2408-529ba5bfbcad",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-910c3d5a-166c-1b3d-7960-ad0c9108a56e": {
      "id": "ss-910c3d5a-166c-1b3d-7960-ad0c9108a56e",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-aac4ef7c-d0dd-7fff-2303-586f2ab4dc62": {
      "id": "ss-aac4ef7c-d0dd-7fff-2303-586f2ab4dc62",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-8905bd3f-509c-b3aa-028b-eb27bd491094": {
      "id": "ss-8905bd3f-509c-b3aa-028b-eb27bd491094",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": "",
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-e9f5253e-148f-3a01-93fa-f16c29420523": {
      "id": "ss-e9f5253e-148f-3a01-93fa-f16c29420523",
      "content": [],
      "duplicatingSettings": {
        "isEnabled": false,
        "duplicateTimes": {
          "value": "",
          "type": "number"
        }
      }
    }
  }
}

export default App;
