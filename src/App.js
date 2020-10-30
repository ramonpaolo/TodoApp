//---- Packages
import React from 'react'

//---- Screens
import Login from "./auth/Login"
import AddTodo from "./addTodo/AddTodo"

//---- Navigation
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const Stack = createStackNavigator()

export default function App() {
    return <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: "center", title: "TodoApp" }} >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="AddTodo" options={{headerStyle: {backgroundColor: "white",elevation: 0.0,}, headerLeft: null}} component={AddTodo} />
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>

}