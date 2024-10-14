from datetime import datetime
import logging

from . import clients_collection

class Clients:
    def __init__(self, nickname):
        self.client_nickname = nickname

    def get_since(self) -> datetime | bool:
        try:
            return clients_collection.find({"name": self.client_nickname})[0]['client_since']
        except Exception as e:
            logging.error(e)
            return False
