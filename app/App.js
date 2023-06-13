import React from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";

const App = () => {
	const [text, onChangeText] = React.useState("Testing");
	const [number, onChangeNumber] = React.useState("");

	return (
		<SafeAreaView>
			<TextInput
				style={styles.input}
				onChangeText={onChangeText}
				value={text}
				testID="inputText"
			/>
			<TextInput
				style={styles.input}
				onChangeText={onChangeNumber}
				value={number}
				placeholder="Please Input"
				keyboardType="numeric"
				testID="inputNumber"
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});

export default App;
