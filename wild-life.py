from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

# Create Flask app
app = Flask(__name__)

# Create connexion with the DB in MongoDB
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'wild-life'
COLLECTION_NAME = 'species'
FIELDS = {'IUCN': True, 'Category': True, 'SPEC': True, 'Species': True,
          'COU': True, 'Country': True, 'Value': True}


# Set up route to render index.html
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/wild-life/species") ## Why is it not finding this?
def wildlife_species():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection [DBS_NAME][COLLECTION_NAME]
    species = collection.find(projection=FIELDS, limit=55000)

    json_species=[]
    for specie in species:
        json_species.append(specie)
    json_specie = json.dumps(json_species)
    connection.close()
    return json_species

if __name__ == "__main__":
    app.run(debug=True)


