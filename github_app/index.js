/** @format */

import {AppRegistry} from 'react-native';
// import AppNavigator from './src/navigator/AppNavigators';
import {name as appName} from './app.json';
import App from './src/App'

AppRegistry.registerComponent(appName, () => App);
