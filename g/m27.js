const GET_URL_1 = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const GET_URL_2 = "?$fields=dsmveno:CustomerAttributes&$mask=dsmveng:EngItemMask.Details";

const PATCH_URL_1 = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const PATCH_URL_2 = "?$mask=dskern:Mask.Default&$fields=dsmveno:CustomerAttributes&$mva=true";


var responseData = "", cestamp, objectID;
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
                        $("#idEIN").text(obj.data.items[0].objectId);
                        $("#idDesc").text(obj.data.items[0].displayType);
                        $("#idName").text(obj.data.items[0].displayName);
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
                $('#saveAllData').click(function () {
                    myWidget.wafDataPatchFunction(objectID, cestamp);
                });
                $('#operasyonSil').click(function () {
                    myWidget.operasyonSil();
                });
            },
            wafDataGetFunction: function (id) {
                cestamp = "";
                var headerWAF = {
                    "SecurityContext": "VPLMProjectLeader.Company Name.GEM ENDUSTRI"
                };
                var url = GET_URL_1 + id + GET_URL_2;
                WAFData.authenticatedRequest(url, {
                    type: "text",
                    method: "GET",
                    headers: headerWAF,
                    onComplete: function (res) {
                        responseData = JSON.parse(res);
                        cestamp = responseData.member[0].cestamp;
                        var customData = responseData.member[0]["dseno:EnterpriseAttributes"];
                        if (!(customData.operasyon1 || customData.operasyon2 || customData.operasyon3 || customData.operasyon4)) {
                            myWidget.set_status("PARÇANIN ÜZERİNDE OPERASYON BİLGİLERİ GİRİLMEMİŞTİR");
                            return false;
                        }
                        myWidget.set_status("TABLO BAŞARILI BİR ŞEKİLDE YENİLENDİ");
                        if (customData.operasyon1 == "MACHINING") {
                            $("#idTezgah1").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah2").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah3").append(new Option(customData.operasyon2, customData.operasyon2));
                        };
                        if (customData.operasyon2 == "MACHINING") {
                            $("#idTezgah1").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah2").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah3").append(new Option(customData.operasyon2, customData.operasyon2));
                        };
                        if (customData.operasyon3 == "MACHINING") {
                            $("#idTezgah1").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah2").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah3").append(new Option(customData.operasyon2, customData.operasyon2));
                        };
                        if (customData.operasyon4 == "MACHINING") {
                            $("#idTezgah1").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah2").append(new Option(customData.operasyon2, customData.operasyon2));
                            $("#idTezgah3").append(new Option(customData.operasyon2, customData.operasyon2));
                        };
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
                        "tezgah1": $("#idTezgah1").val(),
                        "tezgah2": $("#idTezgah2").val(),
                        "tezgah3": $("#idTezgah3").val(),
                        "tezgah_suresi1": $("#idTezgahSuresi1").val(),
                        "tezgah_suresi2": $("#idTezgahSuresi2").val(),
                        "tezgah_suresi3": $("#idTezgahSuresi3").val(),
                    }, "cestamp": cestamp
                };

                const getCSRFTokenUrl = "https://r1132102313088-eu1-space.3dexperience.3ds.com/enovia" + "/resources/v1/application/CSRF";
                var csrfValue = "";
                WAFData.authenticatedRequest(getCSRFTokenUrl, {
                    method: "GET",
                    type: "json",
                    onComplete: function (enoCSRFTokenResponse) {
                        const enoCSRFToken = enoCSRFTokenResponse.csrf.value;
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
