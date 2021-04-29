import React, { useState, useEffect } from "react";
import {
 StyleSheet,
 Text,
 View,
 FlatList,
 TouchableOpacity,
} from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("notes.db");
let count = 0;

export default function NotesScreen({ navigation, route }) {
 const [notes, setNotes] = useState([]);
 
  function refreshNotes() {
  console.log("inside refreshNotes()", count++, route.params);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes",
        null,
        (txObj, { rows: {_array } }) => setNotes(_array),
        (txObj, error) => console.log("Error ", error)
      ); 
    }),console.log("Failed in refreshNote() call", count++), console.log("success in refreshNote()", count++);
  };

 useEffect( () => {
      db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS
        notes
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        done INT);`
      );
    }, null, refreshNotes);
  }, []
  );

  useEffect(() => {
    console.log("inside useeffect insert", count++, route.params);
    if (route.params?.text) {
      db.transaction((tx) => {
        tx.executeSql("INSERT INTO notes (done, title) VALUES (0, ?)", [
          route.params.text,
        ]);
      },
      null,
      refreshNotes,
      );
    }     
  }, [route.params?.text]);

 useEffect(() => {
  console.log("inside useeffect touchable",  count++, route.params);
   navigation.setOptions({
     headerRight: () => (
       <TouchableOpacity onPress={addNote}>
         <Entypo
           name="new-message"
           size={24}
           color="black"
           style={{ marginRight: 20 }}
         />
       </TouchableOpacity>
     ),
   });
 });

 //console.log("in notescreen", count++, route.params);
 
 /*
 useEffect(() => {
    if (route.params?.text) {
      const newNote = {
        title: route.params.text,
        done: false,
        id: notes.length.toString(),
      };
      setNotes([...notes, newNote]);
    }
  }, [route.params?.text]);
*/
 function addNote() {
   navigation.navigate("Add Note");
 };


 function deleteNote(id) {
   console.log("Deleting ", id, count++);
  db.transaction((tx) => {
    tx.executeSql(`DELETE FROM notes WHERE id =${id}`);
  },
  null,
  refreshNotes,
  );
 };

 function renderItem({ item }) {
   return (
     <View
       style={{
         padding: 10,
         paddingTop: 20,
         paddingBottom: 20,
         borderBottomColor: "#ccc",
         borderBottomWidth: 1,
         flexDirection: "row",
         justifyContent: "space-between",
       }}
     >
       <Text style={{ textAlign: "left", fontSize: 16 }}>{item.title}</Text>
         <TouchableOpacity onPress={ () => deleteNote(item.id)}>
         <Entypo
           name="trash" 
           size={16}
           color="black" 
           style={{ marginRight: 20 }}
         />
       </TouchableOpacity>
     </View>
   );
 };

 /* these codes will delete all
        <Text style={{ textAlign: "left", fontSize: 16 }}>{item.title}</Text>
         <TouchableOpacity onPress={deleteNote(item.id)}>
         <Entypo
           name="trash" 
           size={16}
           color="black" 
           style={{ marginRight: 20 }}
         />
       </TouchableOpacity>
 */

 return (
   <View style={styles.container}>
     <FlatList
       style={{ width: "100%" }}
       data={notes}
       renderItem={renderItem}
       keyExtractor={(item) => item.id.toString()}
     />
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#ffc",
   alignItems: "center",
   justifyContent: "center",
 },
});




