angular.module('starter.services', [])
.factory('ValidaVersion', function($http,$ionicPopup,$location,$ionicLoading){
	return {
		verificaVersion: function (version) {
			M.AutoInit();
			info = {
				error: null,
				status: null
			};
			window.loadData("checkVersion",[{"name":"version","value":version}],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
				$ionicLoading.hide();
				if(rDataRespuesta.error!=false){
						info.error=rDataRespuesta.error;
						info.status=false;
						window.alerta(info.error,$ionicPopup);
						$ionicLoading.hide();
				}else{
					info.status=true;
					console.log("VERSION LIB ",version);
				}
			}, function($ionicPopup,rDataError){
				$ionicLoading.hide();
				showError(rDataError,$ionicPopup);
			});
		},isLogged: function () {
			return info;
		}
	}
})
.factory('CargaCatalogosInicio', function($http,$ionicPopup,$location,$ionicLoading){ 
	return {
		cargaInicio: function () {
			M.AutoInit();
			getIMEI();
			getIP();
			if(productosGeneral.length==0){
				window.loadData("todoslosproductos",[],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					productosGeneral=rDataRespuesta;
					$ionicLoading.hide();
				}, function($ionicPopup,rDataError){
					$ionicLoading.hide();
					window.alerta("No se pude establecer comunicacion con la Caja",$ionicPopup);
					showError(rDataError,$ionicPopup);
				});
			}else{
				$ionicLoading.hide();
			}
			aplicacionesGeneral.length=[];
			if(aplicacionesGeneral.length==0){
				window.loadData("obtieneaplicaciones",[],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					aplicacionesGeneral=rDataRespuesta;
					$ionicLoading.hide();
				}, function($ionicPopup,rDataError){
					$ionicLoading.hide();
					window.alerta("No se pude establecer comunicacion con la Caja",$ionicPopup);
					showError(rDataError,$ionicPopup);
				});
			}
			if(formasDePagoGenerales.length==0){
				window.loadData("obtieneformasdepago",[],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					formasDePagoGenerales=rDataRespuesta;
					$ionicLoading.hide();
				}, function($ionicPopup,rDataError){
					$ionicLoading.hide();
					window.alerta("No se pude establecer comunicacion con la Caja",$ionicPopup);
					showError(rDataError,$ionicPopup);
				});
			}
		}	
	}	
})
.factory('Login', function($http,$ionicPopup,$location,$ionicLoading,
			Mesas){ 
	return {
		login: function (password) {
			PASSMAIN=password;
			window.loadData("login",[{"name":"username","value":password}],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null){
						window.alerta("Usuario Incorrecto",$ionicPopup);						
					}else{
						console.log("infoGeneral");
						console.log(infoGeneral);
						infoGeneral=rDataRespuesta;
						//$location.path("/app/mesas/1");
						Mesas.cargaMesasSeccion(1);
					}	
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});
		},
		isLogged: function () {
			var isLogged=true;
			if(!infoGeneral){
				isLogged=false;
			}
			return isLogged;
		}	
	}	
})
.factory('Logout', function($http,$ionicPopup,$location,$ionicLoading,
			Mesas){ 
	return {
		logout: function () {
			infoGeneral=[];
			$location.path("/app/logueo");
		}	
	}	
})
.factory('Configuraciones', function($http,$ionicPopup,$location,$ionicLoading){ 
	return {
		getManejaNombreMesa: function () {
			if(infoGeneral){
				return infoGeneral.manejaNombreMesa
			}
		},
		getUsuarioClaveLogueado: function () {
			if(infoGeneral){
				return infoGeneral.ClaveEmpleado
			}
		},
		getNombreUsuario: function () {
			if(infoGeneral){
				return infoGeneral.NombreEmpleado
			}
		},
		getCierraSesionAlMandarComanda: function () {
			if(infoGeneral){
				return infoGeneral.cierraSesionAlMandarComanda
			}	
		},
		getFiltraMesasXMesero: function () {
			if(infoGeneral){
				return infoGeneral.filtraMesasXMesero
			}
		},
		getHayComentariosPorProducto: function () {
			if(infoGeneral){
				return infoGeneral.hayComentariosPorProducto
			}
		},
		getProductosBloqueados: function () {
			if(infoGeneral){
				return infoGeneral.productosBloqueados
			}	
		},
		getOcultaBotonCuenta: function () {
			if(infoGeneral){
				return infoGeneral.ocultaBotonCuenta
			}	
		},
		getImpideDesbloquearCuentaImpresa: function () {
			if(infoGeneral){
				return infoGeneral.impideDesbloquearCuentaImpresa
			}	
		},
		getManejaDolares: function () {
			if(infoGeneral){
				return infoGeneral.manejaDolares
			}	
		},
		getManejaPrecioBotones: function () {
			if(infoGeneral){
				return infoGeneral.manejaPrecioBotones
			}	
		},
		getNoMostrarClasifiaciones: function () {
			if(infoGeneral){
				return infoGeneral.noMostrarClasifiaciones
			}	
		},	
		getPaquetesIlimitados: function () {
			if(infoGeneral){
				return infoGeneral.paquetesIlimitados
			}	
		},	
		getValidaExistencias: function () {
			if(infoGeneral){
				return infoGeneral.validaExistencias
			}	
		},	
		getNoInicializainterfaz: function () {
			if(infoGeneral){
				return infoGeneral.noinicializainterfazalmandarocmanda
			}	
		},	
		getMostrarCatalogoTerminales: function () {
			if(infoGeneral){
				return infoGeneral.mostrarCatalogoTerminales
			}	
		},	
		getTerminales: function () {
			if(infoGeneral){
				return infoGeneral.terminales
			}	
		},	
		getPreguntaImpresionTicketPago: function () {
			if(infoGeneral){
				return infoGeneral.preguntaporimpresiondepago
			}	
		},	
		getMuestraBotonesPago: function () {
			if(infoGeneral){
				return infoGeneral.habilitapagodesdecomanderamovil
			}	
		},	
		getTipoUsuario: function () {
			if(infoGeneral){
				return infoGeneral.tipoUsuario
			}	
		},	
		getIpspermitidasparacobro: function () {
			if(infoGeneral){
				return infoGeneral.ipspermitidasparacobro
			}	
		},	
		getManejaSubcajero: function () {
			if(infoGeneral){
				return infoGeneral.manejasubcajero
			}	
		},	
		getClaveUsuario: function () {
			if(infoGeneral){
				return infoGeneral.ClaveUsuario
			}	
		},
		getAplicacionesGenerales: function () {
			if(infoGeneral){
				return infoGeneral.aplicacionesGeneral
			}
		},
		getformasDePagoGenerales: function () {
			if(infoGeneral){
				return infoGeneral.formasDePagoGenerales
			}
		},
		esFormaDePagoDisponible: function (idFormaPago) {
			var esOFP=false;
			if(infoGeneral.formasPago.length>0){
				for(var i=0;i<infoGeneral.formasPago.length;i++){
					if(infoGeneral.formasPago[i].claveformadepago == idFormaPago){
						console.log("FORMAS ",infoGeneral.formasPago[i].claveformadepago, " ID SOLICITADA ",idFormaPago);
						esOFP = true;
						return esOFP;
					}
				}
			}
			return esOFP;
		},getConfiguracionTipoVentaClasificacion: function () {
			if(infoGeneral){
				return infoGeneral.ConfiguracionTipoVentaClasificacion
			}
		},getTerminalesPlataformas: function () {
			if(infoGeneral)
				return infoGeneral.terminalesPlataformas;
		},
		getRelacionTerminalesPlataformas: function () {
			if(infoGeneral)
				return infoGeneral.relacionTerminalesPlataformas;
		},
		getValidaClasificaciones: function () {
			if(infoGeneral){
				return infoGeneral.clasificacionesporventa
			}
		}
	}
})
.factory('Comentarios', function($http,$ionicPopup,$location,$ionicLoading){ 
	return {
		getComentariosClasificaciones: function () {
			if(comentariosClasificaciones.length==0){
				var sizeComentarios = window.objectSize(infoGeneral.comentarios);
				for ( var i = 0; i < sizeComentarios; i++ ) {
					comentariosClasificaciones.push({nombre:Object.keys(infoGeneral.comentarios)[i]});
				}
			}
			return comentariosClasificaciones
		},
		getComentarios: function () {
			if(comentarios.length==0){
				var sizeComentarios = window.objectSize(infoGeneral.comentarios);
				for ( var i = 0; i < sizeComentarios; i++ ) {
					var comentartiosXClasificacion=Object.values(infoGeneral.comentarios)[i];
					for ( var j = 0; j < comentartiosXClasificacion.length; j++ ) {
						comentarios.push(comentartiosXClasificacion[j]);
					}	
				}
			}
			return comentarios
		}	
	}	
})
.factory('Secciones', function($http,$ionicPopup,$location){ 
	return {
		cargaSecciones: function () {
			secciones=[{"number":1},{"number":2},{"number":3},{"number":4},{"number":5},{"number":6},{"number":7},{"number":8},{"number":9},{"number":0}];
			return secciones;
		}	
	}	
})

.factory('Mesas', function($http,$ionicPopup,$location,$ionicLoading,Configuraciones,$q){ 
	return {
		cargaMesasSeccion: function (idSeccion) {
			window.loadData("ObtenerMesas",[{"name":"Seccion","value":idSeccion}],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						$location.path('/app/logueo');
					}else{					
						if(Configuraciones.getFiltraMesasXMesero()){
							var mesas=rDataRespuesta.mesas;
							mesasSeccion=[];
							mesasSeccion.mesas=[];
							for(var j=0;j<mesas.length;j++){
								if(mesas[j].estado=="abierto"||mesas[j].estado=="desocupada"){
									mesasSeccion.mesas.push(mesas[j]);
								}else{
									if(parseInt(mesas[j].mesero)==parseInt(infoGeneral.ClaveEmpleado)||parseInt(mesas[j].mesero)==0){
										mesasSeccion.mesas.push(mesas[j]);
									}else if(mesas[j].mesero==""&&mesas[j].tieneSubMesas){
										mesasSeccion.mesas.push(mesas[j]);
									}
								}
							}
						}else{
							mesasSeccion=rDataRespuesta;
						}
						$location.path("/app/mesas/"+idSeccion);
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});
		},
		cargaMesasSecciones: function (secciones) {
			mesasSecciones=[];
			var contador=0;
			for(var k=0;k<secciones.length;k++){
				window.loadData("ObtenerMesas",[{"name":"Seccion","value":secciones[k].number}],
					$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
						$ionicLoading.hide();
						if(rDataRespuesta.error!=null){						
							window.alerta(""+rDataRespuesta.error,$ionicPopup);
							$location.path('/app/logueo');
						}else{
							for(var j=0;j<rDataRespuesta.mesas.length;j++){
								mesasSecciones.push(rDataRespuesta.mesas[j]);
							}	
							
							if(contador==secciones.length-1){
								$location.path("/app/comedor");	
							}
							contador++;	
						}					
					}, function($ionicPopup,rDataError){
						showError(rDataError,$ionicPopup);
				});
			}
		},
		cargaMesasSeccionesRevision: function (seccion,idMesa) {
			var d = $q.defer();
				window.loadData("ObtenerMesas",[{"name":"Seccion","value":seccion}],
					$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
						$ionicLoading.hide();
						if(rDataRespuesta.error!=null){						
							window.alerta(""+rDataRespuesta.error,$ionicPopup);
							$location.path('/app/logueo');
						}else{	
							d.resolve(rDataRespuesta.mesas);
						}					
					}, function($ionicPopup,rDataError){
						showError(rDataError,$ionicPopup);
				});
				return d.promise;

		},
		getMesasSeccion: function () {
			if(mesasSeccion){
				return mesasSeccion.mesas;
			}
		},
		guardaInfoMesa: function (numeroPersonasIngresado,nombreMesaIngresado,numeroAppSeleccionado) {
			numeroPersonas=numeroPersonasIngresado;
			nombreMesa=nombreMesaIngresado;
			appDelivery=numeroAppSeleccionado;
		},
		getNumeroPersonas: function () {
			return numeroPersonas;	
		},
		desocupaMesa: function (mesaSelected,seccionSelected,clavenota) {
			numeroPersonas=0;
			nombreMesa="";
			window.loadData("desocuparmesas",[{"name":"MESA","value":mesaSelected},
			{"name":"seccionSelected","value":seccionSelected},{"name":"clavenota","value":clavenota}],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null&&rDataRespuesta.error!=false){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						$location.path('/app/logueo');
					}else{
						window.loadData("ObtenerMesas",[{"name":"Seccion","value":param[1].value}],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
								$ionicLoading.hide();
								if(rDataRespuesta.error!=null){						
									window.alerta(""+rDataRespuesta.error,$ionicPopup);
									$location.path('/app/logueo');
								}else{
									mesasSeccion=rDataRespuesta;//xxxxxxxxxxxxx
									$location.path("/app/mesas/"+param[0].value);
									
									if(Configuraciones.getFiltraMesasXMesero()){
										var mesas=rDataRespuesta.mesas;
										mesasSeccion=[];
										mesasSeccion.mesas=[];
										for(var j=0;j<mesas.length;j++){
											if(mesas[j].estado=="abierto"||mesas[j].estado=="desocupada"){
												mesasSeccion.mesas.push(mesas[j]);
											}else{
												if(parseInt(mesas[j].mesero)==parseInt(infoGeneral.ClaveEmpleado)||parseInt(mesas[j].mesero)==0){
													mesasSeccion.mesas.push(mesas[j]);
												}else if(mesas[j].mesero==""&&mesas[j].tieneSubMesas){
													mesasSeccion.mesas.push(mesas[j]);
												}
											}
										}
									}else{
										mesasSeccion=rDataRespuesta;
									}
									$location.path("/app/mesas/"+param[0].value);
						
								}					
							}, function($ionicPopup,rDataError){
								showError(rDataError,$ionicPopup);
						});
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});	
		},
		desocupaMesayLogout: function (mesaSelected,seccionSelected,clavenota) {
			numeroPersonas=0;
			nombreMesa="";
			window.loadData("desocuparmesas",[{"name":"MESA","value":mesaSelected},{"name":"seccionSelected","value":seccionSelected}
			,{"name":"clavenota","value":clavenota}],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null&&rDataRespuesta.error!=false){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						$location.path('/app/logueo');
					}else{
						infoGeneral=[];
						$location.path("/app/logueo");
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});	
		},
		desocupaBloqueada: function (mesaSelected,clavenota) {
			numeroPersonas=0;
			nombreMesa="";
			window.loadData("desocuparmesas",[{"name":"MESA","value":mesaSelected},{"name":"clavenota","value":clavenota}	],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null&&rDataRespuesta.error!=false){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						$location.path('/app/logueo');
					}else{
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});	
		},
		desocupaMesaVacia: function (tipoVenta, mesaSelected,estado,seccionSelected,clavenota) {
			numeroPersonas=0;
			nombreMesa="";
			window.loadData("desocuparmesas",[{"name":"MESA","value":mesaSelected},{"name":"tipoVenta","value":tipoVenta},
			{"name":"estado","value":estado},{"name":"seccionSelected","value":seccionSelected},{"name":"clavenota","value":clavenota}	],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null&&rDataRespuesta.error!=false){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						$location.path('/app/logueo');
					}else{
						$location.path("/app/aperturanota/"+param[1].value+"*"+param[0].value+"*"+param[2].value+"*"+param[3].value);
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});	
		},
		getSubMesas: function (idmesa,seccion) {
			window.loadData("obtenersubcuentas",[{"name":"mesa","value":idmesa},{"name":"seccion","value":seccion}],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
				$ionicLoading.hide();
				if(rDataRespuesta.error!=null){						
					window.alerta(""+rDataRespuesta.error,$ionicPopup);
					$location.path('/app/logueo');
				}else{
					subMesas=rDataRespuesta.submesas;
					$location.path('/app/submesas/'+param[0].value+"*"+param[1].value);
				}					
			}, function($ionicPopup,rDataError){
								showError(rDataError,$ionicPopup);
			});
		},
		showSubMesas: function () {
			return subMesas
		},
		showComedor: function () {
			return mesasSecciones
		}		
	}	
})
.factory('Llevar', function($http,$ionicPopup,$location,$ionicLoading){ 
	return {
		getLlevar: function (seccion) {
			window.loadData("obitenenotasllevar",[{"name":"seccion","value":seccion}],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
				$ionicLoading.hide();
				if(rDataRespuesta.error!=null){						
					window.alerta(""+rDataRespuesta.error,$ionicPopup);
					$location.path('/app/logueo');
				}else{
					notasLlevar=rDataRespuesta.secciones;
					$location.path('/app/llevar/'+param[0].value);
				}					
			}, function($ionicPopup,rDataError){
								showError(rDataError,$ionicPopup);
			});
		},
		showLlevar: function () {
			return notasLlevar;
		}		
	}	
})
.factory('Existencias', function($http,$ionicPopup,$location,$ionicLoading,$q){ 
	return {
		validaexistencias: function (nota,tipoventa,claveproducto,cantidad) {
			var notaEnvio = angular.toJson(nota);
			var d = $q.defer();
			window.loadData("validaexistencias",[{"name":"nota","value":notaEnvio},{"name":"CLAVEPRODUCTO","value":claveproducto},
			{"name":"cantidad","value":cantidad},{"name":"TIPOVENTA","value":tipoventa},],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					d.resolve(rDataRespuesta);		
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
					$ionicLoading.hide();
			});	
			return d.promise;
		},
		showLlevar: function () {
			return notasLlevar;
		},
		showDelivery: function (){
			console.log("DELIVERY ",notasDelivery);
			return notasDelivery;
		}		
	}
})
.factory('Nota', function($http,$ionicPopup,$location,$ionicLoading,Mesas,Configuraciones,Logout,$q){ 
	return {
		guardaInfoNota: function (numeroPersonasIngresado,nombreMesaIngresado,numeroAppSeleccionado) {
			numeroPersonas=numeroPersonasIngresado;
			nombreMesa=nombreMesaIngresado;
			appDelivery=numeroAppSeleccionado;
		},
		abreNota: function (idMesa,tipoventa,seccionMesas) {
			window.loadData("despliegamesanota",[{"name":"MESA","value":idMesa},{"name":"TIPOVENTA","value":tipoventa},
			{"name":"seccionMesas","value":seccionMesas},{"name":"numeroMesero","value":infoGeneral.ClaveEmpleado}
			],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						//$location.path('/app/logueo');
					}else{
						informacionNota=rDataRespuesta;
						$location.path("/app/nota/"+param[2].value);
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});
		},
		abreNotaInicio: function (idMesa,tipoventa,seccionMesas) {
			window.loadData("despliegamesanota",[{"name":"MESA","value":idMesa},{"name":"TIPOVENTA","value":tipoventa},
			{"name":"seccionMesas","value":seccionMesas},{"name":"numeroMesero","value":infoGeneral.ClaveEmpleado}
			],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						//$location.path('/app/logueo');
					}else{
						informacionNota=rDataRespuesta;
						//$location.path("/app/nota/"+param[2].value);
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});
		},
		getNota: function () {
			return 	informacionNota;	
		},
		mandaComanda: function (nota,tipoventa,seccion,scopeC) {
			if(nota.nota[0].numero==0){
				nota.nota[0].personas=parseInt(numeroPersonas);
			}
			var notaEnvio = angular.toJson(nota);
			window.loadData("mandaComanda",[{"name":"nota","value":notaEnvio},{"name":"NOMBREMESA","value":nombreMesa},{"name":"TIPOVENTA","value":nota.nota[0].tipoVenta},
					{"name":"seccion","value":seccion},{"name":"idmesa","value":nota.nota[0].mesa},{"name":"APPDELIVERY","value":appDelivery}],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					puedemandarComandaLock=true;	
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null&&rDataRespuesta.error!=false){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						if(rDataRespuesta.error!="La nota no se actualizó \n limpie y vuelva a ingresa \n los productos."){
							reintenta_mandar_comanda($ionicPopup,$ionicLoading,notaEnvio,nombreMesa,tipoventa,seccion,$http,$location,nota,""+rDataRespuesta.error);
						}
					}else{
						numeroPersonas=0;
						nombreMesa="";	
						if(Configuraciones.getCierraSesionAlMandarComanda()){
							Logout.logout();
						}else{
							if(Configuraciones.getNoInicializainterfaz()&&param[2].value==1){
								var idmesaTemp=""+param[4].value;
								if(parseInt(idmesaTemp)>1000){
									idmesaTemp=idmesaTemp.slice(0,idmesaTemp.length-3)+"."+	idmesaTemp.slice(idmesaTemp.length-1,idmesaTemp.length);
								}	
								window.loadData("despliegamesanota",[{"name":"MESA","value":idmesaTemp},{"name":"TIPOVENTA","value":param[2].value},
								{"name":"seccionMesas","value":param[3].value},{"name":"numeroMesero","value":infoGeneral.ClaveEmpleado}
								],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
										$ionicLoading.hide();
										if(rDataRespuesta.error!=null){						
											window.alerta(""+rDataRespuesta.error,$ionicPopup);
										}else{
											informacionNota=rDataRespuesta;
											$location.path("/app/notac/"+param[2].value);
										}
									}, function($ionicPopup,rDataError){
										showError(rDataError,$ionicPopup);
								});
							}else{
								Mesas.cargaMesasSeccion(param[3].value);
							}
						}
					}
				}, function($ionicPopup,rDataError){
					puedemandarComandaLock=true;	
					$ionicLoading.hide();
					reintenta_mandar_comanda($ionicPopup,$ionicLoading,notaEnvio,nombreMesa,tipoventa,seccion,$http,$location,nota,"");
				});	
		},
		mandaComandaPago: function (nota,tipoventa,seccion) {
			if(nota.nota[0].numero==0){
				nota.nota[0].personas=parseInt(numeroPersonas);
			}
			var notaEnvio = angular.toJson(nota);
			var d = $q.defer();
			window.loadData("mandaComanda",[{"name":"nota","value":notaEnvio},{"name":"NOMBREMESA","value":nombreMesa},{"name":"TIPOVENTA","value":nota.nota[0].tipoVenta},
			{"name":"seccion","value":seccion},{"name":"idmesa","value":nota.nota[0].mesa}],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
				$ionicLoading.hide();
				d.resolve(rDataRespuesta);						
			}, function($ionicPopup,rDataError){
				$ionicLoading.hide();
				reintenta_mandar_comanda($ionicPopup,$ionicLoading,notaEnvio,nombreMesa,tipoventa,seccion,$http,$location,nota,"");
			});	
			return d.promise;		
		},
		/**
		 * 
		 * @param {*} nota información general de la nota
		 * @param {*} pagoEfectivo pago a realizar
		 * @param {*} cambio cambio según el monto proporcionado por el cliente
		 * @param {*} pagoOtraMoneda booleano que define si es pago de otra moneda diferente a pesos
		 * @param {*} subcajero subcajero realcionado
		 * @param {*} seccion sección de restaurante correspondiente a la mesa
		 * @param {*} imprime variable qbooleana que indica si se imprimrá el ticket
		 * 
		 * @param {*} ipEquipo variable que no se recibe, pero que se extrae de esta clase para enviar el ID 
		 * de la comandera que está manando la impresión
		 */		
		pagaEfectivo: function (nota,pagoEfectivo,cambio,pagoOtraMoneda,subcajero,seccion,imprime) {
			var notaEnvio = angular.toJson(nota);
			window.loadData("pagoEfectivo",[{"name":"nota","value":notaEnvio},{"name":"pagoEfectivo","value":pagoEfectivo},{"name":"cambio","value":cambio},
					{"name":"pagoOtraMoneda","value":pagoOtraMoneda},{"name":"subcajero","value":subcajero},{"name":"seccion","value":seccion},{"name":"imprime","value":imprime},
					{"name":"ipEquipo","value":ipEquipo}
					],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					//$location.path('/app/logueo');			
					numeroPersonas=0;
					nombreMesa="";	
					if(rDataRespuesta.msg != ""){
						window.alerta(""+rDataRespuesta.msg,$ionicPopup);
					}	
					if(Configuraciones.getCierraSesionAlMandarComanda()){
						Logout.logout();
					}else{
						Mesas.cargaMesasSeccion(param[5].value);
					}
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
				});	
		},
		/**
		 * función encargada de envíar la nota y el pago a la caja
		 * 
		 * @param {*} nota información general de la nota
		 * @param {*} pago pago a realizar
		 * @param {*} propina cantidad de propina integrada en el pago de tarjeta
		 * @param {*} claveterminal clave de terminal relacionada a la nota
		 * @param {*} autorizacionTarjeta 4 digitos ultimos de la tarjeta con que se pago
		 * @param {*} creditodebito tipo de tarjeta, credito o debito
		 * @param {*} subcajero Subcajero relacionado
		 * @param {*} seccion sección de restaurante correspondiente a la mesa
		 * @param {*} imprime variable qbooleana que indica si se imprimrá el ticket
		 * 
		 * @param {*} ipEquipo variable que no se recibe, pero que se extrae de esta clase para enviar el ID 
		 * de la comandera que está manando la impresión
		 */		
		pagaTarjeta: function (nota,pago,propina,claveterminal,autorizacionTarjeta,creditodebito,subcajero,seccion,imprime) {
			var notaEnvio = angular.toJson(nota);
			window.loadData("pagoTarjeta",[{"name":"nota","value":notaEnvio},{"name":"pago","value":pago},{"name":"propina","value":propina},
					{"name":"claveterminal","value":claveterminal},{"name":"tipoTarjeta","value":parseInt(claveterminal)},
					{"name":"autorizacionTarjeta","value":autorizacionTarjeta},{"name":"creditodebito","value":creditodebito},
					{"name":"subcajero","value":subcajero},{"name":"seccion","value":seccion},{"name":"imprime","value":imprime},{"name":"ipEquipo","value":ipEquipo}],
						$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					//$location.path('/app/logueo');		
					numeroPersonas=0;
					nombreMesa="";	
					if(rDataRespuesta.msg != ""){
						window.alerta(""+rDataRespuesta.msg,$ionicPopup);
					}				
					if(Configuraciones.getCierraSesionAlMandarComanda()){
						Logout.logout();
					}else{
						Mesas.cargaMesasSeccion(param[8].value);
					}
					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
				});	
		},
		propinaLimite: function (total,propina) {
			var d = $q.defer();	
			window.loadData("propinaExcedeLimite",[{"name":"total","value":total},{"name":"propina","value":propina}],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					d.resolve(rDataRespuesta);				
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
				});
			return d.promise;		
		},
		/**
		 * 
		 * @param {*} numeronota numero de la nota a imprimir 
		 * @param {*} seccion sección donde se encuentra la nota y su información
		 * 
		 * @param {*} ipEquipo variable que no se recibe, pero que se extrae de esta clase para enviar el ID 
		 * de la comandera que está manando la impresión
		 */		
		imprimeCuenta: function (numeronota,seccion) {
			window.loadData("pedircuenta",[{"name":"nota","value":numeronota},{"name":"seccion","value":seccion},{"name":"ipEquipo","value":ipEquipo}],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					if(rDataRespuesta.error!=null&&rDataRespuesta.error!=false){						
						window.alerta(""+rDataRespuesta.error,$ionicPopup);
						$location.path('/app/logueo');
					}else{
						if(rDataRespuesta.msg != ""){
							window.alerta(""+rDataRespuesta.msg,$ionicPopup);
						}
						Mesas.cargaMesasSeccion(param[1].value);
					}					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});	
		},
		puedemandarcomanda: function (mesa,mesero,nota,comanda) {
			var d = $q.defer();
			window.loadData("puedemandarcomanda",[{"name":"mesa","value":mesa},{"name":"mesero","value":mesero},{"name":"NOTA","value":nota},{"name":"comanda","value":comanda}],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					$ionicLoading.hide();
					d.resolve(rDataRespuesta);					
				}, function($ionicPopup,rDataError){
					showError(rDataError,$ionicPopup);
			});	
			return d.promise;
		}			
	}	
})
.factory('Clasificaciones', function($http,$ionicPopup,$location){ 
	return {
		cargaClasificaciones: function () {
			clasificaciones=[{"claveclasificacion":1,"descripcion":"PROMOS"},{"claveclasificacion":2,"descripcion":"SNACKS"},
				{"claveclasificacion":3,"descripcion":"CHICKEN WINGS"},{"claveclasificacion":4,"descripcion":"DOGS"},
				{"claveclasificacion":5,"descripcion":"PASTA & SALAD"},{"claveclasificacion":6,"descripcion":"RIBS & STICKS"},
				{"claveclasificacion":7,"descripcion":"BEER GARDEN"},{"claveclasificacion":8,"descripcion":"BURGERS"},
				{"claveclasificacion":9,"descripcion":"COCTELERIA"},{"claveclasificacion":10,"descripcion":"KIDS"}];
			return clasificaciones;
		},
		esClasificacionesBloqueada: function (claveClasificacion) {
			var esClasificacionBloqueada=false;
			if(infoGeneral.noMostrarClasifiaciones){
				Object.keys(infoGeneral.noMostrarClasifiaciones).forEach(function (item) {
					if(item==claveClasificacion){
						esClasificacionBloqueada=true;
					}
				});
			}
			return esClasificacionBloqueada;
		},
		esTipoVentaClasificacion: function (claveClasificacion,scope) {
			var esTipoVentaClasificacion=false;
			if(infoGeneral.configuracionTipoVentaClasificacion){
				if(infoGeneral.configuracionTipoVentaClasificacion.length>0){
					for(var i=0;i<infoGeneral.configuracionTipoVentaClasificacion.length;i++){
						if(infoGeneral.configuracionTipoVentaClasificacion[i].idventa == scope){
							if(infoGeneral.configuracionTipoVentaClasificacion[i].nombreclasificacion==claveClasificacion){
								esTipoVentaClasificacion = true;
								return esTipoVentaClasificacion;
							}
						}
					}
				}
			}
			return esTipoVentaClasificacion;
		}
	}	
})
.factory('Productos', function($http,$ionicPopup,$location,Configuraciones){ 
	return {
		cargaProductos: function () {
			productos=[{"claveproducto":1,"descripcion":"PRODUCTO DESC1","precio":10},{"claveproducto":2,"descripcion":"PRODUCTO DESC2","precio":20},
				{"claveproducto":3,"descripcion":"PRODUCTO DESC3","precio":30},{"claveproducto":4,"descripcion":"PRODUCTO DESC4","precio":40},
				{"claveproducto":5,"descripcion":"PRODUCTO DESC5","precio":50},{"claveproducto":6,"descripcion":"PRODUCTO DESC6","precio":60},
				{"claveproducto":7,"descripcion":"PRODUCTO DESC7","precio":70},{"claveproducto":8,"descripcion":"PRODUCTO DESC8","precio":80},
				{"claveproducto":9,"descripcion":"PRODUCTO DESC9","precio":90},{"claveproducto":10,"descripcion":"PRODUCTO DESC10","precio":100},
				{"claveproducto":11,"descripcion":"PRODUCTO DESC11","precio":110},{"claveproducto":12,"descripcion":"PRODUCTO DESC12","precio":120},
				{"claveproducto":13,"descripcion":"PRODUCTO DESC13","precio":130},{"claveproducto":14,"descripcion":"PRODUCTO DESC14","precio":140}];
			return productos;
		},
		getProductos: function () {
			return productosGeneral.productos;
		},
		esProductoBloqueado: function (claveProducto) {
			var esproductoBloqueado=false;
			if(infoGeneral.productosBloqueados){
				Object.keys(infoGeneral.productosBloqueados).forEach(function (item) {
					if(item==claveProducto){
						esproductoBloqueado=true;
					}
				});
			}
			return esproductoBloqueado;
		},
		esPaqueteIlimitado: function (clavePaquete) {
			if(paquetesIlimitados){
				for ( var i = 0; i < infoGeneral.paquetesIlimitados.length; i++ ) {
					var n = infoGeneral.paquetesIlimitados[i].indexOf("[");
					if(n!=-1){
						var paquete=infoGeneral.paquetesIlimitados[i].slice(0, n);
						var tiemposPaquete=infoGeneral.paquetesIlimitados[i].slice(n+1, infoGeneral.paquetesIlimitados[i].length-1).split(";");
						tiemposIlimitados[paquete]=tiemposPaquete;
						paquetesIlimitados.push(paquete);
					}else{
						paquetesIlimitados.push(infoGeneral.paquetesIlimitados[i]);
					}
				}
			}
			var esproductoIlimitado=false;
			for ( var i = 0; i < paquetesIlimitados.length; i++ ) {
				if(paquetesIlimitados[i]==clavePaquete){
					esproductoIlimitado=true;
				}
			}
			return esproductoIlimitado;
		},
		esTiempoIlimitado: function (clavePaquete,tiempo) {
			var esTiempoIlimitado=false;
			Object.keys(tiemposIlimitados).forEach(function (item) {
				if(item==clavePaquete){
					var tiempos=tiemposIlimitados[item]
					for ( var i = 0; i < tiempos.length; i++ ) {
						if(tiempos[i]==tiempo){
							esTiempoIlimitado=true;
						}
					}
				}
			});
			return esTiempoIlimitado;
		},
		tieneTiempoIlimitado: function (clavePaquete) {
			var tieneTiempoIlimitado=false;
			Object.keys(tiemposIlimitados).forEach(function (item) {
				if(item==clavePaquete){
					tieneTiempoIlimitado=true;
				}
			});
			return tieneTiempoIlimitado;
		},
		getProductoByClave: function (claveProducto) {
			var producto=[];
			for ( var i = 0; i < productosGeneral.productos.length; i++ ) {
				if(productosGeneral.productos[i].claveproducto==claveProducto){
					producto=angular.copy(productosGeneral.productos[i]);
				}
			}
			return producto;
		},
		getProductoCompletoByClave: function (claveProducto) {
			var producto=[];
			for ( var i = 0; i < productosGeneral.productos.length; i++ ) {
				if(productosGeneral.productos[i].claveproducto==claveProducto){
					producto=angular.copy(productosGeneral.productos[i]);
					break;
				}else if (productosGeneral.productos[i].productos.length>0){
					producto=findProducto(productosGeneral.productos[i].productos,claveProducto,angular);
				}
				if(producto.claveproducto){
					break;
				}	
			}
			return producto;
		},
		esTipoVentaProducto: function (clasificacion,scope,claveproducto) {
			var esTipoVentaProducto=false;
			if(claveproducto.toString().indexOf(".")){
				return true;
			}
			if(infoGeneral.configuracionTipoVentaClasificacion){
				if(infoGeneral.configuracionTipoVentaClasificacion.length>0){
					for(var i=0;i<infoGeneral.configuracionTipoVentaClasificacion.length;i++){
						if(infoGeneral.configuracionTipoVentaClasificacion[i].idventa == scope){
							if(infoGeneral.configuracionTipoVentaClasificacion[i].nombreclasificacion==clasificacion){
								esTipoVentaProducto = true;
								return esTipoVentaProducto;
							}
						}
					}
				}
			}
			return esTipoVentaProducto;
		}
	}	
})
.factory('Screen', function($http,$ionicPopup,$location,$ionicLoading){
	return {
		getDevice: function () {
				var ancho=window.innerWidth;
				if(ancho>1024){
					return 'desktop';
				}else if(ancho>=500&&ancho<=1024){
					return 'tablet';
				}else{
					return 'phone';
				}
		},
		getBackground: function () {
			console.log(RUTAIMAGENES+"fondo-transparencia.png");
			return RUTAIMAGENES+"fondo-transparencia.png";
		}
	}	
})
.factory('Delivery', function($http,$ionicPopup,$location,$ionicLoading,Configuraciones,$q){
	return {
		getDelivery: function (secciones) {
			window.loadData("obtienenotasdelivery",[{"name":"secciones","value":secciones}],
				$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
				$ionicLoading.hide();
				if(rDataRespuesta.error!=null){
					window.alerta(""+rDataRespuesta.error,$ionicPopup);
					$location.path('/app/logueo');
				}else{
						window.loadData("obtieneaplicaciones",[],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
							aplicacionesGeneral=rDataRespuesta;
							$ionicLoading.hide();
						}, function($ionicPopup,rDataError){
							$ionicLoading.hide();
							window.alerta("No se pude establecer comunicacion con la Caja",$ionicPopup);
							showError(rDataError,$ionicPopup);
						});
					notasDelivery=rDataRespuesta.secciones;
					$location.path('/app/delivery/'+param[0].value);
				}
			}, function($ionicPopup,rDataError){
								showError(rDataError,$ionicPopup);
			});
	},
		showDelivery: function () {
			return notasDelivery;
		},
		showApps: function () {
				window.loadData("obtieneaplicaciones",[],$http,[$ionicPopup],function($ionicPopup,rDataRespuesta,param){
					aplicacionesGeneral=rDataRespuesta;
					$ionicLoading.hide();
				}, function($ionicPopup,rDataError){
					$ionicLoading.hide();
					window.alerta("No se pude establecer comunicacion con la Caja",$ionicPopup);
					showError(rDataError,$ionicPopup);
				});
			return aplicacionesGeneral;
		}
	}
})
.factory('Aplicaciones', function($http,$ionicPopup,$location){
	return {
		getAplicaciones: function () {
			return aplicacionesGeneral.aplicaciones;
		}
	}
})
;
Array.prototype.sum = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
}
var infoGeneral,mesasSeccion,informacionNota;
var productosGeneral=[];
var seccionSeleccionada=1;
var COMEDOR=1;
var numeroPersonas=0;
var nombreMesa="";
var comentarios=[];
var comentariosClasificaciones=[];
var subMesas=[];
var notasLlevar=[];
var mesasSecciones=[];
var paquetesIlimitados=[];
var tiemposIlimitados={};
var PASSMAIN="";
var poppupReenvio;
var IMEI="";
// Para debug
var IP='localhost';
var PUERTO='8000';
//var url = 'http://'+IP+':'+PUERTO+'/app/' +  Math.random(); // Debug
// Productivo
var url = '../app/';

var RUTAIMAGENES=IP+":"+PUERTO+"/cmdImgs/";
var aplicacionesGeneral=[];
var appDelivery="";
var notasDelivery=[];
var formasDePagoGenerales = [];
var ipEquipo = "";

window.loadData = function(method, params, http, args, eFunc, errorFunc){
				var request = new Object();
				request.method=method;
				request.params=params;
				//var tempUrl = 'http://'+IP+':'+PUERTO+'/app/' +  Math.random();
				//http({method: 'post', url:tempUrl,
				request.params.push({"name":"IMEI","value":IMEI});
				http({method: 'post', url:url, // Productivo
						headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},cache: false,
						data:generaXML(request),timeout: 90000}).success(function(responseData) {
						if (responseData.ErrorCode){
							args.push(responseData);
							args.push(params);
							errorFunc.apply(this, args);

						}else{
							if (eFunc){
								args.push(responseData);
								args.push(params);
								eFunc.apply(this, args);
							}
						}
					}).error(function(err) {
						if (errorFunc){
							args.push({ErrorCode:"-00001",ErrorDescription:"Error de Conexión",ErrorName:"Error de Conexión"});
							errorFunc.apply(this, args);
						}

					});

}
window.alerta=function(mensaje, $ionicPopup){
		var alertPopup = $ionicPopup.alert({title: "Aviso",template: mensaje});
		alertPopup.then(function(res) {});
}
window.objectSize= function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}
function generaXML(request) {
	//console.log('generaXML request',request);
	var xmlinfo="";
	//console.log('generaXML request.method',request.method);
	xmlinfo="<request><method><![CDATA["+request.method+"]]></method><params>";
	//console.log('generaXML request.params',request.params);
	for(var jj=0;jj<request.params.length;jj++){
		//console.log('generaXML jj',jj,' request.params[jj]',request.params[jj]);
		xmlinfo=xmlinfo+"<param><name><![CDATA["+request.params[jj].name+"]]></name><value><![CDATA["+request.params[jj].value+"]]></value></param>";
	}
	xmlinfo=xmlinfo+"</params></request>";
	//console.log(xmlinfo);
	return encodeURIComponent(xmlinfo);
}
function reintenta_mandar_comanda(ionicPopup,ionicLoading,notaEnvio,nombreMesa,tipoventa,seccion,http,locationi,nota,mensaje) {
	console.log('reintenta_mandar_comanda 1 notaEnvio',notaEnvio);
	poppupReenvio = ionicPopup.show({
		cssClass:'estructurapaquete',
		template:"<h1>"+mensaje+"</h1>",
		title: '¿Reintentar?',
		buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {poppupReenvio.close();}},
			{text: '<b>OK</b>',type: 'button-positive',
				onTap: function(e) {
				ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Enviando comanda.</p>'});							
					window.loadData("login",[{"name":"username","value":PASSMAIN}],http,[ionicPopup],
						function(ionicPopup,rDataRespuesta,param){
							
							
							window.loadData("despliegamesanota",[{"name":"MESA","value":nota.nota[0].mesa},{"name":"TIPOVENTA","value":tipoventa},
							{"name":"seccionMesas","value":seccion},{"name":"numeroMesero","value":infoGeneral.ClaveEmpleado}
							],http,[ionicPopup],function(ionicPopup,rDataRespuestades){
								//console.log('reintenta_mandar_comanda 0 rDataRespuestades',rDataRespuestades);
								/*console.log('reintenta_mandar_comanda 0 rDataRespuestades.productos',rDataRespuestades.productos);
								console.log('reintenta_mandar_comanda 0 rDataRespuestades.productos.length',rDataRespuestades.productos.length);
								for ( var j = 0; j < rDataRespuestades.productos.length; j++ ) {	
									console.log('j rDataRespuestades.productos[j]',rDataRespuestades.productos[j]);
								}*/
									if(rDataRespuestades.error!=null){		
										poppupReenvio.close();
										ionicLoading.hide();
										//console.log('reintenta_mandar_comanda 2 notaEnvio',notaEnvio);
										reintenta_mandar_comanda(ionicPopup,ionicLoading,notaEnvio,nombreMesa,tipoventa,seccion,http,locationi,nota,""+rDataRespuestades.error);
										//$location.path('/app/logueo');
									}else{
										//console.log('reintenta_mandar_comanda rDataRespuestades',rDataRespuestades);
										/*var notaN= new Object();
										
										notaN.nota=new Object();
										notaN.comentarioComanda=new Object();
										notaN.vComentariosDescripcion=new Object();
										notaN.vComentariosFechas=new Object();
										notaN.productos=[];
										
										notaN.nota=rDataRespuestades.nota;
										notaN.comentarioComanda=rDataRespuestades.comentarioComanda;
										notaN.vComentariosDescripcion=rDataRespuestades.vComentariosDescripcion;
										notaN.vComentariosFechas=rDataRespuestades.vComentariosFechas;
										
										for ( var j = 0; j < rDataRespuestades.productos.length; j++ ) {	
											//console.log('j rDataRespuestades.productos[j]',rDataRespuestades.productos[j]);
											notaN.productos.push(rDataRespuestades.productos[j]);
										}*/
										var notaN=rDataRespuestades;
										console.log('reintenta_mandar_comanda notaN',notaN);
										for ( var j = 0; j < nota.productos.length; j++ ) {												
											if(nota.productos[j].comanda==0){
												console.log('j nota.productos[j]',nota.productos[j]);
												notaN.productos.push(nota.productos[j]);
											}
										}
										//console.log('CON PRODUCTOS NUEVOS notaN',notaN);
										var notaEnvioR = angular.toJson(notaN);
										//console.log('reintenta_mandar_comanda notaEnvioR',notaEnvioR);
										
										window.loadData("mandaComanda",[{"name":"nota","value":notaEnvioR},{"name":"NOMBREMESA","value":nombreMesa},
												{"name":"TIPOVENTA","value":tipoventa},{"name":"seccion","value":seccion}],
												http,[ionicPopup],function(ionicPopup,rDataRespuesta,param){
													ionicLoading.hide();
													locationi.path('/app/logueo');				
											}, function(ionicPopup,rDataError){
												ionicLoading.hide();
												console.log('reintenta_mandar_comanda 3 notaEnvio',notaEnvio);
												reintenta_mandar_comanda(ionicPopup,ionicLoading,notaEnvio,nombreMesa,tipoventa,seccion,http,locationi,nota,"");			
											});	
									}					
								}, function($ionicPopup,rDataError){
									showError(rDataError,$ionicPopup);
							});	
									
									
						}, function(ionicPopup,rDataError){									
								ionicLoading.hide();
								console.log('reintenta_mandar_comanda 4 notaEnvio',notaEnvio);
								reintenta_mandar_comanda(ionicPopup,ionicLoading,notaEnvio,nombreMesa,tipoventa,seccion,http,locationi,nota,"");	
						});																													
				}
			}
		]
	 });
}
function getIMEI() {
	//console.log('IMEI',IMEI);
	if(!IMEI){
		IMEI= '_' + Math.random().toString(36).substr(2, 9);
		console.log('IMEI',IMEI);
	}
}
/**
 * Función que se encarga de recuperar el ID de inicio de la comandera móvil
 * Si no existe un valor en la memoria del navegador uuidU, lo genera
 */
function getIP(){
	if(localStorage.getItem("uuidU")){
		ipEquipo = localStorage.getItem("uuidU");
	}else{
		ipEquipo=window.guid();
	}
}
function findProducto(productos,claveProducto,angular) {
	var producto=[];
	//console.log('productos',productos);
	for ( var i = 0; i < productos.length; i++ ) {
		if(productos[i].claveproducto==claveProducto){
			producto=angular.copy(productos[i]);
			break;
		}else if (productos[i].productos.length>0){
			producto=findProducto(productos[i].productos,claveProducto,angular);
			if(producto.claveproducto){
				break;
			}	
		}	
	}
	return producto;
}	