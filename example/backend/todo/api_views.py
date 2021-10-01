from rest_framework import viewsets

from . import models
from . import serializers


class TodoItemViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TodoItemSerializer
    queryset = models.TodoItem.objects.order_by("pk")
    permission_classes = (
        []
    )  # DOCS: this makes the viewset public. Technically speaking this is very naughty. DRF works beautifully with Guardian, https://django-guardian.readthedocs.io/en/stable/
