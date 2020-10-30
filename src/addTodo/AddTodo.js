import React from "react"
import { AsyncStorage, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Todo from "../todo/Todo"
import { firebase } from "@react-native-firebase/firestore"

export default class AddTodo extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            refreshing: false,
            text: "",
            name: "",
            idUser: props["route"]["params"]["id"],
            list: [],
        }
    }

    async deleteData(){
        await AsyncStorage.clear()
    }

    async uploadMessage() {
        try {
            await firebase.firestore().collection(`users`).doc(this.state.idUser).update({
                "todoList": this.state.list
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getMessages() {
        try {
            const user = await firebase.firestore().collection('users').doc(this.state.idUser).get()
            for (var x = 0; x < 60; x++) {
                try {
                    console.log(await user.data()["todoList"][x])
                    this.state.list.push(
                        { "name": user.data()["todoList"][x]["name"], "text": user.data()["todoList"][x]["text"], "id": user.data()["todoList"][x]["id"] })
                } catch (error) {
                    return;
                }
            }
        } catch (error) {
            print(error)
        }
    }

    async addTodo() {
        var id = Date.now().toString()
        await this.setState({
            list: [{ "name": this.state.name, "text": this.state.text, "id": id }, ...this.state.list],
            name: "",
            text: "",
        })
        await this.uploadMessage()


    }

    async componentDidMount() {
        await this.getMessages()
        this.setState({ list: this.state.list })
    }

    render() {
        return <View renderToHardwareTextureAndroid={true} style={{ backgroundColor: "black" }}>

            <TouchableOpacity style={{ backgroundColor: "white", marginTop: 10, width: 220, height: 20, alignSelf: "center", borderRadius: 40, marginBottom: 2 }} onPress={() => this.deleteData()}>
                <Text style={{ color: "black", alignSelf: "center" }}>
                    Remover login automatico
                </Text>
                </TouchableOpacity>

            <TextInput value={this.state.name} onChangeText={(name) => this.setState({ name: name })} style={style.textInput} placeholder="Nome atividade" />
            <TextInput onChangeText={(text) => this.setState({ text: text })} style={style.textInput} value={this.state.text} keyboardType="default"
                placeholder="Descrição" autoCorrect={true} />

            <TouchableOpacity onPress={async () => await this.addTodo()} style={style.button}>
                <Text style={{ color: "black", alignSelf: "center", textTransform: "uppercase", paddingTop: 10, }}>Add Todo</Text>
            </TouchableOpacity>

            <SafeAreaView style={{ height: Dimensions.get("window").height * 0.615 }}>
                <FlatList data={this.state.list} bouncesZoom={true} renderItem={({ item }) => <Todo title={item.name} message={item.text} key={item.id} id={item.id} idUser={this.state.idUser}></Todo>}
                    refreshing={this.state.refreshing} onRefresh={async () => { this.setState({ list: [], refreshing: true }), await this.getMessages(), this.setState({ refreshing: false }) }} />
            </SafeAreaView>

        </View>
    }

}

const style = StyleSheet.create({
    title: {
        alignSelf: "center",
        color: "white",
        fontSize: 22,
        paddingBottom: 20,
        paddingTop: 20,
    },
    textInput: {
        backgroundColor: "white",
        borderColor: "black",
        borderRadius: 40,
        color: "black",
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    button: {
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 20,
        height: 40,
        marginBottom: 10,
        width: 300,
    }
})