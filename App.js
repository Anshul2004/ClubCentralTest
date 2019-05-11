import { createStackNavigator, createAppContainer } from 'react-navigation';

//Sign-Up page
import SignUp from './screens/signUp'

const container = createStackNavigator({
	SignUp: { screen: SignUp,
		navigationOptions: ({ navigation }) => ({
			header: null
		})
	},
});

export default createAppContainer(container)
