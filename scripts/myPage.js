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
            grd.addColorStop(0, "#247BA0");

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


    var timer;
    $(function () {

        $('.skill-container').LoadSkillBar();

        timer = requestAnimationFrame(animate);
    });

})(jQuery);

