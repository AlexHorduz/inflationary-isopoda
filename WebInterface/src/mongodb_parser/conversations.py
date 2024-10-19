from fastapi import status, HTTPException

from . import conversations_collection
from structure import Conversation, Messages, User
from .clients import Clients

class Conversations:
    def __init__(self, user: User):
        self.clients = Clients(user)
        self.user = user
        self.conversations = self.__get_conversations()

    def __get_conversations(self) -> Conversation:
        found_conv = list(conversations_collection.find({"client_id": self.clients.get_id()}))
        if not found_conv:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong client"
            )
        conversations_list = []
        for conv in found_conv:
            conversations_list.append(
                Conversation(id=str(conv['_id']),
                            client_id=str(conv['client_id']),
                            detected_topics=conv['detected_topics'],
                            is_detected_correctly=conv['is_detected_correctly'],
                            possible_list_of_topics=conv['possible_list_of_topics'],
                            support_id=conv['support_id'],
                            messages=conv['messages'],
                            )
            )
        return conversations_list

