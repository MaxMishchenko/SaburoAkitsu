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
			
			if ((!$('#single-article').length) && ($('input[type="number"]').val() == "")) {
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
			
			if (!$('#single-article').hasClass('loaded') && (!($('input[type="number"]').val().length))) {
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
		
		return false;
	});
	
	function loadDefaultArticles() {
		$.ajax({
			url: "../index.html",
			cache: false,
			success: function (html) {
				$('.galery').append($(html).filter('.galery__content'));
			}
		});
	}
	
	function loadAllArticles() {
		$.ajax({
			url: "../articles.html",
			cache: false,
			success: function (html) {
				$galeryContent.append(html);
				$('#load-more').remove();
			}
		});
	}
	
	function removeDuplicates() {
		var $checker = {};
		
		$('.galery__card-title').each(function () {
			var $text = $(this).text();
			
			if ($checker[$text]) {
				$(this).parents('.galery__card').remove();
			} else {
				$checker[$text] = true;
			}
		});
	}
	
	function searchFromDate() {
		var $dateArray = [];
		var $enteredDateFrom = $('#from-y').val();
		var $enteredDateTo = $('#to-y').val();
		var $nothingFound = '<div class="nothing-found"><span class="nothing-found__text">No results were found for your search.</span><a class="btn" href="/">Back to home</a></div>';
		
		$('.galery__content').addClass('ajax--loader');
		
		var $dateArray = $('.galery__content').find('.galery__card').map(function () {
			return $(this).find('.galery__card-date').attr('data-year');
		});
		
		for (var i = 0; i < $dateArray.length; ++i) {
			if (!($dateArray[i] <= $enteredDateTo && $dateArray[i] >= $enteredDateFrom)) {
				$('.galery__content').find('.galery__card-date[data-year="' + $dateArray[i] + '"]').parents('.galery__card').remove();
			}
		}
		
		if (!$('.galery__card').length) {
			$('.galery__content').removeClass('ajax--loader');
			$('.galery__content').html($nothingFound);
			$('input').prop('disabled', true);
			$('.galery__view').css('pointer-events', 'none');
		} else {
			$('.nothing-found').remove();
			
			setTimeout(function () {
				$('.galery__content').removeClass('ajax--loader');
			}, 800);
		}
	}
	
	$('form[name="filters"] input[type="radio"]').change(function () {
		var $ratingArray = [];
		var $thisTopVal = $(this).val();
		var $fromYear = $('#from-y').val().length;
		var $toYear = $('#to-y').val().length;
		
		$('.galery__content').addClass('ajax--loader');
		
		if ($thisTopVal != "all") {
			loadDefaultArticles();
			loadAllArticles();
			
			setTimeout(function () {
				var $ratingArray = $('.galery__content').find('.galery__card').map(function () {
					return $(this).find('.galery__card-rating').attr('data-rating');
				});
				
				for (var i = 0; i < $ratingArray.length; ++i) {
					if ($ratingArray[i] > parseInt($thisTopVal)) {
						$('.galery__content').find('.galery__card-rating[data-rating="' + $ratingArray[i] + '"]').parents('.galery__card').remove();
					}
				}
				
				if ($fromYear && $toYear) {
					searchFromDate();
				}
			}, 100);
			
			setTimeout(function () {
				removeDuplicates();
			}, 150);
			
			setTimeout(function () {
				$('.galery__content').removeClass('ajax--loader');
			}, 800);
			
		} else {
			loadAllArticles();
			
			if ($fromYear && $toYear) {
				setTimeout(function () {
					searchFromDate();
				}, 100);
			}
			
			setTimeout(function () {
				removeDuplicates();
			}, 150);
			
			setTimeout(function () {
				$('.galery__content').removeClass('ajax--loader');
			}, 800);
		}
	});
	
	$('form[name="filters"] input[type="number"]').keyup(function (e) {
		var $fromYear = $('#from-y').val().length;
		var $toYear = $('#to-y').val().length;
		var $thisMaxCharVal = $(this).attr('maxlength');
		var $maxChar = parseInt($thisMaxCharVal) + 2;
		var $CharCount = $(this).val().length;
		var $charsLeft = $maxChar - $CharCount;
		var $maxInputVal = $(this).attr('max');
		var $minInputVal = $(this).attr('min');
		
		if ($charsLeft > 0) {
			$(this).parent('.galery__filters-field').removeClass('limit');
			$('.form-error').hide(100);
			$('input[type="radio"]').prop('disabled', false);
		} else {
			var $currentVal = $(this).val();
			
			if (!(e.key === "Enter" || e.keyCode === 13)) {
				var $cutValue = $currentVal.substring(0, $currentVal.length - 1);
				$(this).parent('.galery__filters-field').addClass('limit');
				$('.form-error').show(100);
				$(this).val($cutValue);
				$('input[type="radio"]').prop('disabled', true);
			}
		}
		
		if (e.key === "Backspace" || e.keyCode === 8 || e.key === "Delete" || e.keyCode === 46) {
			$(this).parent('.galery__filters-field').removeClass('limit');
			$('input[type="radio"]').prop('disabled', false);
		}
		
		if ((e.key === "Enter" || e.keyCode === 13) && ($fromYear == 4)) {
			var $fromYearVal = $('#from-y').val();
			
			setTimeout(function () {
				if ($fromYearVal <= $maxInputVal && $fromYearVal >= $minInputVal) {
					$('#to-y').focus();
				} else {
					$('#from-y').parent('.galery__filters-field').addClass('limit');
					$('#from-y').focus();
					$('.form-error').show(100);
					$('input[type="radio"]').prop('disabled', true);
				}
			}, 100);
		}
		
		if ((e.key === "Enter" || e.keyCode === 13) && ($toYear == 4)) {
			var $toYearVal = $('#to-y').val();
			
			setTimeout(function () {
				if (($toYearVal <= $maxInputVal && $toYearVal >= $minInputVal) && ($fromYearVal <= $toYearVal)) {
					if ($fromYear == '') {
						$('#from-y').focus();
					}
				} else {
					$('#to-y').parent('.galery__filters-field').addClass('limit');
					$('#to-y').focus();
					$('.form-error').show(100);
					$('input[type="radio"]').prop('disabled', true);
				}
			}, 100);
		}
		
		$('#from-y').focusout(function () {
			var $fromYearValue = parseInt($(this).val());
			
			if ($fromYearValue.length < 4 || $fromYearValue < $minInputVal || $fromYearValue > $maxInputVal) {
				$('#from-y').parent('.galery__filters-field').addClass('limit');
				$('#from-y').focus();
				$('.form-error').show(100);
				$('input[type="radio"]').prop('disabled', true);
			}
		});
		
		$('#to-y').focusout(function () {
			var $toYearValue = parseInt($(this).val());
			
			if ($toYearValue.length < 4 || $toYearValue < $minInputVal || $toYearValue > $maxInputVal) {
				$('#to-y').parent('.galery__filters-field').addClass('limit');
				$('#to-y').focus();
				$('.form-error').show(100);
				$('input[type="radio"]').prop('disabled', true);
			}
		});
		
		if ((e.key === "Enter" || e.keyCode === 13) && ($toYear == 4 && $fromYear == 4) && ($fromYearVal <= $maxInputVal && $fromYearVal >= $minInputVal) && ($toYearVal <= $maxInputVal && $toYearVal >= $minInputVal) && ($fromYearVal <= $toYearVal)) {
			if ($('form[name="filters"] input[type="radio"]').is(':checked')) {
				searchFromDate();
			} else {
				loadDefaultArticles();
				loadAllArticles();
				
				setTimeout(function () {
					removeDuplicates();
				}, 150);
				
				setTimeout(function () {
					searchFromDate();
				}, 100);
			}
		}
	});
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