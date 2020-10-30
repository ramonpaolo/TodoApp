import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome"
import { firebase } from '@react-native-firebase/firestore'

async function deleteMessage(idProduct, idUser) {
    var list = []
    const data = await firebase.firestore().collection("users").doc(idUser)
    const user = await firebase.firestore().collection("users").doc(idUser).get()
    for (var i = 0; i < user.data()['todoList'].length; i++) {
        if (user.data()["todoList"][i]["id"] != idProduct) {
            list.push(user.data()["todoList"][i])
        }
        await data.update({'todoList': list})
    }
}

export default function Todo({ ...props }) {
    return <View style={style.camp} >

        <View style={style.top}>

            <Text style={style.title}>{props.title} </Text>
            <Icon.Button name="trash" size={28} color="white" style={{ backgroundColor: "black" }} onPress={async () => await deleteMessage(props.id, props.idUser)} />

        </View>

        <Text style={style.text}>{props.message}</Text>

    </View>
}

const style = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 22,
    },
    top: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    camp: {
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
        margin: 16,
        backgroundColor: "black",

    },
    text: {
        color: "white",
    },
})