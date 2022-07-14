import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TextInput, StyleSheet, Text, View, FlatList, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import Modal from '../components/Modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AccordionListItem from '../components/AccordionListItem';

const styles = StyleSheet.create({
    icon: {
        height: 24,
        width: 24,
    },
    textFamilia: {
        fontWeight: 'bold',
        fontSize: 15,
        flex: 10,
    },
    lista: {
        width: '90%',
        alignSelf: 'center',
    },
    list: {
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#eee',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'center',
        marginHorizontal: 10,
        marginVertical: 5
    },
    btnList: {
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#eee',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'center',
        marginVertical: 5,
        marginHorizontal: 27,
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
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        padding: 10,
    },
});

export default () => {
    const [productoFamilia, setProductoFamilia] = useState([]);
    const [filterProductoFamilia, setFilterProductoFamilia] = useState()

    const [visibilityFamilia, setVisibilityFamilia] = useState(false);
    // Hooks Productos //
    const [searchProducto, setSearchProducto] = useState('');
    const [filteredProducto, setFilteredProducto] = useState([]);
    const [producto, setProducto] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState([]);
    // Hooks Familia //
    const [searchFamilia, setSearchFamilia] = useState('');
    const [familia, setFamilia] = useState([]);
    const [familia2, setFamilia2] = useState([]);
    const [filteredFamilia, setFilteredFamilia] = useState([]);
    const [selectedFamilia, setSelectedFamilia] = useState({ nombre_familia: 'Seleccione una Categoría...' });

    //Llenado de  FlatList Familia
    const fetchFamilia = async () => {
        if (selectedFamilia.id_familia == null) {

            await fetch('http://192.168.1.129:4000/familia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setFamilia(data);
                    setFamilia2(data);
                });
        } else {
            const json = JSON.stringify({ idFamilia: selectedFamilia.id_familia });

            await fetch('http://192.168.1.129:4000/familia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: json,
            })
                .then((response) => response.json())
                .then((data) => {
                    setFamilia(data);
                });
        }
    };

    //Llenado de  FlatList Producto
    const fetchProduct = async () => {
        if (selectedFamilia.id_familia == null) {
            const json = JSON.stringify({ idFamilia: 1 });

            await fetch('http://192.168.1.129:4000/producto', {
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

            await fetch('http://192.168.1.129:4000/producto', {
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

    // const traerFamiliasyProductos = async () => {
    //     await fetch('http://192.168.1.129:4000/allFamilia', {
    //         method: 'POST',
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             for (let i = 0; i < data.length; i++) {
    //                 //console.log(data[i].nombre_familia)
    //             }
    //         });
    // };



    useEffect(() => {
        fetchProduct();
        fetchFamilia();
        //traerFamiliasyProductos();
        return () => {
            setProducto([]);
            setFamilia([]);
        }
    }, [selectedFamilia, selectedProducto]);

    //Funcion para Seleccionar Familia
    const handleSelectedFamilia = (item) => {
        setSelectedFamilia(item);
        setVisibilityFamilia(false);
    };

    const handleAllFamilias = () => {
        fetchFamilia();
        setSelectedFamilia({ nombre_familia: 'Seleccione una Categoría...' });
        setVisibilityFamilia(false);
    }

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
            nombreProducto: {
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 5,
            },
            desProducto: {
                fontStyle: 'italic',
                fontSize: 15,
            },
            precioProd: {
                color: '#58b543',
                fontSize: 15,
                fontWeight: 'bold',
            }
        })

        return (
            <Animated.View style={styles.productList}>
                <Text style={prodListStyle.nombreProducto}>{item.nombre_producto}</Text>
                <Text style={prodListStyle.desProducto}>{item.desc_producto}</Text>
                <Text style={prodListStyle.precioProd}>${item.precio_producto}</Text>
            </Animated.View>
        );
    }

    //Barra de búsqueda Familia
    const filtrarFamilia = (text) => {
        if (text) {
            console.log(text);
            const newData = familia2.filter((item) => {
                const itemData = item.nombre_familia.toUpperCase();
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setFilteredFamilia(newData);
            setSearchFamilia(text);
        } else {
            setFilteredFamilia(familia2);
            setSearchFamilia(text);
        }
    };

    //Funciones para abrir y cerrar modales
    const handlePressFamilia = () => {
        setVisibilityFamilia(true);
        filtrarFamilia('');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
            {/* Botón Seleccionar Familia */}
            <TouchableOpacity onPress={handlePressFamilia} style={styles.btnContFamilia}>
                <Text style={styles.textFamilia}>{selectedFamilia.nombre_familia}</Text>
                <AntDesign name="caretdown" color="#58b543" style={{ flex: 1 }} />
            </TouchableOpacity>

            <FlatList
                data={familia}
                key={(x) => x.nombre_familia}
                keyExtractor={(x) => String(x.nombre_familia)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <AccordionListItem title={item.nombre_familia}>
                        <FlatList
                            data={producto}
                            key={(x) => x.nombre_producto}
                            keyExtractor={(x) => String(x.nombre_producto)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={viewProducto}
                        />
                    </AccordionListItem>
                )}
            />

            {/* Alternar colores en listas style={{ backgroundColor: index % 2 === 0 ? '#000' : 'white' , borderRadius: 10}} */}
            {/* Lista Productos por Categoría */}
            {/* <FlatList
				data={familia}
                key={(x) => x.nombre_familia}
                keyExtractor={(x) => String(x.nombre_familia)}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item, index }) => (
					<View>
						<View >
							<Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.nombre_familia}</Text>
						</View>

						<FlatList
							data={producto}
							keyExtractor={(x) => String(x.id_producto)}
                            showsHorizontalScrollIndicator={false}
							renderItem={viewProducto }
						/>
					</View>
				)}
			/> */}

            {/* Modal para visualizar Familias */}
            <Modal visibility={visibilityFamilia}>
                <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 18, marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
                    Categorías
                </Text>
                <TouchableOpacity>
                    <TextInput
                        autoFocus={false}
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
                        onChangeText={(text) => filtrarFamilia(text)}
                        value={searchFamilia}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleAllFamilias()}>
                    <Text style={styles.btnList}>Todas Las Categorías</Text>
                </TouchableOpacity>

                <FlatList
                    style={styles.lista}
                    data={filteredFamilia}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(x) => String(x.id_familia)}
                    renderItem={viewFamilia}
                />

                <TouchableOpacity
                    style={{ backgroundColor: 'red', width: '80%', height: 45, alignSelf: 'center', borderRadius: 10, marginHorizontal: 10, marginVertical: 15, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => setVisibilityFamilia(false)}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Cancelar</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}