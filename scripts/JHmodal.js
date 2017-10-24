(function ($) {
    /************************************************擴充方法**************************************/
    $.fn.extend({
        Init: function () {
            var me = $(this);
            if (me.hasClass('JHmodal-open')) {

                var opt = {
                    Content: {},
                };

                me.on('click', function (e) {
                    e.stopPropagation();
                    opt = $.extend(true, opt, me.data('option'));
                    var modalTarget = me.data('modal-target');
                    var modal = GetModal(modalTarget);
                    SetModalContent(modalTarget, opt);
                    modal.Open();
                    modal.focus();

                    SetModalPage(modalTarget, me.data('modal-index'));


                });

            }

        },

        ModalOption: function (option) {
            var me = $(this);

            if (me.hasClass('JHmodal-open')) {

                var opt = $.extend(true, {
                    Content: {},
                }, option);

                me.data('option', opt);
            }
        },
        Open: function () {

            var me = $(this);
            if (me.hasClass('JHmodal')) {

                var id = me.prop('id');
                var content = GetModalContent(id);

                me.removeClass('fadeOut');
                content.removeClass('fadeOutUp');

                me.addClass('open fadeIn ');
                content.addClass('bounceInDown  ');

            }

        },

        Close: function () {
            var me = $(this);
            if (me.hasClass('JHmodal')) {
                var id = me.prop('id');
                var content = GetModalContent(id);

                me.removeClass('fadeIn');
                me.addClass('fadeOut ');

                setTimeout(function () {
                    me.removeClass('open');
                    content.empty();
                }, 500);

            }
        },
        Move: function (index) {
            var me = $(this);
            if (me.hasClass('JHmodal')) {
                var id = me.prop('id');

                var GroupLength = me.data('group-length');

                if ((!index) || index < 0)
                    index == 0;
                else if (index >= GroupLength.length)
                    index = GroupLength - 1;

                var target = GetOpenModalButton(id, index);

                SetModalContent(id, target.data('option'))

                SetModalPage(id, index);
            }
        }

    });







    /***********************************************Modal項目取得************************************************/

    var GetModal = function (id) {
        var modal = $(document.getElementById(id));

        return modal;
    }

    var GetModalContent = function (id) {

        var modal = GetModal(id);
        return modal.find('.JHmodal-content');
    }


    var GetOpenModalButtons = function (id) {
        var group = $('.JHmodal-open[data-modal-target="' + id + '"]');
        return group;

    }

    var GetOpenModalButton = function (id, index) {
        var group = GetOpenModalButtons(id);
        return $(group[index]);

    }



    /****************************************************Modal設定********************************************************/

    var CreateModal = function (id) {

        var modal = $('<div class="JHmodal animated"  tabindex="-1"></div >');

        var modalContent = $('<div class="JHmodal-content animated col-lg-8 col-sm-10 col-xs-12"></div >');



        modal.attr('id', id);
        modal.on('click , keydown', function (e) {
            if (e.type == 'click') {
                modal.Close();
            }
            else if (e.type == 'keydown' && e.keyCode == '27') {
                modal.Close();
            }
        });

        modalContent.on('click', function (e) {
            e.stopPropagation();
        });


        modalContent.appendTo(modal);
        modal.appendTo('body');


        return modal;
    };





    /************************************************Modal內容設定****************************************/
    var SetModalContent = function (id, option) {
        var opt = $.extend(true, {
            ModalContentClass: '',
            Content: null,
        }, option);

        var modal = GetModal(id);
        var modalContent = GetModalContent(id);



        modalContent.empty();

        if (modalContent.length) {
            if (!opt.Content || $.isEmptyObject(opt.Content)) {
                opt.Content = $('<div class="template">')
            }


            opt.Content.addClass('zoomIn animated');
            modalContent.append(opt.Content)

        }
    }

    var SetModalContentSource = function (btnOpen) {

        var source = btnOpen.data('source');
        if (source) {
            var content = $(document.getElementById(source));

            btnOpen.ModalOption({
                Content: content,
            });

            content.remove();
        }

    }



    var SetModalContentCss = function (id, css) {

        var modalContent = GetModalContent(id);

        if (modalContent.length && css) {
            modalContent.css({ 'animation-duration': '1s' });
            modalContent.css(css);

        }
        modalContent.on('click', function (e) {
            e.stopPropagation();
        })
    }





    /*****************************************Modal 上一頁、下一頁功能*************************************/
    var SetModalPage = function (id, nowIndex) {


        var modal = GetModal(id);

        var groupLength = parseInt(modal.data('group-length'));

        var navBtnGroup = GetNavButtonGroup(nowIndex, modal);


        var Nav = modal.find('.JH-nav');

        if (Nav) {
            Nav.remove();
        }

        if (navBtnGroup) {
            Nav = $('<div class="JH-nav">');
            Nav.append(navBtnGroup.Prev);
            Nav.append(navBtnGroup.Next);
            Nav.appendTo(GetModalContent(modal.prop('id')));
        }


    };

    var GetNavButtonGroup = function (nowIndex, modal) {

        var groupLength = modal.data('group-Length');

        var Nav = {
            Prev: '',
            Next: ''
        };

        if (nowIndex > 0) {
            Nav.Prev = GetNewButton('', 'JH-prev fa fa-arrow-left', function () {
                modal.Move(nowIndex - 1)
            });
        }

        if (nowIndex < groupLength - 1) {
            Nav.Next = GetNewButton('', 'JH-next fa fa-arrow-right', function () {
                modal.Move(nowIndex + 1)
            });
        }

        if (Nav.Prev === '' && Nav.Next === '') {

            return null;
        }

        else {

            return Nav;
        }


    };

    var GetNewButton = function (text, btnClass, func) {
        var btn = $('<a>').html(text);
        btn.addClass(btnClass);
        btn.on('click', function (e) {
            e.stopPropagation();

            if (typeof func == 'function') {
                func();
            }

        });

        return btn;
    }






    /***************************************Modal初始化********************************************/


    var InitModal = function () {

        var btn = $('.JHmodal-open');

        btn.each(function () {
            var me = $(this);
            var modalId = me.data('modal-target');
            var modal = GetModal(modalId);
           
            SetModalContentSource(me);

            if (!modal.length) {
                modal = CreateModal(modalId);
            }

            me.Init();
        });

    };



    var InitGroupIndex = function () {
        var model = $('.JHmodal');
        model.each(function () {
            var me = $(this);
            var id = me.prop('id');
            var btnGroup = GetOpenModalButtons(id);

            me.data('group-length', btnGroup.length);

            btnGroup.each(function (index) {
                var btn = $(this);
                btn.data('modal-index', index);
            });
        });
    };


    $(function () {
        InitModal();
        InitGroupIndex();
    });



})(jQuery);