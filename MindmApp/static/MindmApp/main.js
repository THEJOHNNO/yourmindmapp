
  // when the DOM has loaded, run the app
document.addEventListener("DOMContentLoaded", function() {


    // show How To modal if user hasn't yet named their mindmap
    var modal = document.querySelector(".modal");

    // get the user's custom mindmap name from server and only...
    // ...display the modal (How-To) if the user hasn't yet chosen a mindmap name
    fetch('/get_mindmap_name')
    .then(response => response.json())
    .then(mindmapname => {
      if (mindmapname.mindmap_name != "") {
        modal.style.display = "none";
      } else {
      }
    });

    var span = document.getElementsByClassName("close")[0];
    // don't display app when mobile screen is in portrait mode
    if (window.innerHeight > window.innerWidth) {
      modal.style.display = "none";
      document.getElementById("navbarId").style.display = "none";
      document.getElementById("svgFile").style.display = "none";
      document.getElementById("zoomThis").style.display = "none";
      document.getElementById("nameDiv").style.display = "none";
    }
    // close modal when user clicks cross in corner
    span.onclick = function() {
      modal.style.display = "none";
    }
    // close modal when user clicks document outside of the modal
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }



    moveZoom();
    function moveZoom() {
        // move zoom buttons on scroll //
        document.onscroll = function() {
          if (window.pageYOffset >= 65) {
            document.getElementById("zoomThis").style.marginTop = "20px";
          }
          if (window.pageYOffset == 0) {
            document.getElementById("zoomThis").style.marginTop = "65px";
          }
          if (window.pageYOffset == 20) {
            document.getElementById("zoomThis").style.marginTop = "65px";
          }
        }
    }

    zoomFunction();
    function zoomFunction() {
      /// zoom functionality
        document.querySelector(".zoom").onclick = function() {
          window.scrollTo(0, 0);
          document.querySelector("svg").style.width = "100%";
          document.querySelector("svg").style.marginLeft = "0%";
          doEverything();
        }
        document.querySelector(".zoom-out").onclick = function() {
            document.querySelector("svg").style.width = "82%";
            document.querySelector("svg").style.marginLeft = "9%";
            doEverything();
        }
    }

    getMindmapName();
    function getMindmapName() {
        ///// fetch mindmap name ////////
        var mindmapNameInput = document.getElementById("MindmApp_Name");

        fetch('/get_mindmap_name')
        .then(response => response.json())
        .then(mindmapname => {
          if (mindmapname.mindmap_name != "") {
            mindmapNameInput.placeholder = mindmapname.mindmap_name;
          } else {
            mindmapNameInput.placeholder = "MindmApp Name";
          }
        });
        //////////// change name of mindmap ///////////////////
          var typingTimerDone;                //timer
          var doneTypingIntervalMs = 3000;  //time in ms (5 seconds)

          //on keyup event, count
          mindmapNameInput.addEventListener('keyup', function() {
              clearTimeout(typingTimerDone);
              if (mindmapNameInput.value) {
                  typingTimerDone = setTimeout(whenDoneTyping, doneTypingIntervalMs);
              }
          });

          //user is "finished typing," fetch Put mindmap name
          function whenDoneTyping () {
            fetch('/mindmap_Name', {
            method: 'PUT',
            body: JSON.stringify({
                mindmapNameInput: mindmapNameInput.value,  // specific mindmap to get information for from database
            })
            })
            .then(response => response.json())
            .then(result => {
                mindmapNameInput.placeholder = result.mindmapNameInput;  // update mindmap name
                mindmapNameInput.value = "";
            })
            .catch(error => console.log("There was a problem...") );
          ///////////////////////////////////////////////////////
          }
      }

      doEverything();

    function doEverything() {
      ////////////////// realign textbox padding /////////////////
      document.getElementById("Tp2_n8").style.paddingLeft = "10px";
      /////////// resize the page when device changes /////////////
      window.onresize = function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chromium based browsers & Firefox
        location.reload();
      }
      //////////////// make sure alignment is correct before loading page /////////////////
      window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      }

      ////////////////// declare mindmap nodes /////////////////
      var nCenter_dropdown_image = document.getElementById("nCenter_dropdown_image");
      var nFirst_dropdown_image = document.getElementById("nFirst_dropdown_image");
      var n2_dropdown_image = document.getElementById("n2_dropdown_image");
      var n3_dropdown_image = document.getElementById("n3_dropdown_image");
      var n4_dropdown_image = document.getElementById("n4_dropdown_image");
      var n5_dropdown_image = document.getElementById("n5_dropdown_image");
      var n6_dropdown_image = document.getElementById("n6_dropdown_image");
      var n7_dropdown_image = document.getElementById("n7_dropdown_image");
      var n8_dropdown_image = document.getElementById("n8_dropdown_image");
      var n9_dropdown_image = document.getElementById("n9_dropdown_image");
      var n10_dropdown_image = document.getElementById("n10_dropdown_image");
      var n11_dropdown_image = document.getElementById("n11_dropdown_image");
      var n12_dropdown_image = document.getElementById("n12_dropdown_image");

      /////////////// declare node images and dropdowns ///////////////////
      var allImageDropdowns = document.getElementsByClassName("imageDropdown");
      var allImageLinks = document.getElementsByClassName("removeExtension");


      ////////////////////////////////////////////////////////
      ///////////// Get placement of nodes /////////////////
      ////////////////////////////////////////////////////////

      ////////////////// declare node textareas /////////////////
      var allNeurons = document.getElementsByClassName("central");
      var allNodepoints = document.getElementsByClassName("nodepoint");
      var allTextareas = document.getElementsByClassName("nodepointTextarea");
      var svgIdHeight = document.getElementById("svgId").getBoundingClientRect().height;
      var navBarHeight = document.getElementById("navbarId").getBoundingClientRect().height;

      ////////////////// for all textareas /////////////////
      [].forEach.call(allTextareas, textArea => {
        textAreaId = textArea.id

            ////////// handle fetch errors //////////
            function handleErrors(response) {
              if (!response.ok) {
                  throw Error(response.statusText);
              }
              return response;
            }


            ///// fetch all textarea text for user /////
                fetch('/getTextToShow', {
                method: 'PUT',
                body: JSON.stringify({
                    textAreaId: textAreaId,  // specific text area to get information for from database
                })
                })
                .then(handleErrors)  // call handle fetch errors function declared above
                .then(response => response.json())
                .then(result => {
                    textArea.value = result.textAreaPlaceholder;     // update text area
                })
                .catch(error => console.log("no userText for this textarea yet") );
      });
      /////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////
      /////////// for all mindmap nodes (neurons), ///////////
      /////////// implement images and dropdowns  ////////////
      [].forEach.call(allNeurons, neuron => {
        neuronId = neuron.id;
        /////////// get node positions ////////////
        var neuronPosition = neuron.getBoundingClientRect();
        var neuronY = neuronPosition.top;
        var neuronX = neuronPosition.left;
        var neuronW = neuronPosition.width;
        var neuronH = neuronPosition.height;

        /////////// for each node, position dropdown menu's ////////////
        [].forEach.call(allImageDropdowns, imageDropdown => {
          imageDropdownId = imageDropdown.id
          imageDropdown.style.display = "none";

          var imageDropdownChildren = imageDropdown.children;
          var imageToShowDiv = imageDropdownChildren[0];
          var imageToShowDivChildren = imageToShowDiv.children;
          var imageToShow = imageToShowDivChildren[0];

            ////////// align node image with node position //////////////
            if (imageDropdownId.includes(neuronId)) {
              function showImage() {
              if (imageDropdownId.includes("n2")) {
                imageDropdown.style.display="block";
                imageDropdown.style.width = `${neuronW}px`;
                imageDropdown.style.height = `${neuronH}px`;
                imageDropdown.style.marginLeft = `${neuronX}px`;
                imageDropdown.style.marginTop = `${(neuronY-navBarHeight)+20}px`;
                imageDropdown.style.position = "absolute";
                imageDropdown.style.zIndex = "3";

              } else if (imageDropdownId.includes("n10")) {
                  imageDropdown.style.display="block";
                  imageDropdown.style.width = `${neuronW}px`;
                  imageDropdown.style.height = `${neuronH}px`;
                  imageDropdown.style.marginLeft = `${(document.getElementById("n10").getBoundingClientRect().left)+7}px`;
                  imageDropdown.style.marginTop = `${(((document.getElementById("n10").getBoundingClientRect().top)-navBarHeight)+7)}px`;
                  imageDropdown.style.position = "absolute";
                  imageDropdown.style.zIndex = "3";

              } else if (imageDropdownId.includes("n11")){
                  imageDropdown.style.display="block";
                  imageDropdown.style.width = `${neuronW+30}px`;
                  imageDropdown.style.height = `${neuronH+30}px`;
                  imageDropdown.style.marginLeft = `${(document.getElementById("n11").getBoundingClientRect().left)+7}px`;
                  imageDropdown.style.marginTop = `${(((document.getElementById("n11").getBoundingClientRect().top)-navBarHeight)+5)}px`;
                  imageDropdown.style.position = "absolute";
                  imageDropdown.style.zIndex = "3";

              } else if (imageDropdownId.includes("n3")) {
                  imageDropdown.style.display="block";
                  imageDropdown.style.width = `${neuronW+20}px`;
                  imageDropdown.style.height = `${neuronH+20}px`;
                  imageDropdown.style.marginLeft = `${neuronX+10}px`;
                  imageDropdown.style.marginTop = `${(neuronY-navBarHeight)}px`;
                  imageDropdown.style.position = "absolute";
                  imageDropdown.style.zIndex = "3";

              } else if (imageDropdownId.includes("nFirst")) {
                  imageDropdown.style.display="block";
                  imageDropdown.style.width = `${neuronW}px`;
                  imageDropdown.style.height = `${neuronH}px`;
                  imageDropdown.style.marginLeft = `${neuronX}px`;
                  imageDropdown.style.marginTop = `${neuronY-navBarHeight}px`;
                  imageDropdown.style.position = "absolute";
                  imageDropdown.style.zIndex = "3";


              } else if (imageDropdownId.includes("n12")) {
                  imageDropdown.style.display="block";
                  imageDropdown.style.width = `${neuronW}px`;
                  imageDropdown.style.height = `${neuronH}px`;
                  imageDropdown.style.marginLeft = `${neuronX}px`;
                  imageDropdown.style.marginTop = `${neuronY-navBarHeight}px`;
                  imageDropdown.style.position = "absolute";
                  imageDropdown.style.zIndex = "3";

              } else {
                  imageDropdown.style.display="block";
                  imageDropdown.style.width = `${neuronW}px`;
                  imageDropdown.style.height = `${neuronH}px`;
                  imageDropdown.style.marginLeft = `${neuronX}px`;
                  imageDropdown.style.marginTop = `${neuronY-navBarHeight}px`;
                  imageDropdown.style.position = "absolute";
                  imageDropdown.style.zIndex = "3";

              }
            }

            //////////// fetch image source for each node image ////////////////
            fetch('/loadImages')
            .then(response => response.json())
            .then(newSources => {
                ////////////////// update image sources //////////////////////
                if (newSources.nCenter_dropdown != "") {
                  nCenter_dropdown_image.src = `/media/${newSources.nCenter_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.nFirst_dropdown != "") {
                  nFirst_dropdown_image.src = `/media/${newSources.nFirst_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n2_dropdown != "") {
                  n2_dropdown_image.src = `/media/${newSources.n2_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n3_dropdown != "") {
                  n3_dropdown_image.src = `/media/${newSources.n3_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n4_dropdown != "") {
                  n4_dropdown_image.src = `/media/${newSources.n4_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n5_dropdown != "") {
                  n5_dropdown_image.src = `/media/${newSources.n5_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n6_dropdown != "") {
                  n6_dropdown_image.src = `/media/${newSources.n6_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n7_dropdown != "") {
                  n7_dropdown_image.src = `/media/${newSources.n7_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n8_dropdown != "") {
                  n8_dropdown_image.src = `/media/${newSources.n8_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n9_dropdown != "") {
                  n9_dropdown_image.src = `/media/${newSources.n9_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n10_dropdown != "") {
                  n10_dropdown_image.src = `/media/${newSources.n10_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n11_dropdown != "") {
                  n11_dropdown_image.src = `/media/${newSources.n11_dropdown}.jpg`;
                  showImage();
                }
                if (newSources.n12_dropdown != "") {
                  n12_dropdown_image.src = `/media/${newSources.n12_dropdown}.jpg`;
                  showImage();
                }
            });

              ////////// when node is clicked on, show the dropdown and select image ////////////////
              neuron.onclick = function() {
                  showImage();
              }
         }

             ///////////////////////////////////////////////////////
             //////////// load images properly /////////////////////
             ///////////////////////////////////////////////////////
             var selectedImage = imageDropdownChildren[1];
             var selectedImageChildren = selectedImage.children;
             var unorderedList = selectedImageChildren[0];
             var selectedDropdownListItems = unorderedList.querySelectorAll(":scope > .specificListItem");

             ///////////// display dropdown when mouse over node //////////////////
             imageDropdown.onmouseover = function() {
               selectedImage.style.display = "block";
             };

             /////////////// position elements in dropdown /////////////////
             [].forEach.call(selectedDropdownListItems, listItem => {
               var listItemChildren = listItem.children;
               var thisLink = listItemChildren[1];
               var thisLinkT = thisLink.innerText;

               var thisLinkText = thisLinkT.replace(/\.[^/.]+$/, "");

               if (imageDropdown.id == "n3_dropdown") {
                 thisLink.style.overflow = "none";
                 thisLink.height = "20px";
                 thisLink.padding = "5px";
                 thisLink.marginBottom = "-10px";
                 thisLink.style.lineHeight = "100%";
               } else {
                 thisLink.style.lineHeight = "100%";
                 thisLink.style.overflow = "hidden";
               }

               /////////// declare source for specific node image just selected in dropdown //////////////
               var startUrl = "/media/";
               var endUrl = thisLinkText;
               var url = startUrl+endUrl;

              var imageDropdownId = imageDropdown.id;

              /////////// when an image is chosen, PUT server request for database update ///////////////
               listItem.onclick = function() {
                     fetch('/chooseImage', {
                     method: 'PUT',
                     body: JSON.stringify({
                         thisLinkText: thisLinkText,
                         imageDropdownId: imageDropdownId
                     })
                     })
                     .then(response => response.json())
                     .then(result => {
                       //////////// update specific node image /////////////
                        imageToShow.src = `${url}.jpg`;
                      })



                      // when click, close dropdown only in !mobile. //
                      function checkScreenSize(screenSize) {
                        if (screenSize.matches) {
                        } else {
                          selectedImage.style.display = "none";
                        }
                      }

                      //////// when screen size is ipad or mobile //////////
                      var screenSize = window.matchMedia("(max-width: 1024px)")
                      checkScreenSize(screenSize)
                      screenSize.addListener(checkScreenSize)
               }
            });
             ///////////////////////////////////////////////////////
             ///////////////////////////////////////////////////////
             ///////////////////////////////////////////////////////
        });
      });

      /////////// for all text areas, get their position ////////////
      [].forEach.call(allNodepoints, nodepoint => {
        nodepointId = nodepoint.id;
        var nodepointPosition = nodepoint.getBoundingClientRect();
        var nodepointY = nodepointPosition.top - navBarHeight;
        var nodepointX = nodepointPosition.left;
        var nodepointW = nodepointPosition.width;
        var nodepointH = nodepointPosition.height;

        [].forEach.call(allTextareas, textArea => {
            var textAreaId = textArea.id;

            ///// when mouse goes over a text area, do the following ///////////
            textArea.onmouseover = function() {
              textArea.style.border = "thin solid black";
              textArea.style.resize = "both";
            }
            ////// don't show textarea border; initiated by mouse out ///////////
            textArea.onmouseout = function() {
              textArea.style.border = "none";
              textArea.style.resize = "none";
            }

            ///////// when user has finished typing text into a textarea, POST request to server ////////
            textArea.onchange = function() {
                var textAreaText = textArea.value;
                  fetch('/getText', {
                  method: 'POST',
                  body: JSON.stringify({
                      textAreaId: textAreaId,
                      textAreaPlaceholder: textAreaText
                  })
                  })
                  .then(response => response.json())
                  .then(result => {
                    /////// The POST request will run for all textareas, but some textareas have not been changed by user, so the following is normal /////////
                    console.log("This error is normal because server cannot find textitem that user has not created yet...");
                  });
            }

            ////////// position the text areas correctly if they are not empty //////////
            if (textAreaId.includes(nodepointId)) {
                if (textArea.id == "Tp2_n12"){
                  textArea.style.display="block";
                  textArea.style.width = `${nodepointW-35}px`;
                  textArea.style.height = `${nodepointH}px`;
                  textArea.style.marginLeft = `${nodepointX+35}px`;
                  textArea.style.marginTop = `${nodepointY}px`;
                  textArea.style.position = "absolute";
                  textArea.style.zIndex = "1";
                  textArea.style.resize = "none";
                  textArea.style.background = "transparent";
                  textArea.style.border = "none";

                } else {
                  textArea.style.display="block";
                  textArea.style.width = `${nodepointW}px`;
                  textArea.style.height = `${nodepointH}px`;
                  textArea.style.marginLeft = `${nodepointX}px`;
                  textArea.style.marginTop = `${nodepointY}px`;
                  textArea.style.position = "absolute";
                  textArea.style.zIndex = "1";
                  textArea.style.resize = "none";
                  textArea.style.background = "transparent";
                  textArea.style.border = "none";

                }


              //////////// if the text areas are empty, make them look like the following and position them /////////////
              if (textArea.value == "") {
                if (textArea.id == "Tp2_n12"){
                  textArea.style.display="block";
                  textArea.style.width = `${nodepointW-35}px`;
                  textArea.style.height = `${nodepointH}px`;
                  textArea.style.marginLeft = `${nodepointX+35}px`;
                  textArea.style.marginTop = `${nodepointY}px`;
                  textArea.style.position = "absolute";
                  textArea.style.zIndex = "1";
                  textArea.style.background = "transparent";
                  textArea.style.border = "none";
                  textArea.style.resize = "none";
                } else {
                  textArea.style.display="block";
                  textArea.style.width = `${nodepointW}px`;
                  textArea.style.height = `${nodepointH}px`;
                  textArea.style.marginLeft = `${nodepointX}px`;
                  textArea.style.marginTop = `${nodepointY}px`;
                  textArea.style.position = "absolute";
                  textArea.style.zIndex = "1";
                  textArea.style.background = "transparent";
                  textArea.style.border = "none";
                  textArea.style.resize = "none";
                }
              }
            }
        });
      });
      /////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////
  }
});
