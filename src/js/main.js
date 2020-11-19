$(window).on('load', function () {
	preloader();
	cookieCheck();
});

$(document).ready(function () {
	mobileMenu();
	checkWindowWidth();
	readMoreBtn();
	
	var $galeryFilters = $('.galery__filters');
	var $galeryContent = $('.galery__content');
	var $galeryContainer = $('.galery__filters-container');
	
	var $heroSlider = new Swiper('.hero-slider__container', {
		slidesPerView: 'auto',
		spaceBetween: 15,
		centeredSlides: true,
		loop: true,
		slidesOffsetBefore: 0,
		slidesOffsetAfter: 0,
		height: 640,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});
	
	$('a[href*=\\#]:not([href=\\#])').click(function () {
		if (($(this).attr('href').substr(1)) != null) {
			$('html, body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500);
		}
		return false;
	});
	
	$('.galery__view svg').click(function () {
		var $thisData = $(this).attr('data-view');
		
		$('.galery__view svg').removeClass('active');
		$(this).addClass('active');
		$.removeCookie('tiles', {path: '/'});
		$.removeCookie('list', {path: '/'});
		$.cookie($thisData, 'active', {expires: 7, path: '/'});
		
		if ($thisData == 'tiles') {
			$galeryContent.addClass('tiles--view');
			
			if (!$('#single-article').length) {
				$.ajax({
					url: "../articles.html",
					cache: false,
					success: function (html) {
						$galeryContent.append($(html).filter('#single-article'));
					}
				});
			}
		} else {
			$galeryContent.removeClass('tiles--view');
			
			if (!$('#single-article').hasClass('loaded')) {
				$('#single-article').remove();
			}
		}
	});
	
	$('.galery__filters-title').click(function () {
		$galeryContainer.slideToggle();
		$galeryFilters.toggleClass('rotate');
	});
	
	
	$('#load-more').click(function () {
		$.ajax({
			url: "../articles.html",
			cache: false,
			success: function (html) {
				
				if ($('#single-article').length) {
					$galeryContent.append($(html).not('#single-article'));
					$('#single-article').addClass('loaded');
				} else {
					$galeryContent.append(html);
					$('#single-article').addClass('loaded');
				}
			}
		});
		
		$(this).hide();
		
		setTimeout(function () {
			$('html, body').animate({
				scrollTop: $('#single-article').offset().top
			}, 800);
		}, 500);
		
		return false;
	});
	
	function loadAllArticles() {
		$.ajax({
			url: "../articles.html",
			cache: false,
			success: function (html) {
				$galeryContent.append(html);
				$('#single-article').addClass('loaded');
			}
		});
	}
	
	/*function rating() {
		var $ratingArray = [];
		
		setTimeout(function () {
			$('.galery__card-rating').each(function () {
				$ratingArray = $(this).attr('data-rating');
			});
			
		}, 100);
	}
	
	$('#top-2').change(function () {
		loadAllArticles();
		rating();
	});*/
	
});

$(window).resize(function () {
	checkWindowWidth();
});

function preloader() {
	var $body = $('body');
	
	$body.addClass('loaded-hide');
	
	setTimeout(function () {
		$body.addClass('loaded');
		$body.removeClass('loaded-hide');
	}, 500);
}

function cookieCheck() {
	var $list = $('.galery__view svg[data-view="list"]');
	var $tiles = $('.galery__view svg[data-view="tiles"]');
	var $viewButtons = $('.galery__view svg');
	var $galeryContent = $('.galery__content');
	
	if ($.cookie('tiles')) {
		$viewButtons.removeClass('active');
		$tiles.addClass('active');
		$galeryContent.addClass('tiles--view');
		
		$.ajax({
			url: "../articles.html",
			cache: false,
			success: function (html) {
				$galeryContent.append($(html).filter('#single-article'));
			}
		});
	}
	
	if ($.cookie('list')) {
		$viewButtons.removeClass('active');
		$list.addClass('active');
		$galeryContent.removeClass('tiles--view');
	}
}

function mobileMenu() {
	var $burger = $('.header__burger');
	var $list = $('.header__nav ul');
	var $body = $('body');
	
	$burger.click(function () {
		$(this).toggleClass('menu--active');
		$body.toggleClass('body--lock');
		$list.slideToggle();
	});
}

function checkWindowWidth() {
	var $burger = $('.header__burger');
	var $list = $('.header__nav ul');
	var $body = $('body');
	
	if ($(window).width() > 750) {
		$burger.removeClass('menu--active');
		$body.removeClass('body--lock');
		$list.removeAttr('style');
	}
}

function readMoreBtn() {
	$('.galery__card-text').each(function () {
		var $text = $(this).html();
		var $dots = '<span class="read-more-dots"> ...</span>';
		
		if ($('.galery__view svg').hasClass('active') && $(window).width() > 990) {
			var $charLimit = 340;
		} else {
			var $charLimit = 458;
		}
		
		if ($('.galery__view svg').hasClass('active') && $(window).width() < 460) {
			var $charLimit = 220;
		}
		
		if ($text.length > $charLimit) {
			var $beforeSliceText = $text.slice(0, $charLimit);
			var $afterSliceText = $text.slice($charLimit);
			var $buttonReadMore = '<span class="read-more-btn">Read more<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"/></svg></span>'
			
			$(this).html($beforeSliceText + $dots + '<span class="sliced--text" style="display: none;">' + $afterSliceText + '</span>' + $buttonReadMore);
		}
	});
	
	$('.read-more-btn').click(function () {
		var $buttonReadMore = 'Read more<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"/></svg>'
		var $buttonReadLess = 'Read less<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"/></svg>'
		
		$(this).parents('.galery__card-text').find('.read-more-dots').toggle();
		$(this).parents('.galery__card-text').find('.sliced--text').toggle(500);
		$('.read-more-btn').toggleClass('spoiler--open');
		
		if ($(this).text() == 'Read more') {
			$(this).parents('.galery__card-text').find('.read-more-btn').html($buttonReadLess).show(500);
		} else {
			$(this).parents('.galery__card-text').find('.read-more-btn').html($buttonReadMore).show(500);
		}
	});
}