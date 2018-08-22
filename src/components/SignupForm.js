// @flow
import * as React from 'react';

import {
  Button,
  CheckBox,
  FormattedMessage,
  Form,
  FormField,
  Footer,
  Heading,
  Paragraph,
  Box
} from 'grommet';
import * as Log from 'loglevel';

export type StringEventT = string => void;

type InputHandlerT = (event: SyntheticEvent<HTMLInputElement>) => void;

const wrapEvent = (wrapper: string => void): InputHandlerT => {
  return (event: SyntheticEvent<HTMLInputElement>): void => {
    event.stopPropagation();
    if (event.target instanceof window.HTMLInputElement) {
      wrapper(event.target.value);
    } else {
      Log.warn('Event does not contain a valid htmlinputelement');
    }
  };
};

export const Impl = (props: {
  email: string,
  password: string,
  passwordConfirm: string,
  onEmailChange: StringEventT,
  onPasswordChange: StringEventT,
  onPasswordConfirmChange: StringEventT,
  onSubmit: () => void
}): React.Node => {
  const email = <FormattedMessage id="Email" defaultMessage="Email" />;
  const emailId = 'email';
  const emailEventHandler = wrapEvent(props.onEmailChange);

  const password = <FormattedMessage id="Password" defaultMessage="Password" />;
  const passwordId = 'password';
  const passwordEventHandler = wrapEvent(props.onPasswordChange);

  const passwordConfirm = (
    <FormattedMessage id="PasswordConfirm" defaultMessage="Confirm Password" />
  );
  const passwordConfirmId = 'password-confirm';
  const passwordConfirmEventHandler = wrapEvent(props.onPasswordConfirmChange);

  const signUp = <FormattedMessage id="Sign Up" defaultMessage="Sign Up" />;

  return (
    <Form
      className="grommetux-form grommetux-form--pad-medium grommetux-login-form"
      pad="medium"
      onSubmit={props.onSubmit}
    >
      <fieldset>
        <FormField htmlFor={emailId} label={email}>
          <input
            id={emailId}
            type="email"
            value={props.email}
            onChange={emailEventHandler}
          />
        </FormField>
        <FormField htmlFor={passwordId} label={password}>
          <input
            id={passwordId}
            type="password"
            value={props.password}
            onChange={passwordEventHandler}
          />
        </FormField>
        <FormField htmlFor={passwordConfirmId} label={passwordConfirm}>
          <input
            id={passwordConfirmId}
            type="password"
            value={props.passwordConfirm}
            onChange={passwordConfirmEventHandler}
          />
        </FormField>
      </fieldset>
      <Footer
        size="small"
        direction="column"
        align="stretch"
        pad={{ vertical: 'none', between: 'medium' }}
      >
        <Button
          primary={true}
          fill={true}
          type="button"
          label={signUp}
          onClick={props.onSubmit}
        />
      </Footer>
    </Form>
  );
};
