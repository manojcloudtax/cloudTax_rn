import { persistStore } from 'redux-persist';
import store from './src/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MainNavigation from './src/navigation/MainNavigation';

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

export default App;