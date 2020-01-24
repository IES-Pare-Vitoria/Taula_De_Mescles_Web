const controlButtonsCard = $("#controlButtonsCard");
const buttonUpdateCard = $("#buttonUpdateCard");
const buttonUpdateId = $("#buttonUpdateId");
let buttonsDatas = [];

function loadButtons() {
    controlButtonsCard.empty();

    for(let c = 0; c < buttonsDatas.length; c++){
        const button = buttonsDatas[c];
        controlButtonsCard.append(`<button class="button-pad" style="--color: #${colorAddZerosPrefix(button.color)};" data-id="${c}"></button>`);
    }
    controlButtonsCard.show();

    const buttons = $(".button-pad");
    buttons.each(function (index) {
        const elem = $(this);
        elem.on("contextmenu", function (e) {
            e.preventDefault();

            const id = elem.attr("data-id");
            buttonUpdateId.val(id);

            buttonUpdateCard.show();

            return false;
        })
    });

    buttonUpdateCard.hide();
}

$(function () {
    buttonUpdateCard.hide();
    controlButtonsCard.hide();

    $(document).keyup(function(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            buttonUpdateCard.hide();
        }
    });
});