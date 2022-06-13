import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import cartaScreen from './screens/Carta';

const App = createStackNavigator(
	{
		Carta: {
			screen: cartaScreen,
		},
	},
	{
		initialRouteName: 'Carta',
		headerMode: 'none',
	}
);

export default createAppContainer(App);
