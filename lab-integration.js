var phone = iframePhone.getIFrameEndpoint();

// Register Scripting API functions.
function registerCustomFunc(name, func) {
  phone.addListener(name, func);
  phone.post('registerScriptingAPIFunc', name);
}

registerCustomFunc('play', function() {
  model.start();
});

registerCustomFunc('stop', function() {
  model.stop();
});

registerCustomFunc('step', function(content) {
  var steps = content;
  while (steps--) model.step();
});

// Properties.
phone.addListener('set', function (content) {
  switch(content.name) {
    case 'temperature':
      model.temperature = content.value;
      break;
    case 'ph':
      model.ph = content.value;
      break;
    case 'lactose':
      model.lactose = content.value;
      break;
    case 'temperatureFuncDef':
      model.temperatureFuncDef = content.value;
      break;
    case 'phFuncDef':
      model.phFuncDef = content.value;
      break;
  }
});

function getOutputs() {
  return {
    time: model.time,
    glucose: model.glucose
  };
};


model.stepCallback = function () {
  // We could also write:
  // phone.post('outputs', { ... });
  // phone.post('tick');
  // However Lab supports outputs in 'tick' handler too, so we can send only one message.
  phone.post('tick', {
    outputs: getOutputs()
  });
};

model.startCallback = function () {
  phone.post('play.iframe-model');
};

model.stopCallback = function () {
  phone.post('stop.iframe-model');
};

phone.initialize();
// Set initial output values.
phone.post('outputs', getOutputs());
