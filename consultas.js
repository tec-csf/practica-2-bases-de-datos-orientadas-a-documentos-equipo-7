#Seleccionar DB
use Practica2

#Consultas

#Primera consulta, cantidad de personas con nombre "Samantha"
db.Duenio.aggregate(
[
	{$match:
		{
			"Nombre":"Samantha"
		}
	},
	{$group:
		{
			_id:"$Nombre",
			cantidad: {$sum:1}
		}
	},
	{$project:
		{
			"_id":1,cantidad:1
		}
	}
]
)

#Segunda consulta, cantidad de tiendas del mismo nombre ordenadas alfabeticamente
db.Tienda.aggregate(
[
	{$group:
		{
			_id:"$Nombre",
			Cantidad:{$sum:1}
		}
	},
	{$project:
		{
			"_id":1,Cantidad:1
		}
	},
	{$sort:{_id:1}}
]
)

#Tercera consulta, cantidad de locaciones por colonia a partir de la colonia 50
db.Direccion.aggregate(
[
	{$match:
		{
			"Colonia":{$gt:50}
		}
	},
	{$group:
		{
			_id:"$Colonia",
			Cantidad:{$sum:1}
		}
	},
	{$project:
		{
			"_id":1,Cantidad:1
		}
	},
	{$sort:{_id:1}}
]
)