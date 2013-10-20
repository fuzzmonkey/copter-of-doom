define('leapControls', ['controls'], function(Controls) {

	function LeapControls(app) {
		this.app = app;
		this.previousPosition = null;
		this.stopped = false;
		
		this.controls = new Controls(app);
		this.leapController = new Leap.Controller({enableGestures: true});
		this.leapController.on('connect', function() {
			$('#leap-status').text('Connected');
		});
		this.leapController.on('disconnect', function() {
			$('#leap-status').text('Disconnected');
		});
	}

	$.extend(LeapControls.prototype, {

		eventLoop: function() {
			var controller = this;
			controller.leapController.loop(function(frame) {
				if (frame.hands[0]) {
					var hand = frame.hands[0];
					controller.stopped = false;

					if (!controller.app.flying && hand.fingers.length == 5) {
						controller.controls.takeoff();
					}
					if (!controller.app.flying) return;

					action = controller.handleInput(hand)
					if (action != null) {
						controller.controls[action]()
					}
				} else {
					if (!controller.stopped) {
						controller.controls.stop();
						controller.stopped = true;
					}
				}
			});
		},

		handlePitch: function(hand) {
			if (hand.pitch() <= -0.5) {
				// console.log('forward: ' + hand.pitch())
				return 'forwards'
			} else if (hand.pitch() >= 0.5) {
				// console.log('backward: '+ hand.pitch())
				return 'backwards';
			}
		},

		handleRoll: function(hand) {
			if (hand.roll() <= -0.5) {
				// console.log('right:' + hand.roll())
				return 'right'
			} else if (hand.roll() >= 0.5) {
				// console.log('left:' + hand.roll())
				return 'left';
			}
		},

		handleHeight: function(hand) {
			currentPosition = (parseInt(hand.stabilizedPalmPosition[1]/10)+1)*10
			if (currentPosition < this.previousPosition) {
				// console.log('down: ' + currentPosition)
				this.previousPosition = currentPosition;
				return 'down';
			} else if (currentPosition != this.previousPosition) {
				// console.log('up: ' + currentPosition)
				this.previousPosition = currentPosition;
				return 'up';
			}
		},

		handleInput: function(hand) {
			action = this.handleRoll(hand)
			if (action) return action
			action = this.handlePitch(hand)
			if (action) return action
			action = this.handleHeight(hand)
			return action;
		}

	});

	return LeapControls;
});
