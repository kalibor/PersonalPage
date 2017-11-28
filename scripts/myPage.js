(function ($) {
    
    $.fn.extend({
        LoadSkillbar: function (percent) {
            var canvas = $(this);


            var circle_width = canvas.width() / 2;
            var circle_height = canvas.height() / 2;
            var circle_lenght = (canvas.height() / 2) - 20;

            var ctx = canvas.get(0).getContext('2d');
            ctx.clearRect(0, 0, canvas.width(), canvas.height());
            ctx.lineWidth = 10;




            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.strokeStyle = 'rgb(241, 241, 241)';
            ctx.arc(circle_width, circle_height, circle_lenght, d2r(-90), d2r(270));
            ctx.stroke();


            var grd = ctx.createLinearGradient(circle_width * 2, circle_width * 2, 0, 0);
            grd.addColorStop(0, "#555");

            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.strokeStyle = grd;
            ctx.arc(circle_width, circle_height, circle_lenght, d2r(-90), d2r(360 * percent / 100 - 90));
            ctx.stroke();

            function d2r(deg) {
                var ran = (Math.PI / 180) * deg;
                return ran;
            };

        },

        AnimateSkillBar: function () {

            var canvas = $(this);
            var percent = canvas.data('now_percent');
            if (!percent && percent != '0') {
                percent = 0;
                canvas.data('now_percent', percent);
            }
            else {
                var limit_percent = canvas.data('percent');
                if (!limit_percent) {
                    limit_percent = 0;
                }


                if (percent < limit_percent) {
                    percent += 3;
                    if (percent > limit_percent) {
                        percent = limit_percent;
                    }

                    canvas.data('now_percent', percent);
                }
                else {
                    return false;
                }

            }
            canvas.LoadSkillbar(percent);

            return true;
        },
    });


    /********************************************************************************************************/
    var animate = function () {
        var canvas = $('.mycanvas:not(.finished)');

        canvas.each(function () {
            var NeedAnimate = $(this).AnimateSkillBar();
            if (!NeedAnimate) {
                $(this).addClass('finished')
            }
        });

        canvas = $('.mycanvas:not(.finished)');

        if (canvas.length) {
            setTimeout(function () { timer = requestAnimationFrame(animate); }, 1000 / 60)

        } else {
            cancelAnimationFrame(timer);
        }

    }



    $.fn.extend({
        LoadSkillBar: function () {
            var me = $(this);

            if (me.hasClass('skill-container')) {

                var skillitem = me.find('.skill-item');
                skillitem.each(function () {
                    var item = $(this);
                    var progressRate = item.data('percent');

                    if (progressRate) {
                        var skillpercent = item.find('.skill-bar > .skill-percent');
                        skillpercent.css('width', 0);
                        skillpercent.animate({
                            width: progressRate,

                        }, 1000, function () {
                            var span = $('<span class="show">');
                            span.html(progressRate);
                            skillpercent.html(span);

                        });
                    }
                    else {
                        item.html('請設定data-percent屬性')
                    }

                });

            }

        },

    });
    /*******************************************************************************************************/
    var setPageLoadProgress = function (rate, duration, compelete) {

        if (!duration) {
            duration = 1000;
        }

        var progressbar = $('.pageloading-progress');


        progressbar.animate({
            width: rate + '%'
        }, duration, function () {
            if (typeof compelete == 'function') {
                compelete(progressbar);
            }

        });


    };


    /*
     * *************************************************************************************************/

    $.fn.extend({
        setText: function (text) {
            var me = $(this).find('canvas');

            if (me.length) {
                var ctx = me[0].getContext('2d');
                var w = me.width();
                var h = me.height();

                ctx.clearRect(0, 0, w, h);

                ctx.font = '30px Georgia';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 0, (h / 2));


            }
        }
    });

    var setLoadingText = function () {
        var content = $('.pageloading-content ')
        var textArray = ['載入中，請稍後','載入中，請稍後.', '載入中，請稍後..', '載入中，請稍後...'];

        setInterval(function () {
            var index = content.data('TextIndex');
            if (!index || index >= textArray.length) {
                index = 0;
            }
            content.setText(textArray[index]);
            index++;
            content.data('TextIndex', index);
        }, 300);
    };

     /****************************************************************************************************/
    var setBackToTopButton = function () {
        var timeout;
        var btn = $('.btnBackToTop');

        $(window).on('scroll', function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            var me = $(this);
        
            if (me.scrollTop() === 0) {
                btn.removeClass('fadeIn');

                timeout = setTimeout(function () {
                    btn.addClass('hide')
                }, 200);
           
                btn.addClass('fadeOut animated');

            }
            else {
                btn.removeClass('fadeOut hide')
                btn.addClass('fadeIn animated')
            }

        });

        btn.on('click', function () {

            $('html ,body').animate({
                scrollTop: 0
            });
        });

        $(window).scroll();

    };



    /****************************************************************************************************/

    var Init = function () {
        setPageLoadProgress(80, 2000);
        setLoadingText();
        setBackToTopButton();
    };

    Init();

    /****************************************************************************************************/
    var timer;
    $(function () {
        setPageLoadProgress(100, 500, function (progressbar) {
            progressbar.parent().slideUp();
            $('.skill-container').LoadSkillBar();
            timer = requestAnimationFrame(animate);
        });


    });


})(jQuery);

