export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export enum AccountType {
  Surveyor = 'surveyor',
  Admin = 'admin'
}

export type AuthData = {
   __typename?: 'AuthData',
  user?: Maybe<User>,
  token: Scalars['String'],
};

export type FilledForm = {
   __typename?: 'FilledForm',
  id: Scalars['ID'],
  startedDate: Scalars['String'],
  completedDate: Scalars['String'],
  formId: Scalars['String'],
  filledBy: Scalars['String'],
  answerStore: Scalars['String'],
};

export type FilledFormInput = {
  id: Scalars['ID'],
  startedDate: Scalars['String'],
  completedDate?: Maybe<Scalars['String']>,
  formId: Scalars['String'],
  answerStore: Scalars['String'],
};

export type FormFile = {
   __typename?: 'FormFile',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['String']>,
};

export type FormFileInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['String']>,
};

export type GeneralQueryResponse = {
   __typename?: 'GeneralQueryResponse',
  message: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  makeFormAvailableFor: GeneralQueryResponse,
  makeFormUnavailableFor: GeneralQueryResponse,
  saveFilledForm?: Maybe<FilledForm>,
  deleteFilledForms: GeneralQueryResponse,
  deleteForm: GeneralQueryResponse,
  deleteAllFilledForms: GeneralQueryResponse,
  register?: Maybe<User>,
  saveForm?: Maybe<FormFile>,
  registerUser: User,
  resetUserPassword: User,
};


export type MutationMakeFormAvailableForArgs = {
  formId: Scalars['String'],
  surveyorEmail: Scalars['String']
};


export type MutationMakeFormUnavailableForArgs = {
  formId: Scalars['String'],
  surveyorEmail: Scalars['String']
};


export type MutationSaveFilledFormArgs = {
  filledForm: FilledFormInput
};


export type MutationDeleteFilledFormsArgs = {
  id: Array<Maybe<Scalars['String']>>
};


export type MutationDeleteFormArgs = {
  id: Array<Maybe<Scalars['String']>>
};


export type MutationRegisterArgs = {
  user: UserRegisterInput
};


export type MutationSaveFormArgs = {
  form: FormFileInput
};


export type MutationRegisterUserArgs = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String']
};


export type MutationResetUserPasswordArgs = {
  email: Scalars['String'],
  password: Scalars['String'],
  token: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  getFilledForms?: Maybe<Array<Maybe<FilledForm>>>,
  forms?: Maybe<Array<Maybe<FormFile>>>,
  login?: Maybe<AuthData>,
  sendPasswordResetEmail: GeneralQueryResponse,
};


export type QueryGetFilledFormsArgs = {
  bySurveyor?: Maybe<Scalars['String']>
};


export type QueryFormsArgs = {
  id?: Maybe<Array<Maybe<Scalars['String']>>>
};


export type QueryLoginArgs = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type QuerySendPasswordResetEmailArgs = {
  email: Scalars['String']
};

export type User = {
   __typename?: 'User',
  _id: Scalars['ID'],
  email: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  accountType: AccountType,
  surveyorCode?: Maybe<Scalars['String']>,
  availableForms?: Maybe<Array<Maybe<FormFile>>>,
  filledForms?: Maybe<Array<Maybe<FilledForm>>>,
  createdForms?: Maybe<Array<Maybe<FormFile>>>,
};

export type UserRegisterInput = {
  email: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  password: Scalars['String'],
  accountType: AccountType,
  createdBy?: Maybe<Scalars['String']>,
};
