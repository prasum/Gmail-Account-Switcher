var v_loc = document.location.href;
if (v_loc.toLowerCase()
    .indexOf("accounts.google.com") > -1) {
    chrome.extension.sendMessage({
        sksmode: "runmode"
    }, function(response) {
        var runmode = response.output;
        var runModeInt = parseInt(runmode);
        if (runmode > -1) {
            chrome.extension.sendMessage({
                sksmode: "getcurrentcredentials"
            }, function(response) {
                var sks_qg_data = response.output;
                if (sks_qg_data == "") {
                    return;
                }
                var sks_qg_jsonDataa = jQuery.parseJSON(sks_qg_data);
                var sks_qg_usernamee = sks_qg_jsonDataa.username.toLowerCase();
                var button_elements = $('button')
                    .filter(function() {
                        return $(this)
                            .attr('value')
                            .toLowerCase() == sks_qg_usernamee;
                    });
                //alert(button_elements.length);
                if (button_elements.length == 1) {
                    $(button_elements)
                        .trigger("click");
                } else {
                    if ($('#account-chooser-add-account')
                        .length > 0) {
                        $('#account-chooser-add-account')
                            .trigger("click");
                    }
                }
            });
        }
    });
}
if (document.getElementById('Email') !== null) {
    chrome.extension.sendMessage({
        sksmode: "runmode"
    }, function(response) {
        var runmode = response.output;
        var runModeInt = parseInt(runmode);
        if (runmode > -1) {
            sks_qg_loginWithCurrentAccount();
        } else {
            var child = document.createElement('div');
            var imgURL = chrome.extension.getURL("icon_open_left2.png");
            var imgHoverLeftURL = chrome.extension.getURL("hover_left.png");
            var imgHoverRightURL = chrome.extension.getURL("hover_right.png");
            var imgHoverBGURL = chrome.extension.getURL("hover_bg.png");
            child.innerHTML = "<div id='sks_qg_assistant_div' style='padding:6px;overflow: auto;'><img src='" + imgURL + "' alt='Quick Login - Accounts' style='' /></div>";
            child.setAttribute("id", "sks_qg_accounts");
            child.addEventListener("mouseover", function() {
                var cell = document.getElementById("sks_qg_accounts");
                if (cell != null) {
                    cell.style.border = 'solid 1px #B2B2B2';
                    $(this)
                        .css('borderTopWidth', '0px');
                    cell.style.backgroundColor = '#FFFFFF';
                    $(this)
                        .css('border-bottom-right-radius', '5px');
                    $(this)
                        .css('border-bottom-left-radius', '5px');
                    //document.getElementById("sks_qg_assistant_div").innerHTML = "<table border='0' cellpadding='0' cellspacing='0' style='height:26px;width:100%;display:inline-table;'><tr><td style='background-image:url(" + imgHoverLeftURL + ");width:15px;'>&nbsp;</td><td style='background-image:url(" + imgHoverBGURL + ");background-repeat:repeat-x;background-position:center;font-family:Arial, Verdana;font-size:small;text-align:center;color:#535454;'>&nbsp;Quick&nbsp;Login&nbsp;</td><td style='background-image:url(" + imgHoverRightURL + ");width:15px;'>&nbsp;</td></tr></table>";
                    document.getElementById("sks_qg_assistant_div")
                        .innerHTML = "<div style='padding:7px 10px;-webkit-border-radius:5px;background-color:#FF8936;font-size:small;text-align:center;color:#ffffff;'>&nbsp;QuickLogin&nbsp;</div>"
                }
                if (cell.hasChildNodes()) {
                    for (var sks_qg_i = 1; sks_qg_i < cell.childNodes.length; sks_qg_i++) {
                        cell.childNodes[sks_qg_i].style.display = "block";
                    }
                }
            }, false);
            child.addEventListener("mouseout", function() {
                var cell = document.getElementById("sks_qg_accounts");
                if (cell != null) {
                    cell.style.border = 'none';
                    cell.style.backgroundColor = 'transparent';
                    document.getElementById("sks_qg_assistant_div")
                        .innerHTML = "<img src='" + imgURL + "' alt='Quick Login - Accounts' style='' />";
                }
                if (cell.hasChildNodes()) {
                    for (var sks_qg_i = 1; sks_qg_i < cell.childNodes.length; sks_qg_i++) {
                        cell.childNodes[sks_qg_i].style.display = "none";
                    }
                }
            }, false);
            //child.setAttribute("style", "position:absolute;float:right;top:0px;right:1px;text-align:right;padding-bottom:10px;border:solid 1px #B2B2B2;background-color:#ffffff;border-top-width:0px;border-bottom-right-radius:5px;border-bottom-left-radius:5px");
            child.setAttribute("style", "position:absolute;float:right;top:0px;right:1px;text-align:right;padding-bottom:10px;");
            document.body.appendChild(child);
            chrome.extension.sendMessage({
                sksmode: "optionsdatamode"
            }, function(response) {
                var sks_qg_data = response.output;
                if (sks_qg_data == "") {
                    document.body.removeChild(document.getElementById("sks_qg_accounts"));
                    return;
                }
                //var sks_qg_jsonData = eval('(' + sks_qg_data + ')');
                var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
                var sks_qg_text = "";
                var sks_qg_linkExists = false;
                var sks_qg_linkArray = new Array();
                for (var i = 0; i < sks_qg_jsonData.data.length; i++) {
                    sks_qg_text = "";
                    if (sks_qg_jsonData.data[i].n.length > 0) {
                        sks_qg_text = sks_qg_jsonData.data[i].n;
                    } else if (sks_qg_jsonData.data[i].e.length > 0) {
                        sks_qg_text = sks_qg_jsonData.data[i].e;
                    } else if (sks_qg_jsonData.data[i].p.length > 0) {
                        sks_qg_text = "[Unknown]";
                    }
                    if (sks_qg_text.length > 0) {
                        sks_qg_linkExists = true;
                        sks_qg_createLinks(sks_qg_text, i);
                    }
                }
                if (sks_qg_linkExists == true) {
                    ////document.body.style.marginLeft = "13px";
                } else {
                    document.body.removeChild(document.getElementById("sks_qg_accounts"));
                }
            });
        }
    });
}
 
function sks_qg_createLinks(sks_qg_link, sks_qg_index) {
    try {
        var parents = document.getElementById("sks_qg_accounts");
        var child = document.createElement('div');
        child.addEventListener("mouseover", function() {
            document.getElementById('sks_qg_' + sks_qg_index)
                .style.backgroundColor = '#FCFDFF';
            document.getElementById('img_' + sks_qg_index)
                .src = chrome.extension.getURL("online.png");
            document.getElementById('sks_qg_' + sks_qg_index)
                .style.border = 'solid 1px #C9E2FF';
            if (parseInt(sks_qg_index) > 0)
                document.getElementById("sks_qg_" + (parseInt(sks_qg_index) - 1))
                .style.borderBottom = 'solid 1px #ffffff';
            $('#sks_qg_' + sks_qg_index)
                .css('-webkit-border-radius', '4px');
        }, false);
        child.addEventListener("mouseout", function() {
            document.getElementById('sks_qg_' + sks_qg_index)
                .style.backgroundColor = '#ffffff';
            document.getElementById('img_' + sks_qg_index)
                .src = chrome.extension.getURL("offline.png");
            document.getElementById('sks_qg_' + sks_qg_index)
                .style.border = 'solid 1px #ffffff';
            document.getElementById('sks_qg_' + sks_qg_index)
                .style.borderBottom = 'dotted 1px #E8EEFA';
            if (parseInt(sks_qg_index) > 0)
                document.getElementById("sks_qg_" + (parseInt(sks_qg_index) - 1))
                .style.borderBottom = 'dotted 1px #E8EEFA';
        }, false);
        //child.setAttribute("onmouseover", "document.getElementById('sks_qg_" + sks_qg_index + "').style.backgroundColor = '#f3f7fc';document.getElementById('img_" + sks_qg_index + "').src = '" + chrome.extension.getURL("online.png") + "';");
        //child.setAttribute("onmouseout", "document.getElementById('sks_qg_" + sks_qg_index + "').style.backgroundColor = '#ffffff';document.getElementById('img_" + sks_qg_index + "').src = '" + chrome.extension.getURL("offline.png") + "';");
        child.addEventListener("click", function() {
            chrome.extension.sendMessage({
                sksmode: "setrunmode",
                runmodedata: sks_qg_index
            }, function(response) {
                sks_qg_loginWithCurrentAccount();
            });
        }, false);
        child.setAttribute("id", "sks_qg_" + sks_qg_index);
        child.setAttribute("style", "cursor:pointer;display:none;padding:6px;white-space:nowrap;border:solid 1px #ffffff;border-bottom:dotted 1px #E8EEFA;font-family:Arial,Verdana;font-size:small;margin-left:8px;margin-right:8px;text-align:left;");
        //child.setAttribute("title","Click to login");
        child.innerHTML = "<img src='" + chrome.extension.getURL("offline.png") + "' alt='' id='img_" + sks_qg_index + "' />&nbsp;&nbsp;" + sks_qg_link;
        parents.appendChild(child);
    } catch (Excc) {
        console.log(Excc.description);
    }
}
 
function sks_qg_loginWithCurrentAccount() {
    try {
        chrome.extension.sendMessage({
            sksmode: "getcurrentcredentials"
        }, function(response) {
            var sks_qg_data = response.output;
            if (sks_qg_data == "") {
                return;
            }
            //var sks_qg_jsonData = eval('(' + c + ')');
            var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
            var sks_qg_username = sks_qg_jsonData.username;
            var sks_qg_password = sks_qg_jsonData.password;
            if (sks_qg_username.length > 0) {
                document.getElementById('Email')
                    .value = sks_qg_username;
            }
            if (sks_qg_password.length > 0) {
                //document.getElementById('Passwd').value = sks_qg_password;
                $('#Passwd')
                    .val(sks_qg_password);
            }
            if ($('#next')
                .length > 0) {
                $('#next')
                    .trigger("click");
            }
            setTimeout(function() {
                $('#Passwd')
                    .val(sks_qg_password);
                if (sks_qg_password.length > 0 && sks_qg_username.length > 0) {
                    if (document.getElementById('signIn') != null) {
                        var sks_qg_submitBtn = document.getElementById('signIn');
                        if (sks_qg_submitBtn.type == "submit" || sks_qg_submitBtn.type == "button") {
                            sks_qg_submitBtn.click();
                        } else {
                            document.forms[0].submit();
                        }
                    } else {
                        document.forms[0].submit();
                    }
 
                }
                chrome.extension.sendMessage({
                    sksmode: "resetrunmode"
                }, function(response) {});
            }, 500);
 
 
        });
    } catch (Exce) {
        console.log(Exce.description);
    }
}