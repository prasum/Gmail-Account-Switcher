$(document)
    .ready(function() {
        sks_bg_loadAccounts();
    });
 
function sks_bg_loadAccounts() {
    chrome.extension.sendMessage({
        sksmode: "optionsdatamode"
    }, function(response) {
        var sks_qg_data = response.output;
        if (sks_qg_data == "") {
            sks_qg_createOptionsLink();
            return;
        }
        //var sks_qg_jsonData = eval('(' + sks_qg_data + ')');
        var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
        var sks_qg_text = "";
        var sks_qg_linkExists = false;
        var sks_qg_linkArray = new Array();
        var multisign = sks_qg_getMultiSign(sks_qg_jsonData);
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
                sks_qg_createLinks(sks_qg_text, i, multisign);
            }
        }
        if (sks_qg_linkExists == false) {
            sks_qg_createOptionsLink();
        } else {
            sks_qg_createOptionsLinkBottom();
        }
        sks_qg_bindEvents();
        loadAnalytics();
    });
}
 
function sks_qg_bindEvents() {
    $("div[id^=sks_qg_links_]")
        .bind('mouseover', function() {
            sks_qg_handleMouseOver(this);
        });
    $("div[id^=sks_qg_links_]")
        .bind('mouseout', function() {
            sks_qg_handleMouseOut(this);
        });
    $("div[id^=sks_qg_links_]")
        .bind('click', function(event) {
            sks_qg_handleLinkClick(event, this);
            return false;
        });
    //multi sign
    $("span[id^=dveach_]")
        .bind('mouseover', function(event) {
            sks_qg_handleMSMouseOver(this);
        });
    $("span[id^=dveach_]")
        .bind('mouseout', function(event) {
            sks_qg_handleMSMouseOut(this);
        });
    $("span[id^=dveach_]")
        .bind('click', function(event) {
            sks_qg_handleMutiSignClick(event, this);
            return false;
        });
    //account element
    $("span[id^=sks_qg_]")
        .bind('click', function(event) {
            sks_qg_handleLinkClick(event, this);
            return false;
        });
}
 
function sks_qg_createLinks(sks_qg_link, sks_qg_index, multisign) {
    var parents = document.getElementById("divLinks");
    var child = document.createElement('div');
    child.setAttribute("class", "eachaccount");
    child.setAttribute("id", "sks_qg_links_" + sks_qg_index);
    if (multisign == true)
        child.appendChild(sks_qg_createMutilSignElement(sks_qg_index));
    child.appendChild(sks_qg_createAccountElement(sks_qg_link, sks_qg_index));
    //var contnt = (multisign == true ? "<span onmouseover='sks_qg_handleMSMouseOver(" + sks_qg_index + ")' onmouseout='sks_qg_handleMSMouseOut(" + sks_qg_index + ")' onclick='sks_qg_handleMutiSignClick(event,this);' title='Login without logout (Multi Sign-in)' id='dveach_" + sks_qg_index.toString() + "' class='multisign'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" : "");
    //contnt += "<span title='Click to Login' class='eachcontrol' id='sks_qg_" + sks_qg_index + "' onclick='sks_qg_handleLinkClick(event,this);'><img src='offline.png' alt='' id='img_" + sks_qg_index + "' />&nbsp;&nbsp;" + sks_qg_link + "</span>";
    //child.innerHTML = contnt;
    parents.appendChild(child);
    if (document.getElementById("dveach_" + sks_qg_index))
        document.getElementById("dveach_" + sks_qg_index)
        .style.backgroundImage = "url('Users-icon_disabled.png')";
}
 
function sks_qg_createMutilSignElement(sks_qg_index) {
    var child = document.createElement('span');
    child.setAttribute("class", "multisign");
    child.setAttribute('title', 'Login without logout (Multi Sign-in)');
    child.setAttribute("id", "dveach_" + sks_qg_index.toString());
    child.innerHTML = "&nbsp;&nbsp;&nbsp;";
    return child;
}
 
function sks_qg_createAccountElement(sks_qg_link, sks_qg_index) {
    var child = document.createElement('span');
    child.setAttribute("class", "eachcontrol");
    child.setAttribute('title', 'Click to Login');
    child.setAttribute("id", "sks_qg_" + sks_qg_index.toString());
    child.innerHTML = "<img src='offline.png' alt='' id='img_" + sks_qg_index + "' />&nbsp;&nbsp;" + sks_qg_link;
    return child;
}
 
function sks_qg_handleMouseOver(elem) {
    var sks_qg_index = $(elem)
        .attr('id')
        .replace('sks_qg_links_', '');
    document.getElementById('img_' + sks_qg_index)
        .src = 'online.png';
    document.getElementById("sks_qg_links_" + sks_qg_index)
        .style.backgroundColor = '#FCFDFF';
    document.getElementById("sks_qg_links_" + sks_qg_index)
        .style.border = 'solid 1px #C9E2FF';
    elem.style.borderBottom = 'solid 1px #C9E2FF';
    if (document.getElementById("dveach_" + sks_qg_index))
        document.getElementById("dveach_" + sks_qg_index)
        .style.backgroundColor = '#EDF2FF';
    if (parseInt(sks_qg_index) > 0)
        document.getElementById("sks_qg_links_" + (parseInt(sks_qg_index) - 1))
        .style.borderBottom = 'solid 1px #ffffff';
    $('#sks_qg_links_' + sks_qg_index)
        .css('-webkit-border-radius', '4px');
    $('#dveach_' + sks_qg_index)
        .css('border-top-left-radius', '4px');
    $('#dveach_' + sks_qg_index)
        .css('border-bottom-left-radius', '4px');
}
 
function sks_qg_handleMouseOut(elem) {
    var sks_qg_index = $(elem)
        .attr('id')
        .replace('sks_qg_links_', '');
    document.getElementById('img_' + sks_qg_index)
        .src = 'offline.png';
    document.getElementById("sks_qg_links_" + sks_qg_index)
        .style.backgroundColor = '#ffffff';
    document.getElementById("sks_qg_links_" + sks_qg_index)
        .style.border = 'solid 1px #ffffff';
    elem.style.borderBottom = 'dotted 1px #E8EEFA';
    if (document.getElementById("dveach_" + sks_qg_index))
        document.getElementById("dveach_" + sks_qg_index)
        .style.backgroundColor = '#ffffff';
    if (parseInt(sks_qg_index) > 0)
        document.getElementById("sks_qg_links_" + (parseInt(sks_qg_index) - 1))
        .style.borderBottom = 'dotted 1px #E8EEFA';
}
 
function sks_qg_handleMSMouseOver(elem) {
    var sks_qg_index = $(elem)
        .attr('id')
        .replace('dveach_', '');
    document.getElementById("dveach_" + sks_qg_index)
        .style.backgroundImage = "url('Users-icon.png')";
}
 
function sks_qg_handleMSMouseOut(elem) {
    var sks_qg_index = $(elem)
        .attr('id')
        .replace('dveach_', '');
    document.getElementById("dveach_" + sks_qg_index)
        .style.backgroundImage = "url('Users-icon_disabled.png')";
}
 
function sks_qg_handleLinkClick(e, th) {
    var sks_qg_id = th.id;
    sks_qg_id = sks_qg_id.replace("sks_qg_links_", "")
        .replace("sks_qg_", "");
    var bgPage = chrome.extension.getBackgroundPage();
    bgPage.sks_qg_handleLink(sks_qg_id);
    e.stopPropagation();
}
 
function sks_qg_handleMutiSignClick(e, th) {
    var sks_qg_id = th.id;
    sks_qg_id = sks_qg_id.replace("dveach_", "")
        .replace("sks_qg_", "");
    var bgPage = chrome.extension.getBackgroundPage();
    bgPage.sks_qg_handleMutiSign(sks_qg_id);
    e.stopPropagation();
}
 
function sks_qg_createOptionsLink() {
    var parents = document.getElementById("divLinks");
    var child = document.createElement('div');
    child.setAttribute("class", "eachcontrol");
    child.setAttribute("id", "sks_qg_opt");
    child.innerHTML = "Google accounts are not configured in Quick Login. <br />Click <a href='#' id='nooptions'>here</a> to configure.";
    parents.appendChild(child);
    sks_qg_bindOptionsEvent();
}
 
function sks_qg_bindOptionsEvent() {
    myAnchor = document.getElementById("nooptions");
    myAnchor.onclick = function() {
        sks_qg_showOptions();
        return false;
    }
}
 
function sks_qg_createOptionsLinkBottom() {
    var parents = document.getElementById("divLinks");
    var child = document.createElement('div');
    child.setAttribute("id", "sks_qg_optb");
    child.setAttribute("style", "text-align:right;padding-top:5px;");
    child.innerHTML = '<a href="#" style="text-align:right;text-decoration:none;font-size:smaller;color:#999999;" id="nooptions" title="Options">Options</a>';
    parents.appendChild(child);
    sks_qg_bindOptionsEvent();
}
 
function sks_qg_showOptions() {
    var bgPage = chrome.extension.getBackgroundPage();
    bgPage.sks_qg_loadOptions();
}
 
function sks_qg_getMultiSign(respon) {
    var ret = false;
    try {
        if (respon.multisign) {
            ret = respon.multisign == "true" ? true : false;
        }
    } catch (Excre) {}
    return ret;
}
// analytics code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-17319133-1']);
_gaq.push(['_trackPageview']);
//  (function() {
//    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//    //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//    ga.src = 'https://ssl.google-analytics.com/ga.js';
//    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//  })();
function loadAnalytics() {
    try {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    } catch (anaEx) {}
}