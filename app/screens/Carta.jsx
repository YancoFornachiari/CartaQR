import React, { useEffect, useState } from 'react';
import { TextInput, ScrollView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, } from 'react-native';

import Modal from '../components/Modal';
import AntDesign from 'react-native-vector-icons/AntDesign'

//Estilos
const styles = StyleSheet.create({
	header: {
		height: 120,
		margin: 10,
		backgroundColor: '#58b543',
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},

	nombreLocal: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff'
	},

	textFamilia: {
		fontWeight: 'bold',
		fontSize: 15,
		flex: 10,
	},

	action: {
		backgroundColor: '#eee',
		width: '90%',
		height: 50,
		alignSelf: 'center',
		padding: 10,
		borderRadius: 5,
	},

	lista: {
		width: '90%',
		alignSelf: 'center',
	},

	btnSugerencias: {
		width: '70%',
		height: 50,
		margin: 20,
		alignSelf: 'center',
		backgroundColor: '#58b543',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
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
		borderWidth: 1,
		borderColor: '#eee',
		backgroundColor: '#eee',
		borderRadius: 10,
		padding: 10,
		justifyContent: 'center',
		margin: 10,
	},

	contFamilia: {
		height: '70%',
		padding: 10,
		margin: 10,
	},

	btnContFamilia: {
		width: '90%',
		height: 40,
		alignSelf: 'center',
		alignItems: 'center',
		flexDirection: 'row',

		borderBottomWidth: 1,
		borderBottomColor: '#58b543',
		marginBottom: 20,
		marginTop: 10,
	},

	productList: {
		backgroundColor: '#eee',
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 10,
		borderRadius: 10,
		padding: 10,
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
	const [selectedFamilia, setSelectedFamilia] = useState({ nombre_familia: 'Seleccione una Categoría...' });

	//Llenado de  FlatList Familia
	const fetchFamilia = async () => {
		await fetch('http://192.168.1.193:4000/familia', {
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

			await fetch('http://192.168.1.193:4000/producto', {
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
			const json = JSON.stringify({ idFamilia: selectedFamilia.id_familia });

			await fetch('http://192.168.1.193:4000/producto', {
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

	const handleSelectedFamilia = (item) => {
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
				await fetch('http://192.168.1.193:4000/sugerencia', {
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
		const prodListStyle = StyleSheet.create({
			nombreProducto : {
				fontSize : 18,
				fontWeight : 'bold',
				marginBottom : 5,
			},

			desProducto : {
				fontStyle: 'italic',
				fontSize : 15,
			},

			precioProd: {
				color : '#58b543',
				fontSize : 15,
				fontWeight : 'bold',
			}
		})

		return (
			<View style={styles.productList}>
				<Text style={prodListStyle.nombreProducto}>{item.nombre_producto}</Text>
				<Text style={prodListStyle.desProducto}>{item.desc_producto}</Text>
				<Text style={prodListStyle.precioProd}>${item.precio_producto}</Text>
			</View>
		);
	};

	//Barra de búsqueda Familia
	const filtrarFamilia = (text) => {
		if (text) {
			console.log(text);
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
		filtrarFamilia('');
	};

	/*const handleCerrarFamilia = () => {
		setVisibilityFamilia(false);
	};*/

	const handlePressContacto = () => {
		setVisibilityContacto(true);
	};

	const handleCerrarContacto = () => {
		setVisibilityContacto(false);
	};

	//Pantalla Principal
	return (
		<View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
			{/* Header */}
			<View style={styles.header}>
				<Image
					style={{
						width: 80,
						height: 80,
						borderRadius: 100,
						marginLeft: 10,
						marginRight: 10,
					}}
					source={{ uri: 'https://placekitten.com/g/200/100' }}
				/>

				<Text style={styles.nombreLocal}>Local de Comida</Text>
			</View>

			{/* <TextInput
				onChangeText={(text) => filtrarProducto(text)}
				placeholder="Buscar Producto"
				value={searchProducto}
				style={styles.action}
			/> */}
			
			{/* Botón Seleccionar Familia */}
			<TouchableOpacity onPress={handlePressFamilia} style={styles.btnContFamilia}>
				<Text style={styles.textFamilia}>{selectedFamilia.nombre_familia}</Text>
				<AntDesign name="caretdown" size="large" color="#58b543" style={{ flex: 1 }} />
			</TouchableOpacity>
			
			<FlatList
				style={styles.lista}
				data={filteredFamilia}
				renderItem={({ item }) =>(
					<View>
						<Text>{item.nombre_familia}</Text>
						<FlatList 
							style={styles.lista}
							data={filteredProducto}
							keyExtractor={(x) => String(x.id_producto)}
							renderItem={ viewProducto }
							/>
						
					</View>
				)}
			/>

			{/* Lista de productos funcional */}
			{/*
			<FlatList
				style={styles.lista}
				data={filteredProducto}
				keyExtractor={(x) => String(x.id_producto)}
				renderItem={viewProducto}
		/>*/}

			{/* Botón de Sugerencias */}
			<TouchableOpacity onPress={handlePressContacto} style={styles.btnSugerencias}>
				<Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18,}}>Sugerencias o Reclamos</Text>
			</TouchableOpacity>

			{/* Modal para visualizar Familias */}
			<Modal visibility={visibilityFamilia}>
					<Text style={{fontWeight: 'bold', color: '#000', fontSize: 18, marginLeft: 20, marginTop: 20, marginBottom: 5}}>
						Categorías
					</Text>

					<TextInput
						style={{
							width: '85%',
							height: 40,
							padding: 5,
							alignSelf: 'center',
							marginBottom: 5,
							marginTop: 5,
							borderBottomWidth: 1,
							borderBottomColor: '#eee'
						}}
						placeholder="Buscar Categorías..."
						onChangeText={(text) =>filtrarFamilia(text)}
						value={searchFamilia}
					/>
					<FlatList
						style={styles.lista}
						data={filteredFamilia}
						keyExtractor={(x) => String(x.id_familia)}
						renderItem={viewFamilia}
					/>
					<TouchableOpacity 
						style={{backgroundColor: 'red', width: '80%', height: 40, alignSelf: 'center', borderRadius: 10, margin: 10, alignItems: 'center', justifyContent: 'center'}}
						onPress={() => setVisibilityFamilia(false)}>
						<Text style={{color: 'white', fontSize:18, fontWeight: 'bold'}}>Cancelar</Text>
					</TouchableOpacity>
			</Modal>

			{/* Modal para visualizar Formulario de Sugerencias */}
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
