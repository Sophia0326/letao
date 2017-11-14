$(function () {
    var currentPage = 1;
    var pageSize = 5;
   
    // 发送ajax请求获取二级分类数据 和分页渲染
    render();

    function render() {
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                // console.log(data);
                // 将模板数据追加到tbody
                $('tbody').html(template('tpl', data));
                // 分页渲染
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage, //指定当前页
                    totalPages: Math.ceil(data.total / pageSize), //指定总页数
                    onPageClicked: function (a, b, c, page) {
                        // page为当前点击的页面
                        currentPage = page;
                        // 重新渲染页面
                        render();
                    }
                })
            }
        })
    }

    // 单击添加分类按钮,显示模态框并发送ajax请求获取一级分类标题
    $('#addBtn').on('click', function () {
        $('#addModal').modal('show');
        // 发送ajax请求获取一级分类标题
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                $('.dropdown-menu').html(template('tpl1', data));
            }
        })
    })
    

    // 给a注册代理事件,单击下拉菜单的标题,把标题赋值给请选择一级分类分span
    $('.dropdown-menu').on('click', 'a', function () {
        $('.dropdown_text').text($(this).text());
        // 获取a标签的id赋值给一级分类的名称,用来判断是否有选择到分类
        $('#categoryId').val($(this).data('id'));
        // categoryId验证成功状态
        $form.data('bootstrapValidator').updateStatus('categoryId', 'VALID')
    })

    //初始化文件上传
    $('#fileupload').fileupload({
        dataType: 'json',
        // data:图片上传后的对象,通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data.result);//只有picAddr的值
            $('.img_box img').attr('src', data.result.picAddr);
            // 把图片的地址放到隐藏域中
            $('#brandLogo').val(data.result.picAddr);
            // 让brandLogo校验成功
            $form.data('bootstrapValidator').updateStatus('brandLogo', 'VALID')
        }
    })
    // 校验表单
    var $form = $('form');
    $form.bootstrapValidator({
        // 不校验类型为空: 所有的都校验
        excluded: [],
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            }
        }
    })
    // 表单验证成功事件
    $form.on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            success:function (data) {
                if (data.success){
                    $('#addModal').modal('hide');
                    //重新渲染第一页
                    currentPage = 1;
                    render();
                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();
                    $('.dropdown_text').text('请选择一级分类');
                    $('.addcategoryid').text('请输入二级分类名称');
                    $('.img_box img').attr('src','images/none.jpg');
                }
            }
        })
    });
})