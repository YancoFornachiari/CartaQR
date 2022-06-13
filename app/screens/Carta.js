import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Image,
	TouchableOpacity,
} from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import Modal from '../components/Modal';

//Estilos
const styles = StyleSheet.create({
	lista: {
		alignSelf: 'stretch',
		margin: 5,
		height: 350,
	},
	btnSugerencia: {
		height: 40,
		width: 140,
		borderWidth: 1,
		borderRadius: 5,
		marginVertical: 20,
		alignSelf: 'center',
		justifyContent: 'center',
	},
	header: {
		borderBottomWidth: 1,
		height: 120,
		flexDirection: 'row',
		marginTop: 30,
	},
	lista: {
		alignSelf: 'center',
		margin: 5,
		width: '90%',
	},
	btnFamilia: {
		width: '100%',
		height: 70,
		backgroundColor: 'green',
		justifyContent: 'center',
		borderBottomWidth: 2,
		marginTop: 10,
	},
	btnCerrar: {
		width: 100,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 8,
		borderRadius: 10,
		borderWidth: 1,
	},
	list: {
		marginVertical: 3,
		borderWidth: 1,
		borderRadius: 5,
		height: 50,
		width: '100%',
		paddingVertical: '5%',
		paddingLeft: 20,
	},
	contFamilia: {
		marginVertical: 10,
		marginHorizontal: 15,
		borderWidth: 1,
		borderRadius: 50,
		paddingVertical: 20,
		paddingHorizontal: 10,
		height: '65%',
	},
	btnContFamilia: {
		width: '90%',
		height: 40,
		borderRadius: 10,
		borderWidth: 1,
		marginBottom: 10,
		alignSelf: 'center',
	},
	productList: {
		margin: 5,
		borderBottomWidth: 2,
		paddingTop: 5,
		paddingLeft: 10,
		height: 100,
		fontSize: 20,
	},
	vistaContacto: {
		width: '40%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20,
		borderWidth: 1,
		marginLeft: 19,
		marginBottom: 5,
	},
	botonesContacto: {
		height: '100%',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
	},
	txtForm: {
		height: 30,
		width: '100%',
		marginTop: 3,
		borderWidth: 1,
		borderRadius: 5,
		paddingVertical: 3,
		paddingHorizontal: 10,
	},
	txtAreaForm: {
		height: 100,
		width: '100%',
		marginTop: 5,
		borderWidth: 1,
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	lblForm: {
		marginTop: 20,
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default () => {
	// Hooks Modales //
	const [visibilityFamilia, setVisibilityFamilia] = useState(false);
	const [visibilityContacto, setVisibilityContacto] = useState(false);

	// Hooks Contacto //
	const [nombreCliente, setNombreCliente] = useState('');
	const [telefonoCliente, setTelefonoCliente] = useState('');
	const [correoCliente, setCorreoCliente] = useState('');
	const [observacionCliente, setObservacion] = useState('');

	// Hooks Productos //
	const [searchProducto, setSearchProducto] = useState('');
	const [filteredProducto, setFilteredProducto] = useState([]);
	const [producto, setProducto] = useState([]);

	// Hooks Familia //
	const [searchFamilia, setSearchFamilia] = useState('');
	const [familia, setFamilia] = useState([]);
	const [filteredFamilia, setFilteredFamilia] = useState([]);
	const [selectedFamilia, setSelectedFamilia] = useState({nombre_familia: 'Seleccionar Familia'});

	//Llenado de  FlatList Familia
	const fetchFamilia = async () => {
		await fetch('http://192.168.1.183:4000/familia', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setFilteredFamilia(data);
				setFamilia(data);
			});
	};

	//Verificador de correo electrónico
	const validateEmail = (email) => {
		const ve = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return ve.test(String(email).toLowerCase());
	}

	//verificar numero telefonico
	const validatePhone = (phone) => {
		const vp = /^\d{9}$/;
		return vp.test(String(phone).toLowerCase());
	}

	//Llenado de  FlatList Producto
	const fetchProduct = async () => {
		if (selectedFamilia.id_familia == null) {
			const json = JSON.stringify({ idFamilia: 1 });

			await fetch('http://192.168.1.183:4000/producto', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: json,
			})
				.then((response) => response.json())
				.then((data) => {
					setFilteredProducto(data);
					setProducto(data);
				});
		} else {
			const json = JSON.stringify({idFamilia: selectedFamilia.id_familia});

			await fetch('http://192.168.1.183:4000/producto', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: json,
			})
				.then((response) => response.json())
				.then((data) => {
					setFilteredProducto(data);
					setProducto(data);
				});
		}
	};

	useEffect(() => {
		fetchProduct();
		fetchFamilia();
	}, [selectedFamilia]);

	const handleSelectedFamilia  = (item) => {
		filtrarFamilia('');
		setSelectedFamilia(item);
		setVisibilityFamilia(false);
	};
	
	//Función para enviar Sugerencias
	const handleSendSugerencia = async (e) => {
		const json = JSON.stringify({
			nombreCliente,
			telefonoCliente,
			correoCliente,
			observacionCliente,
		});
		e.preventDefault();
		if (nombreCliente === '') {
			alert('Debe ingresar su nombre.');
		} else if (!validatePhone(telefonoCliente)) {
			alert('Ingrese un número telefónico válido.');
		} else if (!validateEmail(correoCliente)) {
			alert('Debe ingresar un correo electrónico válido.');
		} else if (observacionCliente === '') {
			alert('Ingrese su observación.');
		} else {
			try {
				await fetch('http://192.168.1.183:4000/sugerencia', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},

					body: json,
				})
					.then((response) => response.json())
					.then((data) => {
						console.log(data);
					})
					.then(
						setNombreCliente(''),
						setTelefonoCliente(''),
						setCorreoCliente(''),
						setObservacion(''),
						setVisibilityContacto(false),
						alert('¡Sugerencia Enviada!')
					);
			} catch (err) {
				console.error(err.message);
			}
		}
	};

	//Vista de datos en tabla Familia
	const viewFamilia = ({ item }) => {
		return (
			<View>
				<TouchableOpacity onPress={() => handleSelectedFamilia(item)}>
					<Text style={styles.list}>{item.nombre_familia}</Text>
				</TouchableOpacity>
			</View>
		);
	};

	//Vista de datos en tabla Productos
	const viewProducto = ({ item }) => {
		return (
			<View>
				<Text style={styles.productList}>
					{item.nombre_producto}
					{'\n'}
					{item.desc_producto}
					{'\n$'}
					{item.precio_producto}
				</Text>
			</View>
		);
	};

	//Barra de búsqueda Familia
	const filtrarFamilia = (text) => {
		if (text) {
			const newData = familia.filter((item) => {
				const itemData = item.nombre_familia.toUpperCase();
				const textData = text.toUpperCase();

				return itemData.indexOf(textData) > -1;
			});

			setFilteredFamilia(newData);
			setSearchFamilia(text);
		} else {
			setFilteredFamilia(familia);
			setSearchFamilia(text);
			
			
		}
	};

	//Barra de búsqueda Productos 
	const filtrarProducto = (text) => {
		if (text) {
			const newData = producto.filter((item) => {
				const itemData = item.nombre_producto.toUpperCase();
				const textData = text.toUpperCase();

				return itemData.indexOf(textData) > -1;
			});

			setFilteredProducto(newData);
			setSearchProducto(text);
		} else {
			setFilteredProducto(producto);
			setSearchProducto(text);
		}
	};

	//Funciones para abrir y cerrar modales
	const handlePressFamilia = () => {
		setVisibilityFamilia(true);
		filtrarProducto('');
	};

	const handleCerrarFamilia = () => {
		filtrarFamilia('');
		setVisibilityFamilia(false);
	};

	const handlePressContacto = () => {
		setVisibilityContacto(true);
	};

	const handleCerrarContacto = () => {
		setVisibilityContacto(false);
	};

	//Pantalla Principal
	return (
		<View style={{ borderWidth: 1, height: '100%' }}>
			{/* Header */}
			<View style={styles.header}>
				<View
					style={{
						justifyContent: 'center',
						marginLeft: 10,
						width: '25%',
					}}
				>
					<Image
						style={{
							width: 80,
							height: 80,
							borderRadius: 100,
							marginLeft: 10,
						}}
						source={{ uri: 'https://placekitten.com/g/200/200' }}
					/>
				</View>
				<View
					style={{
						alignSelf: 'center',
						width: '75%',
						paddingRight: 20,
						marginLeft: 30,
					}}
				>
					<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
						NOMBRE DEL LOCAL
					</Text>
				</View>
			</View>

			{/* Botón Seleccionar Familia */}
			<View style={styles.contFamilia}>
				<View style={styles.txtFiltro}>
					<TouchableOpacity
						onPress={handlePressFamilia}
						style={styles.btnContFamilia}
					>
						<Text
							style={{
								height: '100%',
								width: '100%',
								textAlign: 'center',
								marginVertical: 10,
							}}
						>
							{selectedFamilia.nombre_familia}
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					<TextInput
						onChangeText={(text) => filtrarProducto(text)}
						placeholder="Buscar Producto"
						value={searchProducto}
						style={{
							borderBottomWidth: 1,
							paddingLeft: 10,
							marginHorizontal: 8,
							height: 40,
						}}
					></TextInput>
				</View>
				<FlatList
					style={styles.lista}
					data={filteredProducto}
					keyExtractor={(x) => String(x.id_producto)}
					renderItem={viewProducto}
				/>
			</View>

			{/* Botón de Sugerencias */}
			<View style={styles.btnSugerencia}>
				<TouchableOpacity
					onPress={handlePressContacto}
					style={{ alignItems: 'center' }}
				>
					<Text style={{ marginHorizontal: 30 }}>
						Sugerencias o Reclamos
					</Text>
				</TouchableOpacity>
			</View>

			{/* Modal para visualizar Familias */}
			<Modal visibility={visibilityFamilia}>
				<View style={{ height: '90%' }}>
					<View
						style={{
							height: 40,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
							Familias
						</Text>
					</View>
					<View style={{ width: '90%', alignSelf: 'center' }}>
						<TextInput
							style={{
								borderBottomWidth: 1,
								height: 40,
								paddingLeft: 10,
							}}
							placeholder="Buscar Familia"
							onChangeText={(text) => filtrarFamilia(text)}
							value={searchFamilia}
						/>
					</View>
					<View
						style={{
							backgroundColor: 'white',
							height: '100%',
							borderRadius: 20,
						}}
					>
						<View style={{ marginBottom: 10, height: '100%' }}>
							<FlatList
								style={styles.lista}
								data={filteredFamilia}
								keyExtractor={(x) => String(x.id_familia)}
								renderItem={viewFamilia}
							></FlatList>
							<View
								style={{
									justifyContent: 'flex-end',
									marginVertical: 10,
									alignItems: 'center',
									height: 50,
								}}
							>
								<TouchableOpacity
									style={styles.btnCerrar}
									onPress={handleCerrarFamilia}
								>
									<Text>Cerrar Modal</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>

			{/* Modal para visualizar Formulario de Sugerencias */  }
			<Modal visibility={visibilityContacto}>
				<ScrollView style={{ height: '90%' }}>
					<View
						style={{
							borderRadius: 20,
							backgroundColor: 'white',
							padding: 10,
							height: '100%',
						}}
					>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
								Sugerencias o Reclamos
							</Text>
						</View>
						<Text style={styles.lblForm}>Nombre</Text>
						<TextInput
							style={styles.txtForm}
							placeholder="Nombre"
							value={nombreCliente}
							onChangeText={(text) => setNombreCliente(text)}
							maxLength={50}
						/>
						<Text style={styles.lblForm}>Teléfono</Text>
						<TextInput
							style={styles.txtForm}
							placeholder="Teléfono"
							keyboardType="number-pad"
							value={telefonoCliente}
							onChangeText={(text) => setTelefonoCliente(text)}
							maxLength={9}
						/>
						<Text style={styles.lblForm}>Correo Electrónico</Text>
						<TextInput
							style={styles.txtForm}
							placeholder="Correo Electrónico"
							value={correoCliente}
							onChangeText={(text) => setCorreoCliente(text)}
							maxLength={100}
						/>
						<Text style={styles.lblForm}>Observaciones</Text>
						<TextInput
							style={styles.txtAreaForm}
							multiline={true}
							placeholder={'Observaciones'}
							value={observacionCliente}
							onChangeText={(text) => setObservacion(text)}
							maxLength={200}
						/>
						<View
							style={{
								flexDirection: 'row',
								height: '10%',
								marginVertical: 50,
							}}
						>
							<View style={styles.vistaContacto}>
								<TouchableOpacity
									style={styles.botonesContacto}
									onPress={handleSendSugerencia}
								>
									<Text>Enviar</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.vistaContacto}>
								<TouchableOpacity
									style={styles.botonesContacto}
									onPress={handleCerrarContacto}
								>
									<Text>Cerrar Modal</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
			</Modal>
		</View>
	);
};
