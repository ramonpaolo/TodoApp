import React from 'react'
import { firebase as firebaseAuth } from '@react-native-firebase/auth'
import { firebase } from '@react-native-firebase/firestore'
import { AsyncStorage, Button, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default class Login extends React.Component {

    constructor(navigation) {
        super(navigation)
        this.state = {
            error: "",
            email: "",
            password: "",
            navigation: navigation
        }
    }

    async saveData() {
        await AsyncStorage.setItem("email", this.state.email)
        await AsyncStorage.setItem("password", this.state.password)
        const user = await firebaseAuth.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        await this.state.navigation["navigation"].replace("AddTodo", { id: user.user.uid })
    }
    async readData() {
        try {
            if (await AsyncStorage.getItem('email') != null) {
                console.log(await AsyncStorage.getItem('email'))
                console.log(await AsyncStorage.getItem('password'))
                this.setState({ email: await AsyncStorage.getItem('email'), password: await AsyncStorage.getItem('password') })
                const user = await firebaseAuth.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                await this.state.navigation["navigation"].replace("AddTodo", { id: user.user.uid })
            }
        } catch (e) {
            console.log(e)
        }
    }

    async login(email, password) {
        if (email == "" && password == "") {
            this.setState({ error: "Campo(s) nulos" })

        } else {
            try {
                await firebaseAuth.auth().signInWithEmailAndPassword(email, password)
                await this.saveData();
                //this.state.navigation["navigation"].replace("AddTodo", { id: user.user.uid })
            } catch (error) {
                if (error.code === "auth/wrong-password") {
                    console.log("Senha errada")
                    this.setState({ error: "Senha errada" })
                } else if (error.code === "auth/invalid-email") {
                    console.log("Invalid email")
                    this.setState({ error: "Invalid email" })
                } else if (error.code === "auth/user-not-found") {
                    console.log("User not found")
                    this.setState({ error: "Email não encontrado" })
                } else if (error == null) {
                    this.setState({ error: "Campos nulos" })
                } else {
                    this.setState({ error: error.code })
                }
                console.log(error)
            }
            console.log(email, password)
            //this.state.navigation["navigation"].navigate("Screen2")
        }
    }

    async cadastro(email, password) {
        if (email == "" && password == "") {
            this.setState({ error: "Campo(s) nulos" })
        } else {
            try {
                const user = await firebaseAuth.auth().createUserWithEmailAndPassword(email, password)
                await firebase.firestore().collection("users").doc(user.user.uid).set({ email: email })
                await this.saveData()
            } catch (error) {
                if (error.code === "auth/email-already-in-use") {
                    console.log("Email already in use")
                    this.setState({ error: "Email already in use" })
                } else if (error.code === "auth/invalid-email") {
                    console.log("Invalid email")
                    this.setState({ error: "Invalid email" })
                }
                console.log(error)
            }
        }
    }

    async componentDidMount() {
        await this.readData()
    }

    render() {
        return (
            <ScrollView>
                <View style={{ padding: 30 }}>
                    <Text style={styles.title}>Bem Vindo ao TodoList</Text>
                    <Text style={styles.divider} />

                    <TextInput style={styles.textInput} placeholderTextColor="white" placeholder="Digite seu Email" autoCompleteType="email" value={this.state.email} onChangeText={(email) => this.setState({ email: email })} ></TextInput>
                    <TextInput secureTextEntry={true} style={styles.textInput} textContentType="password" placeholderTextColor="white" autoCompleteType="password" placeholder="Digite sua Senha" value={this.state.password} onChangeText={(password) => this.setState({ password: password })}  ></TextInput>

                    <Text>{this.state.error}</Text>

                    <TouchableOpacity onPress={() => this.login(this.state.email, this.state.password)} style={styles.button}>
                        <Text style={styles.buttonText} >Logar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => this.cadastro(this.state.email, this.state.password)}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        color: "black",
        fontSize: 24,
        alignSelf: "center",
        paddingBottom: 20,
    },
    divider: {
        marginTop: Dimensions.get('window').height * 0.17
    },
    textInput: {
        backgroundColor: "black",
        margin: 5,
        borderRadius: 40,
        color: "white",
        padding: 10,
    },
    button: {
        marginTop: 10,
        height: 40,
        width: 200,
        borderRadius: 40,
        alignSelf: "center",
        backgroundColor: "black",
    },
    buttonText: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        paddingTop: 8,
    }
})