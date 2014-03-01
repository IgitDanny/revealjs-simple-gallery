(function(Gallery) {
	var galleryTimer;

	Gallery.step = function (items, iterations) {
		var length = items.length,
			ptr = 0,
			loops = 0;

		return function () {
			if (iterations > 0 && loops === iterations) {
				return;
			}
			items[ptr].className = "inactive";
			if (ptr === length - 1) {
				loops++;
				if (iterations === 0 || loops < iterations) {
					ptr = 0;
				}
			} else {
				ptr++;
			}
			items[ptr].className = "active";
		};
	};

	Gallery.start = function (elem) {
		var galleryNode = elem.querySelector('.gallery');
		if (!galleryNode) return; // early exit if no gallery

		var items = Array.prototype.slice.apply(galleryNode.querySelectorAll("li"));
		items.forEach(function (item, index) {
			if (index === 0) {
				item.className = "active";
			} else {
				item.className = "inactive";
			}
			var label = item.querySelector("label");
			if (!label) {
				var img = item.querySelector("img");
				label = document.createElement("label");
				label.innerHTML = img.attributes.alt.value;
				item.appendChild(label);
			}
		});

		var iterations = galleryNode.dataset.iterations ? +galleryNode.dataset.iterations : 1;
		var interval = (galleryNode.dataset.interval || 1) * 1000;
		galleryTimer = setInterval(Gallery.step(items, iterations), interval);
	};

	Gallery.stop = function () {
		clearInterval(galleryTimer);
	};
})(window.Gallery = window.Gallery || {});(function() {
	if( typeof window.addEventListener === 'function' ) {
		Reveal.addEventListener("slidechanged", function (event) {
			if (event.previousSlide.querySelector('.gallery')) {
				Gallery.stop();
			}

			Gallery.start(event.currentSlide);
		});

		// during initial load
		if (Reveal.getCurrentSlide()) {
			Gallery.start(Reveal.getCurrentSlide());
		}
	}
})();