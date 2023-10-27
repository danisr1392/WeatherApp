//Daniel Serrano//
//peJLRLnqRAqUGnpZoF3mHKwLHI5nP9ru key 1
//MQvVGOB3GhG3maTqAvgMeEbpib4f5ukY key 2
const key ="peJLRLnqRAqUGnpZoF3mHKwLHI5nP9ru"; // mi key de la api //

//1
//función para introducir la ciudad deseada y obtener datos
$(document).ready(function(){

  	$("#buscar").click(function (){
	    
        //ciudad que le pasamos por el buscador
        let ciudad = $("#ciudadBuscador").val();
    
			//llamo a la API para el método de buscar ciudad por texto
			$.get("https://dataservice.accuweather.com/locations/v1/cities/search", {q:ciudad, apikey:key, language:'es-es'},

			function(datos, estado){
			   if(estado == "success" && datos != null){ //compruebo que se ha ejecutado correctamente
					   
				   let numLocalizaciones = datos.length; //obtengo el número de posibles localizaciones que coinciden con la búsqueda

					//declaro la variable que va a almacenar la ciudad introducida por teclado y su respectivo país
					let opcion = "";

				   if(numLocalizaciones > 0){
					   
					   $("#mensajeError").hide(); //oculto si lo hubiera un posible mensaje de error
					   $("#opciones").show(); //muestro el select una vez que se que la localización existe

					   //por cada posible localización meto sus datos en un option del select de ciudades
					   for (let i = 0; i < datos.length; i++){

						   //la opcion tiene como value su código de localización, de valor el nombre que metemos por teclado y entre paréntesis el país de origen
						   opcion += "<option value =" + datos[i].Key + ">" + datos[i].LocalizedName + "(" + datos[i].Country.LocalizedName + ")" + "</option>";
					   }
					   
					   //le paso las opciones al select
					   $("#ciudadesOpciones").html(opcion);
					   
					   obtenerTiempo(); //hacemos que aparezca la previsión del tiempo de la primera opción
					   
				   //localización desconocida
				   }else{

					   $("#mensajeError").show(); //muestro el mensaje de error
					   $("#mensajeError").html("<p>Localización desconocida</p>");
				   }
			   }
	   	}, "json");
	});
});




//2
//función para que cuando cambie la opción del select te aparezca automáticamente los nuevos datos
$('#ciudadesOpciones').on('change', function(){
	obtenerTiempo();
});




//3
//función con jquery para conseguir la fecha actual
$.hoy = function(dateObject){

	var fecha = new Date(dateObject);

	var dia = fecha.getDate();
	var mes = fecha.getMonth() + 1;
	var anyo = fecha.getFullYear();

	var hoy = dia + "/" + mes + "/" + anyo;

	return hoy;
};

	


//4
//función para obtener el tiempo de la ciudad introducida
function obtenerTiempo(){
	
	let codigoCiudad = $("#ciudadesOpciones option:selected").val();  //obtengo el código de la ciudad para usarlo luego en el fetch

	fetch("https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + codigoCiudad + "?apikey=" + key + "&language=es-es&details=true&metric=true")    

		.then((result) => {
			return result.json(); //devuelvo los valores obtenidos y procedo a plasmarlos en el HTML
		})

		.then((datos)=>{ //obtengo los datos de la ciudad seleccionada

			let info = ""; //cadena para ir metiendo los datos metereoógicos
			let icono = ""; //cadena para añadir el icono

			//realizo el bucle 5 veces para obtener los datos de 5 días
			for(let i = 0; i < 5; i++){

				if(datos.DailyForecasts[i].Day.Icon < 10){
					icono = "0" + datos.DailyForecasts[i].Day.Icon;  //hay que añadirle un 0 a la cadena de los iconos del 1 al 9 para que los acepte
				}else{
					icono = datos.DailyForecasts[i].Day.Icon;
				}
				
				let lluvia = ""; //cadena para indicar si llueve o no

				if(datos.DailyForecasts[i].Day.HasPrecipitation == true){
					lluvia = "Si";
				}else{
					lluvia = "No";
				}


				let direccionViento = datos.DailyForecasts[i].Day.Wind.Direction.Localized; //variable para guardar la direccion del viento

				//las siglas de direcciones del viento eran demasiadas (habia cosas como ENE(este por el noroeste)) así que lo limte a norte, sur, este, oeste
				if(direccionViento.charAt(0) == "N"){
					direccionViento = "Norte";
				}else if(direccionViento.charAt(0) == "S"){
					direccionViento = "Sur";
				}else if(direccionViento.charAt(0) == "E"){
					direccionViento = "Este";
				}else if(direccionViento.charAt(0) == "O"){
					direccionViento = "Oeste";
				}

				//meto todos los datos en una cadena y la devuelvo al HTML
				info +="<fieldset><img src='iconos/" + icono + "-s.png'><br>"
					+ "<h3>" + datos.DailyForecasts[i].Day.IconPhrase  + "</h3>"
					+ "<p><b>Lluvia: </b> " + lluvia +"</p>"
					+ "<p><b>Temperatura Mínima: </b> " + datos.DailyForecasts[i].Temperature.Minimum.Value + "°C</p>" 
					+ "<p><b>Temperatura Máxima: </b> " + datos.DailyForecasts[i].Temperature.Maximum.Value + "°C</p>"
					+ "<p><b>Velocidad del Viento: </b> " + datos.DailyForecasts[i].Day.Wind.Speed.Value + "km/h</p>"
					+ "<p><b>Dirección del Viento: </b> " + direccionViento + "</p>" 
					+ "<p><b>Radiación Solar: </b> " + datos.DailyForecasts[i].Day.SolarIrradiance.Value + "W/m²</p>"  
					+ "<span>" + $.hoy (datos.DailyForecasts[i].Date) +"</span></fieldset>";
			}
			
			$("#resultado").html(info);
		})
	.catch(console.log)
	.finally(console.warn('La consulta ha finalizado'));
}



