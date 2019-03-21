# --------------------------------
# -------- Isertar datos ---------
# --------------------------------

#Conectarse al router
docker exec -it mongo-router-p2 mongo

#Creacion y uso de DB para la práctica
use Practica2

#Grupos de datos para generar datos aleatorios

nombres = ["Marc", "Bill", "George", "Eliot", "Matt", "Trey", "Tracy", "Greg", "Steve", "Kristina", "Katie", "Jeff","Samantha","Saul","Emilio","María José"];

apellidos = ["Barco","Mejia","Labra","Cruz","Hernández","López","Navarro","Mendez","Torres"];

digitos = ["0","1","2","3","4","5","6","7","8","9"]

tiendas = ["Oxxo","7 Eleven","Walmart","Soriana","Chedraui","HEB","Costco","Sam's Club","La Comer","Superama","McDonald's","Burger King","Chuck-E-Cheese","Carl's Jr."]


#Insertar datos de los dueños
var bulk = db.Duenio.initializeUnorderedBulkOp();

for(var i=0; i<100000; i++){
   IFE = i;
   Nombre = nombres[Math.floor(Math.random()*nombres.length)];
   Apellidos = apellidos[Math.floor(Math.random()*apellidos.length)] + " " + apellidos[Math.floor(Math.random()*apellidos.length)];
   Telefono = digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   "-" +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)];
   bulk.insert( { "IFE":IFE, "Nombre":Nombre, "Apellidos":Apellidos, "Telefono":Telefono });
}
bulk.execute();

#Insertar datos de las direcciones

var bulk = db.Direccion.initializeUnorderedBulkOp();
for(var i=0; i<100000; i++){
   idDireccion = i;
   CodigoPostal = 
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)] +
   digitos[Math.floor(Math.random()*digitos.length)];
   Numero = Math.floor(Math.random()*1000)+200;
   Calle = Math.floor(Math.random()*10000)+200;
   Colonia = Math.floor(Math.random()*100)+1;
   bulk.insert( { "Calle":Calle, "Colonia":Colonia, "Numero":Numero, "IdDireccion":idDireccion, "CodigoPostal":CodigoPostal});
}
bulk.execute();


#Insertar datos de las tiendas

var bulk = db.Tienda.initializeUnorderedBulkOp();

for(var i=0;i<100000;i++){
  IFEDuenio = Math.floor(Math.random()*100001);
  IdTienda = i;
  IdDireccion = Math.floor(Math.random()*100001);
  Nombre = tiendas[Math.floor(Math.random()*tiendas.length)];
  bulk.insert({"IFEDuenio":IFEDuenio,"IdTienda":IdTienda,"IdDireccion":IdDireccion,"Nombre":Nombre});
}
bulk.execute();

#Para verificar que los chunks están funcionando correctamente
db.Duenio.getShardDistribution()
db.Direccion.getShardDistribution()
db.Tienda.getShardDistribution()