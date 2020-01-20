let mqtt;
let buttonsCount, deviceIp = null;

const mqttProgress = $("#mqttConnectionProgress");
const mqttAddressField = $("#mqttConnectionAddressInput");
const mqttPortField = $("#mqttConnectionPortInput");
const mqttNameField = $("#mqttConnectionNameInput");
const mqttConnectionCard = $("#mqttConnectionCard");
const mqttFetchingSpinner = $("#mqttFetchingSpinner");

function mqtt_setLoading(loading = true) {
    mqttAddressField.prop("disabled", loading);
    mqttPortField.prop("disabled", loading);
    mqttNameField.prop("disabled", loading);
    if (loading)
        mqttProgress.removeClass("hidden");
    else
        mqttProgress.addClass("hidden");
}

function mqtt_publish(topic, message = "") {
    const msg = new Paho.MQTT.Message(message);
    msg.destinationName = topic.toString();
    mqtt.send(msg);
}

function mqtt_onConnect() {
    console.warn("MQTT Connected!");

    mqtt.subscribe("esp32/response");

    mqttConnectionCard.addClass("gone");

    //mqtt_publish("esp32/retrieve/buttons");
    mqtt_publish("esp32/retrieve/ip");
    mqtt_setLoading(false);
}

function mqtt_onFailure(msg) {
    console.error("MQTT > ", msg);
    mqttConnectionCard.removeClass("gone");
    mqtt_setLoading(false);
}

function mqtt_onMessageArrived(msg) {
    const message = msg.payloadString;
    const topic = msg.destinationName;

    console.log(`Message arrived on "${topic}": ${message}`);

    let json = JSON.parse(message);

    console.warn("json: ", json);

    const ip = json.ip;
    if (ip != null) {
        deviceIp = ip;

        const url = `http://${ip}/get/listeners`;
        $.ajax({
            url: url,
            success: function (result) {
                try {
                    const json = JSON.parse(result);
                    const buttons = json.buttons;
                    if (buttons == null)
                        console.error("Buttons not found!");
                    else {
                        buttonsDatas = [];
                        for (let i = 0; i < buttons.length; i++) {
                            buttonsDatas[i] = buttons[i].button_data;
                        }
                        loadButtons();
                    }
                }catch (e) {
                    console.error(e);
                    console.warn("JSON: " + result)
                }
            }
        });
    }
}

$(function () {
    $("#mqttConnectionForm").on('submit', function (e) {
        e.preventDefault();

        const mqttAddress = mqttAddressField.val();
        const mqttPort = parseInt(mqttPortField.val());
        const mqttName = mqttNameField.val();

        mqtt_setLoading();
        console.warn("Connecting to " + mqttAddress + ":" + mqttPort);

        mqtt = new Paho.MQTT.Client(mqttAddress, mqttPort, mqttName);
        const options = {
            timeout: 3,
            onSuccess: mqtt_onConnect,
            onFailure: mqtt_onFailure
        };
        mqtt.onMessageArrived = mqtt_onMessageArrived;

        mqtt.connect(options);
        return false;
    });
});