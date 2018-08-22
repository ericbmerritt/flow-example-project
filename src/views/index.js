// @flow
import * as React from 'react';
import { App } from 'grommet';
import { Provider } from 'react-redux';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Maybe from '../maybe';
import * as Store from '../store';
import * as BaseStore from '../base-store';
import * as FrontPage from './frontpage';

const router = (props: {
  currentLocation: Maybe.T<BaseStore.LocationEntryT>
}): React.Node => {
  if (Maybe.isJust(props.currentLocation)) {
    switch (Maybe.get(props.currentLocation).name) {
      case 'home':
        return <FrontPage.RoutedPage />;
      default:
        return <div>Not Found</div>;
    }
  } else {
    return <div>Not Found</div>;
  }
};

const mapStateToProps = ({
  location
}: BaseStore.StoreT): {
  currentLocation: Maybe.T<BaseStore.LocationEntryT>
} => {
  return {
    currentLocation: Maybe.map(
      Maybe.maybe(location),
      location => location.current
    )
  };
};

export const Router = ReactRedux.connect(mapStateToProps)(router);

export const Index = (props: { store: Redux.Store }): React.Node => {
  return (
    <Provider store={props.store}>
      <App>
        <Router />
      </App>
    </Provider>
  );
};
