$(window).on('load', function () {
	// Cookies checker
	
	function cookieCheck() {
		var $list = $('.galery__view svg[data-view="list"]');
		var $tiles = $('.galery__view svg[data-view="tiles"]');
		var $viewButtons = $('.galery__view svg');
		
		if ($.cookie('tiles')) {
			$viewButtons.removeClass('active');
			$tiles.addClass('active');
			$('.galery').addClass('tiles--view');
		}
		
		if ($.cookie('list')) {
			$viewButtons.removeClass('active');
			$list.addClass('active');
			$('.galery').removeClass('tiles--view');
		}
	}
	
	cookieCheck();
});

// Site preloader

function preloader() {
	var preloader = $('#preloader');
	
	preloader.css('opacity', '0');
	preloader.attr('aria-busy', 'false');
	$('#site').css('opacity', '1');
}

window.onload = preloader;

$(document).ready(function () {
	
	// Mobile menu
	
	function mobileMenu() {
		var $burger = $('.header__burger');
		var $list = $('.header__nav-list');
		var $body = $('body');
		
		$burger.click(function () {
			$(this).toggleClass('menu--active');
			$body.toggleClass('body--lock');
			$list.slideToggle();
		});
	}
	
	mobileMenu();
	
	function checkWindowWidth() {
		var $burger = $('.header__burger');
		var $list = $('.header__nav-list');
		var $body = $('body');
		
		if ($(window).width() > 750) {
			$burger.removeClass('menu--active');
			$body.removeClass('body--lock');
			$list.removeAttr('style');
		}
	}
	
	checkWindowWidth();
	
	// Slider
	
	(function () {
		var $heroSlider = new Swiper('.hero-slider__container', {
			slidesPerView: 1,
			spaceBetween: 15,
			height: 640,
			slidesPerGroup: 1,
			freeMode: true,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});
	}());
	
	// Smooth scroll to anchors
	
	$('a[href^="#"]').click(function () {
		if (document.getElementById($(this).attr('href').substr(1)) != null) {
			$('html, body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500);
		}
		return false;
	});
	
	
	// Resize
	
	$(window).resize(function () {
		checkWindowWidth();
	});
	
	// Scroll
	
	$(window).scroll(function () {
	
	});
	
	
	// Read more
	
	function readMoreBtn() {
		$('.galery__card-text').each(function () {
			var $charLimit = 522;
			var $text = $(this).html();
			var $dots = '<span class="read-more-dots"> ...</span>';
			
			if ($text.length > $charLimit) {
				var $beforeSliceText = $text.slice(0, $charLimit);
				var $afterSliceText = $text.slice($charLimit);
				var $buttonReadMore = '<span class="read-more-btn">Read more<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"/></svg></span>'
				
				$(this).html($beforeSliceText + $dots + '<span class="sliced--text" style="display: none;">' + $afterSliceText + '</span>' + $buttonReadMore);
			}
		});
		
		$('.read-more-btn').click(function () {
			$(this).parents('.galery__card-text').find('.read-more-dots').toggle();
			$(this).parents('.galery__card-text').find('.sliced--text').toggle(500);
			$(this).toggleClass('spoiler--open');
		});
	}
	
	readMoreBtn();
	
	// Galery view
	
		$('.galery__view svg').click(function () {
			var $thisData = $(this).attr('data-view');
			
			$('.galery__view svg').removeClass('active');
			$(this).addClass('active');
			$.removeCookie('tiles',{ path: '/' });
			$.removeCookie('list',{ path: '/' });
			$.cookie($thisData, 'active', { expires: 7, path: '/' });
			
			if ($thisData == 'tiles') {
				$('.galery').addClass('tiles--view');
			} else {
				$('.galery').removeClass('tiles--view');
			}
		});
});




