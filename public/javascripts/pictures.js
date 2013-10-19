define('pictures', function() {
	function Pictures(app) {
		this.app = app;
		this.canvas = $('#pictures')[0];
		this.context = this.canvas.getContext('2d');
	}

	$.extend(Pictures.prototype, {
		update: function() {
			var img = new Image(),
				self = this;
			img.src = '/image';
			img.addEventListener('load', function() {
				self.context.drawImage(img, 0, 0);
				setTimeout(function() {
					self.update();
				}, 200);
			});
			img.addEventListener('error', function() {
				console.log('image not ready');
				setTimeout(function() {
					self.update();
				}, 1000);
			});
		}
	});

	return Pictures;
});
