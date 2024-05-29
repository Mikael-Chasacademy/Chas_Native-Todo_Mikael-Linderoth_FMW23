import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

const Stack = createStackNavigator();

export default function App() {
  const [todos, setTodos] = React.useState([]);

  const HomeScreen = ({ navigation }) => {
    React.useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={() => navigation.navigate("Add")} title="Add" />
        ),
      });
    }, [navigation]);

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={styles.todoItem}
        onPress={() => navigation.navigate("Detail", { todoId: item.id })}
      >
        <View style={styles.todoTextContainer}>
          <Text style={[styles.todoText, item.done && styles.strikeThrough]}>
            {item.title}
          </Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>{">"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.homeContainer}>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    );
  };

  const DetailScreen = ({ route, navigation }) => {
    const { todoId } = route.params;
    const todo = todos.find((t) => t.id === todoId);

    const toggleDone = () => {
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t))
      );
      navigation.goBack();
    };

    const deleteTodo = () => {
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
      navigation.goBack();
    };

    return (
      <View style={styles.detailContainer}>
        <Text style={[styles.title, todo.done && styles.strikeThrough]}>
          {todo.title}
        </Text>
        <Text style={[styles.description, todo.done && styles.strikeThrough]}>
          {todo.description}
        </Text>
        <View style={styles.buttons}>
          <Button
            title={todo.done ? "Unmark" : "Mark as Done"}
            onPress={toggleDone}
          />
          <Button title="Delete" onPress={deleteTodo} />
        </View>
      </View>
    );
  };

  const AddScreen = ({ navigation }) => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");

    const addTodo = () => {
      const newTodo = { id: Date.now(), title, description, done: false };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      navigation.goBack();
    };

    return (
      <View style={styles.addContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.descInput}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          numberOfLines={10}
          multiline={true}
        />
        <Button title="Add to list" onPress={addTodo} />
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  addContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  todoItem: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  todoText: {
    fontSize: 18,
  },
  todoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowContainer: {
    marginRight: 10,
  },
  arrow: {
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  titleInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
  },
  descInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 18,
    justifyContent: "flex-start",
    borderRadius: 5,
  },
  strikeThrough: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
});
