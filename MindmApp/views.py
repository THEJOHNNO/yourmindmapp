from django.shortcuts import render
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import *
import json
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.db import IntegrityError, InternalError
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
import os
from django.conf import settings
from django.views.decorators.csrf import csrf_protect


#login and register view
@csrf_exempt
def index(request):
    return render(request, "MindmApp/index.html", {
        "welcome": "Welcome",
    })

#login view
@ensure_csrf_cookie
def login_view(request):
    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            return HttpResponseRedirect(reverse("MindmApp:main"))
        else:
            return render(request, "MindmApp/index.html", {
                "warning": "Incorrect login details, please try again."
            })
    else:
        return render(request, "MindmApp/index.html", {
            "warning": "You are not authorized. Please try again."
        })

#logout view
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("MindmApp:index"))

#register view
@ensure_csrf_cookie
def register_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # do passwords match?
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "MindmApp/index.html", {
                "warning": "Passwords must match."
            })

        # create new user, or else it is already a taken username.
        try:
            user = CustomUser.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "MindmApp/index.html", {
                "warning": "Username already taken."
            })

        # login using CSRF cookie
        login(request, user)

        #list of all unchangeable textarea id's
        allTextareas = ["Tp2_n11", "Tp7_n10", "Tp1_n10", "Tp2_n12", "Tp4_n10", "Tp5_n10", "Tp2_n10", "Tp1_n", "Tp2_n8", "Tp2_n6", "Tp1_n6", "Tp1_n8", "Tp5_center", "Tp4_center", "Tp3_n8", "Tp4_n8", "Tp6_n8", "Tp8_n8", "Tp12_n4", "Tp7_n6", "Tp11_n4", "Tp8_n10", "Tp9_n3", "Tp10_n3", "Tp1_center", "Tp2_center", "Tp8_n3", "Tp3_center", "Tp6_n2", "Tp7_n2", "Tp6_center", "Tp6_n7", "Tp8_n7", "Tp9_n2", "Tp2_n7", "Tp1_n7", "Tp9_n7", "Tp5_n9", "Tp6_n9", "Tp7_n9", "Tp8_n9", "Tp9_n9", "Tp1_n9", "Tp2_n9", "Tp3_n9", "Tp4_n5", "Tp5_n5", "Tp1_n5", "Tp1_nFirst", "Tp7_nFirst", "Tp8_nFirst", "Tp1_n2", "Tp2_n2", "Tp3_n2", "Tp3_n5", "Tp8_n2", "Tp3_n7", "Tp1_n3", "Tp2_n3", "Tp3_n3", "Tp5_n2", "Tp7_n4", "Tp6_n4", "Tp5_n4", "Tp4_n4", "Tp3_n4", "Tp4_n3", "Tp5_n3", "Tp6_n3", "Tp7_n3", "Tp5_n6", "Tp6_n6"]

        #list of all unchangeable node id's
        neurons = ["nCenter_dropdown", "nFirst_dropdown", "n2_dropdown", "n3_dropdown", "n4_dropdown", "n5_dropdown", "n6_dropdown", "n7_dropdown", "n8_dropdown", "n9_dropdown", "n10_dropdown", "n11_dropdown", "n12_dropdown"]

        # create database objects for all nodes.
        for i in neurons:
            UserImages.objects.create(user=user, imageDropdownId=i)

        # create database objects for all textareas.
        for i in allTextareas:
            UserTextArea.objects.create(user=user, textAreaId=i)

        MindMapName.objects.create(user=user)


        return render(request, "MindmApp/index.html", {
            "message": "Registration successful! Please login."
        })
    else:
        return render(request, "MindmApp/index.html")


# login using CSRF cookie
@login_required
def main_view(request):
    user = request.user

    # get static subfolders
    STATIC_SUBFOLDER = os.path.join(settings.BASE_DIR, "MindmApp/static/MindmApp/media")
    #get list of images from django media folder (declared in settings.py)
    lst=[]
    for root, dirs, files in os.walk(STATIC_SUBFOLDER):
        for file in files:
            lst.append(file)


    # remove image extension from text to view in dropdown menu
    image_list = [os.path.splitext(x)[0] for x in lst]

    #return list of images to show in dropdown menu's in main app (main.html)
    return render(request, "MindmApp/main.html", {
            "imageList": image_list,
        })


@login_required
@csrf_exempt #csrf only needed for logins
def getText(request): #update database with custom user text for text area
    #if fetch request was POST
    if request.method == "POST":

        #get the json data from fetch request
        data = json.loads(request.body)
        user = request.user
        textAreaId = data.get("textAreaId")
        textAreaPlaceholder = data.get("textAreaPlaceholder")

        # update database for user text in textarea
        userTextArea = UserTextArea.objects.get(user=user, textAreaId=textAreaId)
        print(userTextArea.user)
        print(userTextArea.textAreaId)
        userTextArea.textAreaPlaceholder = textAreaPlaceholder
        userTextArea.save()

        # return a Json response with the name of the user who updated the textarea, and the id of the text area.
        return JsonResponse({"message": f"user: {user}\ntextAreaId: {textAreaId}"}, status=500)

#need to be logged in to get textarea information
@login_required
@csrf_exempt
def getTextToShow(request):
    if request.method == "PUT":
        # get the currect user
        user = request.user
        data = json.loads(request.body)
        textAreaId = data.get("textAreaId")

        try: #get the text for a textarea for the correct user
            userTextArea = UserTextArea.objects.get(user=user, textAreaId=textAreaId)
            textAreaPlaceholder = userTextArea.textAreaPlaceholder
            return JsonResponse({"textAreaPlaceholder": f"{textAreaPlaceholder}"}, status=201)

        # handle exceptions with Json responses
        except ObjectDoesNotExist:
            return JsonResponse({"problem": f"There is no text for this..."}, status=500)
        except MultipleObjectsReturned:
            return JsonResponse({"problem": f"Too many objects returned..."}, status=500)
        except InternalError:
            return JsonResponse({"problem": f"problem"}, status=500)

    else:
        return JsonResponse({"problem": f"Not a proper request"}, status=500)


@login_required
@csrf_exempt
def chooseImage(request):
    if request.method == "PUT":
        # get the current user
        user = request.user

        # get user data from fetch PUT request
        data = json.loads(request.body)

        # get text for specific textarea (based on id) typed in by user
        thisLinkText = data.get("thisLinkText")
        imageDropdownId = data.get("imageDropdownId")

        # update image chosen for node from dropdown in main.html
        userImages = UserImages.objects.get(user=user, imageDropdownId=imageDropdownId)
        userImages.thisLinkText = thisLinkText
        userImages.save()

        # respond with Json response containing the user text
        return JsonResponse({"thisLinkText": f"{thisLinkText}"}, status=201)


@login_required
@csrf_exempt
def loadImages(request):
    # get the current user
    user = request.user

    # reason for all of the following:
            # get text for each text area in the app for the specified user (line 192)

    nCenter_dropdown = "nCenter_dropdown"
    nCenter_dropdown = UserImages.objects.get(user=user, imageDropdownId=nCenter_dropdown)
    nCenter_dropdown = nCenter_dropdown.thisLinkText

    nFirst_dropdown = "nFirst_dropdown"
    nFirst_dropdown = UserImages.objects.get(user=user, imageDropdownId=nFirst_dropdown)
    nFirst_dropdown = nFirst_dropdown.thisLinkText

    n2_dropdown = "n2_dropdown"
    n2_dropdown = UserImages.objects.get(user=user, imageDropdownId=n2_dropdown)
    n2_dropdown = n2_dropdown.thisLinkText

    n3_dropdown = "n3_dropdown"
    n3_dropdown = UserImages.objects.get(user=user, imageDropdownId=n3_dropdown)
    n3_dropdown = n3_dropdown.thisLinkText

    n4_dropdown = "n4_dropdown"
    n4_dropdown = UserImages.objects.get(user=user, imageDropdownId=n4_dropdown)
    n4_dropdown = n4_dropdown.thisLinkText

    n5_dropdown = "n5_dropdown"
    n5_dropdown = UserImages.objects.get(user=user, imageDropdownId=n5_dropdown)
    n5_dropdown = n5_dropdown.thisLinkText

    n6_dropdown = "n6_dropdown"
    n6_dropdown = UserImages.objects.get(user=user, imageDropdownId=n6_dropdown)
    n6_dropdown = n6_dropdown.thisLinkText

    n7_dropdown = "n7_dropdown"
    n7_dropdown = UserImages.objects.get(user=user, imageDropdownId=n7_dropdown)
    n7_dropdown = n7_dropdown.thisLinkText

    n8_dropdown = "n8_dropdown"
    n8_dropdown = UserImages.objects.get(user=user, imageDropdownId=n8_dropdown)
    n8_dropdown = n8_dropdown.thisLinkText

    n9_dropdown = "n9_dropdown"
    n9_dropdown = UserImages.objects.get(user=user, imageDropdownId=n9_dropdown)
    n9_dropdown = n9_dropdown.thisLinkText

    n10_dropdown = "n10_dropdown"
    n10_dropdown = UserImages.objects.get(user=user, imageDropdownId=n10_dropdown)
    n10_dropdown = n10_dropdown.thisLinkText

    n11_dropdown = "n11_dropdown"
    n11_dropdown = UserImages.objects.get(user=user, imageDropdownId=n11_dropdown)
    n11_dropdown = n11_dropdown.thisLinkText

    n12_dropdown = "n12_dropdown"
    n12_dropdown = UserImages.objects.get(user=user, imageDropdownId=n12_dropdown)
    n12_dropdown = n12_dropdown.thisLinkText

    # return user text for all text areas
    return JsonResponse({"nCenter_dropdown": f"{nCenter_dropdown}", "nFirst_dropdown": f"{nFirst_dropdown}", "n2_dropdown": f"{n2_dropdown}", "n3_dropdown": f"{n3_dropdown}", "n4_dropdown": f"{n4_dropdown}", "n5_dropdown": f"{n5_dropdown}", "n6_dropdown": f"{n6_dropdown}", "n7_dropdown": f"{n7_dropdown}", "n8_dropdown": f"{n8_dropdown}", "n9_dropdown": f"{n9_dropdown}", "n10_dropdown": f"{n10_dropdown}", "n11_dropdown": f"{n11_dropdown}", "n12_dropdown": f"{n12_dropdown}"}, status=201)

@login_required
@csrf_exempt
def mindmap_Name(request):
    if request.method == "PUT":

        data = json.loads(request.body)
        mindmapNameInput = data.get("mindmapNameInput")

        user = request.user
        mindmap_name = MindMapName.objects.get(user=user)
        mindmap_name.name = mindmapNameInput
        mindmap_name.save()

        return JsonResponse({"mindmapNameInput": f"{mindmapNameInput}"}, status=201)


@login_required
@csrf_exempt
def get_mindmap_name(request):
    user = request.user

    mindmap_name = MindMapName.objects.get(user=user)
    mindmap_name = mindmap_name.name
    return JsonResponse({"mindmap_name": f"{mindmap_name}"}, status=201)
