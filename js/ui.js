function reloadUIListeners() {
    $(".delete-parent-click").on("click", function (e) {
        e.preventDefault();
        $(this).parent().remove();
        return false;
    });
}

function hexToRgb(hex) {
    let color = hex;
    if (!hex.startsWith("#"))
        color = "#" + hex;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorAddZerosPrefix(color){
    if(color.length <= 1) return "ffffff";
    const addZeros = 6 - color.length;
    return "0".repeat(addZeros) + color;
}

$(function () {
    const sortable = $(".sortable");
    sortable.sortable();
    sortable.disableSelection();


    const buttonUpdateId = $("#buttonUpdateId");
    const buttonUpdateCommand = $("#buttonUpdateCommand");
    const buttonUpdateCommandDMX = $("#buttonUpdateCommandDMX");
    const buttonUpdateCommandDMXType = $("#buttonUpdateCommandDMXType");
    const buttonUpdateCommandDMXRGB = $("#buttonUpdateCommandDMXRGB");
    const buttonUpdateCommandDMXW = $("#buttonUpdateCommandDMXW");
    const buttonUpdateCommandDMXChannelDiv = $("#buttonUpdateCommandDMXChannelDiv");
    const buttonUpdateCommandDMXValueDiv = $("#buttonUpdateCommandDMXValueDiv");
    const buttonUpdateCommandDMXFocusChannelDiv = $("#buttonUpdateCommandDMXFocusChannelDiv");
    const buttonUpdateCommandDMXPan = $("#buttonUpdateCommandDMXPan");
    const buttonUpdateCommandDMXTilt = $("#buttonUpdateCommandDMXTilt");
    const buttonUpdateCommandDMXChannel = $("#buttonUpdateCommandDMXChannel");
    const buttonUpdateCommandDMXValue = $("#buttonUpdateCommandDMXValue");
    const buttonUpdateCommandDMXFocusChannel = $("#buttonUpdateCommandDMXFocusChannel");
    const buttonUpdateCommandDMXPanAngle = $('input[name="buttonUpdateCommandDMXPanAngle"]');
    const buttonUpdateCommandDMXTiltAngle = $('input[name="buttonUpdateCommandDMXTiltAngle"]');
    const buttonUpdateCommandDMXColor = $("#buttonUpdateCommandDMXColor");
    const buttonUpdateCommandDMXWhite = $("#buttonUpdateCommandDMXWhite");
    const buttonUpdateCommandCommandsList = $("#buttonUpdateCommandCommandsList");
    const addNewCommandForm = $("#addNewCommandForm");
    const updateSendButton = $("#buttonUpdateSend");

    function hideInputs() {
        buttonUpdateCommandDMXRGB.hide();
        buttonUpdateCommandDMXW.hide();
        buttonUpdateCommandDMXChannelDiv.hide();
        buttonUpdateCommandDMXValueDiv.hide();
        buttonUpdateCommandDMXFocusChannelDiv.hide();
        buttonUpdateCommandDMXPan.hide();
        buttonUpdateCommandDMXTilt.hide();
    }

    function resetForm() {
        addNewCommandForm.trigger("reset");
        buttonUpdateCommandDMX.hide();
        hideInputs();
        // TODO: Clear value
        //buttonUpdateCommandDMXPanAngle.data("roundSlider").setValue(0);
        //buttonUpdateCommandDMXTiltAngle.data("roundSlider").setValue(0);
    }

    $("select").on("change", function () {
        if (this.classList != null && this.classList.contains("is-invalid"))
            $(this).removeClass("is-invalid");
    });
    $("input").on("change", function () {
        if (this.classList != null && this.classList.contains("is-invalid"))
            $(this).removeClass("is-invalid");
    });

    buttonUpdateCommand.on("change", function () {
        const val = buttonUpdateCommand.val();

        buttonUpdateCommandDMX.hide();

        if (val === "dmx") {
            buttonUpdateCommandDMX.show();
        }
    });
    buttonUpdateCommandDMXType.on("change", function () {
        const val = buttonUpdateCommandDMXType.val();

        hideInputs();

        if (val === "rgb" || val === "rgbw")
            buttonUpdateCommandDMXRGB.show();
        if (val === "rgbw")
            buttonUpdateCommandDMXW.show();
        if (val === "rgb" || val === "rgbw" || val === "pan" || val === "tilt")
            buttonUpdateCommandDMXFocusChannelDiv.show();
        if (val === "raw")
            buttonUpdateCommandDMXChannelDiv.show();
        if (val === "raw")
            buttonUpdateCommandDMXValueDiv.show();
        if (val === "pan")
            buttonUpdateCommandDMXPan.show();
        if (val === "tilt")
            buttonUpdateCommandDMXTilt.show();
    });
    addNewCommandForm.on("submit", function (e) {
        e.preventDefault();

        const type = buttonUpdateCommand.val();
        const dmxAction = buttonUpdateCommandDMXType.val();
        let showCommand = "",
            command = "";

        const dmxChannel = buttonUpdateCommandDMXChannel.val();
        const dmxValue = buttonUpdateCommandDMXValue.val();
        const dmxFocusChannel = buttonUpdateCommandDMXFocusChannel.val();
        const dmxPanAngle = buttonUpdateCommandDMXPanAngle.val();
        const dmxTiltAngle = buttonUpdateCommandDMXTiltAngle.val();
        const dmxColor = buttonUpdateCommandDMXColor.val();
        const dmxWhite = buttonUpdateCommandDMXWhite.val();

        let addedNewCommand = false;

        const dimmerChannel = parseInt(dmxFocusChannel) + 2;
        const rChannel = dimmerChannel + 1;
        const gChannel = dimmerChannel + 2;
        const bChannel = dimmerChannel + 3;
        const wChannel = dimmerChannel + 4;
        const rgb = hexToRgb(dmxColor);

        if (type === "dmx") {
            const baseDMXCommand = `<span class="badge badge-pill badge-primary">DMX</span>`
            showCommand += baseDMXCommand;
            if (dmxAction === "raw")// TODO: Add channel
                if (dmxChannel === "")
                    buttonUpdateCommandDMXChannel.addClass("is-invalid");
                else if (dmxValue === "")
                    buttonUpdateCommandDMXValue.addClass("is-invalid");
                else
                    showCommand +=
                        `<span class="badge badge-pill badge-info">C-${dmxChannel}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxValue}</span>`;
            else if (dmxAction === "pan")
                if (dmxFocusChannel === "")
                    buttonUpdateCommandDMXFocusChannel.addClass("is-invalid");
                else {
                    showCommand +=
                        `<span class="badge badge-pill badge-info">Pan ${dmxFocusChannel}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxPanAngle}\º</span>`;
                    const channel = parseInt(dmxFocusChannel);
                    command += `P${channel}-${dmxPanAngle}`
                }
            else if (dmxAction === "tilt")
                if (dmxFocusChannel === "")
                    buttonUpdateCommandDMXFocusChannel.addClass("is-invalid");
                else {
                    showCommand +=
                        `<span class="badge badge-pill badge-info">Tilt ${dmxFocusChannel}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxTiltAngle}\º</span>`;
                    const channel = parseInt(dmxFocusChannel) + 1;
                    command += `T${channel}-${dmxPanAngle}`
                }
            else if (dmxAction === "rgb")
                if (dmxFocusChannel === "")
                    buttonUpdateCommandDMXFocusChannel.addClass("is-invalid");
                else {
                    showCommand +=
                        `<span class="badge badge-pill badge-info">RGB ${dmxFocusChannel}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxColor}</span>`;
                    command += `D${dimmerChannel}-255` + "\n" +
                        `D${rChannel}-${rgb.r}` + "\n" +
                        `D${gChannel}-${rgb.g}` + "\n" +
                        `D${bChannel}-${rgb.b}`
                }
            else if (dmxAction === "rgbw")
                if (dmxFocusChannel === "")
                    buttonUpdateCommandDMXFocusChannel.addClass("is-invalid");
                else {
                    showCommand +=
                        `<span class="badge badge-pill badge-info">RGBW ${dmxFocusChannel}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxColor}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxWhite}</span>`;
                    command += `D${dimmerChannel}-255` + "\n" +
                        `D${rChannel}-${rgb.r}` + "\n" +
                        `D${gChannel}-${rgb.g}` + "\n" +
                        `D${bChannel}-${rgb.b}` + "\n" +
                        `D${wChannel}-${dmxWhite}`
                }
            else
                buttonUpdateCommandDMXType.addClass("is-invalid");
            if (showCommand.length > baseDMXCommand.length) {
                addedNewCommand = true;
                buttonUpdateCommandCommandsList.append(`<li class="list-group-item d-flex justify-content-between align-items-center" data-command="${command}"><span>${showCommand}</span> <a href="#" class="badge badge-danger badge-pill delete-parent-click"><i class="far fa-trash-alt"></i></a></li>`);
            }
        }

        if (addedNewCommand) {
            reloadUIListeners();
            resetForm();
        }
        return false;
    });
    updateSendButton.on("click", function (e) {
        e.preventDefault();

        buttonUpdateCard.hide();

        if (deviceIp == null) {
            console.error("Device IP not stored");
            return false
        }

        const buttonId = buttonUpdateId.val();
        const url = `http://${deviceIp}/config/button/clear`;
        $.ajax({
            url: url,
            type: "get",
            data: {
                id: buttonId
            },
            success: function (response) {
                console.warn("result: ", response.toString());
                try {
                    const res = response.toString();
                    if (res == null)
                        console.error("res is null");
                    const code = JSON.parse(res);

                    const result = code.result;
                    if (result != null) {
                        console.log(`Deleted config for button ${buttonId} correctly`);

                        const color = buttonUpdateCommandDMXColor.val().replace("#", "");
                        const colorInt = parseInt(color, 16);
                        $.ajax({
                            url: url,
                            type: "get",
                            data: {
                                id: buttonId,
                                color: colorInt
                            },
                            success: function (response) {
                                try {
                                    const code = JSON.parse(response);
                                    const result = code.result;
                                    if (result != null)
                                        console.log("Set color", colorInt, "HEX:" + color);
                                    else
                                        console.error("Couldn't set color", colorInt, ":", response)
                                } catch (e) {
                                    console.error(e);
                                    console.warn("JSON: " + response)
                                }
                            }
                        });

                        const children = $(buttonUpdateCommandCommandsList.children());
                        for (let i in children) {
                            if (!children.hasOwnProperty(i)) return;
                            const item = $(children[i]);
                            const fullCommand = item.attr("data-command");
                            if (fullCommand == null)
                                return;
                            console.warn("Full command:", fullCommand);
                            const commands = fullCommand.split("\n");
                            for (const c in commands) {
                                if (!commands.hasOwnProperty(c)) return;
                                const command = commands[c];
                                const url = `http://${deviceIp}/config/button/command`;
                                $.ajax({
                                    url: url,
                                    type: "get",
                                    data: {
                                        id: buttonId,
                                        command: command
                                    },
                                    success: function (response) {
                                        try {
                                            const code = JSON.parse(response);
                                            const result = code.result;
                                            if (result != null)
                                                console.log("Added command", command);
                                            else
                                                console.error("Couldn't add command", command, ":", response)
                                        } catch (e) {
                                            console.error(e);
                                            console.warn("JSON: " + response)
                                        }
                                    }
                                });
                            }
                        }
                    } else console.error(`An error occurred while clearing button #${buttonId}`);
                } catch (e) {
                    console.error(e);
                    console.warn("JSON: " + response)
                }
            }
        });

        return false;
    });

    hideInputs();
    buttonUpdateCommandDMX.hide();
});