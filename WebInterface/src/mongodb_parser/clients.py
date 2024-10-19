from datetime import datetime

from fastapi import status, HTTPException
import bson

from . import clients_collection
from structure import Client, User

class Clients:
    def __init__(self, user: User):
        """
        Clients class which is used to parse the MongoDB's Clients collection.
        :param user: Information about the user from cookies.
        """
        self.user = user
        self.client = self._get_client()

    def _get_client(self) -> Client:
        found_client = list(clients_collection.find({"name": self.user.username}))
        if not found_client:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong client"
            )
        return Client(id=str(found_client[0]["_id"]), **found_client[0])

    def get_since(self) -> datetime | bool:
        return self.client.client_since

    def get_id(self):
        return bson.objectid.ObjectId(self.client.id)
