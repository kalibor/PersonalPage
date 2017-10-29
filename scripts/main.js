
/*css*/
import '../css/JHmodal.css'; 
import '../css/mypage.css';

/*scripts*/
import '../scripts/JHmodal'
import '../scripts/mypage'

$(function () {
   
            var skillowl = $('.skill-box >.owl-carousel');

            skillowl.owlCarousel({
                loop: true,
                margin: 10,
                dotsData: true,
                responsive: {
                    0: {
                        items: 1
                    }
                },

            })

            skillowl.on('changed.owl.carousel', function (event) {
                var me = $(this);
                var selectContainer = $(this).find('.owl-item.active > .skill-container')

            })

            var toolowl = $('.footer-item .owl-carousel');
            toolowl.owlCarousel({
                loop: false,
                margin: 10,
                navigation: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 5
                    }
                },

            })


            $('.portfolio-card').each(function () {

                var me = $(this);

                var modalgorup = me.find('.modal-group');
                if (modalgorup.length) {

                    var btnModalOpenArray = modalgorup.find('.JHmodal-open');

                    btnModalOpenArray.each(function () {
                        var btn = $(this);
                        btn.ModalOption({
                            Content: btn.find('> *'),
                        });

                        btn.find('> *').remove();
                    });

                    me.on('click', function () {
                        btnModalOpenArray.first().trigger('click');
                    })
                }

            });
        })