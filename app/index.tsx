import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";

export default function Home() {
    const [textEntered, onTextEntered] = useState("");
    const [menus, setMenus] = useState([])

    useEffect(() => {
        const storeMenus = async () => {
            try {
                const stringMenus = JSON.stringify(menus)
                await AsyncStorage.setItem("menus", stringMenus)
            } catch(error) {
                console.error(error);
            }
        }

        storeMenus()
    }, [menus])


    useEffect(() => {
        const getMenus = async () => {
            try {
                const newMenus = await AsyncStorage.getItem("menus")
                // console.log(AsyncStorage.getItem("menus"));
                const parsedMenus = newMenus === null ? ["No Menu item yet"] : JSON.parse(newMenus)
                setMenus(parsedMenus)
            } catch (error) {
                console.error(error);
            }
        }

        getMenus()
    }, [])

    const deleteAllItems = async () => {
        try {
            await AsyncStorage.removeItem("menus")
            setMenus([])
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.headText}>Welcome Here</ThemedText>
            <TextInput 
                style={styles.input}
                value={textEntered}
                onChangeText={onTextEntered}
                placeholder="Enter a Menu"
            />
            <TouchableOpacity activeOpacity={0.2} style={styles.button} onPress={() => {
                setMenus([...menus, textEntered])
                onTextEntered('')
            }}>
                <ThemedText>
                Add Item
                </ThemedText>
            </TouchableOpacity>

            <ThemedView>
                <Text style={styles.normText}>Menus:</Text>
                {
                    menus.map((menu, index) => (
                        // <View style={[styles.container, {marginTop: 30}]} key={index}>
                            <Text key={index} style={styles.normText}>{menu}</Text>
                        // {/* </View> */}
                    ))
                }
            </ThemedView>

            <TouchableOpacity activeOpacity={0.2} style={styles.button} onPress={deleteAllItems}>
                <ThemedText>
                Delete all Items
                </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.2} style={styles.button}>
                <Link href="/Preferences">
                <ThemedText>
                Go To Preferences
                </ThemedText></Link>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.2} style={styles.button}>
                <Link href="/Customers">
                <ThemedText>
                See Customers
                </ThemedText></Link>
            </TouchableOpacity>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headText: {
        fontSize: 30,
        textAlign: 'center',
        padding: 20
    },
    input: {
        padding: 10,
        margin: 12,
        backgroundColor: 'white',
        color: 'black'
    },
    normText: {
        color: 'white'
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        margin: 20,
        borderRadius: 10,
    }
})