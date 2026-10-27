import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {store} from './store/Index';


import TaskScreen from './screens/TaskCreen';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <TaskScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
