$(function () {
    var currentPage = 1;
    var pageSize = 5;
    render();
    // 1.渲染商品详情数据+渲染分页
    function render() {
        // 发送ajax请求,获取商品信息
        $.ajax({
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                $('tbody').html(template('pro_content', data));
                // 单击上架按扭事件
                $('tbody').on('click', '.btn', function () {
                    // 单击下架/上架按钮显示模态框
                    $('#shelfModal').modal('show');
                    // 单击下架/上架按钮提示是否上架或下架此产品
                    $('#shelfModal').find('.confirm strong').html($(this).hasClass('btn-success') ? '上架' : '下架');
                    // 单击提示上架下架按钮确认键 关闭模态,return false
                    $('#shelfModal .btn_confirm').off().on('click', function () {
                        $('#shelfModal').modal('hide');
                        return false;
                    })
                })
                // 渲染分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, //指定bootstrap版本,如果是3,必须指定
                    currentPage: currentPage, //指定当前页
                    totalPages: Math.ceil(data.total / pageSize), // 指定总页数
                    onPageClicked: function (a, b, c, page) {
                        // page指的是点击的页码,修改了当前页
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }
    // 2.点击添加商品按钮弹出模态框
    $('#addBtn').on('click', function () {
        $('#addBtnModal').modal('show');
        // 发送二级分类ajax请求
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                // 坑!不能随意更改插件模板的类名
                console.log(data)
                $('.dropdown-menu').html(template('tpl', data))
            }
        })
    })
    // 2.1 给二级分类里的a注册代理事件
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取当前的a的内容赋值给.dropdown_text
        $('.dropdown_text').html($(this).text());
        // 获取当前a的ID,把ID赋值给隐藏域brandId
        $('#brandId').val($(this).data('id'));
        // 手动设置brandId为VALID
        $form.data("bootstrapValidator").updateStatus('brandId', 'VALID');
    })
    // 2.2 表单验证插件
    var $form = $('form');
    $form.bootstrapValidator({
        // 指定不校验的类型 为空,因为有隐藏的表单也需要验证
        excluded: [],
        // 指定校验时的图标显示,默认bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 指定校验字段
        fields: {
            // 校验对应表单的name属性
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    // 非空验证
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    // 正则,不能0开头,必须是数字
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '请输入正确的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    // 尺码必须是数字-数字
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '请输入正确的尺码(比如:30-50)'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品价格'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            productLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            }
        }
    })
    // 2.3 图片上传方法
    $('#fileupload').fileupload({
        dataType: "json",
        // e:事件对象
        // data: 图片上传后的对象,通过data.result.picAddr可以获取上传后的图片地址,通过data.result.picName可以获取上传后的图片名字
        done: function (e, data) {
            console.log(data.result);
            if($('.img_box').find('img').length >= 3){
                // 如果图片大于3张,不玩了
                return false;
            }
            // 上传的结果在data.result中,每次上传到往img_box追加一张图片
            $('.img_box').append('<img data-name="' + data.result.picName + '"data-src="' + data.result.picAddr + '"src="' + data.result.picAddr + '"width="100" height="100">');
            // $('.img_box').find('img').css('margin-right','10px');
            // 设置图片预览样式margin为10px
            $('.img_box img').css('margin', '10px');
            
            // 图片校验,判断img_box中img的数量是否是3,如果是就成功,否则失败
            if ($('.img_box').find('img').length == 3) {
                $form.data('bootstrapValidator').updateStatus('productLogo', 'VALID');
            } else {
                $form.data('bootstrapValidator').updateStatus('productLogo', 'INVALID');
            }
            // 双击图片可删除图片功能,并重新判断图片的长度是否等于3
            $('.img_box img').off().on('dblclick',function () {
                $(this).remove();
                // 移除被双击的图片后,重新判断并更新状态
                if ($('.img_box').find('img').length == 3) {
                    $form.data('bootstrapValidator').updateStatus('productLogo', 'VALID');
                } else {
                    $form.data('bootstrapValidator').updateStatus('productLogo', 'INVALID');
                }
            })
        }
    })
    // 2.4 注册表单验证成功事件
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();
        // 使用ajax提交逻辑
        var data = $form.serialize();
        // console.log(data);
        // brandId = 7 & proName=32 & proDesc=23 & num=23 & size=23 - 32 & price=2344 & oldPrice=1234 & productLogo=
        // 获取到img_box下所有的图片,获取picName和picAddr,拼接到data中
        var $img = $('.img_box img');
        // 图片的src在获取的时候,会自动拼接上绝对路径地址:http://localhost,不希望,也放到自定义的属性中
        data +=  "&picName1=" +$img[0].dataset.name+'&picAddr1='+$img[0].dataset.src;
        data += '&picName2=' +$img[1].dataset.name+'&picAddr2='+$img[1].dataset.src;
        data += '&picName3=' +$img[2].dataset.name+'&picAddr3='+$img[2].dataset.src;

        // 发送ajax
        
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: data,
            success: function (data) {
                if (data.success) {
                    // 隐藏模态框
                    $('#addBtnModal').modal('hide');
                    currentPage=1;
                    render();
                    
                    // 重置模态框内的状态
                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();
                    $('.dropdown_text').text('请选择二级分类');
                    $('#brandId').val('');
                    $('.img_box img').remove();
                    $('#productLogo').val('');

                }
            }
        })
    })
})