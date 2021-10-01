from . import models
from rest_framework import serializers
from rest_framework.authtoken.models import Token


class WhoAmISerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = [
            "id",
            "email",
            "is_active",
            "first_name",
            "last_name",
            "is_superuser",
        ]
