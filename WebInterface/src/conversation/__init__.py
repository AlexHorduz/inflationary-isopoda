from pymongo import MongoClient

from constants import MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, IP_SERVER

client = MongoClient(
    IP_SERVER,
    username=MONGO_INITDB_ROOT_USERNAME,
    password=MONGO_INITDB_ROOT_PASSWORD
)

