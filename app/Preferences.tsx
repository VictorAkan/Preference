import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Switch } from "react-native";
import { useState, useEffect } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseAsync('exampleDataStore');

export default function Preferences() {
    const [preferences, setPreferences] = useState({
        pushNotifications: true,
        emailMarketing: true,
        latestNews: false,
    })

    useEffect(() => {
        (async () => {
            try {
                (await db).execAsync(
                    `CREATE TABLE IF NOT EXISTS new (id INTEGER PRIMARY KEY NOT NULL, 
                    pushNotifications BOOLEAN, emailMarketing BOOLEAN, latestNews BOOLEAN);
                    `
                );
                (await db).execAsync(`
                    INSERT INTO new (pushNotifications, emailMarketing, latestNews)
                    VALUES (true, false, false)
                `);
            } catch(e) {
                console.log(e);
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const allRows = (await db).getAllAsync('SELECT * FROM new')
                for (let i = 0; i < allRows.length; i++) {
                    const row = allRows[i]
                    console.log(row.id)
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, [])

    const updateState = (key:any) => {
        setPreferences((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }))
    }

    useEffect(() => {
        (async () => {
            try {
                const storedPreferences = await AsyncStorage.getItem('preferences');
                    setPreferences(storedPreferences ? JSON.parse(storedPreferences) : {
                    pushNotifications: true,
                    emailMarketing: true,
                    latestNews: false,
                })
            } catch(e) {
                console.log(e);
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const preferencesToStore = JSON.stringify(preferences)
                await AsyncStorage.setItem('preferences', preferencesToStore)
            } catch(e) {
                console.log(e);
            }
        })()
    }, [preferences])

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.header}>Account Preferences</ThemedText>
            <ThemedView style={styles.row}>
                <ThemedText>Push notifications</ThemedText>
                <Switch
                    value={preferences.pushNotifications}
                    onValueChange={async () => {
                        try {
                            updateState('pushNotifications')
                        (await db).execAsync([
                            {
                                sql: `INSERT INTO new (pushNotifications) VALUES (?)`,
                                args: [preferences.pushNotifications]
                            }
                        ])
                        } catch(e) {
                            console.log(e);
                        }
                    }}
                />
            </ThemedView>
            <ThemedView style={styles.row}>
                <ThemedText>Marketing emails</ThemedText>
                <Switch
                    value={preferences.emailMarketing}
                    onValueChange={async () => {
                        try {
                            updateState('emailMarketing')
                        (await db).execAsync([
                            {
                                sql: `INSERT INTO new (emailMarketing) VALUES (?)`,
                                args: [preferences.emailMarketing]
                            }
                        ])
                        } catch(e) {
                            console.log(e);
                        }
                    }}
                />
            </ThemedView>
            <View style={styles.row}>
                <ThemedText>Latest news</ThemedText>
                <Switch
                    value={preferences.latestNews}
                    onValueChange={async () => {
                        try {
                            updateState('latestNews')
                        (await db).execAsync([
                            {
                                sql: `INSERT INTO new (latestNews) VALUES (?)`,
                                args: [preferences.latestNews]
                            }
                        ])
                        } catch(e) {
                            console.log(e);
                        }
                    }}
                />
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    header: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})