
$('.btn-menu').on('click', () => { $('header .nav, body, .btn-menu').toggleClass('active') })

/*---------------------------------------------------end*/

$('a[href*="#"]').on('click', function (e) {
    e.preventDefault()
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top, }, 500,)
})

/*---------------------------------------------------end*/

$('.slider-wrapper').slick({
    slideToShow: 1,
    lideToScroll: 1,
    centerMode: true,
    variableWidth: true,
    arrows: true,
    dots: true,
})

/*---------------------------------------------------end*/


$(function () {
    function showModal(id) {
        $(id).fadeIn(300);
        $('body').addClass('active')
    }

    function hideModals() {
        $('.modal').fadeOut();
        $('body').removeClass('active')
    };

    $('.open-modal').on('click', function (e) {
        e.preventDefault()
        showModal('#' + $(this).attr("data-modal"));
    });

    $('.modal-close').on('click', () => {
        hideModals();
    });

    $(document).on('click', function (e) {
        if (!(
            ($(e.target).parents('.modal-content').length) ||
            ($(e.target).parents('.open-modal').length) ||
            ($(e.target).parents('.nav').length) ||
            ($(e.target).parents('.btn-menu').length) ||
            ($(e.target).hasClass('nav')) ||
            ($(e.target).hasClass('btn-menu')) ||
            ($(e.target).hasClass('modal-content')) ||
            ($(e.target).hasClass('open-modal'))
        )) {
            hideModals();
            $('header .nav, body, .btn-menu').removeClass('active')

        }
    });
});

/*---------------------------------------------------end*/

$('input[name="u-phone"]').inputmask({ "mask": "+7 (999)-999-99-99" });

$(".form").submit(function () {
    $('form .btn').attr('disabled', 'disabled');
    $.ajax({
        type: "POST",
        method: 'POST',
        url: "../telegram.php",
        data: $(this).serialize()
    }).done(function () {
        $('form .btn').removeAttr('disabled');
        $('form').trigger('reset');
        alert('Спасибо, за заявку , ожидайте с вами свяжется специалист')
        // setTimeout(function () {
        //     $('.modal').fadeOut();
        // }, 2000);
    });
    return false;
});
