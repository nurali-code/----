
$('.btn-menu').on('click', () => { $('header .nav, body, .btn-menu').toggleClass('active') })

/*---------------------------------------------------end*/

$('.nav-drop').click(function (e) {
    $(this).children('.nav-drop-content').slideToggle();
    $(this).children('.nav-drop-btn').toggleClass('active');
});

/*---------------------------------------------------end*/

$('a[href*="#"]').on('click', function (e) {
    e.preventDefault()
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top, }, 500,)
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

$("#calcResulte").submit(function () {
    $('form .btn').attr('disabled', 'disabled');
    $.ajax({
        type: "POST",
        method: 'POST',
        url: "../telegram_calc.php",
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

function numberWithSpaces(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") };

$('#cPrice, #cVolume, #cPower').on('keyup', function () {
    $(this).val(numberWithSpaces($(this).val().replace(/[^0-9.]/g, "")))
})

/*---------------------------------------------------end*/
var USDRUB,
    EURRUB,
    EURUSD;

(function () {
    var moneyjs = document.createElement('script');
    moneyjs.src = 'https://openexchangerates.github.io/money.js/money.min.js';
    document.body.appendChild(moneyjs);
    moneyjs.addEventListener('load', function () {
        fetch('https://www.cbr-xml-daily.ru/latest.js')
            .then(response => response.json())
            .then(function (data) {
                fx.rates = data.rates;
                fx.base = data.base;
                USDRUB = (fx(1).from("USD").to("RUB")).toFixed(2);
                EURRUB = (fx(1).from("EUR").to("RUB")).toFixed(2);
                EURUSD = (fx(1).from("EUR").to("USD")).toFixed(2);
                $('#currUSD').text(USDRUB);
                $('#currEUR').text(EURRUB);
                console.log(USDRUB, EURUSD, EURRUB);
                $('#calculate').removeAttr('disabled')
            });
    });
})();



function animateTo(e) { $('#modal-calc .modal-content').animate({ scrollTop: e.offset().top, }, 700,) }

$('#calculate').click(function () {
    if (($('#cPrice').val().replace(/[^0-9.]/g, "")) == '') {
        $('#cPrice').parents('.inp-wrap').addClass('err');
        $('#cPrice').focus()
    } else if (($('#cVolume').val().replace(/[^0-9.]/g, "")) == '') {
        $('#cPrice').parents('.inp-wrap').removeClass('err');
        $('#cVolume').parents('.inp-wrap').addClass('err');
        $('#cVolume').focus()

    } else if (($('#cPower').val().replace(/[^0-9.]/g, "")) == '') {
        $('#cVolume').parents('.inp-wrap').removeClass('err');
        $('#cPower').focus()
        $('#cPower').parents('.inp-wrap').addClass('err');
    } else {
        $('.inp-wrap').removeClass('err');
        calculate()
    }
})

function calculate() {
    var cYear = $('#cYear').val(),
        cFace = $('#cFace').val(),
        currency = $('#curr').val(),
        cEngine = $('#cEngine').val(),
        brocker = Number($('#brocker').text().replace(/[^0-9.]/g, "")),
        cVolume = Number($('#cVolume').val().replace(/[^0-9.]/g, "")),
        cPrice = Number($('#cPrice').val().replace(/[^0-9.]/g, "")),
        cPower = Number($('#cPower').val().replace(/[^0-9.]/g, "")),
        epts = Number($('#epts').text().replace(/[^0-9.]/g, "")),
        priceLabelUsd = $('#priceLabelUsd'),
        priceLabel = $('#priceLabel'),
        recycling = $('#recycling'),
        totalUsd = $('#totalUsd'),
        totalRub = $('#totalRub'),
        ndsRow = $('#ndsRow'),
        recyclingCoff,
        customs,
        aksiz,
        sbor,
        nds,
        priceEur;

    if (currency == 'USD') {
        priceEur = cPrice * EURUSD;
        cPrice *= USDRUB
    } else { priceEur = cPrice / EURRUB; }

    $('input[name="u-type"]').val($('#cFace option[selected]').text())
    $('input[name="u-year"]').val($('#cYear option[selected]').text())
    $('input[name="u-volume"]').val(numberWithSpaces(cVolume) + " cm3")
    $('input[name="u-power"]').val(numberWithSpaces(cPower) + " лс")
    $('input[name="u-engine"]').val($('#cEngine option[selected]').text())


    // Сбор за таможенное оформление (зависит только от стоимости автомобиля.)
    switch (true) {
        case (cPrice <= 200000): sbor = 775; break;
        case (cPrice <= 450000): sbor = 1550; break;
        case (cPrice <= 1200000): sbor = 3100; break;
        case (cPrice <= 2700000): sbor = 8530; break;
        case (cPrice <= 4200000): sbor = 12000; break;
        case (cPrice <= 5500000): sbor = 15500; break;
        case (cPrice <= 7000000): sbor = 20000; break;
        case (cPrice <= 8000000): sbor = 23000; break;
        case (cPrice <= 9000000): sbor = 25000; break;
        case (cPrice <= 10000000): sbor = 25000; break;
        case (cPrice >= 10000000): sbor = 30000; break;
    }; +sbor;

    // Утилизационный сбор Физическое лицо --------------------
    function individualCoff() {
        cYear == 3 ? recyclingCoff = 0.17 : recyclingCoff = 0.26;
        cEngine == 'electro' ? recyclingCoff = 1.63 : recyclingCoff;
    }

    // Утилизационный сбор Юридическое лицо ----------------------------------
    function entitylCoff(c1, c2, c3, c4, c5, c6) {
        switch (true) {
            case (cVolume <= 1000): recyclingCoff = c1; break;
            case (cVolume >= 1001 && cVolume <= 2000): recyclingCoff = c2; break;
            case (cVolume >= 2001 && cVolume <= 3000): recyclingCoff = c3; break;
            case (cVolume >= 3001 && cVolume <= 3500): recyclingCoff = c4; break;
            case (cVolume >= 3500): recyclingCoff = c5; break;
        } cEngine == 'electro' ? recyclingCoff = c6 : recyclingCoff;
    };

    if (cFace == 'individual') { individualCoff() } else
        if (cFace == 'entity' && cYear == 3) { entitylCoff(2.41, 8.92, 14.08, 12.98, 22.25, 1.63) }
        else { entitylCoff(6.15, 15.69, 24.01, 28.5, 35.01, 6.1) }
    recyclingCoff = 20000 * recyclingCoff;


    // Сравнивание Процента цены со стоимость объема  ----------------------------------
    function priceVolume(pricePercent, volumeMin, onlyVolume) {
        var volumePrise = volumeMin * cVolume;
        if (onlyVolume == true) { priceEur = volumePrise }
        else if (priceEur >= volumePrise) { priceEur = (priceEur / 100 * pricePercent) }
        else { priceEur = volumePrise }
        customs = priceEur * EURRUB;
    };

    // Таможенные ставки для физических лиц возрастом менее 3 лет. ----------------------------------
    function individualCustoms(t1, p1, t2, p2, t3, p3, t4, p4, t5, p5, t6, p6) {
        switch (true) {
            case (priceEur <= 8500): priceVolume(t1, p1, false); break;
            case (priceEur >= 8501 && priceEur <= 16700): priceVolume(t2, p2, false); break;
            case (priceEur >= 167001 && priceEur <= 42300): priceVolume(t3, p3, false); break;
            case (priceEur >= 42301 && priceEur <= 84500): priceVolume(t4, p4, false); break;
            case (priceEur >= 84501 && priceEur <= 169000): priceVolume(t5, p5, false); break;
            case (priceEur >= 169000): priceVolume(t6, p6, false); break;
        };
    }

    // Таможенные ставки для физических лиц возрастом старше 3 лет.----------------------------------
    function individualCustoms2(ft1, up1, ft2, up2, ft3, up3, ft4, up4, ft5, up5, ft6, up6) {
        switch (true) {
            case (cVolume <= 1000): customsPrice(ft1, up1); break;
            case (cVolume >= 1001 && cVolume <= 1500): customsPrice(ft2, up2); break;
            case (cVolume >= 1501 && cVolume <= 1800): customsPrice(ft3, up3); break;
            case (cVolume >= 1801 && cVolume <= 2300): customsPrice(ft4, up4); break;
            case (cVolume >= 2301 && cVolume <= 3000): customsPrice(ft5, up5); break;
            case (cVolume >= 3001): customsPrice(ft6, up6); break;
        }; function customsPrice(curr, up) {
            if (cYear == 35) { customs = curr } else
                if (cYear == 57 || cYear == 7) { customs = up };
            customs *= cVolume;
        } customs *= EURRUB;
    }

    // Таможенные ставки для юридических лиц на бензиновые двигатели.
    function entityPetrol(p1, v1, p2, v2, p3, v3, p4, v4, p5, v5, p6, v6, onlyVolume) {
        switch (true) {
            case (cVolume <= 1000): priceVolume(p1, v1, onlyVolume); break;
            case (cVolume >= 1001 && cVolume <= 1500): priceVolume(p2, v2, onlyVolume); break;
            case (cVolume >= 1501 && cVolume <= 1800): priceVolume(p3, v3, onlyVolume); break;
            case (cVolume >= 1801 && cVolume <= 2300): priceVolume(p4, v4, onlyVolume); break;
            case (cVolume >= 2301 && cVolume <= 3000): priceVolume(p5, v5, onlyVolume); break;
            case (cVolume >= 3001): priceVolume(p6, v6, onlyVolume); break;
        }
    }
    // Таможенные ставки для юридических лиц на бензиновые двигатели.
    function entityDiesel(p1, v1, p2, v2, p3, v3, onlyVolume) {
        switch (true) {
            case (cVolume <= 1500): priceVolume(p1, v1, onlyVolume); break;
            case (cVolume >= 1501 && cVolume <= 2500): priceVolume(p2, v2, onlyVolume); break;
            case (cVolume >= 2501): priceVolume(p3, v3, onlyVolume); break;
        }
    }

    if (cFace == 'individual') {
        if (cYear == 3) {
            individualCustoms(54, 2.5, 48, 3.5, 48, 5.5, 48, 7.5, 48, 15, 48, 20)
        } else if (cYear == 35 || cYear == 57 || cYear == 7) {
            individualCustoms2(1.5, 3, 1.7, 3.2, 2.5, 3.5, 2.7, 4.8, 3, 5, 3.6, 5.7);
        }
    } else {
        if (cEngine == 'diesel') {
            if (cYear == 3) { entityDiesel(15, 0, 15, 0, 15, 0, false) }
            else if (cYear == 35 || cYear == 57) { entityDiesel(20, 0.32, 20, 0.4, 20, 0.8, false) }
            else if (cYear == 7) { entityDiesel(0, 1.5, 0, 2.2, 0, 3.2, true) }
        } else {
            if (cYear == 3) { entityPetrol(15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 12.5, 0, false) }
            else if (cYear == 35 || cYear == 57) { entityPetrol(20, 0.36, 20, 0.4, 20, 0.36, 20, 0.44, 20, 0.44, 20, 0.8, false) }
            else if (cYear == 7) { entityPetrol(0, 1.4, 0, 1.5, 0, 1.6, 0, 2.2, 0, 2.2, 0, 3.2, true) }
        }
    }

    // Акциз ----------------------------------
    switch (true) {
        case (cPower <= 90): aksiz = 0; break;
        case (cPower >= 90.01 && cPower <= 150): aksiz = 53; break;
        case (cPower >= 150.01 && cPower <= 200): aksiz = 551; break;
        case (cPower >= 200.01 && cPower <= 300): aksiz = 836; break;
        case (cPower >= 300.01 && cPower <= 400): aksiz = 1425; break;
        case (cPower >= 400.01 && cPower <= 500): aksiz = 1475; break;
        case (cPower >= 500.01): aksiz = 1523; break;
    }; console.log('Акциз ' + aksiz);

    // НДС ----------------------------------
    if (cFace == "entity") {
        nds = (cPrice + customs + aksiz) / 100 * 20;
        ndsRow.show(); $('.modal-resulte table').addClass('even')
    } else { ndsRow.hide(); nds = 0; $('.modal-resulte table').removeClass('even') }

    // присваиваем Итог в рублях ------------------------
    var finishPrice = cPrice + epts + brocker + customs + nds + recyclingCoff + sbor;
    totalRub.text(numberWithSpaces(finishPrice.toFixed(2)) + ' руб');

    $('input[name="totalPrice"]').val(totalRub.text());
    $('input[name="u-price"]').val(numberWithSpaces(cPrice) + ' руб')
    // присваиваем Итог в USD ------------------------
    var totUsd = finishPrice / USDRUB;
    totalUsd.text(numberWithSpaces(totUsd.toFixed(2) + " $"));

    // присваиваем в таблицу ---------------------------
    priceLabelUsd.text((cPrice / USDRUB).toFixed(2) + ' $');
    priceLabel.text(numberWithSpaces(cPrice.toFixed(2)) + ' руб');
    $('#sbor').text(numberWithSpaces(sbor) + ' руб');

    recycling.text(numberWithSpaces(recyclingCoff.toFixed(2)) + ' руб');
    $("#nds").text(numberWithSpaces(nds.toFixed(2)) + ' руб');
    $("#customs").text(numberWithSpaces(customs.toFixed(2)) + ' руб');

    $('#fratRub').text(numberWithSpaces($('#frat').text().replace(/[^0-9.]/g, "") * USDRUB) + " руб");
    $('#jpanRub').text(numberWithSpaces($('#jpan').text().replace(/[^0-9.]/g, "") * USDRUB) + " руб");

    $('.modal-resulte').slideDown();
    animateTo($('.modal-resulte'));
};

/*---------------------------------------------------end*/

