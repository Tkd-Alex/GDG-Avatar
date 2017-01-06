  //Init material and dropdown
  $.material.init();
  $("#dropdown-menu select").dropdown();

  function resize(){
    $("#myCanvasDownload").outerHeight($(window).height()-$("#myCanvasDownload").offset().top- Math.abs($("#myCanvasDownload").outerHeight(true) - $("#myCanvasDownload").outerHeight()));
  }

  $(document).ready(function(){
    resize();
    $(window).on("resize", function(){
        resize();
    });
  });

  var options = '';
  for (var i = 0; i < country.length; i++) {
   options += '<option value="' + country[i].id+ '">' + country[i].name + '</option>';
  }
  checkGDG(country[0].id);
  $("#countryOption").html(options);

  $("#countryOption").on('change',function(){
    var getCountry = $(this).val();
    checkGDG(getCountry);
  });

  function checkGDG(country){
    var url = "https://gdgx.io/api/v1/chapters/country/" + country + "?perpage=999&fields=_id,name&asc=-1";

    $.ajax({url: url, type: "GET", dataType: "jsonp", async: true, success: function(result){
        var gdgList = result.items;
        var options = '';
        for (var i = 0; i < gdgList.length; i++) {
         options += '<option value="' + gdgList[i]._id+ '">' + gdgList[i].name + '</option>';
        }
        $("#gdgOption").html(options);
    },
    error: function(error){
        //console.log(error);
    }});
  }

  function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
  }

  document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'myCanvasDownload', 'image.png');
  }, false);

  document.getElementById("uploadimage").addEventListener("change", draw, false);

  var logo = new Image();
  logo.crossOrigin='anonymous';

  var logoWtm = new Image();
  logoWtm.crossOrigin='anonymous';
  logoWtm.src = "img/wtm.png";
  logoWtm.onload = function() { console.log("Caricato");}

  function draw(ev) {
    console.log(ev);
    var ctx = document.getElementById('canvas').getContext('2d'),
        img = new Image(),
        f = document.getElementById("uploadimage").files[0],
        url = window.URL || window.webkitURL,
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
    }
  }

  function start(){
    applyText(canvas,$("#gdgOption option:selected").text());
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
