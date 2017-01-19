  //Init material and dropdown.
  $.material.init();

  //Resize my final canvas.
  function resizeCanvas(canvasItem){
    canvasItem.outerHeight( $(window).height() -
                              canvasItem.offset().top -
                              Math.abs(
                                canvasItem.outerHeight(true) -
                                canvasItem.outerHeight()
                              )
                            );
  }

  //Call resize canvas on resize windows event.
  $(document).ready(function(){
    resizeCanvas($("#myCanvasDownload"));
    $(window).on("resize", function(){
        resizeCanvas($("#myCanvasDownload"));
    });
  });

  //Create option list for country.
  var $selectContry = $('#countryOption').selectize({
					valueField: 'id',
					labelField: 'name',
					searchField: 'name',
					options: country,
					create: false,

          //Check GDG list on every change of countryOption
          onChange: function(value) { downloadGDGList(value); }
				});

  //Get from GDGx the list of GDG per country.
  function downloadGDGList(country){
    $.ajax( { url: "https://gdgx.io/api/v1/chapters/country/" + country + "?perpage=999&fields=_id,name&asc=-1",
              type: "GET",
              dataType: "jsonp",
              async: true,
              success: function(result){
                var gdgList = result.items;
                var $selectGDG = $('#gdgOption').selectize({
                  valueField: 'name',
                  labelField: 'name',
                  searchField: 'name',
                  options: gdgList,
                  create: false,
                });
              },
              error: function(error){
                  console.log(error);
              }
            }
          );
  }

  document.getElementById("uploadimage").addEventListener("change", draw, false);

  document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'myCanvasDownload', 'image.png');
  }, false);

  function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
  }

  var logo = new Image();
  logo.crossOrigin='anonymous';

  var logoWtm = new Image();
  logoWtm.crossOrigin = 'anonymous';
  logoWtm.src = "img/wtm.png";
  logoWtm.onload = function() { console.log("Caricato"); };

  var canvas = document.createElement('canvas');

  function draw(ev) {
    //console.log(ev);
    var ctx = canvas.getContext('2d');
    img = new Image();
    f = document.getElementById("uploadimage").files[0];
    url = window.URL || window.webkitURL;
    src = url.createObjectURL(f);

    img.src = src;

    img.onload = function() {

        if(document.getElementById("squareCrop").checked){

          canvas.width=500;
          canvas.height=500;

          ctx.drawImage(img, 0, 0, 500, 500);

        }
        else if(img.width > 500){

          canvas.width=500;
          canvas.height=img.height / img.width * 500;
          ctx.drawImage(img,0,0,500,img.height / img.width * 500);

        }
        else{

          canvas.width=img.width;
          canvas.height=img.height;
          ctx.drawImage(img,0,0);

        }

        if(document.getElementById("colorSet").checked){
          var imageData = ctx.getImageData(0, 0, img.width, img.height);
          var data = imageData.data;

          for(var i = 0; i < data.length; i += 4) {
            var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
          }

          // overwrite original image
          ctx.putImageData(imageData, 0, 0);
        }

        logo.src = "img/logo.png";
        logo.onload = start;
        url.revokeObjectURL(src);
    };
  }

  function start(){
    applyText(canvas, $("#gdgOption option:selected").text() );
  }

  function applyText(canvas,text){
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');
    var cw,ch;

    cw = tempCanvas.width = canvas.width;
    ch = tempCanvas.height = canvas.height;

    tempCtx.drawImage(canvas,0,0);
    tempCtx.font = "30px verdana";

    var textWidth = tempCtx.measureText(text).width;

    tempCtx.fillStyle = 'white';
    tempCtx.fillText(text,cw-textWidth-10, 30);

    var new_height = logo.height / logo.width * cw;

    tempCtx.drawImage(logo,0,ch-new_height,cw,new_height);

    if(document.getElementById("wtm").checked){
      var widthWMT = 100;
      var new_height = logoWtm.height / logoWtm.width * widthWMT;
      tempCtx.drawImage(logoWtm,0,0,widthWMT,new_height);
    }

    if(document.getElementById('myCanvasDownload'))
      document.getElementById('myImage').removeChild(document.getElementById('myCanvasDownload'));

    tempCanvas.setAttribute('id','myCanvasDownload');
    document.getElementById('myImage').appendChild(tempCanvas);


  }
