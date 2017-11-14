$(function () {
    var currentPage = 1;
    var pageSize = 5;
    var form = $('form');
    // 发送ajax请求获取查询1级分类列表数据同时分页渲染
    render();

    function render() {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                console.log(data)
                // 追加分类列表数据到tbody中
                $('tbody').html(template('tpl', data));
                // 分页渲染
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage, //指定当前页
                    // data.total  返回数据的total值
                    totalPages: Math.ceil(data.total / pageSize), //指定总页数
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page; //page指的是点击的页码
                        render();
                    }
                });
            }
        })
    }

    // 单击添加分类显示模态框
    $('#addBtn').on('click', function () {
        $('#addModal').modal('show');
    })
    // 表单验证
    var $form = $('form');
    $form.bootstrapValidator({
        // 校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 指定校验字段
        fields: {
            addcategory: {
                validators: {
                    notEmpty: {
                        message: '请输入一级分类'
                    }
                }
            }
        }
    })
    // 注册表单验证成功事件
    $form.on('success.form.bv', function (e) {
        var categoryName = $('#addcategoryid').val();
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data:$form.serialize(),
            success: function (data) {
                if (data.success) {
                    // 隐藏模态框
                    $('#addModal').modal('hide');
                    // 从显示第一页
                    currentPage = 1;
                    // 重新渲染
                    render();
                    // 重置
                    $form[0].reset();
                    $form.data('bootstrapValidator').resetForm();
                }
            }
        })
    })
})