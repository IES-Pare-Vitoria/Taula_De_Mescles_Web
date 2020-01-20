$(function () {
    $(".draggable").draggable({
        cancel: ".no-drag"
    });
    $(".form-control").addClass("no-drag");
    $(".custom-select").addClass("no-drag");
    $(".custom-range").addClass("no-drag");
});