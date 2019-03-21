from flask import request, url_for, jsonify
from flask_api import FlaskAPI, status, exceptions
from pymongo import MongoClient
from bson.son import SON

app = FlaskAPI(__name__)

@app.route("/")#, methods=['GET'])
def obtener():
    mongo_uri = "mongodb://mongo-router-p2:27017"
    
    client = MongoClient(mongo_uri)
    db = client.Practica2
    collectionDirector = db.Duenio
    collectionTienda = db.Tienda
    collectionDireccion = db.Direccion
    
    #buscando la direccion con código postal 02938
    #result = db.Direccion.find_one()
    
    #Primera consulta, cantidad de personas con nombre "Samantha"
    pipe = [{"$match":{"Nombre":"Samantha"}},{"$group":{"_id":"$Nombre","cantidad":{"$sum":1}}},{"$project":{"_id":1,"cantidad":1}},{"$sort": SON([("cantidad", -1), ("_id", -1)])}]
    
    cursor = collectionDirector.aggregate(pipe)
    
    result1 = list(cursor)
    
    #Segunda consulta, cantidad de tiendas del mismo nombre ordenadas alfabeticamente
    pipe = [{"$group":{"_id":"$Nombre","cantidad":{"$sum":1}}},{"$project":{"_id":1,"cantidad":1}},{"$sort":{"_id":1}}]
    
    cursor = collectionTienda.aggregate(pipe)
    
    result2 = list(cursor)
    
    #Tercera consulta, cantidad de locaciones por colonia a partir de la colonia 50
    pipe = [{"$match":{"Colonia":{"$gt":50}}},{"$group":{"_id":"$Colonia","Cantidad":{"$sum":1}}},{"$project":{"_id":1,"Cantidad":1}},{"$sort":{"_id":1}}]
    
    cursor = collectionDireccion.aggregate(pipe)
    
    result3 = list(cursor)
    
    return [result1,result2,result3]


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

