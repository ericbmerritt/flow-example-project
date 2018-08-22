// @flow
import * as React from 'react';
import { Box, Columns, Card, LoginForm, Tabs, Tab } from 'grommet';
import { Provider } from 'react-redux';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as Signup from '../reducers/signup';
import * as BaseStore from '../base-store';
import * as SignupForm from '../components/SignupForm';
import * as Maybe from '../maybe';

import { SIGNUP } from '../base-actions';

const mapStateToProps = ({ signup }: BaseStore.AppT): BaseStore.SignupFormT => {
  if (signup && signup.data) {
    return signup.data;
  } else {
    return {
      email: Maybe.nothing(),
      password: Maybe.nothing(),
      passwordConfirm: Maybe.nothing()
    };
  }
};

const mapDisptachToProps = (dispatch: Redux.Dispatch) => ({
  onEmailChange: (email: string) => dispatch(Signup.emailChange(email)),
  onPasswordChange: (password: string) =>
    dispatch(Signup.passwordChange(password)),
  onPasswordConfirmChange: (passwordConfirm: string) =>
    dispatch(Signup.passwordConfirmChange(passwordConfirm)),
  onSubmit: () => dispatch(Signup.signup())
});

export const page = (props: {
  email: string,
  password: string,
  passwordConfirm: string,
  onPasswordChange: SignupForm.StringEventT,
  onEmailChange: SignupForm.StringEventT,
  onPasswordConfirmChange: SignupForm.StringEventT,
  onSubmit: void => void
}): React.Node => {
  return (
    <Box
      appCentered={true}
      alignContent="center"
      focusable={false}
      align="center"
    >
      <Columns justify="center" maxCount={2}>
        <Card>
          <div> Here we Are</div>
        </Card>

        <Card>
          <Tabs>
            <Tab title="Login">
              <LoginForm />
            </Tab>
            <Tab title="Sign Up">
              <SignupForm.Impl
                email={props.email}
                password={props.password}
                passwordConfirm={props.passwordConfirm}
                onPasswordChange={props.onPasswordChange}
                onPasswordConfirmChange={props.onPasswordChange}
                onSubmit={props.onSubmit}
                onEmailChange={props.onEmailChange}
              />
            </Tab>
          </Tabs>
        </Card>
      </Columns>
    </Box>
  );
};

export const RoutedPage = ReactRedux.connect(
  mapStateToProps,
  mapDisptachToProps
)(page);
