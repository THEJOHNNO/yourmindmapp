from django.urls import path
from . import views

app_name = "MindmApp"

urlpatterns = [
    path("", views.index, name="index"),
    # view to login
    path("login", views.login_view, name="login"),
    # view to logout
    path("logout", views.logout_view, name="logout"),
    # view to register
    path("register", views.register_view, name="register"),
    # main app url
    path("main", views.main_view, name="main"),
    # url to send textarea changes to server
    path("getText", views.getText, name="getText"),
    # url to get text from database to show in main.html
    path("getTextToShow", views.getTextToShow, name="getTextToShow"),
    # url to send chosen node image to server
    path("chooseImage", views.chooseImage, name="chooseImage"),
    # url to get node image name from database to show in main.html
    path("loadImages", views.loadImages, name="loadImages"),
    #change mindmap name
    path("mindmap_Name", views.mindmap_Name, name="mindmap_Name"),
    #get mindmap Name
    path("get_mindmap_name", views.get_mindmap_name, name="get_mindmap_name")
]
