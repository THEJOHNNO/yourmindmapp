

<div style="background-color: rgba(236, 242, 246, 0.5); padding: 10px; padding-left: 26px; padding-right: 26px;">

<u>

## HarvardX [CS50W](https://www.edx.org/course/cs50s-web-programming-with-python-and-javascript): Web Programming with Python and JavaScript

</u>

<a href="https://www.youtube.com/watch?v=H4gN1CRU8Pc" target="blank">Youtube video for project </a>(Select 1080p)

<u>

### MindmApp Description

</u>

The brain includes a complex network of around 100 billion neurons that communicate with one another via electrical impulses. This is the high-level structure, if you will, of neural processing. The word "brainstorm" and "mindmap" both relate to neural processing - as an outward expression of an inward mechanism. The name MindmApp is a play on words, a symbiosis between Mind and App, a place where simple and user friendly technology meets the human mind.

MindmApp is a web app for creating custom mindmaps. Whether you want to brainstorm, deploy, or share your ideas, MindmApp is for you. It's unique functionality is distinct from previous projects in this course, as it isn't a search, wiki, eCommerce, mail, or social network app - it's a MindmApp. You can choose images as central nodes, and add descriptive or exploratory text to enhance the richness of your idea generation.

MindmApp was built with serverside Django, frontend Javascript, HTML, and CSS, and a sprinkling of React. The CSS, Javascript, and React languages allow for mobile responsiveness, and the serverside Django allows for saving text and image names to a database (SQLite). Scroll down to the `models.py` section in Additional Info to see the specifics about the database models.

The app is currently responsive to iPads, smartphones, laptops, and computers with larger screens. When opening the app, you will be shown a How-To popup that describes the app's usability in detail.


<u>

### How to run MindmApp

</u>

  - *Make sure you are in the project root directory before running these commands.*
  - Install MindmApp dependencies by running the following command in terminal:<br/> `pip install -r requirements.txt` <br/> *Note: Python and pip need to be installed before running this command.*
  - Make migrations by running `python manage.py makemigrations`
  - Apply migrations by running `python manage.py migrate` <br/> *Note: If this does not work, run* `python manage.py migrate --run-syncdb` *instead.*
  - To run the app, enter the following into the terminal:<br/>
  `python manage.py runserver`

  - The terminal should print out something that looks like this:
  <br/>&nbsp;&nbsp;&nbsp;`Starting development server at http://127.0.0.1:8000/`
  <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   Copy the <a href="http://127.0.0.1:8000/" target="_blank">http link</a> and paste it into a browser of your choice to run the app.

<u>

### Project Directories and Files

</u>


  - **`capstone`** - project root directory.
    - **`capstone`** - django root directory.
      - `urls.py` - added some text to `urls.py` (explained with comments) in order to use the created media directory for image files.
      - `settings.py` - added some text to `settings.py` in order to point to the media directory craeted for image files.
    - **`media`** - I created this media directory to store image files for MindmApp dropdown menu's and nodes.
    - **`MindmApp`** - app directory.
      - **`static`** - static directory created to store static image and css files.
        - **`MindmApp`** - sub-directory inside static directory for app.
          - `main.js` - javascript file for functionality of MindmApp app. Most of the app's user functionality is written in javascript, including the loading of textareas and node images.
          - `favicon.ico` - favicon image for MindmApp.
          - `index.css` - CSS for login & register page (`index.html`) styling.
          - `login_background_portrait.jpg` - background image for login & register page.
          - `main.css` - CSS for mindmap page (`main.html`) styling.
      - **`templates`** - templates directory created to store templates (html files).
        - **`MindmApp`** - sub-directory inside templates directory for app.
          - `index.html` - login/registration page written in plain javascript React to dynamically load forms.
          - `layout.html` - html layout file as the template for both `index.html` and `main.html`. This also includes links for babel (Javascript compiler for React.js) and bootstrap (front-end framework for styling) and mobile responsiveness functionality.
          - `main.html` - main MindmApp html page including SVG code for MindmApp image, and html for textareas and nodes (neurons).
      - `admin.py` - added some text to register the models written in `models.py`.
      - `models.py` - added models (info in additional info).
      - `urls.py` - urls.py file created includes url paths for each view in `views.py`.
      - `views.py` - added views (info in additional info).
    - `requirements.txt` - file with list of required dependencies to install in order to run app.

<u>

### Additional Info

</u>

I drew and edited the background image for the login/register page, and there is therefore no copyright associated with it. I also drew the mindmap image (svg file) in `main.html`. Each user has their own MindmApp, and no one user can edit another user's MindmApp.

- models in `models.py`:
  - CustomUserManager model which extends CustomUser(AbstractUser) for implementation of case-insensitive login functionality.
  - UserTextArea model for the text a user types into each textarea in their MindmApp.
  - UserImages model for all the images chosen by the user as node images.
  - MindMapName model for the user-defined name of each user's MindmApp.

- views in `views.py`:
  - index (to render login/register page).
  - login_view (to login user).
  - logout_view (to logout user).
  - register_view (to register user and create user specific database objects for textareas, nodes, and the MindmApp name).
  - main_view (to render the `main.html` app page with a list of files from **`media`**).
  - getText (to get textarea text from user input and add it to database).
  - getText (send user textareas text to `main.html` for rendering).
  - chooseImage (to get the image a user chooses in a dropdown, and add it to the database).
  - loadImages (send user node images to `main.html` for rendering).
  - mindmap_Name (to get MindmApp name from user input and add it to database).
  - get_mindmap_name (send MindmApp name to `main.html` for rendering).
</div>
