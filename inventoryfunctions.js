    amount;
    var partnerId;
    var cookieId;
    var tradeToken;
    var hasBonus = "false";
    var botId = "76561198203778081";
    var isButtonLocked = false;
    var allButtonClickedClassId = "";
    var botIvLoading = false;
    var cachedIvs = {"All": "", "1": "", "2": "", "3": "", "4": "", "5": ""};
    var ivCounts = {"All": "", "1": "", "2": "", "3": "", "4": "", "5": ""};
    var chosenBot;
    var inventoryPrint;
    var stage;
    var firstClick = true;
    var firstClickBot = false;
    var dec = 2;
    var signedIn = false;
    var cntRequestUrl = 0;
    var totalItems = 0;
    var coins = 0;
    var bot1cache = "";
    var bot2cache = "";
    var bot3cache = "";
    var bot4cache = "";
    var bot5cache = "";

    function loadClientInventory(refresh, id) {
        if (signedIn === true) {
            $('#yourOffer').html('');
            $('#yourValue').html('0.00');
            $('#yourIv').html('<div id="clientsBar"><p id="barsNoClick">Loading Your Inventory<br><img style="margin-top:8px;" src="/images/loader.gif"></img><br><i style="font-size:13px;">(Big inventories can take up to 1 min)</i></p></div>');
            document.getElementById("clientsBar").style.visibility = "visible";
            var clientValue = $('#yourValue').html();
            var botValue = $('#botValue').html();
            if (signedIn === true) {
                buttonDisabler(clientValue, botValue);
                disableExpensive("botsIv", clientValue);
            }
            if (refresh == true) {
                stage = "clientRefresh"
            } else {
                stage = "client";
            }
            printInventory(id, stage, coins, hasBonus, "yourIv", "client");
        }
    }

    function loadBotInventory(refresh, iv) {
        botIvLoading = true;
        if (iv == "refresh") {
            iv = chosenBot;
        } else {
            chosenBot = iv;
        }
        $('#botSortOrder').prop('selectedIndex', 0);
        $('#botOffer').html('');
        lockBotButton("removeItem")
        $('#botValue').html('0.00');
        $('#botsIv').html('<div id="botsBar"><p id="barsNoClick">Loading Bot Inventory<br><img style="margin-top:8px;" src="/images/loader.gif"></img><br><i style="font-size:13px;">(Can take up to 30s)</i></p></div>');
        document.getElementById("botsBar").style.visibility = "visible";
        var clientValue = $('#yourValue').html();
        var botValue = $('#botValue').html();
        if (signedIn === true) {
            buttonDisabler(clientValue, botValue);
        }
        if (iv == "All") {
            stage = "botAll";
            iv = "1";
        }
        else if (refresh == true) {
            stage = "botRefresh"
        }
        else {
            stage = "bot";
        }
        printInventory(botIds[iv], stage, 0, "false", "botsIv", iv);
    }

    function inventorySetup(boxId) {
        $('#' + boxId).html(inventoryPrint);
        setupTt('#' + boxId);
        setupMenus('#' + boxId);
        if (signedIn === true) {
            var clientValue = $('#yourValue').html();
            disableExpensive("botsIv", clientValue);
        }
    }

    function printInventory(id, stage, coins, hasBonus, boxId, iv) {
        loadItemCount(boxId);
        $.post('/phpLoaders/getInventory/getInventory.php', {
            stage: stage,
            steamId: id,
            hasBonus: hasBonus,
            coins: coins
        }, function (data) {
            botIvLoading = false;
            printOutInventory(boxId, data);
            if (stage == "botAll") {
                iv = "All";
            }
            showItemCount(iv);
            inventorySetup(boxId);
            if (boxId == "botsIv") {
                if (chosenBot == "All") {
                    forceHighPriceSort("#botsIv");
                    cachedIvs[chosenBot] = document.getElementById("botsIv").innerHTML;
                } else {
                    cachedIvs[chosenBot] = data;
                }
            }
        });
    }

    function printOutInventory(boxId, data) {
        $('#' + boxId).html(data);
        if (boxId == "botsIv") {
            $(".botSortOrder").val("mostRecent");
        } else if (boxId == "yourIv") {
            $(".clientSortOrder").val("mostRecent");
        }
        if (allButtonClickedClassId !== "" && boxId == "botsIv") {
            moveClickedItemInAll();
            $("#botsIv").animate({scrollTop: 0}, "fast");
        }
    }

    function switchIv(iv) {
        if (botIvLoading == false) {
            if (cachedIvs[iv] == "") {
                loadBotInventory(false, iv);
            } else {
                loadIvFromCache(iv);
            }
            chosenBot = iv;
            switchButton(iv);
        }
    }

    function switchButton(iv) {
        document.getElementById("ivButtonAll").style.background = "#2D3642";
        document.getElementById("ivButton1").style.background = "#2D3642";
        document.getElementById("ivButton2").style.background = "#2D3642";
        document.getElementById("ivButton3").style.background = "#2D3642";
        document.getElementById("ivButton4").style.background = "#2D3642";
        document.getElementById("ivButton5").style.background = "#2D3642";
        document.getElementById("ivButton" + iv).style.background = "#1C222B";
        if (iv !== "All") {
            $("#selectedBot").html("Bot " + iv);
        } else {
            $("#selectedBot").html("All Bot");
        }
    }

    function loadIvFromCache(iv) {
        $('#botOffer').html('');
        $('#botValue').html('0.00');
        $('#botsIv').html('<div id="botsBar"><p id="barsNoClick">Loading Bot Inventory<br><img style="margin-top:8px;" src="/images/loader.gif"></img><br><i style="font-size:13px;">(Can take up to 1 min)</i></p></div>');
        document.getElementById("botsBar").style.visibility = "visible";
        var clientValue = $('#yourValue').html();
        var botValue = $('#botValue').html();
        if (signedIn === true) {
            buttonDisabler(clientValue, botValue);
        }
        printOutInventory('botsIv', cachedIvs[iv]);
        showItemCount(iv);
        setupTt('#botsIv');
        setupMenus('#botsIv');
        if (iv == "All") {
        }
        if (signedIn === true) {
            disableExpensive("botsIv", clientValue);
        }
    }

    function expandIvs() {
        $("#storageBox").animate({height: '1050px'});
        $("#ivBox").animate({height: '1050px'});
        $(".botsItems").css("overflow", "visible");
        $("#yourIv").css("overflow", "visible");
        $(".botsItems").animate({height: '1050px'});
        $("#yourIv").animate({height: '1050px'});
    }

    function getTotalTrades() {
        $.post('/phpLoaders/getTotalTrades.php', {stage: "client"}, function (data) {
            $('#numTrades').html(data);
        });
    }

    function getTotalItems() {
        $.post('/phpLoaders/getTotalTrades.php', {stage: "client"}, function (data) {
            $('#numTrades').html(data);
        });
    }

    function requestOffer() {
        showLightBox("<h3>Validating Your Offer...</h3><br><i>May take up to 10 seconds</i><br><br><img src='/images/loader.gif'></img>", false);
        var offersJson = getOffer();
        $.post('/phpLoaders/tradeOfferVerification/tradeOfferVerification.php', {
            json: offersJson,
            id: partnerId,
            token: tradeToken,
            botNumber: chosenBot
        }, function (data) {
            if (data == "success") {
                showLightBox("<br><h3>Waiting for bot to send offer...</h3><i>May take up to 45 seconds</i><br><img style='width:250px;' src='/images/tradeLoad.gif'></img>", false);
                setTimeout(function () {
                    cntRequestUrl = 0;
                    requestTradeUrl();
                }, 5000);
            }
            else if (data == "noToken") {
                showTokenBox('');
            }
            else if (data.indexOf("missingItems") >= 0) {
                showLightBox("<h3>Unavailable Items</h3>");
                document.getElementById('content').innerHTML += data;
                setTimeout(function () {
                    $("<br><br><span style='color:#3498db;font-size:20px;'><u>Automatically</u> Removing Unavailable Items.</span></b>").hide().appendTo("#content").fadeIn(1300);
                }, 1000);
                setTimeout(function () {
                    closeLightBox();
                }, 5300);
                var rawJson = $("#missingItems").attr("json");
                var classIdArray = JSON.parse(rawJson);
                removeMissing(classIdArray, "botOffer", "botValue");
            }
            else {
                showLightBox("<h3>Message:</h3>" + data);
            }
        });
    }

    function removeMissing(classIdArray, wrapperId, valueId) {
        var $wrapper = $("#" + wrapperId);
        var totalValue = parseFloat(document.getElementById(valueId).innerHTML);
        var toRemove = 0.00;
        $wrapper.children('div').each(function () {
            var eClassId = $(this).attr('classId');
            var eValue = parseFloat($(this).attr('value'));
            var eAmount = parseFloat($(this).attr('amount'));
            if (classIdArray.indexOf(eClassId) !== -1) {
                if (valueId !== "none") {
                    totalValue = parseFloat(document.getElementById(valueId).innerHTML);
                    document.getElementById(valueId).innerHTML = (totalValue - (eValue * eAmount)).toFixed(3);
                }
                $(this).attr('clickable', 'false');
                $(this).fadeOut(2200, function () {
                    $(this).remove();
                });
            }
        });
        var clientValue = $('#yourValue').html();
        disableExpensive("botsIv", clientValue);
    }

    function requestTradeUrl() {
        cntRequestUrl++;
        cntRequestUrlCap = 15;
        if (cntRequestUrl < cntRequestUrlCap) {
            $.post('/phpLoaders/checkPending.php', {id: partnerId, forceConfirm: "false"}, function (data) {
                if (data !== "") {
                    showTradeOfferResult(data);
                }
                else {
                    setTimeout(function () {
                        requestTradeUrl();
                    }, 2000);
                }
            });
        }
        else if (cntRequestUrl == cntRequestUrlCap) {
            console.log("Force confirm check");
            $.post('/phpLoaders/checkPending.php', {id: partnerId, forceConfirm: "true"}, function (data) {
                if (data !== "") {
                    showTradeOfferResult(data);
                }
                else {
                    setTimeout(function () {
                        requestTradeUrl();
                    }, 3000);
                }
            });
        }
        else {
            showLightBox("<h2>Took to long!</h2><b>If your offer was very big(over 50 items) it may take some minutes due to mobile-confirmations. Check your trade offers.</b><br><p>Otherwise bot seem to have crashed or too many requesting trades at the same time.</p><br><br><br><b>If this error keeps showin, <br>please write in our steam group.</b>", true);
        }
    }

    function showTradeOfferResult(data) {
        if (data.indexOf("Error") >= 0) {
            if (data.indexOf("15") >= 0 || data.indexOf("exceed") >= 0) {
                if (totalItems > 970) {
                    showLightBox("<h2>This Bots inventory is full</h2><b style='color:#4aa3df;'>Choose another one of our bots!</b><br><p>This Bots CS:GO inventory has over <u>1000 items</u>. <br><br><b>The automatic emptying system will clear the bot 5-30 min after getting full so just wait.(if it doesn't work in 15min please write in the steam group) </b></p>", true);
                }
                else if (totalItems < 970) {
                    showLightBox("<h2>Sending too many items!</h2><br>Bot's inventory will exceed 1000 items if you send this trade. <br><b>Decrease</b> the amount of items you want to trade.<br></a> </p><br><br>", true);
                }
            }
            else if (data.indexOf("wrongToken") >= 0) {
                showLightBox("<h2>Update you trade-offer url!</h2><p>Your trade-offer url seems to be outdated/incorrect.</p><br><a style='font-size:18px;' href='javascript:void(0)' onclick='showTokenBox(tradeToken)' >Press here to update your trade-offer url.</a>", true);
            }
            else if (data.indexOf("escrowWaitTime") >= 0) {
                showLightBox("<h1>Add a <img style='width:30px;' src='/images/steamGuard.png'></img> Steam-Mobile-Autenticator!</h1>" + "" + "<p>Since Dec 12, anyone trading will need to have a <u>Steam Guard Mobile Authenticator</u> enabled" + " on their steam-account for at least 15 days and must enable trade confirmations. Otherwise, Steam will <a href='https://support.steampowered.com/kb_article.php?ref=8078-TPHC-6195' target='_blank'>hold</a> your trades 3 days before delivery" + " which means we can't trade with you.</p>" + "<hr id='hrStyle'><br><b style='font-size:19px;'>How To</b><br><br>" + "<b>1.</b> Set up a Steam Mobile Authenticator: <a href='https://support.steampowered.com/kb_article.php?ref=4440-RTUI-9218' target='_blank'>Guide</a>" + "<br><br><b>2.</b> When 15 days have passed you will be able to trade instantly with us & others!" + "<br><br><i></i>" + "", true);
            }
            else if (data.indexOf("7day") >= 0 || data.indexOf("is not available to trade. More information will be shown to") >= 0) {
                showLightBox("<h2>You have a trade cooldown!</h2><p><b>Error:</b> <u>You seem to have a trade cooldown on steam, (usually for some days).</u> <br><br>If you don't have a cooldown, please resend.<br><a href='javascript:void(0)' title='Request trade' class='myResendButton' onclick='requestOffer()' ><b>Resend Offer</b></a><br><br><br><br><i>If this seems to be cause by a bug, please contact support.</i>", true);
            }
            else if (data.indexOf("private") >= 0) {
                showLightBox("<h2>Your inventory is private!</h2><p>Change your inventory to public in your steam settings.</p><br><br><br><br><br></p>", true);
            }
            else if (data.indexOf("HTTP error") >= 0) {
                showLightBox("<h2>Your offer could not be sent!</h2><p><b>Error:</b> <u>Steam HTTP Error.</u> <br><br>This means problems with steam servers.(<a href='https://steamstat.us/' target='_blank'>Steam status</a>) <b>Try resending the offer.</b><br><a href='javascript:void(0)' title='Request trade' class='myResendButton' onclick='requestOffer()' ><b>Resend Offer</b></a><br><br><br><br></p>", true);
            }
            else if (data.indexOf("50") >= 0) {
                showLightBox("<h2>Too many people are using this bot!</h2>This bot is having too many active offers, please switch bot above the inventory.<br><br><br><a href='javascript:void(0)' title='Request trade' class='myResendButton' onclick='requestOffer()' ><b>Resend Offer</b></a><br>", true);
            }
            else if (data.indexOf("26") >= 0) {
                showLightBox("<h2>Some item could not be found!</h2><br>Offer could not be sent because some/one of the items in your offer just got traded by someone else.<br>Resend to see which items are missing.</a> </p><a href='javascript:void(0)' title='Request trade' class='myResendButton' onclick='requestOffer()' ><b>Resend Offer</b></a><br><br>", true);
            }
            else if (data.indexOf("(20)") >= 0) {
                showLightBox("<h2>Steam Unavailable!</h2>The Steam Community Market and various game inventories (CS:GO/DOTA) appear to be having some issues and/or are delayed.<br><br><a style='font-size:18px;' href='https://steamstat.us/' target='_blank'>Check Steam status</a> <br><br><i>(Please try resending now & <u>some hours</u> later)</i><br><a href='javascript:void(0)' title='Request trade' class='myResendButton' onclick='requestOffer()' ><b>Resend Offer</b></a><br>", true);
            }
            else if (data.indexOf("steamLaggy") >= 0) {
                showLightBox("<h2>Steam communication problems!</h2><span style='font-size:17px;'>The bot had some problem when communicating with steam.<br>This is usually solved by <u>resending the offer</u>.</span> <br><br><i>(Please try resending now & <u>some hours</u> later)</i><br><a href='javascript:void(0)' title='Request trade' class='myResendButton' onclick='requestOffer()' ><b>Resend Offer</b></a><br>", true);
            }
            else {
                showLightBox("<h2>Your offer could not be sent!</h2>'<i>" + data + "</i>'<br>We don't really know the problem. <a href='https://steamstat.us/' target='_blank'>Steam status</a><br><br>(Please try again now & <u>some hours</u> later)<br><a href='javascript:void(0)' title='Request trade' class='myResendButton' onclick='requestOffer()' ><b>Resend Offer</b></a><br><br><br><b>Error stays?</b><br>Make sure you can trade with friends, contact support if you can trade with friends but still get this error.<br>", true);
            }
        }
        else {
            window.open('http://steamcommunity.com/tradeoffer/'+data);
            showLightBox("<br><a target='_blank' id='offerLink' href='http://steamcommunity.com/tradeoffer/" + data + "'><img style='margin-top:-25px;margin-bottom:-30px;width:400px;' src='/images/offerButton/tradeOffer.png'></img></a><br><a target='_blank' href='http://steamcommunity.com/tradeoffer/" + data + "' class='tradeOfferReadyButton'>👍  LINK TO TRADE OFFER</a><br>", true);
        }
    }

    function getOffer() {
        var clientOfferArray = [];
        var botOfferArray = [];
        var cnt = 0;
        $('#yourOffer').children('div').each(function () {
            var obj = {
                amount: this.getAttribute('amount'),
                classId: this.getAttribute('classid'),
                name: this.getAttribute('original-name')
            };
            clientOfferArray[cnt] = obj;
            cnt++;
        });
        cnt = 0;
        $('#botOffer').children('div').each(function () {
            var obj = {
                amount: this.getAttribute('amount'),
                classId: this.getAttribute('classid'),
                name: this.getAttribute('original-name')
            };
            botOfferArray[cnt] = obj;
            cnt++;
        });
        var offers = {clientOfferArray: clientOfferArray, botOfferArray: botOfferArray};
        var offersJson = JSON.stringify(offers);
        return offersJson;
    }

    var shifted = false;

    function setupListeners() {
        $(document).on('keyup keydown', function (e) {
            shifted = e.shiftKey;
            console.log(shifted);
        });
        $("#yourOffer").mousedown(function (event) {
            if (event.button == 0) {
                divId = event.target.id;
                if (divId != "yourOffer" && divId != "notSignedIn" && divId != "infoAdd" && divId !== "infoAddClient") {
                    addElement(divId, "yourOffer");
                }
            }
        });
        $("#yourIv").mousedown(function (event) {
            if (event.button == 0) {
                divId = event.target.id;
                if (divId != "yourIv") {
                    addElement(divId, "yourIv");
                    setupMenus('#yourOffer');
                }
            }
        });
        $("#botOffer").mousedown(function (event) {
            if (event.button == 0) {
                divId = event.target.id;
                if (divId != "botOffer" && divId !== "infoAdd" && divId !== "infoAddBot") {
                    addElement(divId, "botOffer");
                }
                lockBotButton("removeItem");
            }
        });
        $("#botsIv").mousedown(function (event) {
            if (event.button == 0) {
                divId = event.target.id;
                if (divId != "botsIv") {
                    if (chosenBot !== "All") {
                        addElement(divId, "botsIv");
                        setupMenus('#botOffer');
                        lockBotButton("addItem");
                    }
                    else if (chosenBot == "All") {
                        var botNum = $(event.target).attr("botnum");
                        allButtonClickedClassId = $(event.target).attr("classid");
                        var opacity = $(event.target).css("opacity");
                        if (!(opacity < 1)) {
                            switchFromAll(divId, botNum);
                        }
                    }
                }
            }
        });
    }

    function initRest() {
        $('#searchBar').bind('input', function () {
            searchItems($(this).val(), '#botsIv');
        });
        $('#clientSearchBar').bind('input', function () {
            searchItems($(this).val(), '#yourIv');
        });
        setupHoverChange("#inDepth img", "/images/inDepthButton/inDepthHover.png", "/images/inDepthButton/inDepth.png");
        setupHoverChange("#refreshButton1 a img", "/images/refreshButton/refreshHover.png", "/images/refreshButton/refresh.png");
        setupHoverChange("#refreshButton2 a img", "/images/refreshButton/refreshHover.png", "/images/refreshButton/refresh.png");
        runAllStatsUpdate();
    }

    function ElementObject(id, img) {
        this.id = id;
        this.img = img;
    }

    function addElement(divId, boxId) {
        amount = $(".yourIv").find("#" + divId).attr("amount");
        amountO = $(".yourOffer").find("#" + divId).attr("amount");
        totalValue = parseFloat(document.getElementById("yourValue").innerHTML);
        valueLeft = parseFloat(document.getElementById("valueLeft").innerHTML);
        var isValid = false;
        botIvBox = "botsIv";
        amountBotIv = $("#" + botIvBox).find("#" + divId).attr("amount");
        amountBotOffer = $("#botOffer").find("#" + divId).attr("amount");
        totalValueBot = parseFloat(document.getElementById("botValue").innerHTML);
        if (firstClick == true && divId !== "barsNoClick" && signedIn == true) {
            if (boxId == "yourIv") {
                document.getElementById("yourOffer").innerHTML = "";
                document.getElementById("botOffer").innerHTML = "";
                $("#botOffer").html("<h3 id='infoAddBot' style='font-weight:normal; color:grey;' >↓ Then create a counter-offer ↓</p>");
                firstClick = false;
                firstClickBot = true;
            }
            else {
            }
        }
        else if (firstClickBot == true && divId !== "barsNoClick" && signedIn == true) {
            if (boxId == "botsIv") {
                document.getElementById("botOffer").innerHTML = "";
                firstClickBot = false;
            }
            else {
            }
        }
        if (boxId == "yourOffer") {
            if ($(".yourIv").find("#" + divId).attr("value") !== "") {
                isValid = true;
                itemValue = parseFloat($(".yourIv").find("#" + divId).attr("value"));
                document.getElementById("yourValue").innerHTML = parseFloat((totalValue - itemValue).toFixed(3));
                document.getElementById("valueLeft").innerHTML = parseFloat((valueLeft - itemValue).toFixed(3));
            }
            if ($(".yourIv").find("#" + divId).attr("clickable") == "false") {
                $(".yourIv").find("#" + divId).stop().fadeTo(0, 1);
                $(".yourIv").find("#" + divId).attr("clickable", "true");
                $(".yourIv").find("#" + divId).css("cursor", "pointer");
            } else {
                $(".yourIv").find("#" + divId).attr("amount", parseInt(amount) + 1);
                $(".yourIv").find("#num" + divId).text("x" + (parseInt(amount) + 1));
            }
            if (amountO == "1") {
                $(".yourOffer").find("#" + divId).stop().fadeOut(0, function () {
                    $(this).tipsy("hide");
                    $(this).remove();
                });
            } else {
                $(".yourOffer").find("#" + divId).attr("amount", parseInt(amountO) - 1);
                $(".yourOffer").find("#num" + divId).text("x" + (parseInt(amountO) - 1));
            }
        } else if (boxId == "yourIv") {
            if ($(".yourIv").find("#" + divId).attr("clickable") == "true") {
                if ($(".yourIv").find("#" + divId).attr("value") !== "") {
                    isValid = true;
                    itemValue = parseFloat($(".yourIv").find("#" + divId).attr("value"));
                    if (itemValue < 0.01) {
                        dec = 3;
                    }
                    document.getElementById("yourValue").innerHTML = parseFloat((totalValue + itemValue).toFixed(3));
                    document.getElementById("valueLeft").innerHTML = parseFloat((valueLeft + itemValue).toFixed(3));
                }
                if ($(".yourOffer").find("#" + divId).attr("clickable") == null) {
                    $("#" + divId).clone().prop('test1', "offer").appendTo("#yourOffer");
                    $("#yourOffer").find("#" + divId).tipsy({html: true});
                    $("#yourOffer").find("#" + divId).attr("amount", 1);
                    $("#yourOffer").find("#num" + divId).text("x1");
                } else {
                    $("#yourOffer").find("#" + divId).attr("amount", parseInt(amountO) + 1);
                    $("#yourOffer").find("#num" + divId).text("x" + (parseInt(amountO) + 1));
                }
                if (amount == "1") {
                    $("#yourIv").find("#" + divId).stop().fadeTo(0, 0);
                    $("#yourIv").find("#" + divId).attr("clickable", "false");
                    $("#yourIv").find("#" + divId).css('cursor', 'default');
                } else {
                    $("#yourIv").find("#" + divId).attr("amount", amount - 1);
                    $("#yourIv").find("#num" + divId).text("x" + (amount - 1));
                }
            }
        } else if (boxId == "botOffer") {
            if ($("#botOffer").find("#" + divId).attr("clickable") !== "false") {
                if ($("#" + boxId).find("#" + divId).attr("value") !== "") {
                    isValid = true;
                    itemValue = parseFloat($("#botOffer").find("#" + divId).attr("value"));
                    document.getElementById("botValue").innerHTML = parseFloat((totalValueBot - itemValue).toFixed(3));
                    document.getElementById("valueLeft").innerHTML = parseFloat((valueLeft + itemValue).toFixed(3));
                }
                if ($("#" + botIvBox).find("#" + divId).attr("clickable") == "false") {
                    $("#" + botIvBox).find("#" + divId).stop().css("opacity", "0.01");
                    $("#" + botIvBox).find("#" + divId).attr("clickable", "true");
                    $("#" + botIvBox).find("#" + divId).css('cursor', 'pointer');
                } else {
                    $("#" + botIvBox).find("#" + divId).attr("amount", parseInt(amountBotIv) + 1);
                    $("#" + botIvBox).find("#num" + divId).text("x" + (parseInt(amountBotIv) + 1));
                }
                if (amountBotOffer == "1") {
                    $("#botOffer").find("#" + divId).stop().fadeOut(0, function () {
                        $(this).tipsy("hide");
                        $(this).remove();
                    });
                } else {
                    $("#botOffer").find("#" + divId).attr("amount", parseInt(amountBotOffer) - 1);
                    $("#botOffer").find("#num" + divId).text("x" + (parseInt(amountBotOffer) - 1));
                }
            }
        } else if (boxId == "botsIv") {
            if ($("#" + botIvBox).find("#" + divId).attr("clickable") == "true") {
                if ($("#" + botIvBox).find("#" + divId).attr("value") !== "") {
                    isValid = true;
                    itemValue = parseFloat($("#" + boxId).find("#" + divId).attr("value"));
                    if (itemValue < 0.01) {
                        dec = 3;
                    }
                    document.getElementById("botValue").innerHTML = parseFloat((totalValueBot + itemValue).toFixed(3));
                    document.getElementById("valueLeft").innerHTML = parseFloat((valueLeft - itemValue).toFixed(3));
                }
                if ($("#botOffer").find("#" + divId).attr("clickable") == null) {
                    $("#" + botIvBox).find("#" + divId).clone().prop('test1', "offer").appendTo("#botOffer");
                    $("#botOffer").find("#" + divId).tipsy({html: true});
                    $("#botOffer").find("#" + divId).attr("amount", 1);
                    $("#botOffer").find("#num" + divId).text("x1");
                } else {
                    $("#botOffer").find("#" + divId).attr("amount", parseInt(amountBotOffer) + 1);
                    $("#botOffer").find("#num" + divId).text("x" + (parseInt(amountBotOffer) + 1));
                }
                if (amountBotIv == "1") {
                    $("#" + botIvBox).find("#" + divId).attr("clickable", "false");
                    $("#" + botIvBox).find("#" + divId).stop().css("opacity", "0");
                    $("#" + boxId).find("#" + divId).css('cursor', 'default');
                } else {
                    $("#" + botIvBox).find("#" + divId).attr("amount", parseInt(amountBotIv) - 1);
                    $("#" + botIvBox).find("#num" + divId).text("x" + (parseInt(amountBotIv) - 1));
                }
            }
        }
        if (isValid == true) {
            changeOfferCnt(boxId);
        }
        clientValue = parseFloat(document.getElementById("yourValue").innerHTML);
        botValue = parseFloat(document.getElementById("botValue").innerHTML);
        valueLeft = clientValue - botValue;
        valueLeft = valueLeft.toFixed(3);
        if (firstClick == false && firstClickBot == false) {
            buttonDisabler(clientValue, botValue);
        }
        disableExpensive("botsIv", valueLeft);
    }

    function buttonDisabler(clientValue, botValue) {
        if (botValue <= clientValue && clientValue > 0.000) {
            if (botValue > 0.000) {
                $("#tradeButton img").attr("src", "/images/tradeButton/tradeActive.png");
                $("#tradeButton").attr("onClick", "requestOffer()");
                setupHoverChange("#tradeButton img", "/images/tradeButton/tradeActiveHover.png", "/images/tradeButton/tradeActive.png");
            }
            else if (botValue == 0.000) {
                $("#tradeButton img").attr("src", "/images/tradeButton/donate.png");
                $("#tradeButton").attr("onClick", "requestOffer()");
                setupHoverChange("#tradeButton img", "/images/tradeButton/donateHover.png", "/images/tradeButton/donate.png");
            }
        }
        else if (botValue > clientValue) {
            $("#tradeButton img").attr("src", "/images/tradeButton/tradeUnvalid.png");
            $("#tradeButton").attr("onClick", "");
            setupHoverChange("#tradeButton img", "/images/tradeButton/tradeUnvalid.png", "/images/tradeButton/tradeUnvalid.png");
        }
        else if (botValue == clientValue) {
            if (botValue == 0.000) {
                $("#tradeButton img").attr("src", "/images/tradeButton/tradeEmpty.png");
                $("#tradeButton").attr("onClick", "");
                setupHoverChange("#tradeButton img", "/images/tradeButton/tradeEmpty.png", "/images/tradeButton/tradeEmpty.png");
            }
            else {
                $("#tradeButton img").attr("src", "/images/tradeButton/tradeActive.png");
                $("#tradeButton").attr("onClick", "requestOffer()");
                setupHoverChange("#tradeButton img", "/images/tradeButton/tradeActiveHover.png", "/images/tradeButton/tradeActive.png");
            }
        }
    }

    function setupHoverChange(id, srcOnHover, soruceOff) {
        $(id).mouseover(function () {
            $(this).attr("src", srcOnHover);
        }).mouseout(function () {
            $(this).attr("src", soruceOff);
        });
    }

    $.preloadImages = function () {
        for (var i = 0; i < arguments.length; i++) {
            $("<img />").attr("src", arguments[i]);
        }
    }
    function preload() {
        $.preloadImages("/images/tradeButton/tradeEmpty.png", "/images/tradeButton/tradeUnvalid.png", "/images/tradeButton/tradeActiveHover.png", "/images/tradeButton/tradeActive.png", "/images/tradeButton/donateHover.png", "/images/tradeButton/donate.png");
    };
    function moveAll(classid, box) {s
        box = box.replace('#', '');
        var el = $("#" + box).find("[classid='" + classid + "']");
        if (el.attr("clickable") == "true" && chosenBot !== "All") {
            var times = el.attr("amount");
            var divId = el.attr("id");
            for (cnt = 0; cnt < times; cnt++) {
                console.log("ran");
                addElement(divId, box);
            }
            if (box == "yourIv") {
                setupMenus('#yourOffer');
            }
            else if (box == "botsIv") {
                setupMenus('#botOffer');
                lockBotButton("addItem");
            }
            else if (box == "botOffer") {
                lockBotButton("removeItem");
            }
        }
    }

    function disableExpensive(id, clientMinusBot) {
        $('#' + id).children('div').each(function () {
            if ($(this).css("opacity") > 0 && this.getAttribute('value')) {
                if (parseFloat(this.getAttribute('value')) <= clientMinusBot && this.getAttribute('valuetype') !== "unaccepted") {
                    $(this).css("opacity", "1");
                    this.setAttribute("clickable", "true");
                }
                else {
                    $(this).css("opacity", "0.45");
                    this.setAttribute("clickable", "false");
                }
            }
            else {
            }
        });
    }

    function sortItems(element, wrapperId) {
        var $wrapper = $(wrapperId);
        type = element.value;
        if (type == "TlowoHigh") {
            $wrapper.find('.itemImgDiv').sort(function (a, b) {
                return a.getAttribute('value') - b.getAttribute('value');
            }).appendTo($wrapper);
        }
        else if (type == "highToLow") {
            $wrapper.find('.itemImgDiv').sort(function (a, b) {
                return b.getAttribute('value') - a.getAttribute('value');
            }).appendTo($wrapper);
        }
        else if (type == "mostRecent") {
            $wrapper.find('.itemImgDiv').sort(function (a, b) {
                return a.getAttribute('id') - b.getAttribute('id');
            }).appendTo($wrapper);
        }
    }

    function searchItems(searchString, wrapperId) {
        var $wrapper = $(wrapperId);
        $wrapper.children('div').each(function () {
            var title = $(this).attr('original-title').toLowerCase();
            searchString = searchString.toLowerCase();
            var altTitle = title.replace(" ", "").replace("-", "");
            var altSearchString = searchString.replace("-", "").replace(" ", "");
            var valueType = $(this).attr('valueType').toLowerCase();
            if (title.indexOf(searchString) >= 0 || altTitle.indexOf(altSearchString) >= 0 || valueType.indexOf(searchString) >= 0) {
                $(this).css("display", "inline-block");
            }
            else {
                $(this).css("display", "none");
            }
        });
    }

    function showInfo(html, id) {
        $(html).hide().appendTo(id).fadeIn();
    }

    function bonusPercentages() {
        var percentInt = 2;
        keysPercentage = parseInt(document.getElementById("keysPercentage").innerHTML);
        document.getElementById("keysPercentage").innerHTML = (keysPercentage + percentInt);
        keysPercentage = parseInt(document.getElementById("knifesPercentage").innerHTML);
        document.getElementById("knifesPercentage").innerHTML = (keysPercentage + percentInt);
        keysPercentage = parseInt(document.getElementById("rareWeaponsPercentage").innerHTML);
        document.getElementById("rareWeaponsPercentage").innerHTML = (keysPercentage + percentInt);
        keysPercentage = parseInt(document.getElementById("weaponsPercentage").innerHTML);
        document.getElementById("weaponsPercentage").innerHTML = (keysPercentage + percentInt);
        keysPercentage = parseInt(document.getElementById("miscPercentage").innerHTML);
        document.getElementById("miscPercentage").innerHTML = (keysPercentage + percentInt);
    }
