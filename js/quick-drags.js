// take from http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
// and modified by Ben

(function($) {
	$.fn.drags = function(opt) {

		opt = $.extend({cursor:"move",vertical:true,horizontal:true,onDrag:function(){},onRelease:function(){}}, opt);
		
		var $el = this;

		return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
			var $drag = $(this).addClass('draggable');
			var z_idx = $drag.css('z-index'),
				drg_h = $drag.outerHeight(),
				drg_w = $drag.outerWidth(),
				orig_y = $drag.offset().top,
				orig_x = $drag.offset().left,
				pos_y = $drag.offset().top + drg_h - e.pageY,
				pos_x = $drag.offset().left + drg_w - e.pageX;
			$drag.css('z-index', 1000);
			$(window).on("mousemove", function(e) {
				$('.draggable').offset({
					top: (opt.vertical) ? e.pageY + pos_y - drg_h : orig_y,
					left: (opt.horizontal) ? e.pageX + pos_x - drg_w : orig_x
				});
				opt.onDrag();
			}).on("mouseup", function() {
				$('.draggable').removeClass('draggable').css('z-index', z_idx);
				$(window).off("mousemove").off("mouseup");
				opt.onRelease();
			});
			e.preventDefault(); // disable selection
		});
	}
})(jQuery);