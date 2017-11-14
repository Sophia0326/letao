$(function () {
    // 发送ajax,请求一级分类查询    
    $.ajax({
        url: '/category/queryTopCategory',
        success: function (data) {
            $('.pro_l .mui-scroll').html(template('tpl1', data));
            // 获取一级分类的第一个id
            var id = data.rows[0].id;
            render(id);
        }
    })
    render();
    function render(id) {
        $.ajax({
            url:'/category/querySecondCategory',
            data:{
                id:id
            },
            success:function (data) {
                console.log(data)
                $('.pro_r .mui-scroll').html(template('tpl2',data)) ;
                
            }
        })
    }
    $('.pro_l').on('click','a',function () {
        var id = $(this).data('id');
        // 给a的父元素li加now,当前加now这个类名时,其他兄弟要移除now类
        $(this).parent().addClass('now').siblings().removeClass('now')
        render(id);
    })
})