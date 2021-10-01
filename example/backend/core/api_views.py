from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend

# from . import models
from . import serializers


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def who_am_i(request):
    # TODO: turn this into a class based view
    serializer = serializers.WhoAmISerializer(request.user)
    return Response(serializer.data)
