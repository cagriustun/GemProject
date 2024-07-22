const GET_URL_1 = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const GET_URL_2 = "?$fields=dsmveno:CustomerAttributes&$mask=dsmveng:EngItemMask.Details";

const PATCH_URL_1 = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const PATCH_URL_2 = "?$mask=dskern:Mask.Default&$fields=dsmveno:CustomerAttributes&$mva=true";


var cuArray = [], cuIndex = 1, str = [], responseData = "", cestamp, objectID;
 var tezgahData = [
   { "value": "Makine 1", "text": "Makine 1" },
   { "value": "Makine 2", "text": "Makine 2" },
   { "value": "Makine 3", "text": "Makine 3" },
 ];

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
        var url = GET_URL_1 + id + GET_URL_2;
        WAFData.authenticatedRequest(url, {
          type: "text",
          method: "GET",
          headers: headerWAF,
          onComplete: function (res) {
            cuArray = [];
            responseData = JSON.parse(res);
            cestamp = responseData.member[0].cestamp;
            $('#idOperasyon').empty();
            $('#idTezgah').empty();
            var customData = responseData.member[0]["dseno:EnterpriseAttributes"];
            if (!(customData.Operasyon1 && customData.Operasyon2 && customData.Operasyon3 && customData.Operasyon4)) {
              myWidget.set_status("PARÇANIN ÖZELLİKLERİNİ KONTROL EDİN");
              return false;
            }
            myWidget.set_status("TABLO BAŞARILI BİR ŞEKİLDE YENİLENDİ");
            (customData.Operasyon1 == "Talasli Imalat" || customData.Operasyon1 == "Onisleme") ? operasyonData.push({ "value": "Operasyon1 - " + customData.Operasyon1, "text": "Operasyon 1 - " + customData.Operasyon1 }) : "";
            (customData.Operasyon2 == "Talasli Imalat" || customData.Operasyon2 == "Onisleme") ? operasyonData.push({ "value": "Operasyon2 - " + customData.Operasyon2, "text": "Operasyon 2 - " + customData.Operasyon2 }) : "";
            (customData.Operasyon3 == "Talasli Imalat" || customData.Operasyon3 == "Onisleme") ? operasyonData.push({ "value": "Operasyon3 - " + customData.Operasyon3, "text": "Operasyon 3 - " + customData.Operasyon3 }) : "";
            (customData.Operasyon4 == "Talasli Imalat" || customData.Operasyon4 == "Onisleme") ? operasyonData.push({ "value": "Operasyon4 - " + customData.Operasyon4, "text": "Operasyon 4 - " + customData.Operasyon4 }) : "";
            $('#idTezgahSuresi').val('');
            $('#idOperasyon').append($('<option>', {
              value: "",
              text: ""
            }));
            $.each(operasyonData, function (index, item) {
              $('#idOperasyon').append($('<option>', {
                value: item.value,
                text: item.text
              }));
            });
            $('#idTezgah').append($('<option>', {
              value: "",
              text: ""
            }));
            $.each(tezgahData, function (index, item) {
              $('#idTezgah').append($('<option>', {
                value: item.value,
                text: item.text
              }));
            });
            (customData.Tezgah1 != "") ? cuArray.push({ operasyon: customData.Operasyon1, tezgah: customData.Tezgah1, tezgahSuresi: customData.TezgahSuresi1, operasyonKey: "1" }) : "";
            (customData.Tezgah2 != "") ? cuArray.push({ operasyon: customData.Operasyon2, tezgah: customData.Tezgah2, tezgahSuresi: customData.TezgahSuresi2, operasyonKey: "2" }) : "";
            (customData.Tezgah3 != "") ? cuArray.push({ operasyon: customData.Operasyon3, tezgah: customData.Tezgah3, tezgahSuresi: customData.TezgahSuresi3, operasyonKey: "3" }) : "";
            (customData.Tezgah4 != "") ? cuArray.push({ operasyon: customData.Operasyon4, tezgah: customData.Tezgah4, tezgahSuresi: customData.TezgahSuresi4, operasyonKey: "4" }) : "";
            myWidget.tableAddedFunction(cuArray);
          },
          onFailure: function (error) {
            myWidget.set_status("İŞLEM BAŞARISIZ");
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

        const getCSRFTokenUrl = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia" + "/resources/v1/application/CSRF";
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
