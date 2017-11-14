$(function () {
    // 启用禁用按钮ajax请求
    // 发送ajax请求,获取用户数据,把数据渲染到表格
    var currentPage = 1; // 当前页
    var pageSize = 5;// 每页数据行数
    function render() {
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                $("tbody").html(template('disabled_btn', data));
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: currentPage,//指定当前页
                    totalPages:Math.ceil(data.total/pageSize),//总页数
                    onPageClicked:function (a,b,c,page) {
                         // page指的是点击的页码,修改了当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    }

    render();
    
    // 通过父级tbody做代理来给每个button按钮添加单击事件
    $('tbody').on('click', '.btn', function () {
        // 弹出模态框
        $('#userModal').modal('show');
        var id = $(this).parent().data('id');
        var name = $(this).parent().data('name');
        var isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
        // 提示禁用或启用此按钮
        $('#userModal').find('strong').html(($(this).hasClass('btn-danger') ? '禁用' : '启用') + name);
        $('.edit').off().on('click', function () {
            // 发送ajax请求禁用或启用数据
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function (data) {
                    if (data.success) {
                        // 数据返回success关闭模态框
                        $('#userModal').modal('hide');
                        // 重新渲染数据
                        render();
                    }
                }
            })
        })
    })

})