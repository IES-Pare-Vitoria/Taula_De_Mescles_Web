function reloadUIListeners() {
    $(".delete-parent-click").on("click", function (e) {
        e.preventDefault();
        $(this).parent().remove();
        return false;
    });
}

$(function () {
    const sortable = $(".sortable");
    sortable.sortable();
    sortable.disableSelection();


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
    const buttonUpdateCommandCommandsList = $("#buttonUpdateCommandCommandsList");
    const addNewCommandForm = $("#addNewCommandForm");

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
        this.classList.remove("is-invalid");
    });
    $("input").on("change", function () {
        this.classList.remove("is-invalid");
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

        let addedNewCommand = false;

        if (type === "dmx") {
            const baseDMXCommand = `<span class="badge badge-pill badge-primary">DMX</span>`
            showCommand += baseDMXCommand;
            if (dmxAction === "raw")
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
                else
                    showCommand +=
                        `<span class="badge badge-pill badge-info">Pan ${dmxFocusChannel}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxPanAngle}\º</span>`;
            else if (dmxAction === "tilt")
                if (dmxFocusChannel === "")
                    buttonUpdateCommandDMXFocusChannel.addClass("is-invalid");
                else
                    showCommand +=
                        `<span class="badge badge-pill badge-info">Tilt ${dmxFocusChannel}</span>` +
                        `<span class="badge badge-pill badge-secondary">${dmxTiltAngle}\º</span>`;
            else
                buttonUpdateCommandDMXType.addClass("is-invalid");
            if (showCommand.length > baseDMXCommand.length) {
                addedNewCommand = true;
                buttonUpdateCommandCommandsList.append(`<li class="list-group-item d-flex justify-content-between align-items-center" data-command="${command}"><span>${showCommand}</span> <a href="#" class="badge badge-danger badge-pill delete-parent-click"><i class="far fa-trash-alt"></i></a></li>`);
            }
            }

        if(addedNewCommand) {
            reloadUIListeners();
            resetForm();
        }
        return false;
    });
    hideInputs();
    buttonUpdateCommandDMX.hide();
});