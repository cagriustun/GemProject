const GET_URL_1 = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const GET_URL_2 = "?$fields=dsmveno:CustomerAttributes&$mask=dsmveng:EngItemMask.Details";

const PATCH_URL_1 = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const PATCH_URL_2 = "?$mask=dskern:Mask.Default&$fields=dsmveno:CustomerAttributes&$mva=true";


var cuArray = [], cuIndex = 1, str = [], responseData = "", cestamp, objectID;
var tezgahData = [
  { "value": "860", "text": "860" },
  { "value": "1020", "text": "1020" },
  { "value": "1300", "text": "1300" },
  { "value": "CME", "text": "CME" },
  { "value": "1700", "text": "1700" },
  { "value": "V2000", "text": "V2000" },
  { "value": "LAGUN", "text": "LAGUN" },
  { "value": "KRAFT", "text": "KRAFT" },
  { "value": "FPT", "text": "FPT" },
  { "value": "TORNA", "text": "TORNA" },
  { "value": "UNIVERSAL FREZE", "text": "UNIVERSAL FREZE" },
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
          var temp = 0;
          for (var i = 0; i < cuArray.length; i++) {
            if (cuArray[i].tezgah != "") {
              temp++;
            }
          }
          if (temp == 3) {
            myWidget.set_status("MAKSİMUM SAYIDA TEZGAH BİLGİSİ GİRİLMİŞ, KONTROL EDİN");
            return;
          } else {
            if (cuArray[0].tezgah == "") {
              cuArray[0].tezgah = idTezgah;
              cuArray[0].tezgahSuresi = idTezgahSuresi;
            } else if (cuArray[1].tezgah == "") {
              cuArray[1].tezgah = idTezgah;
              cuArray[1].tezgahSuresi = idTezgahSuresi;
            } else if (cuArray[2].tezgah == "") {
              cuArray[2].tezgah = idTezgah;
              cuArray[2].tezgahSuresi = idTezgahSuresi;
            }
            myWidget.wafDataPatchFunction(objectID, cestamp);
          }

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
          if (checkIndex == 0 && cuArray[0].tezgah == "") {
            if (cuArray[1].tezgah == "") {
              cuArray[2].tezgah = "";
              cuArray[2].tezgahSuresi = "";
            } else {
              cuArray[1].tezgah = "";
              cuArray[1].tezgahSuresi = "";
            }
          } else {
            cuArray[0].tezgah = "";
            cuArray[0].tezgahSuresi = "";
          }

          cuArray[checkIndex].tezgah = "";
          cuArray[checkIndex].tezgahSuresi = "";
          myWidget.wafDataPatchFunction(objectID, cestamp);
        }
      },
      tableAddedFunction: function (data) {
        var toplamSaniye = $('#idToplamSaniye');
        var cuSN = 0;
        // toplamSaniye.text(parseInt(toplamSaniye.text()) + parseInt(item.tezgahSuresi));
        $('#table_ tbody').empty();
        var tableArray = data;
        tableArray.forEach((item, index) => {
          if (item.tezgah != "") {
            cuSN += parseInt(item.tezgahSuresi);
            var newRow = $('<tr>');
            var checkbox = $('<input>').attr({
              type: 'checkbox',
              name: 'checkboxName',
              value: 'checkboxValue',
            });
            $('<td>').append(checkbox).appendTo(newRow);
            $('<td>').text(index).appendTo(newRow);
            $('<td>').text(item.operasyon).appendTo(newRow);
            $('<td>').text(item.tezgah).appendTo(newRow);
            $('<td>').text(item.tezgahSuresi).appendTo(newRow);
            $('#table_ tbody').append(newRow);
          }
        });
        toplamSaniye.text(cuSN);


      },
      wafDataGetFunction: function (id) {
        cestamp = "";
        var operasyonData = [];
        var headerWAF = {
          "SecurityContext": "VPLMProjectLeader.Company Name.GEM ENDUSTRI"
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
            if (!(customData.operasyon1 && customData.operasyon2 && customData.operasyon3 && customData.operasyon4)) {
              myWidget.set_status("PARÇANIN ÜZERİNDE OPERASYON BİLGİLERİ GİRİLMEMİŞTİR");
              return false;
            }
            myWidget.set_status("TABLO BAŞARILI BİR ŞEKİLDE YENİLENDİ");
            (customData.operasyon1 == "TALASLI") ? operasyonData.push({ "value": "operasyon1 - " + customData.operasyon1, "text": "Operasyon 1 - " + customData.operasyon1 }) : "";
            (customData.operasyon2 == "TALASLI") ? operasyonData.push({ "value": "operasyon2 - " + customData.operasyon2, "text": "Operasyon 2 - " + customData.operasyon2 }) : "";
            (customData.operasyon3 == "TALASLI") ? operasyonData.push({ "value": "operasyon3 - " + customData.operasyon3, "text": "Operasyon 3 - " + customData.operasyon3 }) : "";
            (customData.operasyon4 == "TALASLI") ? operasyonData.push({ "value": "operasyon4 - " + customData.operasyon4, "text": "Operasyon 4 - " + customData.operasyon4 }) : "";
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
            cuArray = [
              { operasyon: "TALASLI", tezgah: customData.tezgah1, tezgahSuresi: customData.tezgah_suresi1, operasyonKey: "1" },
              { operasyon: "TALASLI", tezgah: customData.tezgah2, tezgahSuresi: customData.tezgah_suresi2, operasyonKey: "2" },
              { operasyon: "TALASLI", tezgah: customData.tezgah3, tezgahSuresi: customData.tezgah_suresi3, operasyonKey: "3" }
            ];
            myWidget.tableAddedFunction(cuArray);
          },
          onFailure: function (error) {
            myWidget.set_status("İŞLEM BAŞARISIZ");
            console.log("onFailure : " + error);
          }
        });
      },
      wafDataPatchFunction: function (objectID, cestamp) {
        var tmpStr = {
          "dseno:EnterpriseAttributes": {
            "tezgah1": cuArray[0].tezgah,
            "tezgah2": cuArray[1].tezgah,
            "tezgah3": cuArray[2].tezgah,
            "tezgah_suresi1": cuArray[0].tezgahSuresi,
            "tezgah_suresi2": cuArray[1].tezgahSuresi,
            "tezgah_suresi3": cuArray[2].tezgahSuresi,
          }, "cestamp": cestamp
        };

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
              "SecurityContext": "VPLMProjectLeader.Company Name.GEM ENDUSTRI",
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
