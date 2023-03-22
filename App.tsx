import { persistStore } from 'redux-persist';
import store from './src/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MainNavigation from './src/navigation/MainNavigation';
import CodePush from 'react-native-code-push';


let CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  // updateDialog: {
  //   appendReleaseDescription: true,
  //   title: "a new update is available!"
  // }
}

const App = () => {
  const persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <MainNavigation />
      </PersistGate>
    </Provider>
  );
};

export default CodePush(CodePushOptions)(App);