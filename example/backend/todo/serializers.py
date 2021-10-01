from rest_framework import serializers
from . import models


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TodoItem
        fields = ["id", "name", "done"]
        # DOCS always include the id field, it is needed by the frontend helpers
