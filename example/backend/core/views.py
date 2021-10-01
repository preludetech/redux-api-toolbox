from django.http import HttpResponseRedirect


def confirm_password_reset(request, uidb64, token):
    return HttpResponseRedirect(
        f"http://localhost:5000/password-reset/confirm/{uidb64}/{token}"  # TODO
    )
