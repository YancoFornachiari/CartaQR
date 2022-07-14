import React, { useState } from 'react';
import { TextInput, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, } from 'react-native';
import Modal from '../components/Modal';
import FamiliaProducto from './FamiliaProducto';

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
	action: {
		backgroundColor: '#eee',
		width: '90%',
		height: 50,
		alignSelf: 'center',
		padding: 10,
		borderRadius: 5,
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
	contFamilia: {
		height: '70%',
		padding: 10,
		margin: 10,
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
	const [visibilityContacto, setVisibilityContacto] = useState(false);

	// Hooks Contacto //
	const [nombreCliente, setNombreCliente] = useState('');
	const [telefonoCliente, setTelefonoCliente] = useState('');
	const [correoCliente, setCorreoCliente] = useState('');
	const [observacionCliente, setObservacion] = useState('');

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

			<FamiliaProducto />

			{/* Botón de Sugerencias */}
			<TouchableOpacity onPress={handlePressContacto} style={styles.btnSugerencias}>
				<Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18,}}>Sugerencias o Reclamos</Text>
			</TouchableOpacity>

			

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
