/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { firebase } from '@react-native-firebase/firestore';
import {firebase as firebaseAuth} from "@react-native-firebase/auth"

firebase.initializeApp()
firebaseAuth.initializeApp()

AppRegistry.registerComponent(appName, () => App);
