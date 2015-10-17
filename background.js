var sks_qg_security_pwd_bg = "sks_qg";
 
function sks_qg_handleLink(sks_qg_index) {
    localStorage["sks_runmode"] = String(sks_qg_index);
    var sks_qg_url2Load = sks_qg_getCurrentURL();
    chrome.tabs.getSelected(null, function(tb) {
        if (sks_qg_getAlwaysUseCurrentTab()) {
            chrome.tabs.update(tb.id, {
                url: "http://www.google.com/accounts/Logout?continue=" + sks_qg_url2Load,
                selected: true
            }, function(tb) {});
        } else {
            if (tb.url.indexOf('chrome:') > -1 && tb.url.indexOf('newtab') > -1) {
                chrome.tabs.update(tb.id, {
                    url: "http://www.google.com/accounts/Logout?continue=" + sks_qg_url2Load,
                    selected: true
                }, function(tb) {});
            } else {
                chrome.tabs.create({
                    url: "http://www.google.com/accounts/Logout?continue=" + sks_qg_url2Load,
                    selected: true
                }, function(tb) {});
            }
        }
    });
}
 
function sks_qg_handleMutiSign(sks_qg_index) {
    localStorage["sks_runmode"] = String(sks_qg_index);
    var sks_qg_url2Load = sks_qg_getCurrentURL();
    chrome.tabs.getSelected(null, function(tb) {
        if (sks_qg_getAlwaysUseCurrentTab()) {
            chrome.tabs.update(tb.id, {
                url: "https://accounts.google.com/AddSession?continue=" + sks_qg_url2Load,
                selected: true
            }, function(tb) {});
        } else {
            if (tb.url.indexOf('chrome:') > -1 && tb.url.indexOf('newtab') > -1) {
                chrome.tabs.update(tb.id, {
                    url: "https://accounts.google.com/AddSession?continue=" + sks_qg_url2Load,
                    selected: true
                }, function(tb) {});
            } else {
                chrome.tabs.create({
                    url: "https://accounts.google.com/AddSession?continue=" + sks_qg_url2Load,
                    selected: true
                }, function(tb) {});
            }
        }
    });
}
 
function sks_qg_getAlwaysUseCurrentTab() {
    var ret = false;
    try {
        if (localStorage.getItem('sks_qg_optionsData') != null) {
            //var sks_qg_jsonData = eval('(' + localStorage["sks_qg_optionsData"] + ')');
            var sks_qg_jsonData = jQuery.parseJSON(localStorage["sks_qg_optionsData"]);
            ret = sks_qg_jsonData.curTab == "true" ? true : false;
        }
    } catch (Excre) {}
    return ret;
}
 
function sks_qg_getCurrentURL() {
    var sks_qg_url = "http://www.google.com/accounts/b/0/ManageAccount?nroma=1";
    try {
        var sks_qg_data = getCurrentCredentials();;
        if (sks_qg_data == "") {
            return "http://www.google.com/accounts/b/0/ManageAccount?nroma=1";
        }
        //var sks_qg_jsonData = eval('(' + sks_qg_data + ')');
        var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
        sks_qg_url = sks_qg_jsonData.url == "" ? "http://www.google.com/accounts/b/0/ManageAccount?nroma=1" : sks_qg_jsonData.url;
    } catch (Exce) {
 
    }
    return sks_qg_url;
}
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.sksmode == "runmode") {
            var sks_qg_runmode = localStorage["sks_runmode"];
            if (!sks_qg_runmode) {
                sendResponse({
                    output: "-1"
                });
            } else sendResponse({
                output: sks_qg_runmode
            });
        } else if (request.sksmode == "resetrunmode") {
            localStorage["sks_runmode"] = "-1";
            sendResponse({});
        } else if (request.sksmode == "setrunmode") {
            localStorage["sks_runmode"] = request.runmodedata;
            sendResponse({});
        } else if (request.sksmode == "optionsdatamode") {
            var sks_qg_optionsData = localStorage["sks_qg_optionsData"];
            if (!sks_qg_optionsData) {
                sendResponse({
                    output: ""
                });
            } else sendResponse({
                output: sks_qg_optionsData
            });
        } else if (request.sksmode == "saveoptionsdatamode") {
            localStorage["sks_qg_optionsData"] = request.optionsdata;
            sendResponse({
                output: "success"
            });
        } else if (request.sksmode == "getcurrentcredentials") {
            var sks_qg_currentCredentials = getCurrentCredentials();
            sendResponse({
                output: sks_qg_currentCredentials
            });
        } else sendResponse({}); // snub them.
    });
 
function getCurrentCredentials() {
    var outPut = '{ "username" : "", "password": ""}';
    var sks_qg_optionsData = localStorage["sks_qg_optionsData"];
    if (!sks_qg_optionsData) {
        return outPut;
    }
    var sks_qg_runm = localStorage["sks_runmode"];
    if (!sks_qg_runm) {
        return outPut;
    }
    if (sks_qg_runm == "-1") return outPut;
    try {
        //var sks_qg_jsonData = eval('(' + sks_qg_optionsData + ')');
        var sks_qg_jsonData = jQuery.parseJSON(sks_qg_optionsData);
        sks_qg_runm = parseInt(sks_qg_runm);
        outPut = '{ "username" : "' + sks_qg_getProper(sks_qg_jsonData.data[sks_qg_runm].e) + '", "password": "' + sks_qg_decrypt(sks_qg_jsonData.data[sks_qg_runm].p) + '", "url": "' + sks_qg_getProper(sks_qg_jsonData.data[sks_qg_runm].u) + '"}';
    } catch (Exc) {}
    return outPut;
}
 
function sks_qg_getProper(sks_qg_arg) {
    if (sks_qg_arg == undefined) {
        return "";
    } else {
        return sks_qg_arg;
    }
}
 
function sks_qg_decrypt(passtext) {
    if (passtext == undefined) {
        return "";
    } else if (passtext == "") {
        return "";
    } else {
        return AesCtr.decrypt(passtext, sks_qg_security_pwd_bg, 256);
    }
}
 
function sks_qg_loadOptions() {
    chrome.tabs.getSelected(null, function(tb) {
        if (tb.url.indexOf('chrome:') > -1 && tb.url.indexOf('newtab') > -1) {
            chrome.tabs.update(tb.id, {
                url: "options.html",
                selected: true
            }, function(tb) {});
        } else {
            chrome.tabs.create({
                url: "options.html",
                selected: true
            }, function(tb) {});
        }
    });
}