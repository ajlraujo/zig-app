import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
	appBar: {
		backgroundColor: '#EEEED4',
		elevation: 0.8,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#3C3C3C',
	},
	gradientBackground: {
		flex: 1,
	},
	container: {
		padding: 20,
	},
	imageContainer: {
		flex: 1,
		alignItems: 'center',
		marginBottom: 20,
		marginTop: 80,
	},
	imageWrapper: {
		width: 200,
		height: 200,
		borderRadius: 15,
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 10,
	},
	addButton: {
		position: 'absolute',
		bottom: 5,
		right: 5,
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
		borderRadius: 20,
	},
	titleText: {
		fontSize: 23.44,
		fontWeight: 'bold',
		color: '#B0B0B0',
	},
	touchableButton: {
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
		borderRadius: 10,
		marginTop: 15,
		alignSelf: 'stretch',
		minHeight: 42,
		justifyContent: 'center',
		paddingHorizontal: 15,
		alignItems: 'flex-start',
	},
	titleButton: {
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
		borderRadius: 10,
		marginTop: 10,
		alignSelf: 'stretch',
		minHeight: 50,
		justifyContent: 'center',
		paddingHorizontal: 15,
		alignItems: 'flex-start',
	},
	createButton: {
		marginTop: 50,
		backgroundColor: '#191919',
		borderRadius: 25,
		alignSelf: 'stretch',
		minHeight: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	createButtonText: {
		fontSize: 18,
		fontWeight: 'semibold',
		color: '#f1f1f1',
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginRight: 5,
		marginLeft: -8,
	},
	buttonText: {
		fontSize: 18,
		color: '#9C9C9C',
		fontWeight: 'semibold',
	},
	dialogContainer: {
		backgroundColor: '#FCFCFC',
		borderRadius: 30,
		padding: 5,
	},
	dialogTitle: {
		color: '#404040',
		fontSize: 18.75,
		fontWeight: 'bold',
	},
	dialogInput: {
		backgroundColor: '#F0F0F0',
		fontSize: 18.75,
	},
	dialogButton: {
		color: '#404040',
		fontSize: 18.75,
		fontWeight: '500',
	},
	buttonContainer: {
	},
});
