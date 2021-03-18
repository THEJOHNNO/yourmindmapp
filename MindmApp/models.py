from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

#If error django: no such table pops up, you must sync the database when you migrate:
#               python manage.py migrate --run-syncdb

# Implementation of case case_insensitive username login capability
class CustomUserManager(UserManager):
    def get_by_natural_key(self, username):
        case_insensitive_username_field = '{}__iexact'.format(self.model.USERNAME_FIELD)
        return self.get(**{case_insensitive_username_field: username})

# user table
class CustomUser(AbstractUser):
    # allow for Implementation of CustomUserManager class
    objects = CustomUserManager()

# user text areas table
class UserTextArea(models.Model):
    user = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="userOfText")
    textAreaId = models.TextField(blank=False)
    textAreaPlaceholder = models.TextField(blank=True)

# node images chosen by user table
class UserImages(models.Model):
    user = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="userOfImage")
    thisLinkText = models.TextField(blank=True)
    imageDropdownId = models.TextField(blank=False)

class MindMapName(models.Model):
    user = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="userOfMindMapName")
    name = models.TextField(blank=True)
