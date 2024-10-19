from pymongo import MongoClient

import constants

client = MongoClient(
    constants.IP_SERVER,
    username=constants.MONGO_INITDB_ROOT_USERNAME,
    password=constants.MONGO_INITDB_ROOT_PASSWORD
)

maggots = client['Maggots']

clients_collection = maggots['Clients']
conversations_collection = maggots['Conversations']
supports_collection = maggots['Supports']
authentication_collection = maggots['Passwords']