const GET_URL_1 = "https://r1132102313088-eu1-ifwe.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const GET_URL_2 = "?$fields=dsmveno:CustomerAttributes&$mask=dsmveng:EngItemMask.Details";

const PATCH_URL_1 = "https://r1132102313088-eu1-ifwe.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const PATCH_URL_2 = "?$mask=dskern:Mask.Default&$fields=dsmveno:CustomerAttributes&$mva=true";


var cuArray = [], cuIndex = 1, str = [], responseData = "", cestamp, objectID;
// var tezgahData = [
//   { "value": "Makine 1", "text": "Makine 1" },
//   { "value": "Makine 2", "text": "Makine 2" },
//   { "value": "Makine 3", "text": "Makine 3" },
// ];

function executeWidgetCode() {
  require(["DS/WAFData/WAFData", "DS/DataDragAndDrop/DataDragAndDrop"], function (WAFData, DataDragAndDrop) {
    var myWidget = {
      set_status: function (message) {
        $(".c-widget-drop-area").html(message);
      },
      onLoadWidget: function () {
        var dropElement = document.getElementById("drop_area");
        DataDragAndDrop.droppable(dropElement, {
          drop: function (data) {
            var obj = JSON.parse(data);
            objectID = obj.data.items[0].objectId;
            myWidget.wafDataGetFunction(objectID);
          },
          enter: function () {
            dropElement.className = "drop-area-enter";
          },
          leave: function () {
            dropElement.className = "drop-area-leave";
          },
          over: function () {
            dropElement.className = "drop-area-over";
          }
        });
        $('#operasyonEkle').click(function () {
          myWidget.operasyonEkle();
        });
        $('#operasyonSil').click(function () {
          myWidget.operasyonSil();
        });
      },
      operasyonEkle: function () {
        reqBody = [];
        var idOperasyon = $('#idOperasyon option:selected').val();
        var idTezgah = $('#idTezgah option:selected').val();
        var idTezgahSuresi = $('#idTezgahSuresi').val();
        if (!idOperasyon) {
          $('#idOperasyon').css('border-color', 'red');
          $('#idTezgah').css('border-color', '#ced4da');
          $('#idTezgahSuresi').css('border-color', '#ced4da');
          return;
        } else if (!idTezgah) {
          $('#idOperasyon').css('border-color', '#ced4da');
          $('#idTezgah').css('border-color', 'red');
          $('#idTezgahSuresi').css('border-color', '#ced4da');
          return;
        } else if (!idTezgahSuresi) {
          $('#idOperasyon').css('border-color', '#ced4da');
          $('#idTezgah').css('border-color', '#ced4da');
          $('#idTezgahSuresi').css('border-color', 'red');
          return;
        } else {
          $('#idOperasyon').css('border-color', '#ced4da');
          $('#idTezgah').css('border-color', '#ced4da');
          $('#idTezgahSuresi').css('border-color', '#ced4da');

          myWidget.wafDataPatchFunction(objectID, cestamp, idOperasyon, idTezgah, idTezgahSuresi);
        }
      },
      operasyonSil: function () {
        var checkControl = 0;
        var checkIndex = 0;
        var checkboxes = $('input[type="checkbox"]');
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked == true) {
            checkControl++;
            checkIndex = i;
          }
        }
        if (checkControl > 1) {
          myWidget.set_status("SİLMEK İÇİN BİR TANE OPERASYON SEÇİNİZ");
          return;
        } else {
          var tempTDIndex = cuArray[checkIndex].operasyonKey;
          myWidget.wafDataPatchFunction(objectID, cestamp, tempTDIndex, "", "");
        }

      },
      tableAddedFunction: function (data) {
        var toplamSaniye = $('#idToplamSaniye');
        var cuSN = 0;
        // toplamSaniye.text(parseInt(toplamSaniye.text()) + parseInt(item.tezgahSuresi));
        $('#table_ tbody').empty();
        var tableArray = data;
        tableArray.forEach(item => {
          cuSN += parseInt(item.tezgahSuresi);
          var newRow = $('<tr>');
          var checkbox = $('<input>').attr({
            type: 'checkbox',
            name: 'checkboxName',
            value: 'checkboxValue',
          });
          $('<td>').append(checkbox).appendTo(newRow);
          $('<td>').text(1).appendTo(newRow);
          $('<td>').text(item.operasyon).appendTo(newRow);
          $('<td>').text(item.tezgah).appendTo(newRow);
          $('<td>').text(item.tezgahSuresi).appendTo(newRow);
          $('#table_ tbody').append(newRow);
        });
        toplamSaniye.text(cuSN);


      },
      wafDataGetFunction: function (id) {
        cestamp = "";
        var operasyonData = [];
        var headerWAF = {
          "SecurityContext": "VPLMProjectLeader.Company Name.Common Space"
        };
        url = "https://r1132102313088-eu1-ifwe.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/search?tenant=r1132102313088&%24searchStr=test&%24mask=dsmveng%3AEngItemMask.Details&%24top=1&%24skip=0";
        WAFData.authenticatedRequest(url, {
            type: "text",
            method: "GET",
            headers : headerWAF,
            onComplete: function (dataResp) {
                console.log("onComplete : " + dataResp);
                $("#responseDiv").html(dataResp + "<br>"+  $("#responseDiv").html())
            },
            onFailure: function (error) {
                console.log("onFailure : " + error);
            }
        });
      },
      wafDataPatchFunction: function (objectID, cestamp, operasyon, tezgah, tezgahSuresi) {
        var opSplit = operasyon.split(" - ")[0];
        var opIndex = opSplit[opSplit.length - 1];
        var tezgahWithIndex = "Tezgah" + opIndex;
        var tezgahSuresiWithIndex = "TezgahSuresi" + opIndex;
        var tezgah = tezgah != "" ? tezgah.split(" ")[0] + tezgah.split(" ")[1] : "";
        var tmpStr = { "dseno:EnterpriseAttributes": { [tezgahWithIndex]: tezgah, [tezgahSuresiWithIndex]: tezgahSuresi }, "cestamp": cestamp };

        const getCSRFTokenUrl = "https://r1132102313088-eu1-ifwe.3dexperience.3ds.com/3dspace" + "/resources/v1/application/CSRF";
        var csrfValue = "";
        WAFData.authenticatedRequest(getCSRFTokenUrl, {
          method: "GET",
          type: "json",
          onComplete: function (enoCSRFTokenResponse) {
            const enoCSRFToken = enoCSRFTokenResponse.csrf.value;
            //  if (!methodOptions.headers) methodOptions.headers = {};
            //   methodOptions.headers.ENO_CSRF_TOKEN = enoCSRFToken;
            csrfValue = enoCSRFToken;
            var headerWAF = {
              "SecurityContext": "VPLMProjectLeader.Company Name.Common Space",
              "ENO_CSRF_TOKEN": csrfValue,
              "Content-Type": "application/json"
            };
            var url = PATCH_URL_1 + objectID + PATCH_URL_2;
            WAFData.authenticatedRequest(url, {
              method: "patch",
              type: "json",
              headers: headerWAF,
              data: JSON.stringify(tmpStr),
              onComplete: function (res) {
                myWidget.wafDataGetFunction(objectID);
              },
              onFailure: function (error) {
                console.log("onFailure : " + error);
              }
            });
          }
        });

      }
    };
    widget.addEvent("onLoad", myWidget.onLoadWidget);
  });
}
