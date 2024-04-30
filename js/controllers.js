angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('Logueo', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
			ValidaVersion,CargaCatalogosInicio,Login,Screen,Configuraciones,Aplicaciones) {
	vista="";	
	$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Verificando Versión.</p>'});
	ValidaVersion.verificaVersion(versionSistema);
	$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando catalogos.</p>'});					
	CargaCatalogosInicio.cargaInicio();
	window.eliminacookies();
	$scope.data = {};
	$scope.background=Screen.getBackground();
	$scope.versionSistema=versionSistema;
	if(localStorage.getItem("uuidU")){
		$scope.uuidU = localStorage.getItem("uuidU");
	}else{
		$scope.uuidU=window.guid();
	}
	$scope.data.password="";
	
	$scope.ingresaDigito = function(digito) {
		$scope.data.password=$scope.data.password+digito;
	};
	$scope.limpiaPassword = function() {
		$scope.data.password="";
	};
	$scope.ingresaPassword = function() {
		info = ValidaVersion.isLogged();
		if(info.status){
			$ionicLoading.show({template: '<i class="icon icon ion-person" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Iniciando sesion.</p>'});
			Login.login($scope.data.password);
		}else {
			window.alerta(info.error ? info.error : "El sistema no permitirá inicio de sesión debido a que no es la misma version que el sistema de caja",$ionicPopup);
		}
	};
})
.controller('Mesas', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
	Secciones,Configuraciones,Screen,Mesas,Nota,Llevar,Login,Logout,Productos,Aplicaciones,Delivery) {
	vista="";
	if(Configuraciones.getManejaSubcajero()&&Configuraciones.getTipoUsuario()>""){
		subcajeroMain=Configuraciones.getClaveUsuario();
	}	
	if(!Login.isLogged()){
		Logout.logout();
		return;
	}
	$scope.background=Screen.getBackground();
	if(notarevisar!=-1){
		Mesas.desocupaBloqueada(notarevisar,notarevisar);
	}
	if(contenidoNota){
		contenidoNota.close();
	}
	if(comentariosPop){
		comentariosPop.close();
	}
	if(poppupPaquete){
		poppupPaquete.close();
	}
	
	
	$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesas.</p>'});							
	$scope.seccionMesasSelected = $stateParams.param;
	$scope.getDevice=Screen.getDevice();	
	$scope.usuarioLogueado =Configuraciones.getNombreUsuario();
	$scope.data = {};
	$scope.secciones=Secciones.cargaSecciones();
	$scope.mesas=Mesas.getMesasSeccion();
	$scope.formaspago = Configuraciones.esFormaDePagoDisponible(8);
	if($scope.formaspago){
		$scope.muestrabotondelivery=Configuraciones.getAplicacionesGenerales;
	}
	$ionicLoading.hide();
	$scope.getFila = function(index,cantidad) {
  		if((parseInt(index)%cantidad)==0){
  			return true;
  		}else{
  			return false;
  		}
  	}
	$scope.getEstadoColor = function(estado,mesa) {
  		if(estado=='abierto'&&!mesa.tieneSubMesas){
  			return 'border-color: #19B309 !important;color: #19B309 !important;';
  		}else if(estado=='ocupado'||mesa.tieneSubMesas){
  			return 'border-color: #e60000 !important;color: #e60000 !important;';
  		}else if(estado=='cuenta'){
  			return 'border-color: #DBA901 !important;color: #DBA901 !important;';
  		}
		else if(estado=='desocupada'){
  			return 'border-color: #19B309 !important;color: #19B309 !important;';
  		}
  	}
	$scope.getSeccionColor = function(idSeccion) {
  		if(parseInt(idSeccion)==parseInt($scope.seccionMesasSelected)){
  			return 'border-color: #387ef5 !important;color: #387ef5 !important;';
  		}else {
  			return 'border-color: #fff !important;color: #fff !important;';
  		}
  	}
	$scope.getSeccionColorPhone = function(idSeccion) {
  		if(parseInt(idSeccion)==parseInt($scope.seccionMesasSelected)){
  			return 'border-color: #387ef5 !important;color: #387ef5 !important;width:25%;';
  		}else {
  			return 'border-color: #fff !important;color: #fff !important;width:25%;';
  		}
  	}
	$scope.getNota = function(mesa) {
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});							
		$ionicLoading.hide();
		Mesas.cargaMesasSeccionesRevision($scope.seccionMesasSelected,mesa.idMesa).then(function(mesas){
				for(var j=0;j<mesas.length;j++){
					if(mesa.idMesa==mesas[j].idMesa){
						$scope.mesaRevision=mesas[j];
						break;
					}
				}
				if($scope.mesaRevision.estado=="abierto"||$scope.mesaRevision.estado=='desocupada'){
					if($scope.mesaRevision.tieneSubMesas){
						$scope.getSubMesas($scope.mesaRevision);
					}else{
						$location.path("/app/aperturanota/"+COMEDOR+"*"+$scope.mesaRevision.idMesa+"*"+$scope.mesaRevision.estado+"*"+$scope.seccionMesasSelected);
					}
					
				}else if($scope.mesaRevision.estado=="ocupado"||$scope.mesaRevision.estado=="cuenta"){
					if($scope.mesaRevision.tieneSubMesas){
						$scope.getSubMesas($scope.mesaRevision);
					}else{
						Nota.abreNota($scope.mesaRevision.idMesa,COMEDOR,$scope.seccionMesasSelected);
					}
				}	
			});	
  	}
	$scope.getNotaDelivery = function(mesa) {
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});
		$ionicLoading.hide();
		Mesas.cargaMesasSeccionesRevision($scope.seccionMesasSelected,mesa.idMesa).then(function(mesas){
			for(var j=0;j<mesas.length;j++){
				if(mesa.idMesa==mesas[j].idMesa){
					$scope.mesaRevision=mesas[j];
				}
			}
			if($scope.mesaRevision.estado=="abierto"||$scope.mesaRevision.estado=='desocupada'){
				if($scope.mesaRevision.tieneSubMesas){
					$scope.getSubMesas($scope.mesaRevision);
				}else{
					$location.path("/app/seleccionapp/"+PLATAFORMA+"*"+$scope.mesaRevision.idMesa+"*"+$scope.mesaRevision.estado+"*"+$scope.seccionMesasSelected);
				}

			}else if($scope.mesaRevision.estado=="ocupado"||$scope.mesaRevision.estado=="cuenta"){
				if($scope.mesaRevision.tieneSubMesas){
					$scope.getSubMesas($scope.mesaRevision);
				}else{
					Nota.abreNota($scope.mesaRevision.idMesa,PLATAFORMA,$scope.seccionMesasSelected);
				}
			}
		});
	}
	$scope.getSeccion = function(idSeccion) {
  		Mesas.cargaMesasSeccion(idSeccion);
  	}
	$scope.getComedor = function() {
  		Mesas.cargaMesasSecciones($scope.secciones);
  	}
	$scope.search = function() {
		if($scope.data.nomesaBuscar){
			Nota.abreNota($scope.data.nomesaBuscar,COMEDOR,$scope.seccionMesasSelected);
		}else{
			window.alerta("Ingrese un numero de mesa o de nota para buscar",$ionicPopup);	
		}
	}
	$scope.getSubMesas = function(mesa) {
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesas.</p>'});							
		Mesas.getSubMesas(mesa.idMesa,$scope.seccionMesasSelected);
	}
	$scope.getLlevar = function() {
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesas.</p>'});							
		Llevar.getLlevar($scope.seccionMesasSelected);
	}
	$scope.getDelivery = function() {
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesas.</p>'});
		Delivery.getDelivery($scope.secciones);
	}
	$scope.getEstadoColorSubmesas = function(estado,mesa) {
  		return 'border-color: #DBA901 !important;color: #DBA901 !important;';
  	}
	$scope.logout = function() {
		Logout.logout();
	}
})
.controller('Llevar', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
	Secciones,Configuraciones,Screen,Mesas,Nota,Login,Logout,Llevar) {
	$scope.data = {};
	$scope.data.nombremesa="";
	vista="";
	if(!Login.isLogged()){
		Logout.logout();
		return;
	}
	if(notarevisar!=-1){
		Mesas.desocupaBloqueada(0,notarevisar);
	}
	$scope.background=Screen.getBackground();
	$scope.manejaNombreMesa=Configuraciones.getManejaNombreMesa();	
	$scope.seccionMesasSelected = $stateParams.param;
	$scope.notasllevar=Llevar.showLlevar();
	if(contenidoNota){
		contenidoNota.close();
	}
	if(comentariosPop){
		comentariosPop.close();
	}
	if(poppupPaquete){
		poppupPaquete.close();
	}
	$scope.getFila = function(index,cantidad) {
  		if((parseInt(index)%cantidad)==0){
  			return true;
  		}else{
  			return false;
  		}
  	}
	$scope.getNota = function(notallevar) {
  		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});							
		Nota.abreNota(notallevar.numero,LLEVAR,$scope.seccionMesasSelected);		
  	}
	$scope.getNotaNew = function(notallevar) {
  		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});							
		Nota.guardaInfoNota(0,$scope.data.nombremesa,0);
		Nota.abreNota(0,LLEVAR,$scope.seccionMesasSelected);		
  	}
	
})	
.controller('Delivery', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
	Secciones,Configuraciones,Screen,Mesas,Nota,Login,Logout,Delivery) {
	vista="";
	if(!Login.isLogged()){
		Logout.logout();
		return;		
	}
	$scope.background=Screen.getBackground();
	$scope.seccionMesasSelected = $stateParams.param;
	$scope.notasdelivery=Delivery.showDelivery();
	$scope.aplicaciones=Delivery.showApps();
	$scope.data = {};
	$scope.data.numeropersonas="";
	$scope.data.nombremesa="";

	$scope.getFila = function(index,cantidad) {
  		if((parseInt(index)%cantidad)==0){
  			return true;
  		}else{
  			return false;
  		}
  	}
	$scope.getNotaDelivery = function(notadelivery) {
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});
		Nota.abreNota(notadelivery.numero,PLATAFORMA,1);
	}
	$scope.getNotaNewDelivery = function(notadelivery) {
		$location.path("/app/seleccionapp/");
	}
	$scope.createNotaNewDelivery = function(aplicacion) {
  		Nota.guardaInfoNota(0,$scope.data.nombremesa,aplicacion.clavetipoaplicacion);
			Nota.abreNota(0,PLATAFORMA,1);
		}
})
.controller('Comedor', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
	Secciones,Configuraciones,Screen,Mesas,Nota,Login,Logout,Llevar) {
	vista="";
	if(!Login.isLogged()){
		Logout.logout();
		return;
	}
	$scope.background=Screen.getBackground();
	$scope.seccionMesasSelected = $stateParams.param;
	$scope.notascomedor=Mesas.showComedor();
	
	$scope.getFila = function(index,cantidad) {
  		if((parseInt(index)%cantidad)==0){
  			return true;
  		}else{
  			return false;
  		}
  	}
	$scope.getNota = function(notacomedor) {
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});							
		Nota.abreNota(notacomedor.idMesa,COMEDOR,1);		
  	}	
})	
.controller('Submesas', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
	Secciones,Configuraciones,Screen,Mesas,Nota,Login,Logout) {
	vista="";
	if(!Login.isLogged()){
		Logout.logout();
		return;
	}
	$scope.background=Screen.getBackground();
	$scope.parametoCompleto = $stateParams.param.split("*");
	$scope.idMesa = $scope.parametoCompleto[0];
	$scope.seccionMesasSelected = $scope.parametoCompleto[1];
	$scope.submesas=Mesas.showSubMesas();
	if(contenidoNota){
		contenidoNota.close();
	}
	if(comentariosPop){
		comentariosPop.close();
	}
	if(poppupPaquete){
		poppupPaquete.close();
	}
	$scope.getFila = function(index,cantidad) {
  		if((parseInt(index)%cantidad)==0){
  			return true;
  		}else{
  			return false;
  		}
  	}
	$scope.getNota = function(submesa) {
  		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});							
		Nota.abreNota(submesa.numero,COMEDOR,$scope.seccionMesasSelected);		
  	}
	$scope.nuevaSubmesa = function(submesa) {
  		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesa.</p>'});							
		$scope.arrSubMesas=[]
		for(var jj=0;jj<$scope.submesas.length;jj++){
			$scope.arrSubMesas[jj]=parseFloat($scope.submesas[jj].numero);
		}
		$scope.maxSubmesa=$scope.arrSubMesas.max()+parseFloat('0.1');
		$scope.maxSubmesa=$scope.maxSubmesa.toFixed(1);
		
		Nota.guardaInfoNota(1,"",0);
		Nota.abreNota($scope.maxSubmesa,COMEDOR,$scope.seccionMesasSelected);
  	}
})	
.controller('Aperturanota', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
			CargaCatalogosInicio,Login,Configuraciones,Mesas,Nota,Screen,Logout) {
	vista="";
	$scope.escuentasseparadas=false;
	if(!Login.isLogged()){
		Logout.logout();
		return;
	}
	$scope.background=Screen.getBackground();
	if(contenidoNota){
		contenidoNota.close();
	}
	if(comentariosPop){
		comentariosPop.close();
	}
	if(poppupPaquete){
		poppupPaquete.close();
	}
	if(notarevisar!=-1){
		Mesas.desocupaBloqueada(notarevisar);
	}
	$scope.parametoCompleto = $stateParams.param.split("*");
	$scope.tipoNota = $scope.parametoCompleto[0];
	$scope.idMesa = $scope.parametoCompleto[1];
	$scope.estadoMesa = $scope.parametoCompleto[2];
	$scope.seccionMesasSelected = $scope.parametoCompleto[3];
	$scope.data = {};
	$scope.data.numeropersonas="";
	$scope.data.nombremesa="";
	$scope.manejaNombreMesa=Configuraciones.getManejaNombreMesa();	
	$scope.ingresaDigitoPersonas = function(digito) {
		$scope.data.numeropersonas=$scope.data.numeropersonas+digito;
	};
	$scope.limpiaPersonas = function() {
		$scope.data.numeropersonas="";
	};
	$scope.cambiocuentas = function() {
		if($scope.escuentasseparadas){
			$scope.escuentasseparadas=false;
		}else{
			$scope.escuentasseparadas=true;
		}
	};
	$scope.guardaInfoMesa = function() {
		if($scope.data.numeropersonas==""){
			$scope.data.numeropersonas="1";
		}

		Nota.guardaInfoNota(parseInt($scope.data.numeropersonas),$scope.data.nombremesa,0);
		if($scope.escuentasseparadas){
			$scope.idMesaS=$scope.idMesa+".1"
		}else{
			$scope.idMesaS=$scope.idMesa;
		}
		Nota.abreNota($scope.idMesaS,$scope.tipoNota,$scope.seccionMesasSelected);
	};
})

.controller('NotaC', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,
			CargaCatalogosInicio,Login,Configuraciones,Mesas,Nota,Screen,Logout) {
	$scope.seccionMesasSelected = $stateParams.param;
	$location.path("/app/nota/"+$scope.seccionMesasSelected);	
				
})				
.controller('Nota', function($scope, $stateParams, $ionicModal,$http, $ionicLoading, $ionicPopup, $location,$rootScope,$filter,$ionicScrollDelegate,
	Configuraciones,Screen,Clasificaciones,Productos,Mesas,Nota,Comentarios,Login,Logout,Existencias,$q,$window) {
	vista="NOTA";

	//$scope.uuidU=window.guid();
	if(!Login.isLogged()){
		Logout.logout();
		return;
	}
	puedemandarComandaLock=true;
	if(localStorage.getItem("uuidU")){
		$scope.uuidU = localStorage.getItem("uuidU");
	}else{
		$scope.uuidU=window.guid();
	}
	$scope.puedecobrar=window.puedecobrar($scope.uuidU,Configuraciones.getIpspermitidasparacobro());	
	
	$scope.background=Screen.getBackground();
	$scope.seccionMesasSelected = $stateParams.param;
	$scope.getDevice=Screen.getDevice();	
	$scope.informacionNota = Nota.getNota();
	
	$scope.numeroPersonas=Mesas.getNumeroPersonas();
	if($scope.numeroPersonas==0&&$scope.informacionNota.nota[0].tipoVenta==COMEDOR&&$scope.informacionNota.productos.length==0&&$scope.informacionNota.nota[0].mesa<1000){
		Mesas.desocupaMesaVacia(COMEDOR,$scope.informacionNota.nota[0].mesa,$scope.informacionNota.nota[0].estado,$scope.seccionMesasSelected,$scope.informacionNota.nota[0].numero);
	}
	$scope.data = {};
	$scope.usuarioLogueado =Configuraciones.getNombreUsuario();
	$scope.dataE = {};
	$scope.data.pagoefectivo="";
	$scope.data.cambioefectivo="";
	$scope.data.mensajepagofectivo="";
	$scope.data.nomesa = $scope.informacionNota.nota[0].mesa;
	$scope.data.nonota = $scope.informacionNota.nota[0].numero;
	$scope.muestratickepago=!Configuraciones.getPreguntaImpresionTicketPago();
	$scope.muestrabotonespago=Configuraciones.getMuestraBotonesPago();
	$scope.validaclasificaciones=Configuraciones.getValidaClasificaciones();
	
	if($scope.informacionNota.nota[0].estado!=0){
		M.toast({html: 'La nota ya ha sido pagada o abonada',displayLength:4000})
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesas.</p>'});							
		Mesas.desocupaMesa($scope.data.nomesa,$scope.seccionMesasSelected,$scope.informacionNota.nota[0].numero);
		
	}
	
	$scope.esUsuario=false;
	if(Configuraciones.getTipoUsuario()>""){
		$scope.esUsuario=true;
	}	
	var muestraPagoEfectivo;
	var muestraPagoTarjeta;
	var muestraPagoAmbos;
	$scope.terminalGeneral=[];
	$scope.tipotarjetaGeneral=[];
	$scope.terminalGeneralPlataforma=[];
	$scope.tipotarjetaGeneralPlataforma=[];
	//notarevisar=$scope.data.nonota;
	notarevisar=$scope.data.nomesa ;
	if($scope.informacionNota.nota[0].tipoVenta==LLEVAR){
		notarevisar=$scope.informacionNota.nota[0].numero;
	}else if($scope.informacionNota.nota[0].tipoVenta==PLATAFORMA){
		notarevisar=$scope.informacionNota.nota[0].numero;
	}
	$scope.clasificaciones=Productos.getProductos();
	$scope.productos=[];
	$scope.productosGeneral=Productos.getProductos();
	$scope.productosAgregados=$scope.informacionNota.productos;
	$scope.cantidadProductosOriginal=$scope.informacionNota.productos.length;
	$scope.data.cantidadProducto = "";	
	$scope.claveClasificacionFilter=0;
	$scope.indiceProductoAgregadoFilter=-1;
	$scope.productos=$scope.clasificaciones[0].productos;
	$scope.claveClasificacionFilter=parseInt($scope.clasificaciones[0].claveproducto);
	if($scope.informacionNota.nota[0].nombreMesa){
		M.toast({html: 'Nombre Mesa: '+$scope.informacionNota.nota[0].nombreMesa,displayLength:2000})
	}	
	
	$scope.limpia_cambios = function() {
		notarevisar=-1;
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Cargando mesas.</p>'});							
		Mesas.desocupaMesa($scope.data.nomesa,$scope.seccionMesasSelected,$scope.informacionNota.nota[0].numero);
		//Mesas.cargaMesasSeccion($scope.seccionMesasSelected);
	}
	$scope.get_total_nota = function() {
		return $scope.productosAgregados.sum("importe");
	}
	$scope.sepuedepagar = function() {
		var idapp = $scope.informacionNota.nota[0].tipoVenta;
		if(idapp == 7){
			return false;
		}

		if($scope.productosAgregados.sum("importe")>0){
			return true;
		}else{
			return false;
		}
	}
	$scope.tienedelivery = function() {
		if($scope.aplicaciones.length>0){
			return true;
		}else{
			return false;
		}
	}
	$scope.getFila = function(index) {
  		if((parseInt(index)%2)==0){
  			return true;
  		}else{
  			return false;
  		}
  	}
	$scope.aumentaCantidad = function(cantidad) {
  		$scope.data.cantidadProducto = $scope.data.cantidadProducto +cantidad;
  	}
	$scope.limpiaCantidad = function() {
  		$scope.data.cantidadProducto = "";
  	}
	$scope.aumentaCantidadPiezaPaquete = function(cantidad) {
  		$scope.dataE.cantidadPiezaPaquete = $scope.dataE.cantidadPiezaPaquete +cantidad;
  	}
	$scope.limpiaCantidadPiezaPaquete = function() {
  		$scope.dataE.cantidadPiezaPaquete = "";

  	}
	$scope.revisaProducto = function(producto,index,event) {
		if(producto.tipoProducto.localeCompare("CLASIFICACION")==0){
			$scope.productos=$scope.productos[index].productos;
			$ionicScrollDelegate.$getByHandle('productos').scrollTop();
		}else if (producto.tipoProducto.localeCompare("PRODUCTO")==0){
			if(Configuraciones.getValidaExistencias()){
				$scope.revisaExistencia(producto).then(function(data){
					if(data){
						$scope.agregaProducto(producto);
					}
				})	
			}else{
				$scope.agregaProducto(producto);
			}
		}
		else if (producto.tipoProducto.localeCompare("PAQUETE")==0){			
			if(Configuraciones.getValidaExistencias()){
				$scope.revisaExistencia(producto).then(function(data){
					if(data){
						$scope.muestraEstructuraPaquete(producto,index,event);
					}
				})
			}else{
				$scope.muestraEstructuraPaquete(producto,index,event);
			}
		}	
	}
	$scope.revisaExistencia = function(producto) {
		var d = $q.defer();
		if($scope.data.cantidadProducto==""){
			$scope.data.cantidadProducto="1";
		}
		$scope.productosEnvioRevision=new Object();
		$scope.productosEnvioRevision.productos=$scope.productosAgregados;
		$scope.productosEnvioRevision.nota=$scope.informacionNota.nota;
		$scope.productosEnvioRevision.comentarioComanda="";
		for ( var i = 0; i < $scope.productosEnvioRevision.productos.length; i++ ) {
			$scope.productosEnvioRevision.productos[i].estado=0;
		}
		Existencias.validaexistencias($scope.productosEnvioRevision,COMEDOR,producto.claveproducto,$scope.data.cantidadProducto).then(function(data){
			if(data.msg==""){
				d.resolve( true);
			}else{
				M.toast({html: 'No hay existencias suficiente de '+data.msg,displayLength:700})
				d.resolve( false);
			}
		})
		return d.promise;
	}
	$scope.verContenido = function() {
		contenidoNota = $ionicPopup.show({
			templateUrl: 'templates/contenidonota.html',
			cssClass:'estructurapaquete',
			title: 'Contenido Nota',
			scope: $scope,
			buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {
				contenidoNota.close();
			}},
			{ text: '-',type: 'button-assertive',onTap: function(e) {
					$scope.reduceCantidadProductoAgregado();
					e.preventDefault();
				} },{ text: '+',type: 'button-balanced',onTap: function(e) {
					$scope.aumentaCantidadProductoAgregado();
					e.preventDefault();
				} },{ text: '',type: 'button-positive ion-arrow-right-a',onTap: function(e) {
					$scope.mandaComanda();
				} },{text: '<i class="ion-clipboard"></b>',
				type: 'button-royal',
				onTap: function(e) {
					
					$scope.muestraComentarios();								 
				}
			  }
			]
		  });
	}
	//pago efectivo
	$scope.muestraPagoEfectivo = function() {
		muestraPagoEfectivo = $ionicPopup.show({
			templateUrl: 'templates/pagoefectivo2.html',
			cssClass:'estructurapaquete',
			title: 'Pago en efectivo',
			scope: $scope,
			buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {
				muestraPagoEfectivo.close();
			}},
			{ text: 'Pagar',type: 'button-assertive',onTap: function(e) {
					$scope.validaPagoEfectivo();
					e.preventDefault();
				} }
			]
		  });
		  
	}
	$scope.ingresaDigitoEfectivo = function(digito) {
		$scope.data.pagoefectivo=$scope.data.pagoefectivo+""+digito;
	};
	$scope.ingresaDigitoEfectivoPunto = function() {
		$scope.data.pagoefectivo=$scope.data.pagoefectivo+".";
	};
	$scope.limpiaEfectivo = function() {
		$scope.data.pagoefectivo="";
	};
	$scope.validaPagoEfectivo = function() {
	
		var imprimeticket=true;
		if(Configuraciones.getPreguntaImpresionTicketPago()){
			imprimeticket = document.getElementById("imprimeticket").checked;		
			imprimeticket=false;
		}
		var imprimeticketenvio = imprimeticket ? 1	 : 0;

		if($scope.data.pagoefectivo==""){
			$scope.data.pagoefectivo=$scope.informacionNota.nota[0].adeudo
		}	
		$scope.data.cambioefectivo= ""+(parseFloat($scope.data.pagoefectivo)-$scope.informacionNota.nota[0].adeudo);
		muestraPagoEfectivo.close();
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Pagando nota.</p>'});
		var pagoreal=0.0;
		if(parseFloat($scope.data.pagoefectivo)>$scope.informacionNota.nota[0].adeudo){
			pagoreal=$scope.informacionNota.nota[0].adeudo;
		}else{
			pagoreal=parseFloat($scope.data.pagoefectivo);
		}	
		notarevisar=-1;	
		Nota.puedemandarcomanda($scope.data.nomesa,Configuraciones.getUsuarioClaveLogueado(),$scope.data.nonota,parseInt($scope.informacionNota.nota[0].comandas[0])+1).then(
		function(data){
			if(data.msg==""){
				if($scope.cantidadProductosOriginal!=$scope.productosAgregados.length){
					window.alerta("Existen productos en la comanda activa, favor de enviarlos antes de realizar el pago de la nota.",$ionicPopup);		
				}else{
					Nota.pagaEfectivo($scope.informacionNota,parseFloat(pagoreal),parseFloat($scope.data.cambioefectivo),0.0,subcajeroMain,$scope.seccionMesasSelected,imprimeticketenvio);
				}	
						
			}else{
				window.alerta("La nota ha sido actualizada, favor de cargar nuevamente",$ionicPopup);	
				Mesas.cargaMesasSeccion($scope.seccionMesasSelected);
			}	
		})
		
	}
	$scope.muestracambioefectivo = function() {
		$scope.data.cambioefectivo= ""+(parseFloat($scope.data.pagoefectivo)-$scope.informacionNota.nota[0].adeudo);
		if($scope.data.cambioefectivo){
			if($scope.data.cambioefectivo>=0){
			return $scope.data.cambioefectivo;
			}else{
				return 0.0;
			}
		}else{
			return 0.0;
		}		
		
	}		
	//pago tarjeta
	$scope.muestraPagoTarjeta = function() {
		$scope.creditDebit=creditDebit;
		$scope.opcionesTarjeta=opcionesTarjeta;
		$scope.tipoS=$scope.creditDebit[0];
		$scope.muestracatalogoterminales=Configuraciones.getMostrarCatalogoTerminales();
		$scope.data.pagotarjeta=informacionNota.nota[0].adeudo;
		$scope.data.pagopropina=0;
		if($scope.muestracatalogoterminales){
			$scope.terminales=Configuraciones.getTerminales();
			$scope.tipoTerminal=$scope.terminales[0];
			$scope.terminalGeneral=$scope.terminales[0];
			$scope.tipotarjetaGeneral=$scope.creditDebit[0];
		}
		
		muestraPagoTarjeta = $ionicPopup.show({
			templateUrl: 'templates/pagotarjeta2.html',
			cssClass:'estructurapaquete',
			title: 'Pago con Tarjeta',
			scope: $scope,
			buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {
				muestraPagoTarjeta.close();
			}},
			{ text: 'Pagar',type: 'button-assertive',onTap: function(e) {
					$scope.validaPagoTarjeta();
					e.preventDefault();
				} }
			]
		  });
		 var elementf = $window.document.getElementById("campototaltarjeta");
				if(elementf){
				  elementf.focus();
				 } 
		
	}
	$scope.onSelectTerminal=function(terminal){ 	
		$scope.terminalGeneral=terminal;
	}
	$scope.onSelectTipoPago=function(tipotarjeta){ 
		$scope.tipotarjetaGeneral=tipotarjeta;		
	}
	$scope.calculaPagototal=function(){ 
		return parseInt($scope.data.pagotarjeta)+parseInt($scope.data.pagopropina);		
	}
	$scope.ingresaDigitoTarjeta = function(digito) {
		$scope.data.pagoefectivo=$scope.data.pagoefectivo+digito;
	};
	$scope.ingresaDigitoTarjetaPunto = function() {
		$scope.data.pagoefectivo=$scope.data.pagoefectivo+".";
	};
	$scope.limpiaTarjeta = function() {
		$scope.data.pagoefectivo="";
	};
	$scope.validaPagoTarjeta = function() {
		$scope.mensajevalidaciontarjeta="";
		if(!$scope.data.pagotarjeta){
			$scope.mensajevalidaciontarjeta="Ingrese una cantidad de pago";
		}
		if(!$scope.data.pagopropina&&$scope.data.pagopropina>""){
			$scope.mensajevalidaciontarjeta="Ingrese una cantidad de propina";
		}	
		if(!$scope.data.pagofolio){
			$scope.mensajevalidaciontarjeta="Ingrese el folio de la tarjeta";
		}
		if($scope.data.pagofolio){
			if($scope.data.pagofolio.length<4){
				$scope.mensajevalidaciontarjeta="Ingrese los cuatro ultimos de la tarjeta";
			}
		}
		if($scope.terminalGeneral.length==0){
			$scope.mensajevalidaciontarjeta="Seleccione una terminal";
		}
		if($scope.tipotarjetaGeneral.length==0){
			$scope.mensajevalidaciontarjeta="Seleccione un tipo de tarjeta";
		}		
		if($scope.mensajevalidaciontarjeta!=""){
			$ionicPopup.alert({
			 title: ''+$scope.mensajevalidaciontarjeta
		   });
		   return;
		}
		$scope.tipotar="0.";
		if($scope.tipotarjetaGeneral=="Crédito"){
			$scope.tipotar+="1";
		}else{
			$scope.tipotar+="2";
		}	
		Nota.propinaLimite($scope.data.pagotarjeta,$scope.data.pagopropina).then(function(data){
			if(data.mensaje==""){
				if(!informacionNota.nota[0].tipoVenta == PLATAFORMA){
					muestraPagoTarjeta.close();
				}
				$scope.aceptoPagoTarjeta();
			}else{
				var mensajePropina = $ionicPopup.show({
				title:''+data.mensaje,
				scope: $scope,
				buttons: [
				  { text: 'Cancelar' },
				  {
					text: '<b>Aceptar</b>',
					type: 'button-positive',
					onTap: function(e) {
							muestraPagoTarjeta.close();
							$scope.aceptoPagoTarjeta();
					}
				  }
				]
			  });
			}		
		});	
		
	}
	$scope.aceptoPagoTarjeta = function() {
		
		var imprimeticket=true;
		if(Configuraciones.getPreguntaImpresionTicketPago()){
			imprimeticket = document.getElementById("imprimeticket").checked;		
			imprimeticket=false;
		}
		var imprimeticketenvio = imprimeticket ? 1	 : 0;

		Nota.puedemandarcomanda($scope.data.nomesa,Configuraciones.getUsuarioClaveLogueado(),$scope.data.nonota,parseInt($scope.informacionNota.nota[0].comandas[0])+1).then(
		function(data){
			if(data.msg==""){
				$scope.data.cambioefectivo= ""+(parseFloat($scope.data.pagoefectivo)-$scope.informacionNota.nota[0].adeudo);
				notarevisar=-1;
				if($scope.cantidadProductosOriginal!=$scope.productosAgregados.length){
					window.alerta("Existen productos en la comanda activa, favor de enviarlos antes de realizar el pago de la nota.",$ionicPopup);		
				}else{
					$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Pagando nota.</p>'});							
					Nota.pagaTarjeta($scope.informacionNota,$scope.data.pagotarjeta,$scope.data.pagopropina,$scope.terminalGeneral.claveterminal,$scope.data.pagofolio,$scope.tipotar,subcajeroMain,$scope.seccionMesasSelected,imprimeticketenvio)
				}	
			}else{
				window.alerta("La nota ha sido actualizada, favor de cargar nuevamente",$ionicPopup);	
				Mesas.cargaMesasSeccion($scope.seccionMesasSelected);
			}	
		})
		/*
		
		
			*/
	}	
	//fin pago
	$scope.muestraComentarios = function(index) {
		if($scope.indiceProductoAgregadoFilter!=-1){
			if(parseInt($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].estado)==-1){
				$scope.comentariosClasificaciones=Comentarios.getComentariosClasificaciones();
				$scope.comentarios=Comentarios.getComentarios();
				for ( var j = 0; j < $scope.comentarios.length; j++ ) {	
					$scope.data.comentariolibre="";
					$scope.comentarioConcatenado="";
					$scope.comentarios[j].enabled=false;	
				}			
				$scope.data.comentariolibre=""+$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].comentario;
				comentariosPop = $ionicPopup.show({
					templateUrl: 'templates/comentarios.html',
					cssClass:'estructurapaquete',
					title: 'Comentarios',
					scope: $scope,
					buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {
						comentariosPop.close();
					}},
								{ text: 'Agregar',type:'button-balanced',onTap: function(e) {
									$scope.comentarioConcatenado="";
									$scope.comentarioSeparacion="";
									for ( var i = 0; i < $scope.comentarios.length; i++ ) {									
										if($scope.comentarios[i].enabled&&$scope.comentarios[i].enabled==true){
											$scope.comentarioConcatenado=""+$scope.comentarioConcatenado+$scope.comentarioSeparacion+" "+$scope.comentarios[i].comentario;
											$scope.comentarioSeparacion=",";
										}
									}
									if(!$scope.data.comentariolibre){
										$scope.data.comentariolibre="";
									}else{
										$scope.data.comentariolibre=$scope.data.comentariolibre+", ";
									}
									$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].comentario=
										$scope.data.comentariolibre+$scope.comentarioConcatenado;
									$scope.data.comentariolibre="";
									$scope.comentarioConcatenado="";
								}}
							]
				});		
			}else{
				window.alerta("Seleccione un producto de la comanda activa",$ionicPopup);	
			}	
		}else{
			window.alerta("Seleccione un producto",$ionicPopup);
		}	
			
	}
	$scope.muestraComentariosPaquetes = function(index,indexTiempo,cuantas) {
		$scope.comentariosClasificaciones=Comentarios.getComentariosClasificaciones();
		$scope.comentarios=Comentarios.getComentarios();
		for ( var j = 0; j < $scope.comentarios.length; j++ ) {	
			$scope.comentarios[j].enabled=false;	
		}
		comentariosPop = $ionicPopup.show({
			templateUrl: 'templates/comentarios.html',
			cssClass:'estructurapaquete',
			title: 'Comentarios',
			scope: $scope,
			buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {
				console.log("ENTRA ");
				$scope.data.comentariolibrePaquete="";
				$scope.data.comentariolibre="";
				$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].comentario = "";
				comentariosPop.close();
			}},
						{ text: 'Agregar',type:'button-balanced',onTap: function(e) {
							$scope.comentarioConcatenadoPaquete="";
							$scope.comentarioSeparacionPaquete="";
							for ( var i = 0; i < $scope.comentarios.length; i++ ) {									
								if($scope.comentarios[i].enabled&&$scope.comentarios[i].enabled==true){
									$scope.comentarioConcatenadoPaquete=""+$scope.comentarioConcatenadoPaquete+$scope.comentarioSeparacionPaquete+" "+$scope.comentarios[i].comentario;
									$scope.comentarioSeparacionPaquete=",";
								}
							}
							if(!$scope.data.comentariolibre){
								$scope.data.comentariolibre="";
							}else{
								$scope.data.comentariolibre=$scope.data.comentariolibre+", ";
							}
							var cantidadPiezas = cuantas;
							if($scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].comentario != ""){
								$scope.data.comentariolibrePaquete=$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].comentario+" |"+cantidadPiezas+" _";
								$scope.data.comentariolibrePaquete = $scope.data.comentariolibrePaquete+$scope.data.comentariolibre;
								$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].comentario = $scope.data.comentariolibrePaquete+$scope.comentarioConcatenadoPaquete;
							}else{
								if(cantidadPiezas > 1.0){
									$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].comentario = cantidadPiezas+" _"+$scope.data.comentariolibre+$scope.comentarioConcatenadoPaquete;
								}else{
									$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].comentario = $scope.data.comentariolibre+$scope.comentarioConcatenadoPaquete;
								}
							}
							console.log("ESTRUCTURA PAQUETE ",$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index]);
							$scope.data.comentariolibre="";
						}}
					]
		});
	}
	$scope.muestraEstructuraPaquete = function(producto,index,event) {
		$scope.estructuraPaquete=producto.tiempos;
		$scope.porcentajePaquete=producto.porcentajePaquete;
		$scope.porcentajePaqueteAcumulado=0;
		$scope.esPorcentajePaquete=producto.esPorcentajePaquete;
		$scope.tiempoaMostrar=0;
		$scope.dataE.cantidadPiezaPaquete = "";
		$scope.estructuraTiemposPiezaPaqueteAgregados=[];
		$scope.clavePaqueteMain=producto.claveproducto;
		$scope.esPaqueteIlimitado=Productos.esPaqueteIlimitado(producto.claveproducto);
		if($scope.data.cantidadProducto!="" && (parseFloat($scope.data.cantidadProducto)%1)!=0.0 && parseInt(producto.PuedeFraccionar)<1){
			window.alerta("El paquete ("+producto.nombreproducto+") no se puede fraccionar",$ionicPopup);
			return;
		}
		if($scope.data.cantidadProducto==""){
			$scope.data.cantidadProducto="1";
		}	
		$scope.cantidadTiempos=$scope.estructuraPaquete.length;	
		$scope.indicesRemover=[];
		for ( var i = 0; i < $scope.estructuraPaquete.length; i++ ) {
			if($scope.estructuraPaquete[i].productos==null){
				if($scope.estructuraPaquete[i-1].tiempo!=$scope.estructuraPaquete[i][0].tiempo){
					$scope.estructuraPaquete[i]=$scope.estructuraPaquete[i][0];
				}else{
					$scope.indicesRemover.push(i);
				}
			}
		}
		for ( var i = 0; i < $scope.indicesRemover.length; i++ ) {
			$scope.estructuraPaquete.splice($scope.indicesRemover[i],1);
		}		

		for ( var i = 0; i < $scope.estructuraPaquete.length; i++ ) {
			$scope.cantidadTiempoTemp=$scope.estructuraPaquete[i].productos.length;
			$scope.estructuraPiezaPaqueteAgregados=[];
			for ( var j = 0; j < $scope.cantidadTiempoTemp; j++ ) {	
				$scope.estructuraPiezaPaqueteAgregados.push($scope.estructuraPaquete[i].productos[j]);
				$scope.estructuraPiezaPaqueteAgregados[$scope.estructuraPiezaPaqueteAgregados.length-1].cantidadAgregada=0;
			}
			$scope.estructuraTiemposPiezaPaqueteAgregados.push({cantidad:$scope.estructuraPaquete[i].cantidad*$scope.data.cantidadProducto,
			cantidadAgregada:0,
			productos:$scope.estructuraPiezaPaqueteAgregados,nombreGrupo:$scope.estructuraPaquete[i].nombreGrupo});
			
		}
		$scope.maximaCantidadTiempo=[];
		$scope.minimaCantidadTiempo=[];
		$scope.totalPiezasAgregar=[];
		for ( var i = 0; i < $scope.estructuraPaquete.length; i++ ) {
			$scope.maximaCantidadTiempo[i]=1;
			for ( var j = 0; j < $scope.estructuraPaquete[i].productos.length; j++ ) {	
				if($scope.maximaCantidadTiempo[i]<$scope.estructuraPaquete[i].productos[j].puntaje){
						$scope.maximaCantidadTiempo[i]=$scope.estructuraPaquete[i].productos[j].puntaje;
				}
			}
			$scope.minimaCantidadTiempo[i]=$scope.maximaCantidadTiempo[i];
			for ( var j = 0; j < $scope.estructuraPaquete[i].productos.length; j++ ) {	
				if($scope.minimaCantidadTiempo[i]>$scope.estructuraPaquete[i].productos[j].puntaje){
						$scope.minimaCantidadTiempo[i]=$scope.estructuraPaquete[i].productos[j].puntaje;
				}
			}
			if($scope.maximaCantidadTiempo[i] != $scope.minimaCantidadTiempo[i]){
				$scope.totalPiezasAgregar[i] = $scope.estructuraTiemposPiezaPaqueteAgregados[i].cantidad*$scope.maximaCantidadTiempo[i];
			}else{
				$scope.totalPiezasAgregar[i] = $scope.estructuraTiemposPiezaPaqueteAgregados[i].cantidad;
			}
		}
			poppupPaquete = $ionicPopup.show({
			templateUrl: 'templates/estructurapaqueteg.html',
			cssClass:'estructurapaquete',
			title: 'Completa el paquete',
			scope: $scope,
			buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {
				for ( var i = 0; i < $scope.estructuraTiemposPiezaPaqueteAgregados.length; i++ ) {
					for ( var j = 0; j < $scope.estructuraTiemposPiezaPaqueteAgregados[i].productos.length; j++ ) {
						$scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].comentario = "";
					}
				}
				poppupPaquete.close();
			}},
			{ text: '<i class="ion-arrow-left-a"></b>',type: 'button-positive',onTap: function(e) {
					if($scope.tiempoaMostrar>0){
						$scope.tiempoaMostrar--;
						document.getElementById(''+$scope.tiempoaMostrar).scrollIntoView();					
					}
					e.preventDefault();
			} },
			{ text: '<i class="ion-arrow-right-a"></b>',type: 'button-positive',onTap: function(e) {
					if($scope.tiempoaMostrar<$scope.cantidadTiempos){
						$scope.tiempoaMostrar++;
						document.getElementById(''+$scope.tiempoaMostrar).scrollIntoView();
					}
					e.preventDefault();
			} },
			{text: '<b>OK</b>',type: 'button-positive',
				onTap: function(e) {
					//REVISAR BARRA
					$scope.paqueteCompleto=true;
					//console.log('$scope.estructuraTiemposPiezaPaqueteAgregados',$scope.estructuraTiemposPiezaPaqueteAgregados);
					//console.log('$scope.estructuraTiemposPiezaPaqueteAgregados.length',$scope.estructuraTiemposPiezaPaqueteAgregados.length);

					if(!$scope.esPaqueteIlimitado){
						if(!$scope.esPorcentajePaquete){
							for ( var i = 0; i < $scope.estructuraTiemposPiezaPaqueteAgregados.length; i++ ) {
								if($scope.estructuraTiemposPiezaPaqueteAgregados[i].cantidadAgregada<$scope.totalPiezasAgregar[i]){
									window.alerta("Favor de completar el tiempo "+$scope.estructuraTiemposPiezaPaqueteAgregados[i].nombreGrupo,$ionicPopup);
									e.preventDefault();							
									return;
								} else if($scope.estructuraTiemposPiezaPaqueteAgregados[i].cantidadAgregada>$scope.totalPiezasAgregar[i]){
									window.alerta("La cantidad seleccionada sobrepasa la cantidad permitida "+$scope.estructuraTiemposPiezaPaqueteAgregados[i].nombreGrupo,$ionicPopup);	
								    return;
								}
							}
						}else{
							if($scope.porcentajePaqueteAcumulado!=($scope.porcentajePaquete*$scope.data.cantidadProducto)){		
								window.alerta("La cantidad seleccionada sobrepasa la cantidad permitida ",$ionicPopup);	
								return;
							}
						}	
					}
					//console.log('XXX $scope.estructuraTiemposPiezaPaqueteAgregados',$scope.estructuraTiemposPiezaPaqueteAgregados);
					$scope.productosRelacion=[];
					for ( var i = 0; i < $scope.estructuraTiemposPiezaPaqueteAgregados.length; i++ ) {
						//console.log('XXX $scope.estructuraTiemposPiezaPaqueteAgregados[i].productos',$scope.estructuraTiemposPiezaPaqueteAgregados[i].productos);
						for ( var j = 0; j < $scope.estructuraTiemposPiezaPaqueteAgregados[i].productos.length; j++ ) {
							//console.log('XXX $scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j]',$scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j]);
									
							if($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].cantidadAgregada>0){
								
								if($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].productoRelacion.length>0){
									$scope.productosRelacion.push($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].productoRelacion[0]);
								}	
								if(parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].cantidadAgregada)==1 
								|| !$scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].comentario.includes("_")){
									$scope.productosAgregados.unshift(angular.copy($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j]));
									$scope.productosAgregados[0].cantidad=parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].cantidadAgregada);	
									$scope.productosAgregados[0].importe=parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].precio)*
										parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].cantidadAgregada);
									$scope.productosAgregados[0].comentario = $scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].comentario;
									$scope.productosAgregados[0].estado=-1;
								}else{
									if($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].comentario.includes(" |")){
										var comentariosDividido = $scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].comentario.split(" |");
										console.log("COMENTARIO DIVIDIDO ",comentariosDividido);
										for(var ii=0; ii < comentariosDividido.length; ii++){
											$scope.productosAgregados.unshift(angular.copy($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j]));
											var cantidadaux = 0.0;
											var comentarioaux = "";
											if(comentariosDividido[ii].includes(" _")){
												var comentariocantidad = comentariosDividido[ii].split(" _");
												console.log("COMENTARIO CANTIDAD ",comentariocantidad);
												cantidadaux = parseFloat(comentariocantidad[0]);
												comentarioaux = comentariocantidad[1];
											}else{
												comentarioaux = comentariosDividido[ii];
												cantidadaux = 1.0;
											}
											$scope.productosAgregados[0].cantidad = cantidadaux;
											$scope.productosAgregados[0].importe = importe=parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].precio)*
																					parseFloat(cantidadaux);
											$scope.productosAgregados[0].comentario = comentarioaux;
											$scope.productosAgregados[0].estado=-1;
										}
									}else{
										var comentariocantidad = $scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].comentario.split(" _");
										console.log("COMENTARIO CANTIDAD ",comentariocantidad);
										var comentarioaux = comentariocantidad[1];
										$scope.productosAgregados.unshift(angular.copy($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j]));
										$scope.productosAgregados[0].cantidad=parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].cantidadAgregada);	
										$scope.productosAgregados[0].importe=parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].precio)*
											parseFloat($scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].cantidadAgregada);
										$scope.productosAgregados[0].comentario = comentarioaux;
										$scope.productosAgregados[0].estado=-1;
									}
								}
								$scope.estructuraTiemposPiezaPaqueteAgregados[i].productos[j].comentario = "";								
							}	
						}
					}
										
					/*console.log('XXX $scope.estructuraTiemposPiezaPaqueteAgregados',$scope.estructuraTiemposPiezaPaqueteAgregados);
					for ( var hh = 0; hh < $scope.estructuraTiemposPiezaPaqueteAgregados.length; hh++ ) {
							
					}*/	
					$scope.paqueteRelacion=null;
					for ( var kk = 0; kk < $scope.productosRelacion.length; kk++ ) {
						if($scope.paqueteRelacion==null){
							$scope.paqueteRelacion=$scope.productosRelacion[kk];
						}else{
							if($scope.productosRelacion[kk] != null){					
								if($scope.paqueteRelacion.precio<$scope.productosRelacion[kk].precio){
									$scope.paqueteRelacion=$scope.productosRelacion[kk];
								}
							}
						}		
					}	
					if($scope.paqueteRelacion!=null){
							producto=$scope.paqueteRelacion;
					}
					if($scope.data.cantidadProducto==""){
						$scope.data.cantidadProducto="1";
					}
					$scope.productosAgregados.unshift(angular.copy(producto));
					$scope.productosAgregados[0].cantidad=parseFloat($scope.data.cantidadProducto);	
					$scope.productosAgregados[0].importe=parseFloat(producto.precio)*parseFloat($scope.data.cantidadProducto);
					$scope.productosAgregados[0].estado=-1;	
					$scope.data.cantidadProducto="";
				}
			  }
			]
		  });

	}
	$scope.insertaPiezaPaquete = function(producto,index,indexTiempo) {
		if(Configuraciones.getValidaExistencias()){
			$scope.revisaExistencia(producto).then(function(data){
				if(!data){
					return;	
				}
			})
		}
		tamanostilo=parseInt($scope.estructuraTiemposPiezaPaqueteAgregados.length);
		indexTiempo=parseInt(indexTiempo)-1;
		if(tamanostilo<=1){
			indexTiempo = 0;
		}
		if(	$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada !="" &&
		(parseFloat(	$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada)%1)!=0.0 &&
		parseInt(	$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregadPuedeFraccionar)<1){
			window.alerta("El producto ("+producto.nombreproducto+") no se puede fraccionar",$ionicPopup);
			return;
		}
		if($scope.dataE.cantidadPiezaPaquete==""){
			$scope.dataE.cantidadPiezaPaquete="1";
		}
		if(!$scope.esPorcentajePaquete){//xxxxxxx
			$scope.esTiempoIlimitado=Productos.esTiempoIlimitado($scope.clavePaqueteMain,indexTiempo+1);
			if(!$scope.esPaqueteIlimitado){
				if(($scope.maximaCantidadTiempo[indexTiempo])>=((1/producto.puntaje)*($scope.maximaCantidadTiempo[indexTiempo]))){
					if(($scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada+
						(((1/producto.puntaje)*(parseFloat($scope.dataE.cantidadPiezaPaquete)))*$scope.maximaCantidadTiempo[indexTiempo]))
						>$scope.totalPiezasAgregar[indexTiempo]){
						window.alerta("La cantidad seleccionada sobrepasa la cantidad permitida en el tiempo ("+
							$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidad+") ",$ionicPopup);
						return;
					}
				}else{
						window.alerta("La cantidad seleccionada sobrepasa la cantidad permitida en el tiempo ("+
							$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidad+") ",$ionicPopup);
						return;
				}
			}else{
				$scope.tieneTiempoIlimitado=Productos.tieneTiempoIlimitado($scope.clavePaqueteMain);			
				if($scope.tieneTiempoIlimitado&&!$scope.esTiempoIlimitado){
					if(($scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada+parseFloat($scope.dataE.cantidadPiezaPaquete))
						>$scope.totalPiezasAgregar[indexTiempo]){
						window.alerta("La cantidad seleccionada sobrepasa la cantidad permitida en el tiempo ("+
							$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidad+")",$ionicPopup);	
						return;
					}
				}
			}
			if($scope.maximaCantidadTiempo[indexTiempo]!=producto.puntaje){
				$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada=
					$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada+
					(parseFloat($scope.dataE.cantidadPiezaPaquete)*producto.puntaje);
				$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada=
					$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada+
					(parseFloat($scope.dataE.cantidadPiezaPaquete)*$scope.maximaCantidadTiempo[indexTiempo]);
				var cuantas = parseFloat($scope.dataE.cantidadPiezaPaquete);
				if(Configuraciones.getHayComentariosPorProducto()){
					$scope.muestraComentariosPaquetes(index,indexTiempo,cuantas);
				}
				//$scope.dataE.cantidadPiezaPaquete="";
			}else{
				$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada=
					$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada+
					(parseFloat($scope.dataE.cantidadPiezaPaquete));
				$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada=
					$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada+
					(parseFloat($scope.dataE.cantidadPiezaPaquete));
				var cuantas = parseFloat($scope.dataE.cantidadPiezaPaquete);
				if(Configuraciones.getHayComentariosPorProducto()){
					$scope.muestraComentariosPaquetes(index,indexTiempo,cuantas);
				}
				$scope.dataE.cantidadPiezaPaquete="";

			}
			if($scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada==
				$scope.totalPiezasAgregar[indexTiempo]){
				if($scope.tiempoaMostrar<$scope.cantidadTiempos){
					$scope.tiempoaMostrar++;
					var delayInMilliseconds = 1000;
					setTimeout(function() {
					  document.getElementById(''+$scope.tiempoaMostrar).scrollIntoView();
					}, delayInMilliseconds);			
				}
			}
		}else{
			if(($scope.porcentajePaqueteAcumulado+(parseFloat($scope.dataE.cantidadPiezaPaquete)*producto.puntaje))>
				$scope.porcentajePaquete * $scope.data.cantidadProducto){		
						window.alerta("La cantidad seleccionada sobrepasa la cantidad permitida ",$ionicPopup);	
						return;
			}else{
				$scope.porcentajePaqueteAcumulado+=(parseFloat($scope.dataE.cantidadPiezaPaquete)*producto.puntaje);
				$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada=
					$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada+
					(parseFloat($scope.dataE.cantidadPiezaPaquete));
				$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada=
					$scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada+
					(parseFloat($scope.dataE.cantidadPiezaPaquete));
				var cuantas = parseFloat($scope.dataE.cantidadPiezaPaquete);
				if(Configuraciones.getHayComentariosPorProducto()){
					$scope.muestraComentariosPaquetes(index,indexTiempo,cuantas);
				}
				$scope.dataE.cantidadPiezaPaquete="";
			}
		}	
	}
	$scope.getCantidadAgregadaPiezaPaquete = function(index,indexTiempo) {			
		indexTiempo=parseInt(indexTiempo)-1;
		return $scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada;
	}
	$scope.getStiloPiezaPaquete = function(index,indexTiempo) {
		indexTiempo=parseInt(indexTiempo)-1;
		if($scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].productos[index].cantidadAgregada>=1){
			return 'border-color: #512C12!important;;color: #512C12!important;';
		}else{
			return 'border-color: #000!important;color: #000!important;';
		}
	}
	$scope.revisaTiempoCompleto = function(indexTiempo) {
		if(!$scope.esPorcentajePaquete){
			if($scope.estructuraTiemposPiezaPaqueteAgregados[indexTiempo].cantidadAgregada==
				$scope.totalPiezasAgregar[indexTiempo]){
				return true;
			}else{
				return false;
			}
		}else{
			if($scope.porcentajePaqueteAcumulado==($scope.porcentajePaquete * $scope.data.cantidadProducto)){		
				return true;
			}else{
				return false;
			}
		}
	}
	$scope.agregaProducto = function(producto) {
		if(Productos.esProductoBloqueado(producto.claveproducto)){
			window.alerta("Producto Bloqueado",$ionicPopup);
			return;
		}
		if($scope.data.cantidadProducto==""){
			$scope.data.cantidadProducto="1";
		}  		
		$scope.productosAgregados.unshift(angular.copy(producto));
		$scope.productosAgregados[0].cantidad=parseFloat($scope.data.cantidadProducto);
		$scope.productosAgregados[0].importe=parseFloat(producto.precio)*parseFloat($scope.data.cantidadProducto);
		$scope.productosAgregados[0].estado=-1;

		$scope.data.cantidadProducto="";
		if($scope.indiceProductoAgregadoFilter!=-1){
			$scope.indiceProductoAgregadoFilter++;
		}
		if($scope.getDevice=='phone'){
			M.toast({html: 'Producto Agregado',displayLength:700})
		}
		if(Configuraciones.getHayComentariosPorProducto()){
			$scope.indiceProductoAgregadoFilter=0;
			$scope.muestraComentarios(0);
		}
  	}
	$scope.selecciona_clasificacion = function(clasificacion,index) {
		$scope.productos=$scope.productosGeneral[index].productos;
		$scope.claveClasificacionFilter=parseInt(clasificacion.claveproducto);
		$ionicScrollDelegate.$getByHandle('productos').scrollTop();
	}
	$scope.selecciona_producto_agregado = function(item,indice) {
		$scope.indiceProductoAgregadoFilter=parseInt(indice);
	}
	$scope.aumentaCantidadProductoAgregado = function() {
  		if($scope.indiceProductoAgregadoFilter!=-1){
			if($scope.data.cantidadProducto==""){
				$scope.data.cantidadProducto="1";
			}
			if($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].unidad=='PAQUETE'||$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].tipoProducto=='PAQUETE'){
				
			}else if($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].unidad=='PIEZAPAQUETE'||$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].tipoProducto=='PIEZAPAQUETE'){
				
			}else {
				if(parseInt($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].estado)==-1){
					$scope.productosAgregados[parseInt($scope.indiceProductoAgregadoFilter)].cantidad=
						$scope.productosAgregados[parseInt($scope.indiceProductoAgregadoFilter)].cantidad+
						parseFloat($scope.data.cantidadProducto);
					$scope.productosAgregados[parseInt($scope.indiceProductoAgregadoFilter)].importe+=
						$scope.productosAgregados[parseInt($scope.indiceProductoAgregadoFilter)].precio*
						parseFloat($scope.data.cantidadProducto);
				}else if(parseInt($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].estado)==0){
					$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].claveproducto
					$scope.newProducto=Productos.getProductoCompletoByClave($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].claveproducto);
					$scope.productosAgregados.unshift($scope.newProducto);
	
					$scope.productosAgregados[0].cantidad=parseFloat($scope.data.cantidadProducto);
					$scope.productosAgregados[0].importe=parseFloat($scope.productosAgregados[0].precio)*parseFloat($scope.data.cantidadProducto);
					$scope.productosAgregados[0].estado=-1;
					$scope.productosAgregados[0].comanda=0;
					$scope.indiceProductoAgregadoFilter++;
				
				}
			}			
			$scope.data.cantidadProducto="";
		}else{
			window.alerta("Seleccion un producto",$ionicPopup);
		}
  	}
	$scope.reduceCantidadProductoAgregado = function() {
  		if($scope.indiceProductoAgregadoFilter!=-1){
			if($scope.data.cantidadProducto==""){
				$scope.data.cantidadProducto="1";
			}
			if(parseFloat($scope.data.cantidadProducto)<=parseFloat($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].cantidad)){
				if(parseInt($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].estado)==-1){
					
					if($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].tipoProducto.localeCompare("PAQUETE")!=0&&
						$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].tipoProducto.localeCompare("PIEZAPAQUETE")!=0){
							
						if($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].cantidad>1&&
							$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].cantidad!=$scope.data.cantidadProducto){

							$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].cantidad=
								$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].cantidad-parseFloat($scope.data.cantidadProducto);
							$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].importe-=
								$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].precio*parseFloat($scope.data.cantidadProducto);
						
						}else if($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].cantidad==1||
								$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].cantidad==$scope.data.cantidadProducto){	
							$scope.productosAgregados.splice(parseInt($scope.indiceProductoAgregadoFilter), 1);
							$scope.indiceProductoAgregadoFilter=-1;
							
						}
					}else if($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].tipoProducto.localeCompare("PAQUETE")==0){
						
						$scope.productosAgregados.splice(parseInt($scope.indiceProductoAgregadoFilter), 1);

						for(var jj=parseInt($scope.indiceProductoAgregadoFilter);jj<$scope.productosAgregados.length;jj++){
							if($scope.productosAgregados[jj].tipoProducto.localeCompare("PIEZAPAQUETE")==0){
								$scope.productosAgregados.splice(jj, 1);
								jj--;
							}else{
								break;
							}	
						}
						$scope.indiceProductoAgregadoFilter=-1;
					}	
					$scope.data.cantidadProducto="";	
					
				}else if(parseInt($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].estado)==0){
					/*$scope.productosAgregados.unshift({"claveproducto":$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].claveproducto,
					"nombreproducto":$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].nombreproducto,
					"cantidad":parseFloat($scope.data.cantidadProducto)*-1.00,"precio":$scope.productosAgregados[$scope.indiceProductoAgregadoFilter].precio,
					"importe":parseFloat($scope.productosAgregados[$scope.indiceProductoAgregadoFilter].precio)*parseFloat($scope.data.cantidadProducto)*-1.00,
					"estado":-1});
					$scope.data.cantidadProducto="";
					$scope.indiceProductoAgregadoFilter++;
					$scope.data.cantidadProducto="";*/
				}
			}else{
				window.alerta("La cantidad seleccionada sobrepasa la cantidad del producto agregado",$ionicPopup);
				$scope.data.cantidadProducto="";
			}
		}else{
			window.alerta("Seleccion un producto",$ionicPopup);
		}
  	}
	$scope.getCantidadesGrupo = function(estructura) {
		if(!$scope.esPorcentajePaquete){
			return parseFloat($scope.totalPiezasAgregar[estructura.tiempo-1]);
		}else{
			return parseInt(($scope.porcentajePaquete / estructura.productos[0].puntaje) * $scope.data.cantidadProducto);
		}
	}
	$scope.getCantidadesAgregadasGrupo = function(estructura,index) {
		if(!$scope.esPorcentajePaquete){
			return (parseFloat($scope.totalPiezasAgregar[estructura.tiempo-1]))-$scope.estructuraTiemposPiezaPaqueteAgregados[index].cantidadAgregada;
		}else{
			return $scope.getCantidadesGrupo(estructura) - $scope.porcentajePaqueteAcumulado/parseInt(estructura.productos[0].puntaje);
		}
	}	
	$scope.mandaComanda = function() {
		if(puedemandarComandaLock){
			puedemandarComandaLock=false;
			notarevisar=-1;
			if($scope.productosAgregados.length>0){
				$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Enviando comanda.</p>'});							
				$scope.productosEnvio=new Object();
				$scope.productosEnvio.productos=$scope.productosAgregados;
				$scope.productosEnvio.nota=$scope.informacionNota.nota;
				$scope.productosEnvio.comentarioComanda="";

				for ( var i = 0; i < $scope.productosEnvio.productos.length; i++ ) {
					$scope.productosEnvio.productos[i].estado=0;
				}
				Nota.mandaComanda($scope.productosEnvio,COMEDOR,$scope.seccionMesasSelected,$scope);
			}else{
				puedemandarComandaLock=true;
				window.alerta("No se han agregado productos",$ionicPopup);
			}
		}
	}
	$scope.imprimeCuenta = function() {
		notarevisar=-1;
		if($scope.informacionNota.nota[0].numero!=0){
			$ionicLoading.show({template: '<i class="icon icon ion-printer" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Imprimiendo cuenta.</p>'});							
			Nota.imprimeCuenta($scope.informacionNota.nota[0].numero,$scope.seccionMesasSelected);
		}else{
			window.alerta("Imposible imprimir cuenta de nota nueva",$ionicPopup);
		}
	}
	$scope.logout = function() {
		notarevisar=-1;
		Mesas.desocupaMesayLogout($scope.data.nomesa,$scope.seccionMesasSelected,$scope.informacionNota.nota[0].numero);
	}
	$scope.muestraBotonCuenta = function() {
		return Configuraciones.getOcultaBotonCuenta();
	}
	$scope.muestraClasificacion = function(clasificacion) {
		return !Clasificaciones.esClasificacionesBloqueada(clasificacion.claveproducto);
	}
	$scope.muestraClasificacionCS = function(clasificacion) {
		return !Clasificaciones.esTipoVentaClasificacion(clasificacion.nombreproducto,$scope.informacionNota.nota[0].tipoVenta);
	}
	$scope.muestraProducto = function(producto) {
		return Productos.esTipoVentaProducto(producto.clasificacion,$scope.informacionNota.nota[0].tipoVenta,producto.claveproducto);
	}
	$scope.muestraPrecioProducto = function() {
		return Configuraciones.getManejaPrecioBotones();
	}
	$scope.esdelivery = function() {
		var idapp = $scope.informacionNota.nota[0].tipoVenta;
		if(idapp == 7){
			return true;
		}else{
			return false;
		}
	}
	$scope.muestraPagoDelivery = function() {
		var idapp = $scope.informacionNota.nota[0].numero;
		for(var j=0; j<notasDelivery.length;j++){
			var notanum = notasDelivery[j].numero;
			if(notanum == idapp){
				var formapago = notasDelivery[j].tipopago;
				var idPlataforma = parseInt(notasDelivery[j].aplicacion);
				break;
			}
		}
		if(formapago == "EFECTIVO"){
			$scope.muestraPagoEfectivo();
		}else if(formapago == "TARJETA"){
			$scope.mensajevalidaciontarjeta="";
			$scope.data.pagotarjeta = informacionNota.nota[0].adeudo;
			$scope.data.pagopropina = 0.0;
			$scope.data.pagofolio="9999";
			$scope.muestracatalogoterminales=Configuraciones.getMostrarCatalogoTerminales();
			$scope.terminalesPlataformas=[];
			$scope.relacionTerminalesPlataformas=[];
			if($scope.muestracatalogoterminales){
				$scope.terminalesPlataformas=Configuraciones.getTerminalesPlataformas();
				$scope.relacionTerminalesPlataformas=Configuraciones.getRelacionTerminalesPlataformas();
				for(var i=0; i < $scope.terminalesPlataformas.length;i++){
					$scope.clavebanco=$scope.terminalesPlataformas[i].clavebanco;
					$scope.tipoTerminalPlataforma=$scope.terminalesPlataformas[i].claveterminal;
					$scope.terminalNombre=$scope.terminalesPlataformas[i].nombreterminal;
					if($scope.tipoTerminalPlataforma == parseInt($scope.relacionTerminalesPlataformas[idPlataforma])){
						$scope.terminalGeneral = $scope.terminalesPlataformas[i];
						//$scope.terminalGeneral.claveterminal = parseFloat($scope.terminalGeneral);
						console.log("YA LA ENCONTRE");
					}
				}
			}
			$scope.tipotarjetaGeneral = "Debito";
			$scope.validaPagoTarjeta()
		 }else{
			 muestraPagoAmbos = $ionicPopup.show({
				templateUrl: 'templates/pagoambos.html',
				cssClass:'estructurapaquete',
				title: 'Seleccione un método de pago',
				scope: $scope,
				buttons: [{ text: '<i class="icon ion-close-circled"></i>',type:'popclose',onTap: function(e) {
					muestraPagoAmbos.close();
				}},
				{ text: 'Efectivo',type: 'button-assertive',onTap: function(e) {
						e.preventDefault();
						muestraPagoAmbos.close();
						$scope.muestraPagoEfectivo();
					}},
					{ text: 'Tarjeta',type: 'button-assertive',onTap: function(e) {
							e.preventDefault();
							muestraPagoAmbos.close();
							$scope.muestraPagoTarjeta();
						}}
				]
				});
		 }
	}
	$scope.validaPagoEfectivoDelivery = function() {

		var imprimeticket=true;
		if(Configuraciones.getPreguntaImpresionTicketPago()){
			imprimeticket = document.getElementById("imprimeticket").checked;
			imprimeticket=false;
		}

		var imprimeticketenvio = imprimeticket ? 1	 : 0;

		if($scope.data.pagoefectivo==""){
			$scope.data.pagoefectivo=$scope.informacionNota.nota[0].adeudo
		}
		$scope.data.cambioefectivo= ""+(parseFloat($scope.data.pagoefectivo)-$scope.informacionNota.nota[0].adeudo);
		muestraPagoEfectivo.close();
		$ionicLoading.show({template: '<i class="icon icon ion-load-c" style="font-size: 100px;margin-left:50px;margin-right:50px;" ></i> <br> </button> <p>Pagando nota.</p>'});
		var pagoreal=0.0;
		if(parseFloat($scope.data.pagoefectivo)>$scope.informacionNota.nota[0].adeudo){
			pagoreal=$scope.informacionNota.nota[0].adeudo;
		}else{
			pagoreal=parseFloat($scope.data.pagoefectivo);
		}
		Nota.puedemandarcomanda($scope.data.nomesa,Configuraciones.getUsuarioClaveLogueado(),$scope.data.nonota,parseInt($scope.informacionNota.nota[0].comandas[0])+1).then(
		function(data){
			if(data.msg==""){
				if($scope.cantidadProductosOriginal!=$scope.productosAgregados.length){
					window.alerta("Existen productos en la comanda activa, favor de enviarlos antes de realizar el pago de la nota.",$ionicPopup);
				}else{
					Nota.pagaDelivery($scope.informacionNota,parseFloat(pagoreal),0.0,parseFloat($scope.data.cambioefectivo),0.0,0.0,"","","",subcajeroMain,$scope.seccionMesasSelected,imprimeticketenvio);
				}

			}else{
				window.alerta("La nota ha sido actualizada, favor de cargar nuevamente",$ionicPopup);
				Mesas.cargaMesasSeccion($scope.seccionMesasSelected);
			}
		})

	}
	//ESTILOS
	$scope.getColorClasificacion = function(clasifiacion) {
		if(parseInt(clasifiacion.claveproducto)==$scope.claveClasificacionFilter){
			return "color:#43a422!important;border-color:#43a422!important;";
		}else{
			return "color:#fff!important;border-color:#fff!important;";
		}		
	}
	$scope.getEstadoColor = function(estado) {
  		if(parseInt(estado)==-1){
  			return 'border: 1px solid white;';
  		}else if(parseInt(estado)==0){
  			return 'border: 1px solid #512C12;';
  		}
  	}
	$scope.getEstadoColorPhone = function(estado) {
  		if(parseInt(estado)==-1){
  			return 'border: 1px solid white;color:#000;';
  		}else if(parseInt(estado)==0){
  			return 'border: 1px solid #512C12;color:#000;';
  		}
  	}
	$scope.getProductoPhone = function(index) {
  		if(parseInt(index)==0){
  			return '';
  		}else {
  			return 'margin-bottom:-40px !important;margin-top:-40px !important;';
  		}
  	}	
	$scope.producto_agregado_stilo = function(item,indice) {
		if(indice==$scope.indiceProductoAgregadoFilter){
			return "color:#fff!important;background-color:#43a422!important;";
		}else{
			return "color:#fff!important;background-color:Transparent!important;";
		}	
	}
	$scope.texto_producto = function(texto) {
		if(texto.length>30){
			return "font-family: 'Open Sans', sans-serif;font-size: 12px;color:#512C12;font-weight: bold;";
		}else{
			return "font-family: 'Open Sans', sans-serif;font-size: 15px;color:#512C12;font-weight: bold;";
		}	
	}
	$scope.texto_productoD = function(texto) {
		if(texto.length>30){
			return "font-family: 'Open Sans', sans-serif;font-size: 15px;color:#512C12;font-weight: bold;";
		}else{
			return "font-family: 'Open Sans', sans-serif;font-size: 18px;color:#512C12;font-weight: bold;";
		}	
	}
	//FIN ESTILOS
})
;
window.alerta=function(mensaje, $ionicPopup){
		var alertPopup = $ionicPopup.alert({title: "Aviso",template: mensaje});
		alertPopup.then(function(res) {});
}
/**
 * 
 * @returns regresa un número aleatorio de 8 digitos a partir de 10000000 y hasta 99999999 
 */
window.guid=function(){
	var guid = Math.floor(Math.pow(10,14)*Math.random()*Math.random())%(99999999-10000000+1)+1;
	localStorage.setItem("uuidU", guid);
	return guid;
}
window.puedecobrar=function(idequipo,ipspermitidas){
		var puede=false;
		if(ipspermitidas!=null){
			var divison=ipspermitidas.split(",");
			for(var jj=0;jj<divison.length;jj++){
				if(divison[jj]==idequipo){
					puede=true;
					break;
				}	
			}
		}		
		return puede;
}
window.eliminacookies = function() {
    const cookies = document.cookie.split(";");
			console.log("COOKIES 1 ",cookies );
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
		console.log("COOKIES 2 ",cookies);
}
Array.prototype.max = function(arreglo) {
  return Math.max.apply(null, this);
};
var COMEDOR=1;
var LLEVAR=2;
var PLATAFORMA=7;
var vista="";
var notarevisar=-1;
var puedemandarComandaLock=false;
var versionSistema="2.9.22 20122023";
var contenidoNota;
var comentariosPop;
var poppupPaquete;
var creditDebit=["Crédito", "Débito"];
var opcionesTarjeta=["Otras", "American Express"];
var subcajeroMain=0.0;