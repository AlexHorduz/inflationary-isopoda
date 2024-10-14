from clients import Clients
from supports import Supports

class Conversations(Clients, Supports):
    def __init__(self, nickname):
        super().__init__(nickname)

