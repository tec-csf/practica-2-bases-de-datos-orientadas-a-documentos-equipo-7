#Creación de red para Sharding
docker network create mongo-sh-p2

# -----------------------------------------------
# ------ Configurar el Config Replica Set -------
# -----------------------------------------------

#Contenedores para los nodos
docker run --name mongo-config1-p2 -d --net mongo-sh-p2 mongo --replSet "rsConfigP2" --configsvr
docker run --name mongo-config2-p2 -d --net mongo-sh-p2 mongo --replSet "rsConfigP2" --configsvr
docker run --name mongo-config3-p2 -d --net mongo-sh-p2 mongo --replSet "rsConfigP2" --configsvr

#Iniciar terminal con nodo
docker exec -it mongo-config1-p2 bash

#Conectarse a nodo
mongo --host mongo-config1-p2 --port 27019

#Inicializar el Config Replica Set
config = {
      "_id" : "rsConfigP2",
      "configsvr": true,
      "members" : [
          {
              "_id" : 0,
              "host" : "mongo-config1-p2:27019"
          },
          {
              "_id" : 1,
              "host" : "mongo-config2-p2:27019"
          },
          {
              "_id" : 2,
              "host" : "mongo-config3-p2:27019"
          }
      ]
  }
rs.initiate(config)

#Para salir
exit
exit

# ------------------------------------------------
# ------ Configurar los Shard Replica Sets -------
# ------------------------------------------------

#Contenedores para los nodos del Shard Replica Set
docker run --name mongo-shard11-p2 -d --net mongo-sh-p2 mongo --replSet "rsShard1P2" --shardsvr
docker run --name mongo-shard12-p2 -d --net mongo-sh-p2 mongo --replSet "rsShard1P2" --shardsvr
docker run --name mongo-shard13-p2 -d --net mongo-sh-p2 mongo --replSet "rsShard1P2" --shardsvr

#Iniciar terminal en uno de los nodos
docker exec -it mongo-shard11-p2 bash

#Conectarse a nodo
mongo --host mongo-shard11-p2 --port 27018

#Inicializar el Shard Replica Set
config = {
      "_id" : "rsShard1P2",
      "members" : [
          {
              "_id" : 0,
              "host" : "mongo-shard11-p2:27018"
          },
          {
              "_id" : 1,
              "host" : "mongo-shard12-p2:27018"
          },
          {
              "_id" : 2,
              "host" : "mongo-shard13-p2:27018"
          }
      ]
  }
rs.initiate(config)

#Para salir
exit
exit

# --------------------------------
# ------ Iniciar el Router -------
# --------------------------------

docker run  --name mongo-router-p2 -d -p 27017:27017 --net mongo-sh-p2 mongo  mongos --configdb rsConfigP2/mongo-config1-p2:27019,mongo-config2-p2:27019,mongo-config3-p2:27019 --bind_ip_all

#Conectarse al router
docker exec -it mongo-router-p2 mongo

#Adicionar shards al clúster
sh.addShard( "rsShard1P2/mongo-shard11-p2:27018")
sh.addShard( "rsShard1P2/mongo-shard12-p2:27018")
sh.addShard( "rsShard1P2/mongo-shard13-p2:27018")

#Creacion y uso de DB para la práctica
use Practica2

#Habilitar sharding para dicha DB
sh.enableSharding("Practica2")

#Crear colecciones
db.createCollection("Tienda")
db.createCollection("Duenio")
db.createCollection("Direccion")

#Habilitar sharding en las colecciones
sh.shardCollection("Practica2.Tienda", { "IFEDuenio" : "hashed" } )
sh.shardCollection("Practica2.Duenio", { "Nombre" : "hashed" } )
sh.shardCollection("Practica2.Direccion", { "Colonia" : "hashed" } )
