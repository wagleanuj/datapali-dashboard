import React from 'react';
import './App.css';

import { SurveyForm } from './components/SurveyForm';
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
            <SurveyForm  root={RootSection.fromJSON(demo)} onChange={this.handleChange.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}
const demo = {
  "id": "root-b81e7724-0a7a-40fe-7ddd-1f5741d2d17a",
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
                      "questionRef": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
                      "comparisonOperator": ">=",
                      "comparisonValue": {
                        "content": "opt-0",
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
                "value": "45",
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
                          "questionRef": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
                          "comparisonOperator": ">=",
                          "comparisonValue": {
                            "content": "opt-0",
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
                    "value": "45",
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
                "value": {
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
                },
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
            "condition": {
              "literals": []
            },
            "duplicateTimes": {
              "value": {
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
              },
              "type": "number"
            }
          }
        },
        {
          "id": "ss-1570f1f8-c1a4-841d-e4fb-2c789f085c03",
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
          "id": "ss-92c93457-cf51-d8e5-b024-314551f77132",
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
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": {
                "value": {
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
                },
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
      "isRequired": true,
      "appearingCondition": {
        "literals": []
      },
      "questionContent": {
        "content": "what is your cat's name?",
        "type": "string"
      },
      "autoAnswer": {
        "isEnabled": true,
        "answeringConditions": [
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-1",
            "ifFalse": "opt-2"
          },
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-2",
            "ifFalse": "opt-3"
          },
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-2",
            "ifFalse": "opt-2"
          },
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-2",
            "ifFalse": "opt-1"
          }
        ]
      },
      "options": {
        "optionsMap": {
          "opt-0": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-0",
            "value": "cat1"
          },
          "opt-1": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-1",
            "value": "cat2"
          },
          "opt-2": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-2",
            "value": "cat3"
          },
          "opt-3": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-3",
            "value": "cat4"
          },
          "opt-4": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-4",
            "value": "cat5"
          }
        },
        "optionGroupMap": {}
      },
      "answerType": {
        "name": "select",
        "ofType": {
          "name": "string"
        }
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
                "value": {
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
                },
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
              "value": {
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
      "id": "ss-eed81b34-e961-2fd1-9565-25a9da34193a",
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
      "id": "ss-e6e6b75c-c1f5-4ca4-8753-d44012eebd26",
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
                  "questionRef": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
                  "comparisonOperator": ">=",
                  "comparisonValue": {
                    "content": "opt-0",
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
            "value": "45",
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
                      "questionRef": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
                      "comparisonOperator": ">=",
                      "comparisonValue": {
                        "content": "opt-0",
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
                "value": "45",
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
      "isRequired": true,
      "appearingCondition": {
        "literals": []
      },
      "questionContent": {
        "content": "what is your cat's name?",
        "type": "string"
      },
      "autoAnswer": {
        "isEnabled": true,
        "answeringConditions": [
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-1",
            "ifFalse": "opt-2"
          },
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-2",
            "ifFalse": "opt-3"
          },
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-2",
            "ifFalse": "opt-2"
          },
          {
            "condition": {
              "literals": []
            },
            "ifTrue": "opt-2",
            "ifFalse": "opt-1"
          }
        ]
      },
      "options": {
        "optionsMap": {
          "opt-0": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-0",
            "value": "cat1"
          },
          "opt-1": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-1",
            "value": "cat2"
          },
          "opt-2": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-2",
            "value": "cat3"
          },
          "opt-3": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-3",
            "value": "cat4"
          },
          "opt-4": {
            "appearingCondition": {
              "literals": []
            },
            "type": {
              "name": "string"
            },
            "id": "opt-4",
            "value": "cat5"
          }
        },
        "optionGroupMap": {}
      },
      "answerType": {
        "name": "select",
        "ofType": {
          "name": "string"
        }
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
                      "questionRef": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
                      "comparisonOperator": ">=",
                      "comparisonValue": {
                        "content": "opt-0",
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
                "value": "45",
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
                          "questionRef": "q-3682ec18-23cf-9ea1-9c17-bd9a66adf4fd",
                          "comparisonOperator": ">=",
                          "comparisonValue": {
                            "content": "opt-0",
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
                    "value": "45",
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
                "value": {
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
                },
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
            "condition": {
              "literals": []
            },
            "duplicateTimes": {
              "value": {
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
              },
              "type": "number"
            }
          }
        },
        {
          "id": "ss-1570f1f8-c1a4-841d-e4fb-2c789f085c03",
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
          "id": "ss-92c93457-cf51-d8e5-b024-314551f77132",
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
      "duplicatingSettings": {
        "isEnabled": false,
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
            "value": {
              "value": {
                "value": {
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
                },
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
            "value": {
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
        "condition": {
          "literals": []
        },
        "duplicateTimes": {
          "value": {
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
          },
          "type": "number"
        }
      }
    },
    "ss-1570f1f8-c1a4-841d-e4fb-2c789f085c03": {
      "id": "ss-1570f1f8-c1a4-841d-e4fb-2c789f085c03",
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
    "ss-92c93457-cf51-d8e5-b024-314551f77132": {
      "id": "ss-92c93457-cf51-d8e5-b024-314551f77132",
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
                "value": {
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
                },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
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
              "value": {
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
              },
              "type": "number"
            },
            "type": "number"
          },
          "type": "number"
        }
      }
    },
    "ss-eed81b34-e961-2fd1-9565-25a9da34193a": {
      "id": "ss-eed81b34-e961-2fd1-9565-25a9da34193a",
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
    "ss-e6e6b75c-c1f5-4ca4-8753-d44012eebd26": {
      "id": "ss-e6e6b75c-c1f5-4ca4-8753-d44012eebd26",
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
