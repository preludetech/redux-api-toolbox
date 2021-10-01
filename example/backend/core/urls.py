from django.urls import path

from . import views
from . import api_views

urlpatterns = [
    # path("health_check", views.health_check),
    path("who_am_i/", api_views.who_am_i),
    path(
        "password/reset/confirm/<uidb64>/<token>/",
        views.confirm_password_reset,
        name="password_reset_confirm",
    ),
]
