import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";

// Open the database
const db = SQLite.openDatabaseAsync("customers");

export default function Customers() {
    const colorScheme = useColorScheme();
    const [customers, setCustomers] = useState([]);
    const [textInput, onChangeInput] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    // Function to add a customer
    const addCustomer = async () => {
        if (textInput.trim() === "") return; // Prevent empty input

        if (editingIndex !== null) {
            // Update an existing customer
            const updatedCustomers = [...customers];
            updatedCustomers[editingIndex].name = textInput;
            setCustomers(updatedCustomers);
            setEditingIndex(null);

            try {
                (await db).execAsync(`UPDATE customerNames SET name = ? WHERE id = ?;`, [textInput, updatedCustomers[editingIndex].id]);
                console.log("Customer updated");
            } catch (error) {
                console.log("Error updating customer", error);
            }
        } else {
            // Insert a new customer
            try {
                (await db).execAsync(`INSERT INTO customerNames (name) VALUES (?);`, [textInput]);
                console.log("Customer added", textInput);
                fetchCustomers(); // Refresh the customer list
            } catch (error) {
                console.log("Error adding customer", error);
            }
        }

        onChangeInput(""); // Reset input
    };

    // Function to fetch customers from the database
    const fetchCustomers = async () => {
        try {
            const result = (await db).getAllAsync(`SELECT * FROM customerNames;`);
            const allRows = result?.rows?._array || [];
            console.log("Fetched customers:", allRows);
            setCustomers(allRows); // Set the customer list to state
        } catch (error) {
            console.log("Error fetching customers:", error);
        }
    };

    // Create the table and fetch customers when the component mounts
    useEffect(() => {
        (async () => {
            try {
                (await db).execAsync(`CREATE TABLE IF NOT EXISTS customerNames (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`);
                fetchCustomers(); // Fetch customers after creating the table
            } catch (error) {
                console.log("Error creating table", error);
            }
        })();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.header}>Little Lemon Customers</ThemedText>

            {/* Input field to add customers */}
            <TextInput
                style={styles.input}
                placeholder="Enter the customer name"
                value={textInput}
                onChangeText={onChangeInput}
            />

            <TouchableOpacity activeOpacity={0.2} style={styles.button} onPress={addCustomer}>
                <ThemedText style={styles.buttonText}>Save Customer</ThemedText>
            </TouchableOpacity>

            <ThemedView>
                <ThemedText style={styles.normText}>Customers:</ThemedText>
                {/* Display customers */}
                {customers.length > 0 ? (
                    customers.map((customer, index) => (
                        <ThemedView key={index} style={styles.crow}>
                            <ThemedText style={styles.normText}>{customer.name}</ThemedText>
                            <ThemedView style={styles.crow}>
                                <Ionicons
                                    onPress={() => editCustomer(index)}
                                    name="pencil"
                                    size={32}
                                    color={colorScheme === "dark" ? "white" : "black"}
                                />
                                <Ionicons
                                    onPress={() => deleteCustomer(index)}
                                    name="trash"
                                    size={32}
                                    color={colorScheme === "dark" ? "white" : "black"}
                                />
                            </ThemedView>
                        </ThemedView>
                    ))
                ) : (
                    <ThemedText style={styles.normText}>No customers yet</ThemedText>
                )}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        padding: 16,
    },
    header: {
        margin: 24,
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        padding: 10,
    },
    input: {
        height: 40,
        textAlign: "center",
        borderColor: "green",
        backgroundColor: "white",
    },
    button: {
        backgroundColor: "green",
        padding: 10,
        marginTop: 30,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
    normText: {
        marginTop: 20,
    },
    crow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignContent: "center",
    },
});


// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { StyleSheet, View, Text, TextInput, TouchableOpacity, useColorScheme } from "react-native";
// import Constants from "expo-constants";
// import { useState, useEffect } from "react";
// import * as SQLite from "expo-sqlite";
// import { Ionicons } from "@expo/vector-icons";

// const db = SQLite.openDatabaseAsync("customers")

// export default function Customers() {
//     const colorScheme = useColorScheme();
//     const [customers, setCustomers] = useState([]);
//     const [textInput, onChangeInput] = useState("");
//     const [editingIndex, setEditingIndex] = useState(null)

//     useEffect(() => {
//     (async () => {
//         try {
//             (await db).execAsync(`
//                 CREATE TABLE IF NOT EXISTS customerNames (id INTEGER PRIMARY KEY NOT NULL, name TEXT);
//             `);
//             fetchCustomers(); // Fetch existing data after table creation
//         } catch (e) {
//             console.error("Error creating table or fetching customers:", e);
//         }
//     })();
// }, []);


//     const addCustomer = async () => {
//         if (textInput.trim() === "") return;

//         if (editingIndex !== null) {
//             const updatedCustomers = [...customers]
//             updatedCustomers[editingIndex] = textInput
//             setCustomers(updatedCustomers)
//             setEditingIndex(null)
//             try {
//                 (await db).runAsync(`
//                     UPDATE customerNames SET name = ? WHERE id = ?
//                 `, [textInput, updatedCustomers[editingIndex].id])
//             } catch(e) {
//                 console.log("Error Updating customer: ", e);
//             }
//         } else {
//             // setCustomers([
//             //     ...customers,
//             //     textInput
//             // ])
//             try {
//                 (await db).execAsync(`
//                     INSERT INTO customerNames (name) VALUES (?);
//                 `, [textInput])

//                 console.log("Customer added:", textInput);
//                 // setCustomers([...customers, { id: newId, name: textInput }]);
//                 fetchCustomers()
//             } catch (e) {
//                 console.error(e);
//             }
//         }
//         onChangeInput("")
//     }

//     const editCustomer = async (id:number) => {
//         const customer = customers[id]
//         onChangeInput(customer)
//         setEditingIndex(id)
//     }

//     const deleteCustomer = async (id:any) => {
//         const filteredCustomers = customers.filter((customer, index) => index !== id)
//         try {
//             (await db).runAsync(`DELETE FROM customerNames WHERE id = ?;`, [id]);
//             // setCustomers(filteredCustomers)
//             fetchCustomers()
//         } catch(e) {
//             console.log(e);
//         }
//     }

//     useEffect(() => {
//         fetchCustomers()
//     }, [])

//     const fetchCustomers = async () => {
//         try {
//                 const result = (await db).getAllAsync(`SELECT * FROM customerNames`);
//                 const allRows = result[0]?.rows?._array || []
//                 console.log("Fetched Customers: ", allRows)
//                 setCustomers(allRows)
//         } catch(e) {
//                 console.log(e);
//         }
//     }

//     return (
//         <ThemedView style={styles.container}>
//             <ThemedText style={styles.header}>Little Lemon Customers</ThemedText>
//             <TextInput style={styles.input} 
//                 placeholder="Enter the customer name"
//                 value={textInput}
//                 onChangeText={onChangeInput}
//             />
//             <TouchableOpacity activeOpacity={0.2} style={styles.button} onPress={addCustomer}>
//                 <Text style={styles.buttonText}>
//                     Save Customer
//                 </Text>
//             </TouchableOpacity>

//             <ThemedView>
//                 <ThemedText style={styles.normText}>Customers:</ThemedText>
//                 {customers.length > 0 ? customers.map((customer, index) => (
//                     <ThemedView key={customer.id} style={styles.crow}>
//                         <ThemedText style={styles.normText}>{customer.name}</ThemedText>
//                         <ThemedView style={styles.crow}>
//                             <Ionicons onPress={() => editCustomer(customer.id)} name="pencil" size={32} color={
//                                 colorScheme === 'dark' ? 'white' : 'black'
//                             } />
//                             <Ionicons onPress={() => deleteCustomer(customer.id)} name="trash" size={32} color={
//                                 colorScheme === 'dark' ? 'white' : 'black'
//                             } />
//                         </ThemedView>
//                     </ThemedView>
//                 )) : <ThemedText style={styles.normText}>No customers yet</ThemedText>}

//             </ThemedView>
//         </ThemedView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingTop: Constants.statusBarHeight,
//         padding: 16,
//     },
//     header: {
//         margin: 24,
//         fontSize: 25,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         padding: 10
//     },
//     input: {
//         height: 40,
//         textAlign: 'center',
//         borderColor: 'green',
//         backgroundColor: 'white',
//     }, 
//     button: {
//         backgroundColor: 'green',
//         padding: 10,
//         marginTop: 30
//     }, 
//     buttonText: {
//         color: 'white',
//         textAlign: 'center'
//     },
//     normText: {
//         marginTop: 20
//     },
//     crow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         alignContent: 'center'
//     }
// })