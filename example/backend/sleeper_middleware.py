import time

def sleeper(get_response):
    def middleware(request):
        response = get_response(request)
        # time.sleep(2)
        return response

    return middleware
