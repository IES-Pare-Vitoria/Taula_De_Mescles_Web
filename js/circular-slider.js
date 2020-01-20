$(function () {
    const anglePicker = $(".angle-picker");
    anglePicker.each(function (i) {
        const picker = $(anglePicker[i]);
        const min = picker.attr("min") || 0;
        const max = picker.attr("max") || 360;
        picker.roundSlider({
            radius: 80,
            width: 8,
            handleSize: "+16",
            handleShape: "dot",
            sliderType: "min-range",
            value: 0,
            min: min,
            max: max,
            mouseScrollAction: true
        });
    });
});