from django.contrib import admin
from .models import *


# models registered
admin.site.register(CustomUser)
admin.site.register(UserTextArea)
admin.site.register(UserImages)
